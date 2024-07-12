const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Pinwina.0610",
    database:"db_office"
});

// POST methods

// Create an employee by an employee with Human Resource Position
app.post("/Lists/Employee/create_employee", (request, response) => {
    const fullname = request.body.fullname;
    const subdivision = request.body.subdivision;
    const position = request.body.position;
    const status = request.body.status;
    const hrPartner = request.body.hrPartner;
    const pmPartner = request.body.pmPartner;
    const ooob = request.body.ooob;

    const sqlQuery = "INSERT INTO EMPLOYEE (FULLNAME, SUBDIVISION, POSITION, STATUS_EMP, HR_PARTNER, PM_PARTNER, OUT_OF_OFFICE_BALANCE) VALUES (?,?,?,?,?,?,?);";
    db.query(sqlQuery, [fullname, subdivision, position, status, hrPartner, pmPartner, ooob], (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't create the employee.");
        } else {
            response.send(result);
        }
    });
});

// Create a leave request by an employee 
app.post("/Lists/LeaveRequest/create_request", (request, response) => {
    const employee = request.body.employee;
    const absenceReason = request.body.absenceReason;
    const startDate = request.body.startDate.slice(0,10);
    const endDate = request.body.endDate.slice(0,10);
    const comment = request.body.comment;
    const status = request.body.status;

    const sqlQuery = "INSERT INTO LEAVE_REQUEST (EMPLOYEE, ABSENCE_REASON, INITIAL_DATE, FINAL_DATE, REQUEST_COMMENT, STATUS_REQUEST) VALUES (?,?,?,?,?,?);";
    db.query(sqlQuery, [employee, absenceReason, startDate, endDate, comment, status], (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't create the leave request.");
        } else {
            response.send(result);
        }
    });
});

// Create a project by an employee with Project Manager position
app.post("/Lists/Project/create_project", (request, response) => {
    const type = request.body.type;
    const startDate = request.body.startDate.slice(0,10);
    const endDate = request.body.endDate.slice(0,10); 
    const manager = request.body.manager;
    const comment = request.body.comment;
    const status = request.body.status;

    const sqlQuery = "INSERT INTO PROJECT (PROJECT_TYPE, INITIAL_DATE, FINAL_DATE, PROJECT_MANAGER, PROJECT_COMMENT, STATUS_PROJECT) VALUES (?,?,?,?,?,?);";
    db.query(sqlQuery, [type, startDate, endDate, manager, comment, status], (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't create the project.");
        } else {
            response.send(result);
        }
    });
});

// Create an assigment for an employee by an employee with Project Manager position
app.post("/Lists/PeopleProject/create_assignment", (request, response) => {
    const project = request.body.project;
    const employee = request.body.employee;

    const sqlQuery = `INSERT INTO PEOPLE_PROJECT (ID_PROJECT, ID_EMPLOYEE) VALUES (${project}, ${employee});`;
    db.query(sqlQuery, (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't assign the project.");
        } else {
            response.send(result);
        }
    });
});

// GET methods

// Gets employees, can be of the hole system or with an especific role
app.get("/Lists/Employee", (request, response) => {
    const { page, pageSize, role } = request.query;

    const offset = (page) * pageSize; 
    const where_role = ((role) !== undefined) ? `WHERE POSITION = "${role}"` : "";
    const limit = ((pageSize) !== undefined) ? `LIMIT ${pageSize} OFFSET ${offset}` : "";
    const sqlQuery =  `SELECT DISTINCT * FROM EMPLOYEE ${where_role} ${limit};`;
    db.query(sqlQuery, (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't get employees.");
        } else {
            response.send(result);
        }
    });
});

// Gets employees with a specific Human Resource employee partner
app.get("/Lists/Employee/Partner", (request, response) => {
    const { page, pageSize, partner } = request.query;

    const offset = (page) * pageSize; 
    const where_partner = ((partner) !== undefined) ? `WHERE HR_PARTNER = "${partner}" OR PM_PARTNER=${partner}` : "";
    const limit = ((pageSize) !== undefined) ? `LIMIT ${pageSize} OFFSET ${offset}` : "";
    const sqlQuery =  `SELECT DISTINCT * FROM EMPLOYEE ${where_partner} ${limit};`;
    db.query(sqlQuery, (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't get employees.");
        } else {
            response.send(result);
        }
    });
});

app.get("/Lists/LeaveRequest", (request, response) => {
    const { page, pageSize, emp } = request.query;

    const offset = (page) * pageSize;
    const where = ((emp) !== undefined) ? `WHERE T2.ID = "${emp}"` : ``;
    const limit = ((pageSize) !== undefined) ? `LIMIT ${pageSize} OFFSET ${offset}` : ``;
    const sqlQuery = `  SELECT DISTINCT T1.*
                        FROM LEAVE_REQUEST AS T1
                        JOIN EMPLOYEE AS T2 ON T1.EMPLOYEE = T2.ID
                        ${where}
                        ${limit};`;
    db.query(sqlQuery, (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't get leave requests.");
        } else {
            response.send(result);
        }
    });
});

app.get("/Lists/LeaveRequest/Partner", (request, response) => {
    const { page, pageSize, partner } = request.query;

    const offset = (page) * pageSize;
    const where = ((partner) !== undefined) ? `WHERE T3.ID = "${partner}" OR T4.ID = "${partner}"` : ``;
    const limit = ((pageSize) !== undefined) ? `LIMIT ${pageSize} OFFSET ${offset}` : ``;
    const sqlQuery = `  SELECT DISTINCT T1.*
                        FROM LEAVE_REQUEST AS T1
                        JOIN EMPLOYEE AS T2 ON T1.EMPLOYEE = T2.ID
                        JOIN EMPLOYEE AS T3 ON T2.HR_PARTNER = T3.ID
                        JOIN EMPLOYEE AS T4 ON T2.PM_PARTNER = T4.ID
                        ${where}
                        ${limit};`;
    db.query(sqlQuery, (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't get leave requests.");
        } else {
            response.send(result);
        }
    });
});

app.get("/Lists/ApprovalRequest", (request, response) => {
    const { page, pageSize, emp } = request.query;

    const offset = (page) * pageSize;
    const where_emp = ((emp) !== undefined) ? `WHERE HR_APPROVER = ${emp} OR PM_APPROVER = ${emp}` : "";
    const limit = ((pageSize) !== undefined) ? `LIMIT ${pageSize} OFFSET ${offset}` : ``;
    const sqlQuery = `SELECT DISTINCT * FROM APPROVAL_REQUEST ${where_emp} ${limit};`;
    db.query(sqlQuery, (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't get approval requests.");
        } else {
            response.send(result);
        }
    });
});

app.get("/Lists/ApprovalRequest/CE", (request, response) => {
    const { page, pageSize, emp } = request.query;

    const offset = (page) * pageSize;
    const where_emp = ((emp) !== undefined) ? `WHERE T3.ID = ${emp}` : "";
    const limit = ((pageSize) !== undefined) ? `LIMIT ${pageSize} OFFSET ${offset}` : ``;
    const sqlQuery =    `SELECT DISTINCT T1.* 
                        FROM APPROVAL_REQUEST AS T1
                        JOIN LEAVE_REQUEST AS T2 ON T1.ID_LEAVE_REQUEST = T2.ID
                        JOIN EMPLOYEE AS T3 ON T2.EMPLOYEE = T3.ID
                        ${where_emp} 
                        ${limit};`;
    db.query(sqlQuery, (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't get approval requests.");
        } else {
            response.send(result);
        }
    });
});

app.get("/Lists/Project", (request, response) => {
    const { page, pageSize, manager } = request.query;

    const offset = (page) * pageSize;
    const where_part = ((manager) !== undefined) ? `WHERE PROJECT_MANAGER="${manager}"` : ``;
    const limit = ((pageSize) !== undefined) ? `LIMIT ${pageSize} OFFSET ${offset}` : ``;
    const sqlQuery = `SELECT DISTINCT * FROM PROJECT ${where_part} ${limit};`;
    db.query(sqlQuery, (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't get projects.");
        } else {
            response.send(result);
        }
    });
});

app.get("/Lists/Project/HR", (request, response) => {
    const { page, pageSize, partner } = request.query;

    const offset = (page) * pageSize;
    const where_part = ((partner) !== undefined) ? `WHERE T3.HR_PARTNER="${partner}"` : ``;
    const limit = ((pageSize) !== undefined) ? `LIMIT ${pageSize} OFFSET ${offset}` : ``;
    const sqlQuery = `  SELECT DISTINCT T1.* 
                        FROM PROJECT AS T1
                        JOIN PEOPLE_PROJECT AS T2 ON T1.ID = T2.ID_PROJECT
                        JOIN EMPLOYEE AS T3 ON T2.ID_EMPLOYEE = T3.ID
                        ${where_part} 
                        ${limit};`;
    db.query(sqlQuery, (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't get projects.");
        } else {
            response.send(result);
        }
    });
});

app.get("/Lists/Project/CE", (request, response) => {
    const { page, pageSize, emp } = request.query;

    const offset = (page) * pageSize;
    const limit = ((pageSize) !== undefined) ? `LIMIT ${pageSize} OFFSET ${offset}` : ``;
    const sqlQuery = `  SELECT DISTINCT T1.* 
                        FROM PROJECT AS T1
                        JOIN PEOPLE_PROJECT AS T2 ON T1.ID = T2.ID_PROJECT
                        WHERE T2.ID_EMPLOYEE = ${emp}
                        ${limit};`;
    db.query(sqlQuery, (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't get projects.");
        } else {
            response.send(result);
        }
    });
});

// PUT
app.put("/Lists/Employee/update_employee", (request, response) => {
    const { deactivate } = request.query;

    const id = request.body.id;
    const status = request.body.status;

    if (deactivate) {
        const sqlQuery = `UPDATE EMPLOYEE SET STATUS_EMP="${status}" WHERE ID=${id};`;
        db.query(sqlQuery, (error, result) => {
            if (error) {
                console.error(error);
                response.status(500).send("Can't update the employee.");
            } else {
                response.send(result);
            }
        });
    } else {
        
        const fullname = request.body.fullname;
        const subdivision = request.body.subdivision;
        const position = request.body.position;
        const status = request.body.status;
        const hrPartner = request.body.hrPartner;
        const pmPartner = request.body.pmPartner;
        const ooob = request.body.ooob;

        const sqlQuery = "UPDATE EMPLOYEE SET FULLNAME=?, SUBDIVISION=?, POSITION=?, STATUS_EMP=?, HR_PARTNER=?, PM_PARTNER=?, OUT_OF_OFFICE_BALANCE=? WHERE ID=?;";
        db.query(sqlQuery, [fullname, subdivision, position, status, hrPartner, pmPartner, ooob, id], (error, result) => {
            if (error) {
                console.error(error);
                response.status(500).send("Can't update the employee.");
            } else {
                response.send(result);
            }
        });
    }
});

app.put("/Lists/LeaveRequest/update_request", (request, response) => {
    const id = request.body.id;
    const employee = request.body.employee;
    const absenceReason = request.body.absenceReason;
    const startDate = request.body.startDate.slice(0,10);
    const endDate = request.body.endDate.slice(0,10);
    const comment = request.body.comment;
    const status = request.body.status;

    const sqlQuery = "UPDATE LEAVE_REQUEST SET EMPLOYEE=?, ABSENCE_REASON=?, INITIAL_DATE=?, FINAL_DATE=?, REQUEST_COMMENT=?, STATUS_REQUEST=? WHERE ID=?;";
    db.query(sqlQuery, [employee, absenceReason, startDate, endDate, comment, status, id], (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't update the leave request.");
        } else {
            response.send(result);
        }
    });

    if (status == "Submitted") {
        const getApprovers = `SELECT DISTINCT HR_PARTNER, PM_PARTNER FROM EMPLOYEE WHERE ID=${employee};`;
        let hrApprover = 0;
        let pmApprover = 0;
        db.query(getApprovers, (error, result) => {
            if (error) {
                console.error(error);
                response.status(500).send("Can't get the approver.");
            } else {
                hrApprover = result[0].HR_PARTNER;
                pmApprover = result[0].PM_PARTNER;
                const createApprovalRequest = "INSERT INTO APPROVAL_REQUEST (HR_APPROVER, PM_APPROVER, ID_LEAVE_REQUEST, STATUS_REQUEST, REQUEST_COMMENT) VALUES (?,?,?,?,?);";
                db.query(createApprovalRequest, [hrApprover, pmApprover, id, status, comment], (error, result)  => {
                    if (error) {
                        console.error(error);
                        response.status(500).send("Can't create the approval request.");
                    }
                });
            }
        });
    }    
});

app.put("/Lists/ApprovalRequest/update_request", (request, response) => {
    const id = request.body.id;
    const hrApprover = request.body.hrApprover;
    const pmApprover = request.body.pmApprover;
    const leaveRequest = request.body.leaveRequest;
    const comment = request.body.comment;
    const status = request.body.status;

    const sqlQuery = "UPDATE APPROVAL_REQUEST SET HR_APPROVER=?, PM_APPROVER=?, ID_LEAVE_REQUEST=?, REQUEST_COMMENT=?, STATUS_REQUEST=? WHERE ID=?;";
    db.query(sqlQuery, [hrApprover, pmApprover, leaveRequest, comment, status, id], (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't update the approval request.");
        } else {
            response.send(result);
        }
    });

    const queryLR = `UPDATE LEAVE_REQUEST SET STATUS_REQUEST="${status}" WHERE ID=${leaveRequest};`;
    db.query(queryLR, (error, result) => {
        if (error) {
            console.error(error);
            response.status(500).send("Can't update the leave request.");
        }
    });

});

app.put("/Lists/Project/update_project", (request, response) => {
    const { deactivate } = request.query;

    const id = request.body.id;
    const status = request.body.status;

    if (deactivate) {
        const sqlQuery = `UPDATE PROJECT SET STATUS_PROJECT="${status}" WHERE ID=${id};`;
        db.query(sqlQuery, (error, result) => {
            if (error) {
                console.error(error);
                response.status(500).send("Can't update the project.");
            } else {
                response.send(result);
            }
        });
    } else {
        const type = request.body.type;
        const startDate = request.body.startDate.slice(0,10);
        const endDate = request.body.endDate.slice(0,10); 
        const manager = request.body.manager;
        const comment = request.body.comment;

        const sqlQuery = "UPDATE PROJECT SET PROJECT_TYPE=?, INITIAL_DATE=?, FINAL_DATE=?, PROJECT_MANAGER=?, PROJECT_COMMENT=?, STATUS_PROJECT=? WHERE ID=?;";
        db.query(sqlQuery, [type, startDate, endDate, manager, comment, status, id], (error, result) => {
            if (error) {
                console.error(error);
                response.status(500).send("Can't update the project.");
            } else {
                response.send(result);
            }
        });
    }
});


app.listen(3001, () => {
    console.log("Running at port 3001.");
})