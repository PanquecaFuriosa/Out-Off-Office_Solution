import React, { useState, useEffect } from "react";
import Axios from "axios"
import {
    Box,
    IconButton,
    Tooltip,
    Grid,
    Typography,
    Button,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CancelIcon from '@mui/icons-material/Cancel';
import PublishIcon from '@mui/icons-material/Publish';
import CustomTable from "../../templates/components/table/CustomTable";
import { 
    ModalRequestCreate, 
    ModalRequestCancel,
    ModalRequestSubmit
} from "../../templates/components/modals/ModalLeaveRequest";
import TableFilter from "../../templates/components/table/TableFilter";
import PageNavbar from "../../templates/components/common/PageNavbar";

/**
 * Create an leaveRequest data
 *
 * @param {*} Employee leaveRequest's fullname
 * @param {*} Absence_reason leaveRequest's subdivision
 * @param {*} Start_date leaveRequest's position
 * @param {*} End_date leaveRequest's status
 * @param {*} Comment leaveRequest's people partner
 * @param {*} Status leaveRequest's out of office balance
 * @param {*} Actions available actions on the leaveRequest
 * @returns An object, contains the data of the leaveRequest
 */
const createData = (Employee, Absence_reason, Start_date, End_date, Comment, Status, Actions) => {
    return { 
        Employee, 
        "Absence reason": Absence_reason, 
        "Start date": Start_date, 
        "End date": End_date, 
        Comment, 
        Status, 
        Actions };
};

const columns = [
    "Employee",
    "Absence reason",
    "Start date",
    "End date",
    "Comment",
    "Status",
    "Actions",
];
const columnsToFilter = [columns[0], columns[1], columns[5]];

const CELeaveRequestPanel = ({ user }) => {
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState(false);
    const [submiting, setSubmiting] = useState(false);
    const [canceling, setCanceling] = useState(false);
    const [dataModal, setDataModal] = useState([]);

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [filteredRows, setFilteredRows] = useState(leaveRequests);
    const [rowProperties, setRowProperties] = useState([]);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const handleCreateLeaveRequest = () => {
        setDataModal(null);
        setCreating(true);
    };
    /**
     * Employee modify management
     *
     * @param {*} leaveRequest leaveRequest to edit
     */
    const modifyLeaveRequest = (leaveRequest) => {
        setDataModal(leaveRequest);
        setEditing(true);
    };

    const cancelLeaveRequest = (leaveRequest) => {
        setDataModal(leaveRequest);
        setCanceling(true);
    };

    const submitLeaveRequest = (leaveRequest) => {
        setDataModal(leaveRequest);
        setSubmiting(true);
    };


    /**
     * Create the component that contains the actions on the users
     *
     * @param {*} user user to whom the actions will be performed
     * @returns A component that contains the actions on the users
     */
    const createActionsComponent = ({ leaveRequest }) => {
        return (
            <Grid container columns={3} spacing={1.5}>
                <Grid item xs={1} align="right">
                    <Tooltip title="Modify leave request" arrow>
                        <IconButton
                            disabled={leaveRequest.STATUS_REQUEST === "Canceled" || 
                                leaveRequest.STATUS_REQUEST === "Submitted" || 
                                leaveRequest.STATUS_REQUEST === "Approved" ||
                                leaveRequest.STATUS_REQUEST === "Rejected"
                            }
                            color="primary"
                            onClick={() => modifyLeaveRequest(leaveRequest)}
                        >
                            <EditOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={1} align="center">
                    <Tooltip title="Cancel leave request" arrow>
                        <IconButton
                            disabled={leaveRequest.STATUS_REQUEST === "Canceled" || 
                                leaveRequest.STATUS_REQUEST === "Submitted" || 
                                leaveRequest.STATUS_REQUEST === "Approved" ||
                                leaveRequest.STATUS_REQUEST === "Rejected"
                            }
                            color="primary"
                            onClick={() => cancelLeaveRequest(leaveRequest)}
                        >
                            <CancelIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={0} align="center">
                    <Tooltip title="Submit leave request" arrow>
                        <IconButton
                            disabled={leaveRequest.STATUS_REQUEST === "Canceled" || 
                                leaveRequest.STATUS_REQUEST === "Submitted" || 
                                leaveRequest.STATUS_REQUEST === "Approved" ||
                                leaveRequest.STATUS_REQUEST === "Rejected"
                            }
                            color="primary"
                            onClick={() => submitLeaveRequest(leaveRequest)}
                        >
                            <PublishIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            
        );
    };

    // Request from all system leaveRequests
    const getLeaveRequests = (page, pageSize) => {
        Axios.get(`http://localhost:3001/Lists/LeaveRequest?page=${page}&pageSize=${pageSize}&emp=${user}`).then((response) => {
            const AllLeaveRequests = response.data;
            const leaveRequestsList = AllLeaveRequests.map((leaveRequest) => {
                return createData(
                    leaveRequest.EMPLOYEE,
                    leaveRequest.ABSENCE_REASON,
                    leaveRequest.INITIAL_DATE.slice(0,10),
                    leaveRequest.FINAL_DATE.slice(0,10),
                    leaveRequest.REQUEST_COMMENT,
                    leaveRequest.STATUS_REQUEST,
                    createActionsComponent((leaveRequest = { leaveRequest }))
                );
            });
            setLeaveRequests(leaveRequestsList);
            setFilteredRows(leaveRequestsList);
            setRowProperties(columns);
        });
    };

    // Load all the users
    useEffect(() => {
        getLeaveRequests(page, pageSize);
    }, [page, pageSize, user]);
    
    return (
        <>
            {creating && (
                <ModalRequestCreate
                    open={creating}
                    setOpen={setCreating}
                    create={true}
                    data={dataModal}
                    employee={user}
                />
            )}
            {editing && (
                <ModalRequestCreate
                    open={editing}
                    setOpen={setEditing}
                    create={false}
                    data={dataModal}
                    employee={user}
                />
            )}
            {canceling && (
                <ModalRequestCancel
                    open={canceling}
                    setOpen={setCanceling}
                    data={dataModal}
                />
            )}
            {submiting && (
                <ModalRequestSubmit
                    open={submiting}
                    setOpen={setSubmiting}
                    data={dataModal}
                />
            )}
            <Box className="box-content">
                <PageNavbar
                    barTitle={"Company Employee"}
                />
                <Box sx={{ p: 4, mt: 6 }}>
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        paddingRight="1px"
                    >
                        <Typography variant="h5" className="welcome-text">
                            Leave request List
                        </Typography>
                        <Button
                            variant="contained"
                            className="options-button"
                            onClick={handleCreateLeaveRequest}
                        >
                            <Typography
                                variant="subtitle1"
                                className="text-options-button"
                            >
                                Create Leave Request
                            </Typography>
                        </Button>
                    </Grid>
                    <Grid item md={12}>
                        <TableFilter
                            columns={columnsToFilter}
                            rows={leaveRequests}
                            setFilteredRows={setFilteredRows}
                        />
                        <CustomTable
                            columns={columns}
                            filteredRows={filteredRows}
                            setFilteredRows={setFilteredRows}
                            items={leaveRequests}
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

export default CELeaveRequestPanel;