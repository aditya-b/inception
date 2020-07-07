import React from 'react';
import '../sass/css.ts';
import { PanelModel } from '../packages/data';
import { Graph } from '../packages/plugins/graph/Graph';

function App() {
  const panel = new PanelModel();
  return (
    <div className="App">
      <Graph panel={panel} />
    </div>
  );
}

export default App;
