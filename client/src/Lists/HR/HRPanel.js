import React from "react";

import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";

const HRPanel = () => {
    const pages = {
        "Employee List": "/HR/Lists/Employee", 
        "Leave Request List": "/HR/Lists/LeaveRequest", 
        "Approval Request List": "/HR/Lists/ApprovalRequest", 
        "Project List": "/HR/Lists/Project"
    };
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center', 
                rowGap: 4,
                alignContent: 'space-between',
                height: '100vh', 
                backgroundColor: '#cecece', 
            }}
            >
            <Typography fontSize={20} color={"black"}>What do you want to go?</Typography>
            {Object.keys(pages).map((section) => (
                <Button 
                variant="contained" 
                color="primary" 
                sx={{ height: 100, width: 500 }}
                onClick={() => {
                    navigate(pages[section], {
                        state: { from: location},
                        replace: true,
                    })
                }}
                >
                    {section}
                </Button>
            ))}
        </Box>
    );
};

export default HRPanel;