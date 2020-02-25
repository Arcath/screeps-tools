import React from 'react'
import {Link} from '@reach/router'

export const Index: React.FC<{path: string}> = () => {
  return <>
    <Link to="/building-planner">Building Planner</Link>
    <Link to="/creep-designer">Creep Designer</Link>
  </>
}