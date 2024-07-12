import React, { useState, useEffect } from "react";
import Axios from "axios";

import {
    TextField,
    Grid,
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    InputAdornment,
    DialogTitle,
    Box,
    MenuItem,
} from "@mui/material";

/**
 * Create an employee data
 *
 * @param {*} Fullname employee's fullname
 * @returns An object, contains the data of the employee
 */
const createProjectData = (Type, Id) => {
    return { Type, Id };
};

/**
 * Create the user creation modal
 *
 * @param {*} open Indicates if the modal is open
 * @param {*} setOpen Open status setter function.
 * @param {*} create Indicates if the modal must create a new user or edit it
 * @param {*} data Employee data in case the modal i used to edit
 * @returns A dialog component with the form to create a user
 */
const ModalEmployeeCreate = ({
    open,
    setOpen,
    create,
    data,
    editing=false,
}) => {
    //form fields states
    const [fullname, setFullname] = useState(create ? "" : data.FULLNAME);
    const [subdivision, setSubdivision] = useState(create ? "" : data.SUBDIVISION);
    const [position, setPosition] = useState(create ? "" : data.POSITION);
    const [status, setStatus] = useState(create ? "Active" : data.STATUS_EMP);
    const [hrPartner, setHRPartner] = useState(create ? 1 : data.HR_PARTNER);
    const [pmPartner, setPMPartner] = useState(create ? 1 : data.PM_PARTNER);
    const [oOOB, setOOOB] = useState(create ? 0 : data.OUT_OF_OFFICE_BALANCE);

    const statuses = ["Active", "Inactive"];

    const handleSubmitDialog = () => {
        if (create) {
            Axios.post("http://localhost:3001/Lists/Employee/create_employee", {
                fullname: fullname,
                subdivision: subdivision,
                position: position, 
                status: status,
                hrPartner: hrPartner,
                pmPartner: pmPartner,
                ooob: oOOB,

            }).then(() => {
                alert("Employee registered.");
            });
        } else  {
            Axios.put("http://localhost:3001/Lists/Employee/update_employee", {
                id: data.ID,
                fullname: fullname,
                subdivision: subdivision,
                position: position, 
                status: status,
                hrPartner: hrPartner,
                pmPartner: pmPartner,
                ooob: oOOB,

            }).then(() => {
                alert("Employee updated.");
            });
        }
    };

    const handleChangeFullname = (event) => {
        setFullname(event.target.value);
    };

    const handleChangeSubdivision = (event) => {
        setSubdivision(event.target.value);
    };

    const handleChangePosition = (event) => {
        setPosition(event.target.value);
    };

    const handleChangeHRPartner = (event) => {
        setHRPartner(event.target.value);
    };

    const handleChangePMPartner = (event) => {
        setPMPartner(event.target.value);
    };

    const handleChangeOOOB = (event) => {
        setOOOB(event.target.value);
    };
    
    return (
        <>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="alert-dialog-title">
                    {create ? "Create Employee" : "View Employee"}
                </DialogTitle>
                <DialogContent>
                    <Grid container rowSpacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                disabled={!create && !editing}
                                value={fullname}
                                onChange={handleChangeFullname}
                                id="fullname"
                                label="Fullname"
                                fullWidth
                                style={{ marginTop: "0.5rem" }}
                                InputProps={{
                                    placeholder: "Fullname",
                                    endAdornment: (
                                        <InputAdornment
                                            position="end"
                                            className="bi bi-person"
                                        />
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={!create && !editing}
                                value={subdivision}
                                onChange={handleChangeSubdivision}
                                id="subdivision"
                                label="Subdivision"
                                fullWidth
                                style={{ marginTop: "0.5rem" }}
                                InputProps={{
                                    placeholder: "Subdivision",
                                    endAdornment: (
                                        <InputAdornment
                                            position="end"
                                            className="bi bi-person"
                                        />
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                disabled={!create && !editing}
                                value={position}
                                onChange={handleChangePosition}
                                id="position"
                                label="Position"
                                fullWidth
                                style={{ marginTop: "0.5rem" }}
                                InputProps={{
                                    placeholder: "Position",
                                    endAdornment: (
                                        <InputAdornment
                                            position="end"
                                            className="bi bi-person"
                                        />
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                disabled={!create}
                                id="outlined-select-status"
                                select
                                label="Status"
                                defaultValue={status}
                                helperText="Please select the status"
                                onChange={(event) => {
                                    setStatus(event.target.value);
                                }}
                                >
                                {statuses.map((option) => (
                                    <MenuItem key={option} value={option}>
                                    {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                disabled={!create && !editing}
                                value={hrPartner}
                                onChange={handleChangeHRPartner}
                                id="hr-partner"
                                label="Human Resource Partner"
                                fullWidth
                                style={{ marginTop: "0.5rem" }}
                                InputProps={{
                                    placeholder: "ID HR partner",
                                    endAdornment: (
                                        <InputAdornment
                                            position="end"
                                            className="bi bi-person"
                                        />
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                disabled={!create && !editing}
                                value={pmPartner}
                                onChange={handleChangePMPartner}
                                id="pm-partner"
                                label="Project Manager Partner"
                                fullWidth
                                style={{ marginTop: "0.5rem" }}
                                InputProps={{
                                    placeholder: "ID PM partner",
                                    endAdornment: (
                                        <InputAdornment
                                            position="end"
                                            className="bi bi-person"
                                        />
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                disabled={!create && !editing}
                                value={oOOB}
                                onChange={handleChangeOOOB}
                                id="out-of-office-balance"
                                label="Out-of-office balance"
                                fullWidth
                                style={{ marginTop: "0.5rem" }}
                                InputProps={{
                                    placeholder: "Out-of-office balance",
                                    endAdornment: (
                                        <InputAdornment
                                            position="end"
                                            className="bi bi-person"
                                        />
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Back</Button>
                    {(create || editing) &&
                        <Button onClick={handleSubmitDialog} autoFocus>
                            Apply
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        </>
    );
};

/**
 * Create the user deletion modal
 *
 * @param {*} open Indicates if the modal is open
 * @param {*} setOpen Open status setter function.
 * @param {*} data Data of the user to delete
 * @returns A dialog component with the form to delete a user
 */
const ModalAssignEmployee = ({ open, setOpen, data }) => {
    const [projects, setProjects] = useState([]);
    const [project, setProject] = useState(0);

    // Request from all system projects
    const getProjects = () => {
        Axios.get(`http://localhost:3001/Lists/Project`).then((response) => {
            const allProjects = response.data;
            const projectList = allProjects.map((project) => {
                return createProjectData(
                    project.PROJECT_TYPE,
                    project.ID,
                );
            });
            setProjects(projectList);
        });
    };

    // Load all the projects
    useEffect(() => {
        getProjects();
    }, []);

    const handleSubmit = () => {
        Axios.post("http://localhost:3001/Lists/PeopleProject/create_assignment", {
            project: project,
            employee: data.ID,
        }).then(() => {
            alert("Assigned project.");
        });
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Select the project to assign</DialogTitle>
            <DialogContent sx={{ paddingTop: "10px !important" }}>
                <TextField
                    id="outlined-select-project"
                    select
                    label="Project type"
                    defaultValue=""
                    helperText="Please select a project"
                    onChange={(event) => {
                        setProject(event.target.value);
                    }}
                    >
                    {projects.map((option) => (
                        <MenuItem key={option.Type} value={option.Id}>
                        {option.Type}
                        </MenuItem>
                    ))}
                </TextField>
                <DialogActions>
                    <Box display="flex" flexDirection="row-reverse">
                        <Button variant="contained" onClick={() => setOpen(false)}>
                            <Typography>Back</Typography>
                        </Button>
                        <Box sx={{ pr: 1 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#009103",
                                    ":hover": {
                                        backgroundColor: "green",
                                    },
                                }}
                                onClick={(_) => handleSubmit()}
                            >
                                <Typography>Assign</Typography>
                            </Button>
                        </Box>
                    </Box>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

const ModalEmployeeDeactivate = ({ open, setOpen, data }) => {

    const handleDeactivate = () => {
        Axios.put("http://localhost:3001/Lists/Employee/update_employee?deactivate=true", {
            id: data.ID,
            status: "Inactive",
        }).then(() => {
            alert("Employee deactivated.");
        });
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{"Are you sure you want to deactivate this employee?"}</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="row-reverse">
                    <Button variant="contained" onClick={() => setOpen(false)}>
                        <Typography>Back</Typography>
                    </Button>
                    <Box sx={{ pr: 1 }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#d32f2f",
                                ":hover": {
                                    backgroundColor: "red",
                                },
                            }}
                            onClick={(_) => handleDeactivate()}
                        >
                            <Typography>Deactivate</Typography>
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export { ModalEmployeeCreate, ModalAssignEmployee, ModalEmployeeDeactivate};