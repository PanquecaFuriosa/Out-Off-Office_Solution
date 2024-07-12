import './styles/reset.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useRoutes } from "react-router-dom";

// Pages
import Home from "./templates/Home";

// Human Resource pages
import HRPanel from "./Lists/HR/HRPanel";
import HREmployeePanel from "./Lists/HR/Employees";
import HRLeaveRequestPanel from "./Lists/HR/LeaveRequests";
import HRApprovalRequestPanel from "./Lists/HR/ApprovalRequests";
import HRProjectPanel from "./Lists/HR/Projects";

// Project Manager pages
import PMPanel from "./Lists/PM/PMPanel";
import PMEmployeePanel from "./Lists/PM/Employees";
import PMLeaveRequestPanel from "./Lists/PM/LeaveRequests";
import PMApprovalRequestPanel from "./Lists/PM/ApprovalRequests";
import PMProjectPanel from "./Lists/PM/Projects";

// Company Employee pages
import CEPanel from "./Lists/CE/CEPanel";
import CELeaveRequestPanel from "./Lists/CE/LeaveRequests";
import CEApprovalRequestPanel from "./Lists/CE/ApprovalRequests";
import CEProjectPanel from "./Lists/CE/Projects";

const GetUser = ({ setUser=undefined }) => {
  let routes = useRoutes([
    { path: "/", element: <Home setUser={setUser} />},
  ]);
  return routes;
};

const App = ({ user }) => {
  let routes = useRoutes([
    // Human Reource paths
    { path: "/Lists/HR/HRPanel", element: <HRPanel />},
    { path: "/HR/Lists/Employee", element: <HREmployeePanel user={user}/> },
    { path: "/HR/Lists/LeaveRequest", element: <HRLeaveRequestPanel user={user}/> },
    { path: "/HR/Lists/ApprovalRequest", element: <HRApprovalRequestPanel user={user}/> },
    { path: "/HR/Lists/Project", element: <HRProjectPanel user={user}/> },

    // Project Manager paths
    { path: "/Lists/PM/PMPanel", element: <PMPanel />},
    { path: "/PM/Lists/Employee", element: <PMEmployeePanel user={user}/> },
    { path: "/PM/Lists/LeaveRequest", element: <PMLeaveRequestPanel user={user}/> },
    { path: "/PM/Lists/ApprovalRequest", element: <PMApprovalRequestPanel user={user}/> },
    { path: "/PM/Lists/Project", element: <PMProjectPanel user={user}/> },

    // Comopany Employee paths
    { path: "/Lists/CE/CEPanel", element: <CEPanel />},
    { path: "/CE/Lists/LeaveRequest", element: <CELeaveRequestPanel user={user} /> },
    { path: "/CE/Lists/ApprovalRequest", element: <CEApprovalRequestPanel user={user}/> },
    { path: "/CE/Lists/Project", element: <CEProjectPanel user={user}/> },
  ]);
  return routes;
};

function AppWrapper() {
  const [user, setUser] = useState(0);
  return (
    <Router>
      <GetUser setUser={setUser}/>
      <App user={user}/>
    </Router>
  );
}

export default AppWrapper;
