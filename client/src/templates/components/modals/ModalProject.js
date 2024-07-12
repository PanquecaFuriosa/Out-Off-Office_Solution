import React, { useState } from "react";
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
    FormControl,
} from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";

const ModalProjectCreate = ({
    open,
    setOpen,
    create,
    edit,
    data,
}) => {
    const [type, setType] = useState(create ? "" : data.PROJECT_TYPE);
    const [startDate, setStartDate] = useState(
        create ? null : dayjs(data.INITIAL_DATE, "DD-MM-YYYY")
    );
    const [endDate, setEndDate] = useState(
        create ? null : dayjs(data.FINAL_DATE, "DD-MM-YYYY")
    );
    const [manager, setManager] = useState(create ? 0 : data.PROJECT_MANAGER);
    const [comment, setComment] = useState(create ? "" : data.PROJECT_COMMENT);
    const [status, setStatus] = useState(create ? "Active" : data.STATUS_PROJECT);
    const statuses = ["Active", "Inactive"];

    const handleSubmitDialog = () => {
        if (create) {
            Axios.post("http://localhost:3001/Lists/Project/create_project", {
                type: type,
                startDate: startDate,
                endDate: endDate, 
                manager: manager,
                comment: comment,
                status: status,
            }).then(() => {
                alert("Project registered.");
            });
        } else {
            Axios.put("http://localhost:3001/Lists/Project/update_project", {
                id: data.ID,
                type: type,
                startDate: startDate,
                endDate: endDate, 
                manager: manager,
                comment: comment,
                status: status,
            }).then(() => {
                alert("Project updated.");
            });
        }
    };

    const handleChangeType = (event) => {
        setType(event.target.value);
    };

    const handleChangeStartDate = (event) => {
        setStartDate(event);
    };

    const handleChangeEndDate = (event) => {
        setEndDate(event);
    };

    const handleChangeManager = (event) => {
        setManager(event.target.value);
    };

    const handleChangeComment = (event) => {
        setComment(event.target.value);
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
                    {create ? "Create Project" : "View Project"}
                </DialogTitle>
                <DialogContent>
                    <Grid container rowSpacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                disabled={!create && !edit}
                                value={type}
                                onChange={handleChangeType}
                                id="type"
                                label="Type"
                                fullWidth
                                style={{ marginTop: "0.5rem" }}
                                InputProps={{
                                    placeholder: "Type",
                                    endAdornment: (
                                        <InputAdornment
                                            comment="end"
                                            className="bi bi-person"
                                        />
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        disabled={!create && !edit}
                                        label="Start date"
                                        value={startDate}
                                        onChange={(d, _) => handleChangeStartDate(d)}
                                        format="DD-MM-YYYY"
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        disabled={!create && !edit}
                                        label="End date"
                                        value={endDate}
                                        onChange={(d, _) => handleChangeEndDate(d)}
                                        format="DD-MM-YYYY"
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                disabled={!create && !edit}
                                value={manager}
                                onChange={handleChangeManager}
                                id="manager"
                                label="Manager"
                                fullWidth
                                style={{ marginTop: "0.5rem" }}
                                InputProps={{
                                    placeholder: "Manager",
                                    endAdornment: (
                                        <InputAdornment
                                            comment="end"
                                            className="bi bi-person"
                                        />
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                disabled={!create && !edit}
                                value={comment}
                                onChange={handleChangeComment}
                                id="comment"
                                label="Comment"
                                fullWidth
                                style={{ marginTop: "0.5rem" }}
                                InputProps={{
                                    placeholder: "Comment",
                                    endAdornment: (
                                        <InputAdornment
                                            comment="end"
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

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Back</Button>
                    {(create || edit) &&
                        <Button onClick={handleSubmitDialog} autoFocus>
                            Apply
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        </>
    );
};

const ModalProjectDeactivate = ({ open, setOpen, data }) => {

    const handleDeactivate = () => {
        Axios.put("http://localhost:3001/Lists/Project/update_project?deactivate=true", {
            id: data.ID,
            status: "Inactive",
        }).then(() => {
            alert(`Project deactivated.`);
        });
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{"Are you sure you want to deactivate this project?"}</DialogTitle>
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

export { ModalProjectCreate,ModalProjectDeactivate };