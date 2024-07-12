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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CustomTable from "../../templates/components/table/CustomTable";
import { 
    ModalEmployeeCreate,
    ModalEmployeeDeactivate,
} from "../../templates/components/modals/ModalEmployee";
import TableFilter from "../../templates/components/table/TableFilter";
import PageNavbar from "../../templates/components/common/PageNavbar";


/**
 * Create an employee data
 *
 * @param {*} Fullname employee's fullname
 * @param {*} Subdivision employee's subdivision
 * @param {*} Position employee's position
 * @param {*} Status_emp employee's status
 * @param {*} People_partner employee's people partner
 * @param {*} Out_of_office_balance employee's out of office balance
 * @param {*} Actions available actions on the employee
 * @returns An object, contains the data of the employee
 */
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
const columnsToFilter = [columns[0], columns[1], columns[2], columns[3], columns[5], columns[6]];

const HREmployeePanel = ({ user }) => {
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState(false);
    const [suspending, setSuspending] = useState(false);
    const [dataModal, setDataModal] = useState([]);

    const [employees, setEmployees] = useState([]);
    const [filteredRows, setFilteredRows] = useState(employees);
    const [rowProperties, setRowProperties] = useState([]);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    /**
     * Employee creation management
     */
    const handleCreateEmployee = () => {
        setDataModal(null);
        setCreating(true);
    };

    /**
     * Employee modify management
     *
     * @param {*} employee employee to edit
     */
    const modifyEmployee = (employee) => {
        setDataModal(employee);
        setEditing(true);
    };

    /**
     * Employee suspension management
     *
     * @param {*} ID employee's ID
     * @param {*} suspended employeer's suspend state
     */
    const toggleLock = (ID, suspended) => {
        setDataModal({ ID, suspended });
        setSuspending(true);
    };

    /**
     * Create the component that contains the actions on the users
     *
     * @param {*} user user to whom the actions will be performed
     * @returns A component that contains the actions on the users
     */
    const createActionsComponent = ({ employee }) => {
        return (
            <Grid container columns={2} spacing={1.5}>
                <Grid item xs={1} align="right">
                    <Tooltip title="Modify employee" arrow>
                        <IconButton
                            color="primary"
                            onClick={() => modifyEmployee(employee)}
                        >
                            <EditOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item xs={1} align="left">
                    <Tooltip
                        title={employee.STATUS_EMP == "Active" ? "Deactivate employee" : ""}
                        arrow
                    >
                        <IconButton
                            disabled={employee.STATUS_EMP !== "Active"}
                            color="primary"
                            onClick={() =>
                                toggleLock(employee.ID, employee.STATUS_EMP)
                            }
                        >
                            <LockOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        );
    };

    // Request from all system employees
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

    // Load all the users
    useEffect(() => {
        getEmployees(page, pageSize);
    }, [page, pageSize, suspending]);

    return (
        <>
            {creating &&
                <ModalEmployeeCreate 
                    open={creating}
                    setOpen={setCreating}
                    create={true}
                    editing={false}
                    data={dataModal}
                />
            }
            {editing &&
                <ModalEmployeeCreate 
                    open={editing}
                    setOpen={setEditing}
                    create={false}
                    editing={true}
                    data={dataModal}
                />
            }
            {suspending &&
                <ModalEmployeeDeactivate
                    open={suspending}
                    setOpen={setSuspending}
                    data={dataModal}
                />
            }
            <Box className="box-content">
                <PageNavbar
                    barTitle={"Human Resource"}
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
                        <Button
                            variant="contained"
                            className="options-button"
                            onClick={handleCreateEmployee}
                        >
                            <Typography
                                variant="subtitle1"
                                className="text-options-button"
                            >
                                Create User
                            </Typography>
                        </Button>
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

export default HREmployeePanel;