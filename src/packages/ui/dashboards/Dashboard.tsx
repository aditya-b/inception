import React, { Component } from "react";
import { DashboardModel } from "../../data";

interface DashboardProps {
    dashboard: DashboardModel;
}

export class Dashboard extends Component<DashboardProps>{

    render() {
        return <div className="dashboard">Sample test for dashboard</div>;
    }
}
