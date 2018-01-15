import * as React  from 'react'
import {
  BrowserRouter as Router,
  Route,
  withRouter,
  Switch,
  NavLink
} from 'react-router-dom'

import {BuildingPlanner} from './building-planner'
import {CreepDesigner} from './creep-designer'
import {ConsoleViewer} from './console-viewer'
import {Index} from './index'
import {MemoryViewer} from './memory-viewer'

const AppRouter = () => (
  <div className="screeps-tools">
    <div className="header">
      <img src="/img/screeps/logo.gif" />
      <NavLink to='/' exact>Tools</NavLink>
      <NavLink to='/building-planner'>Building Planner</NavLink>
      <NavLink to='/creep-designer'>Creep Designer</NavLink>
      <NavLink to='/console-viewer'>Console Viewer</NavLink>
      <NavLink to='/memory-viewer'>Memory Viewer</NavLink>
      <a href="https://github.com/Arcath/screeps-tools" className="gh-link">GitHub</a>
      <a href="https://screeps.slack.com/messages/C8LFD7KEX/" className="gh-link">Slack</a>
    </div>
    <Switch>
      <Route path='/building-planner'component={BuildingPlanner} />
      <Route path='/creep-designer' component={CreepDesigner} />
      <Route path='/console-viewer' component={ConsoleViewer} />
      <Route path='/memory-viewer' component={MemoryViewer} />
      <Route path='/' exact component={Index} />
    </Switch>
  </div>
)

const WrappedApp = withRouter(AppRouter)

export const App = () => (
  <Router>
    <WrappedApp />
  </Router>
)