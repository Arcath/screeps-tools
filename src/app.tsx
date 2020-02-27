import React from 'react'
import './app.css'
import {Router} from '@reach/router'

import {Header} from './components/header'

import {Index} from './pages/index'

import {BuildingPlanner} from './tools/building-planner'
import {CreepDesigner} from './tools/creep-designer'

const App: React.FC = () => {
  return <>
    <Header />
    <Router>
      <Index path="/" />
      <BuildingPlanner path="/building-planner" />
      <CreepDesigner path="/creep-designer" />
      
    </Router>
  </>
}

export default App;