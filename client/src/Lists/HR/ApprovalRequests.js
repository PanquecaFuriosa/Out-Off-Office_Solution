import React, { useState, useEffect } from "react";
import Axios from "axios"
import {
    Box,
    IconButton,
    Tooltip,
    Grid,
    Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import CustomTable from "../../templates/components/table/CustomTable";
import {
    ModalApprovalRequest,
    ModalRequestActions,  
} from "../../templates/components/modals/ModalApprovalRequest";
import TableFilter from "../../templates/components/table/TableFilter";
import PageNavbar from "../../templates/components/common/PageNavbar";


/**
 * Create an approvalRequest data
 *
 * @param {*} Approval approvalRequest's fullname
 * @param {*} Leave_request approvalRequest's subdivision
 * @param {*} Status_request approvalRequest's position
 * @param {*} Request_comment approvalRequest's status
 * @param {*} Actions available actions on the approvalRequest
 * @returns An object, contains the data of the approvalRequest
 */
const createData = (HR_Approver, PM_Approver, Leave_request, Status, Comment, Actions) => {
    return { 
        "HR Approver": HR_Approver, 
        "PM Approver": PM_Approver, 
        "Leave request": Leave_request, 
        Status, 
        Comment,  
        Actions };
};

const columns = [
    "HR Approver",
    "PM Approver",
    "Leave request",
    "Comment",
    "Status",
    "Actions",
];
const columnsToFilter = [columns[1], columns[2], columns[4]];

const HRApprovalRequestPanel = ({ user }) => {
    const [seeing, setSeeing] = useState(false);
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);
    const [dataModal, setDataModal] = useState([]);

    const [approvalRequests, setApprovalRequests] = useState([]);
    const [filteredRows, setFilteredRows] = useState(approvalRequests);
    const [rowProperties, setRowProperties] = useState([]);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    /**
     * Approval modify management
     *
     * @param {*} approvalRequest approvalRequest to edit
     */
    const viewRequest = (approvalRequest) => {
        setDataModal(approvalRequest);
        setSeeing(true);
    };

    /**
     * Approval modify management
     *
     * @param {*} approvalRequest approvalRequest to edit
     */
    const approveApprovalRequest = (approvalRequest) => {
        setDataModal(approvalRequest);
        setApproving(true);
    };

    const rejectApprovalRequest = (approvalRequest) => {
        setDataModal(approvalRequest);
        setRejecting(true);
    };


    /**
     * Create the component that contains the actions on the users
     *
     * @param {*} user user to whom the actions will be performed
     * @returns A component that contains the actions on the users
     */
    const createActionsComponent = ({ approvalRequest }) => {
        return (
            <Grid container columns={3} spacing={1.5}>
                <Grid item xs={1} align="right">
                    <Tooltip title="View request" arrow>
                        <IconButton
                            color="primary"
                            onClick={() => viewRequest(approvalRequest)}
                        >
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={1} align="center">
                    <Tooltip title="Approve" arrow>
                        <IconButton
                            disabled={approvalRequest.STATUS_REQUEST == "Approved" || approvalRequest.STATUS_REQUEST == "Rejected"}
                            color="primary"
                            onClick={() => approveApprovalRequest(approvalRequest)}
                        >
                            <ThumbUpOffAltIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={1} align="left">
                    <Tooltip title="Reject" arrow>
                        <IconButton
                            disabled={approvalRequest.STATUS_REQUEST == "Approved" || approvalRequest.STATUS_REQUEST == "Rejected"}
                            color="primary"
                            onClick={() => rejectApprovalRequest(approvalRequest)}
                        >
                            <ThumbDownOffAltIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        );
    };

    // Request from all system approvalRequests
    const getApprovalRequests = (page, pageSize) => {
        Axios.get(`http://localhost:3001/Lists/ApprovalRequest?page=${page}&pageSize=${pageSize}&emp=${user}`).then((response) => {
            const AllApprovalRequests = response.data;
            const approvalRequestsList = AllApprovalRequests.map((approvalRequest) => {
                return createData(
                    approvalRequest.HR_APPROVER,
                    approvalRequest.PM_APPROVER,
                    approvalRequest.ID_LEAVE_REQUEST,
                    approvalRequest.STATUS_REQUEST,
                    approvalRequest.REQUEST_COMMENT,
                    createActionsComponent((approvalRequest = { approvalRequest }))
                );
            });
            setApprovalRequests(approvalRequestsList);
            setFilteredRows(approvalRequestsList);
            setRowProperties(columns);
        });
    };

    // Load all the users
    useEffect(() => {
        getApprovalRequests(page, pageSize);
    }, [page, pageSize]);

    return (
        <>
            {seeing &&
                <ModalApprovalRequest
                    open={seeing}
                    setOpen={setSeeing}
                    data={dataModal}
                />
            }
            {approving && (
                <ModalRequestActions
                    open={approving}
                    setOpen={setApproving}
                    create={false}
                    data={dataModal}
                    approve={true}
                />
            )}
            {rejecting && (
                <ModalRequestActions
                    open={rejecting}
                    setOpen={setRejecting}
                    create={false}
                    data={dataModal}
                    approve={false}
                />
            )}
            <Box className="box-content">
                <PageNavbar
                    barTitle={"Human Resource"}
                />
                <Box sx={{ p: 4, mt: 6  }}>
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        paddingRight="1px"
                    >
                        <Typography variant="h5" className="welcome-text">
                            Approval List
                        </Typography>
                    </Grid>
                    <Grid item md={12}>
                        <TableFilter
                            columns={columnsToFilter}
                            rows={approvalRequests}
                            setFilteredRows={setFilteredRows}
                        />
                        <CustomTable
                            columns={columns}
                            filteredRows={filteredRows}
                            setFilteredRows={setFilteredRows}
                            items={approvalRequests}
                            onPageChange={setPage}
                            onSizeChange={setPageSize}
                            rowProperties={rowProperties}  
                        />
                    </Grid>
                </Box>
            </Box>
        </>
    );
};

export default HRApprovalRequestPanel;