import * as React from 'react'
import {Link} from 'react-router-dom'

export const Index = () => (
  <div className="index">
    <ul>
      <li>
        <Link to='/building-planner'>Building Planner</Link>
      </li>
      <li>
        <Link to='/creep-designer'>Creep Designer</Link>
      </li>
      <li>
        <Link to='/memory-viewer'>Memory Viewer</Link>
      </li>
    </ul>
  </div>
)