import * as React from 'react'
import {Link} from 'react-router-dom'

export const Index = () => (
  <div className="index">
    <h2><Link to='/building-planner'>Building Planner</Link></h2>
    <p>
      The Building planner is a port of Dissi's Building planner into React.
      
      All of its api calls are passed through an express instance on the screeps-tolls server to avoid CORS issues.
    </p>
    <h2><Link to='/creep-designer'>Creep Designer</Link></h2>
    <p>
      The Creep Designer gives a UI to build creeps and see all their stats.
    </p>
    <h2><Link to='/memory-viewer'>Memory Viewer</Link></h2>
    <p>
      The Memory viewer pulls a copy of your Memory from any of the shards. This can then be viewed in React-JSON-View and queiried using JQ.
    </p>
  </div>
)