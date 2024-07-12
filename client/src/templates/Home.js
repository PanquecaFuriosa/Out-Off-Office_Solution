import React, { useState, useEffect } from "react";
import Axios from "axios";
// Navigation
import { useLocation, useNavigate } from "react-router-dom";
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button,
    Box,
} from "@mui/material";

const createData = (Fullname, Id) => {
    return { Fullname, Id };
}; 

const Home = ({ setUser=undefined }) => {
    const [open, setOpen] = useState(true);
    const [role, setRole] = useState("Employee");
    const [fullname, setFullname] = useState("");
    const [employees, setEmployees] = useState([]);
    const pages = {"Human Resource": "/Lists/HR/HRPanel", "Project Manager": "/Lists/PM/PMPanel", "Employee": "/Lists/CE/CEPanel"};

    const navigate = useNavigate();
    const location = useLocation();

    // Request from all system employees
    const getEmployees = (role) => {
        Axios.get(`http://localhost:3001/Lists/Employee?role=${role}`).then((response) => {
            const allEmployees = response.data;
            const employeeList = allEmployees.map((employee) => {
                return createData(
                    employee.FULLNAME,
                    employee.ID,
                );
            });
            setEmployees(employeeList);
        });
    };

    // Load all the users
    useEffect(() => {
        getEmployees(role);
    }, [role]);
    
    return (
        <Dialog 
            open={open} 
            setOpen={setOpen}
        >
            <DialogTitle>
                Select your role in the company
            </DialogTitle>
            <DialogContent>
                <Box 
                    sx={{
                        width: 500,
                        maxWidth: '100%',
                        mt: 2,
                    }}
                >
                    <TextField
                        select
                        fullWidth
                        id="role-select"
                        label="Role"
                        defaultValue={role}
                        helperText="Please select your role"
                        onChange={(event) => {
                            setRole(event.target.value);
                        }}
                    >
                        {Object.keys(pages).map((role) => (
                            <MenuItem key={role} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        id="user-select"
                        label="Fullname"
                        defaultValue={fullname}
                        helperText="Please select your fullname"
                        onChange={(event) => {
                            setUser(event.target.value.Id);
                            setFullname(event.target.value.Fullname);
                        }}
                    >
                        {employees.map((employee) => (
                            <MenuItem key={employee.Id} value={employee}>
                                {employee.Fullname}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <DialogActions>
                    <Button onClick={() => {
                        setOpen(false);
                        navigate(pages[role], {
                            state: { from: location },
                            replace: true,
                        });
                    }}
                    >
                        Select
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default Home;