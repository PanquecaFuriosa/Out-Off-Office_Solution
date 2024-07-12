import React from "react";

import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";

const PMPanel = () => {
    const pages = {
        "Employee List": "/PM/Lists/Employee", 
        "Leave Request List": "/PM/Lists/LeaveRequest", 
        "Approval Request List": "/PM/Lists/ApprovalRequest", 
        "Project List": "/PM/Lists/Project"
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

export default PMPanel;