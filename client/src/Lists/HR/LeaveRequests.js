import React, { useState, useEffect } from "react";
import Axios from "axios"
import {
    Box,
    IconButton,
    Tooltip,
    Grid,
    Typography,
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import CustomTable from "../../templates/components/table/CustomTable";
import { ModalRequestCreate } from "../../templates/components/modals/ModalLeaveRequest";
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

const PMLeaveRequestPanel = ({ user }) => {
    const [seeing, setSeeing] = useState(false);
    const [dataModal, setDataModal] = useState([]);

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [filteredRows, setFilteredRows] = useState(leaveRequests);
    const [rowProperties, setRowProperties] = useState([]);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    /**
     * Employee modify management
     *
     * @param {*} leaveRequest leaveRequest to edit
     */
    const viewLeaveRequest = (leaveRequest) => {
        setDataModal(leaveRequest);
        setSeeing(true);
    };


    /**
     * Create the component that contains the actions on the users
     *
     * @param {*} user user to whom the actions will be performed
     * @returns A component that contains the actions on the users
     */
    const createActionsComponent = ({ leaveRequest }) => {
        return (
            <Grid container columns={1} spacing={1.5}>
                <Grid item xs={1} align="center">
                    <Tooltip title="View leave request" arrow>
                        <IconButton
                            color="primary"
                            onClick={() => viewLeaveRequest(leaveRequest)}
                        >
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        );
    };

    // Request from all system leaveRequests
    const getLeaveRequests = (page, pageSize) => {
        Axios.get(`http://localhost:3001/Lists/LeaveRequest/Partner?page=${page}&pageSize=${pageSize}&partner=${user}`).then((response) => {
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
    }, [page, pageSize]);

    return (
        <>
            {seeing && (
                <ModalRequestCreate
                    open={seeing}
                    setOpen={setSeeing}
                    create={false}
                    data={dataModal}
                    employee={dataModal.EMPLOYEE}
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
                            Leave Request List
                        </Typography>
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

export default PMLeaveRequestPanel;