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


/**
 * Create an project data
 *
 * @param {*} Project_type project's name
 * @param {*} Start_date project's start date
 * @param {*} End_date project's end date
 * @param {*} Manager project's manager
 * @param {*} Comment A comment about the project
 * @param {*} Status project's status
 * @param {*} Suspended True if the project is deactivated, False otherwise
 * @param {*} Actions available actions on the project
 * @returns An object, contains the data of the project
 */
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

const CEProjectPanel = ({ user }) => {
    const [seeing, setSeeing] = useState(false);
    const [dataModal, setDataModal] = useState([]);

    const [projects, setProjects] = useState([]);
    const [filteredRows, setFilteredRows] = useState(projects);
    const [rowProperties, setRowProperties] = useState([]);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    /**
     * Project modify management
     *
     * @param {*} project project to edit
     */
    const viewProject = (project) => {
        setDataModal(project);
        setSeeing(true);
    };

    /**
     * Create the component that contains the actions on the projects
     *
     * @param {*} user user to whom the actions will be performed
     * @returns A component that contains the actions on the projects
     */
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

    // Request from all system projects
    const getProjects = (page, pageSize) => {
        Axios.get(`http://localhost:3001/Lists/Project/CE?page=${page}&pageSize=${pageSize}&emp=${user}`).then((response) => {
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

    // Load all the projects
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
                    barTitle={"Company Employee"}
                />
                <Box sx={{ p: 4, mt: 6 }}>
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

export default CEProjectPanel;