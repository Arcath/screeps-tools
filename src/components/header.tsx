import React from 'react'
import styled from '@emotion/styled'
import {Link} from '@reach/router'

const HeaderBar = styled.header`
  height:5vh;
  background-image:linear-gradient(to bottom, #1f1f1f 0%, #1a1a1a 100%);
  line-height:5vh;

  * {
    height:100%;
    float:left;
  }
`

export const Header: React.FC = () => {
  return <HeaderBar>
    <Link to="/">
      <img src="/img/screeps/logo.gif" />
    </Link>
    <Link to="/building-planner">Building Planner</Link>
    <Link to="/creep-designer">Creep Designer</Link>
  </HeaderBar>
}