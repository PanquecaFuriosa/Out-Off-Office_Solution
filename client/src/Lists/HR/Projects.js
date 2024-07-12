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
import { 
    ModalProjectCreate,
} from "../../templates/components/modals/ModalProject";
import TableFilter from "../../templates/components/table/TableFilter";
import PageNavbar from "../../templates/components/common/PageNavbar";

const createData = (Project_type, Start_date, End_date, Manager, Comment, Status, Actions) => {
    return { 
        "Project type": Project_type, 
        "Start date": Start_date, 
        "End date": End_date, 
        Manager, 
        Comment, 
        Status, 
        Actions 
    };
};

const columns = [
    "Project type",
    "Start date",
    "End date",
    "Manager",
    "Comment",
    "Status",
    "Actions",
];
const columnsToFilter = [columns[0], columns[3], columns[5]];

const HRProjectPanel = ({ user }) => {
    const [seeing, setSeeing] = useState(false);
    const [dataModal, setDataModal] = useState([]);

    const [projects, setProjects] = useState([]);
    const [filteredRows, setFilteredRows] = useState(projects);
    const [rowProperties, setRowProperties] = useState([]);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const viewProject = (project) => {
        setDataModal(project);
        setSeeing(true);
    };

    const createActionsComponent = ({ project }) => {
        return (
            <Grid container columns={1} spacing={1.5}>
                <Grid item xs={1} align="center">
                    <Tooltip title="View project" arrow>
                        <IconButton
                            color="primary"
                            onClick={() => viewProject(project)}
                        >
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        );
    };

    const getProjects = (page, pageSize) => {
        Axios.get(`http://localhost:3001/Lists/Project/HR?page=${page}&pageSize=${pageSize}&partner=${user}`).then((response) => {
            const AllProjects = response.data;
            const projectsList = AllProjects.map((project) => {
                return createData(
                    project.PROJECT_TYPE,
                    project.INITIAL_DATE.slice(0,10),
                    project.FINAL_DATE.slice(0,10),
                    project.PROJECT_MANAGER,
                    project.PROJECT_COMMENT,
                    project.STATUS_PROJECT,
                    createActionsComponent((project = { project }))
                );
            });
            setProjects(projectsList);
            setFilteredRows(projectsList);
            setRowProperties(columns);
        });
    };

    useEffect(() => {
        getProjects(page, pageSize);
    }, [page, pageSize]);

    return (
        <>
            {seeing && (
                <ModalProjectCreate
                    open={seeing}
                    setOpen={setSeeing}
                    create={false}
                    edit={false}
                    data={dataModal}
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
                            Project List
                        </Typography>
                    </Grid>
                    <Grid item md={12}>
                        <TableFilter
                            columns={columnsToFilter}
                            rows={projects}
                            setFilteredRows={setFilteredRows}
                        />
                        <CustomTable
                            columns={columns}
                            filteredRows={filteredRows}
                            setFilteredRows={setFilteredRows}
                            items={projects}
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

export default HRProjectPanel;