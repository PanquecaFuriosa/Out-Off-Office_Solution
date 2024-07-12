import { useState } from "react";
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
    FormControl,
    MenuItem,
} from "@mui/material";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";

/**
 * Create the user creation modal
 *
 * @param {*} open Indicates if the modal is open
 * @param {*} setOpen Open status setter function.
 * @param {*} create Indicates if the modal must create a new user or edit it
 * @param {*} data User data in case the modal i used to edit
 * @returns A dialog component with the form to create a user
 */
const ModalRequestCreate = ({
    open,
    setOpen,
    create,
    employee,
    data,
}) => {
    //form fields states
    const [absenceReason, setAbsenceReason] = useState(create ? "" : data.ABSENCE_REASON);
    const [startDate, setStartDate] = useState(
        create ? null : dayjs(data.INITIAL_DATE, "DD-MM-YYYY")
    );
    const [endDate, setEndDate] = useState(
        create ? null : dayjs(data.FINAL_DATE, "DD-MM-YYYY")
    );
    const [comment, setComment] = useState(create ? "" : data.REQUEST_COMMENT);
    const [statusRequest, setStatusRequest] = useState(create ? "Active" : data.STATUS_REQUEST);
    const statuses = ["Active", "Inactive"];

    const handleSubmitDialog = () => {
        if (create) {
            Axios.post("http://localhost:3001/Lists/LeaveRequest/create_request", {
                employee: employee,
                absenceReason: absenceReason,
                startDate: startDate,
                endDate: endDate,
                comment: comment,
                status: statusRequest,
            }).then(() => {
                alert("Request registered.");
            });
        } else {
            Axios.put("http://localhost:3001/Lists/LeaveRequest/update_request", {
                id: data.ID,
                employee: employee,
                absenceReason: absenceReason,
                startDate: startDate,
                endDate: endDate,
                comment: comment,
                status: statusRequest,
            }).then(() => {
                alert("Request updated.");
            });
        }
        
    };

    const handleChangeAbsenceReason = (event) => {
        setAbsenceReason(event.target.value);
    };

    const handleChangeStartDate = (event) => {
        setStartDate(event);
    };

    const handleChangeEndDate = (event) => {
        setEndDate(event);
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
                    {create ? "Create Request" : "Edit Request"}
                </DialogTitle>
                <DialogContent>
                    <Grid container rowSpacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                disabled={!create}
                                value={absenceReason}
                                onChange={handleChangeAbsenceReason}
                                id="absenceReason"
                                label="Absence reason"
                                fullWidth
                                style={{ marginTop: "0.5rem" }}
                                InputProps={{
                                    placeholder: "Absence reason",
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
                            <FormControl fullWidth>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        disabled={!create}
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
                                        disabled={!create}
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
                                disabled={!create}
                                value={comment}
                                onChange={handleChangeComment}
                                id="comment"
                                label="Comment"
                                fullWidth
                                InputProps={{
                                    placeholder: "Comment",
                                    endAdornment: (
                                        <InputAdornment
                                            position="end"
                                            className="bi bi-lock"
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
                                defaultValue={statusRequest}
                                helperText="Please select the status"
                                onChange={(event) => {
                                    setStatusRequest(event.target.value);
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
                    {create &&
                        <Button onClick={handleSubmitDialog} autoFocus>
                            Apply
                        </Button>}
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
const ModalRequestSubmit = ({ open, setOpen, data }) => {
    const handleSubmit = () => {
        Axios.put("http://localhost:3001/Lists/LeaveRequest/update_request", {
            id: data.ID,
            employee: data.EMPLOYEE,
            absenceReason: data.ABSENCE_REASON,
            startDate: data.INITIAL_DATE,
            endDate: data.FINAL_DATE,
            comment: data.REQUEST_COMMENT,
            status: "Submitted",
        }).then(() => {
            alert("Request updated.");
        });
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{`Are you sure you want to submit this request?`}</DialogTitle>
            <DialogContent>
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
                            <Typography>Submit</Typography>
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
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
const ModalRequestCancel = ({ open, setOpen, data }) => {
    const handleCancel = () => {
        Axios.put("http://localhost:3001/Lists/LeaveRequest/update_request", {
            id: data.ID,
            employee: data.EMPLOYEE,
            absenceReason: data.ABSENCE_REASON,
            startDate: data.INITIAL_DATE,
            endDate: data.FINAL_DATE,
            comment: data.REQUEST_COMMENT,
            status: "Canceled",
        }).then(() => {
            alert("Request updated.");
        });
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{`Are you sure you want to cancel this request?`}</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="row-reverse">
                    <Button variant="contained" onClick={() => setOpen(false)}>
                        <Typography>Back</Typography>
                    </Button>
                    <Box sx={{ pr: 1 }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#f44336",
                                ":hover": {
                                    backgroundColor: "red",
                                },
                            }}
                            onClick={(_) => handleCancel()}
                        >
                            <Typography>Cancel</Typography>
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};



export { ModalRequestCreate, ModalRequestCancel, ModalRequestSubmit };