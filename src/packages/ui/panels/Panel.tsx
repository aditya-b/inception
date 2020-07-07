import React, { Component } from "react";
import { PanelModel } from "../../data";

interface PanelProps {
    panel: PanelModel;
}

export class Panel extends Component<PanelProps>{

    render() {
        return <div className="panel">Sample test for panel</div>;
    }
}
