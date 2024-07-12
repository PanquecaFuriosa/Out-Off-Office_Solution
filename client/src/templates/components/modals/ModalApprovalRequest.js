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
} from "@mui/material";

const ModalApprovalRequest = ({
    open,
    setOpen,
    data,
}) => {
    const [comment, setComment] = useState(data.REQUEST_COMMENT);
    const hrApprover = data.HR_APPROVER;
    const pmApprover = data.PM_APPROVER;
    const leaveRequest = data.ID_LEAVE_REQUEST;
    const statusRequest = data.STATUS_REQUEST;
    
    const handleChangeComment = (event) => {
        setComment(event);
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
                    "View Request"
                </DialogTitle>
                <DialogContent>
                    <Grid container rowSpacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                disabled
                                value={hrApprover}
                                id="hr-approver"
                                label="HR Approver"
                                fullWidth
                                style={{ marginTop: "0.5rem" }}
                                InputProps={{
                                    placeholder: "HR Approver",
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
                                disabled
                                value={pmApprover}
                                id="pm-approver"
                                label="PM Approver"
                                fullWidth
                                style={{ marginTop: "0.5rem" }}
                                InputProps={{
                                    placeholder: "PM Approver",
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
                                disabled
                                value={leaveRequest}
                                id="leaveRequest"
                                label="Leave request"
                                fullWidth
                                style={{ marginTop: "0.5rem" }}
                                InputProps={{
                                    placeholder: "Leave Request",
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
                                value={statusRequest}
                                disabled
                                id="status"
                                label="Status"
                                multiline
                                fullWidth
                                InputProps={{
                                    placeholder: "Status",
                                    endAdornment: (
                                        <InputAdornment
                                            position="end"
                                            className="bi bi-person-vcard"
                                        />
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Back</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const ModalRequestActions = ({ open, setOpen, data, approve=true }) => {
    const process = approve ? "Approved" : "Rejected";
    const action = approve ? "approve" : "reject";
    const handleProcess = () => {
        Axios.put("http://localhost:3001/Lists/ApprovalRequest/update_request", {
            id: data.ID,
            hrApprover: data.HR_APPROVER,
            pmApprover: data.PM_APPROVER,
            leaveRequest: data.ID_LEAVE_REQUEST,
            comment: data.REQUEST_COMMENT,
            status: process,
        }).then(() => {
            alert(`Request ${process}.`);
        });
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{`Are you sure you want to ${action} this request?`}</DialogTitle>
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
                            onClick={(_) => handleProcess()}
                        >
                            <Typography>Submit</Typography>
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export { ModalApprovalRequest, ModalRequestActions };