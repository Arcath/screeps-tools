import React from 'react'
import {Link} from '@reach/router'

export const Index: React.FC<{path: string}> = () => {
  return <>
    <h2><Link to="/building-planner">Building Planner</Link></h2>
    <p>The Building planner is a port of Dissi's Building planner into React. All of its api calls are passed through a serverless function to avoid CORS issues.</p>
    <h2><Link to="/creep-designer">Creep Designer</Link></h2>
    <p>The Creep Designer gives a UI to build creeps and see all their stats.</p>
  </>
}