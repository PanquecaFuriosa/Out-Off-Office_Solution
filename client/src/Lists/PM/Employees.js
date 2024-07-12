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
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CustomTable from "../../templates/components/table/CustomTable";
import { 
    ModalEmployeeCreate,
    ModalAssignEmployee
} 
from "../../templates/components/modals/ModalEmployee";
import TableFilter from "../../templates/components/table/TableFilter";
import PageNavbar from "../../templates/components/common/PageNavbar";

const createData = (Fullname, Subdivision, Position, Status_emp, HR_partner, PM_partner, Out_of_office_balance, Actions) => {
    return { 
        Fullname, 
        Subdivision, 
        Position, 
        "Status": Status_emp, 
        "HR Partner": HR_partner, 
        "PM Partner": PM_partner, 
        "Out-Off-Office Balance": Out_of_office_balance, 
        Actions };
};

const columns = [
    "Fullname",
    "Subdivision",
    "Position",
    "Status",
    "HR Partner",
    "PM Partner",
    "Out-Off-Office Balance",
    "Actions",
];
const columnsToFilter = [columns[0], columns[1], columns[2], columns[3], columns[4], columns[6]];

const PMEmployeePanel = ({ user }) => {
    const [seeing, setSeeing] = useState(false);
    const [editing, setEditing] = useState(false);
    const [dataModal, setDataModal] = useState([]);

    const [employees, setEmployees] = useState([]);
    const [filteredRows, setFilteredRows] = useState(employees);
    const [rowProperties, setRowProperties] = useState([]);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);


    const viewEmployee = (employee) => {
        setDataModal(employee);
        setSeeing(true);
    };

    const assignEmployee = (employee) => {
        setDataModal(employee);
        setEditing(true);
    };

    const createActionsComponent = ({ employee }) => {
        return (
            <Grid container columns={2} spacing={1.5}>
                <Grid item xs={1} align="right">
                    <Tooltip title="View employee" arrow>
                        <IconButton
                            color="primary"
                            onClick={() => viewEmployee(employee)}
                        >
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={1} align="left">
                    <Tooltip
                        title="Assign employee"
                        arrow
                    >
                        <IconButton
                            color="primary"
                            onClick={() =>
                                assignEmployee(employee)
                            }
                        >
                            <AssignmentIndIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        );
    };

    const getEmployees = (page, pageSize) => {
        Axios.get(`http://localhost:3001/Lists/Employee/Partner?page=${page}&pageSize=${pageSize}&partner=${user}`).then((response) => {
            const allEmployees = response.data;
            const employeeList = allEmployees.map((employee) => {
                return createData(
                    employee.FULLNAME,
                    employee.SUBDIVISION,
                    employee.POSITION,
                    employee.STATUS_EMP,
                    employee.HR_PARTNER,
                    employee.PM_PARTNER,
                    employee.OUT_OF_OFFICE_BALANCE,
                    createActionsComponent((employee = { employee }))
                );
            });
            setEmployees(employeeList);
            setFilteredRows(employeeList);
            setRowProperties(columns);
        });
    };

    useEffect(() => {
        getEmployees(page, pageSize);
    }, [page, pageSize]);

    return (
        <>
            {seeing && (
                <ModalEmployeeCreate
                    open={seeing}
                    setOpen={setSeeing}
                    create={false}
                    data={dataModal}
                />
            )}
            {editing && (
                <ModalAssignEmployee
                    open={editing}
                    setOpen={setEditing}
                    create={false}
                    data={dataModal}
                />
            )}
            <Box className="box-content">
                <PageNavbar
                    barTitle={"Project Manager"}
                />
                <Box sx={{ p: 4, mt: 6 }}>
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        paddingRight="1px"
                    >
                        <Typography variant="h5" className="welcome-text">
                            Employee List
                        </Typography>
                    </Grid>
                    <Grid item md={12}>
                        <TableFilter
                            columns={columnsToFilter}
                            rows={employees}
                            setFilteredRows={setFilteredRows}
                        />
                        <CustomTable
                            columns={columns}
                            filteredRows={filteredRows}
                            setFilteredRows={setFilteredRows}
                            items={employees}
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

export default PMEmployeePanel;