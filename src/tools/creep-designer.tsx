import React, {useState, useEffect} from 'react'
import styled from '@emotion/styled'

import {Creep} from '../components/creep'

const CDLayout = styled.div`
  display:grid;
  grid-template-columns:1fr 1fr;
  grid-gap:10px;
`

const Box = styled.div`
  background-color:#222;
  color:#ccc;
  overflow:auto;

  table{
    width:75%;
    float:left;

    input{
      width:50px;
      text-align:right;
      color:#ffe56d;
      background-color:rgba(0,0,0,0);
      border:none;
      padding-right:5px;
    }

    textarea{
      width:100%;
    }
  }

  svg{
    width:25%;
    float:left;
  }
`

const SummaryTable = styled.table`
  width:100% !important;
`

const Method = styled.li<{active: boolean}>`
  color:${({active}) => active ? '#27ae60' : '#c0392b'}
`

const RCL_ENERGY: {[level: number]: number} = {
  1: 300,
  2: 550,
  3: 800,
  4: 1300,
  5: 1800,
  6: 2300,
  7: 5600,
  8: 12900
}

const BODYPART_COST = {
  move: 50,
  work: 100,
  attack: 80,
  carry: 50,
  heal: 250,
  ranged_attack: 150,
  tough: 10,
  claim: 600
}

export const BODYPARTS = {
  move: "MOVE",
  work: "WORK",
  attack: "ATTACK",
  ranged_attack: "RANGED_ATTACK",
  tough: "TOUGH",
  heal: "HEAL",
  claim: "CLAIM",
  carry: "CARRY"
}

const ACTIONS = {
  attack: {action: 'Attack', standard: 30, boost: [2,3,4], part: 'attack', background: '#f93842', color: '#fff'},
  build: {action: 'Build', standard: 5, boost: [1.5,1.8,2], part: 'work', background: '#ffe56d', color: '#444'},
  dismantle: {action: 'Dismantle', standard: 50, boost: [2,3,4], part: 'work', background: '#ffe56d', color: '#444'},
  harvestEnergy: {action: 'Harvest (Energy)', standard: 2, boost: [3,5,7], part: 'work', background: '#ffe56d', color: '#444'},
  harvestMineral: {action: 'Harvest (Mineral)', standard: 1, boost: [3,5,7], part: 'work', background: '#ffe56d', color: '#444'},
  heal: {action: 'Heal', standard: 12, boost: [2,3,4], part: 'heal', background: '#65fd62', color: '#444'},
  ra1: {action: 'Ranged 3', standard: 1, boost: [2,3,4], part: 'ranged_attack', background: '#5d7fb2', color: '#fff'},
  ra2: {action: 'Ranged 2', standard: 4, boost: [2,3,4], part: 'ranged_attack', background: '#5d7fb2', color: '#fff'},
  ra3: {action: 'Ranged 1', standard: 10, boost: [2,3,4], part: 'ranged_attack', background: '#5d7fb2', color: '#fff'},
  rangedHeal: {action: 'Ranged Heal', standard: 4, boost: [2,3,4], part: 'heal', background: '#65fd62', color: '#444'},
  repair: {action: 'Repair', standard: 1, boost: [3,5,7], part: 'work', background: '#ffe56d', color: '#444'},
  upgradeController: {action: 'Upgrade Controller', standard: 1, boost: [1.5,1.8,2], part: 'work', background: '#ffe56d', color: '#444'}
}

export const PART_CONSTANTS = (Object.keys(BODYPARTS) as (keyof typeof BODYPARTS)[])
const ACTION_CONSTANTS = (Object.keys(ACTIONS) as (keyof typeof ACTIONS)[])

export const CreepDesigner: React.FC<{path: string}> = () => {
  const [body, setBody] = useState({
    move: 1,
    work: 0,
    attack: 0,
    ranged_attack: 0,
    tough: 0,
    heal: 0,
    claim: 0,
    carry: 0
  })

  useEffect(() => {
    const importable = getQueryVariable('share')
    if(typeof importable === 'string'){
      const counts = importable.split('-').map((count) => parseInt(count, 10))

      setBody({
        move: counts[0],
        work: counts[1],
        attack: counts[2],
        ranged_attack: counts[3],
        tough: counts[4],
        heal: counts[5],
        claim: counts[6],
        carry: counts[7]
      })
    }
  }, [])

  const add = (bodypart: keyof typeof BODYPARTS) => {
    if(partCount() < 50){
      const newBody = {...body}
      newBody[bodypart] = body[bodypart] + 1
      setBody(newBody)
    }
  }

  const remove = (bodypart: keyof typeof BODYPARTS) => {
    if(body[bodypart] !== 0){
      const newBody = {...body}
      newBody[bodypart] = body[bodypart] - 1
      setBody(newBody)
    }
  }

  const set = (bodypart: keyof typeof BODYPARTS, value: number) => {
    const newBody = {...body}
    newBody[bodypart] = value
    setBody(newBody)
  }

  const partCount = () => {
    return PART_CONSTANTS.reduce((count, part) => {
      return count + body[part]
    }, 0)
  }

  const partCost = () => {
    return PART_CONSTANTS.reduce((cost, part) => {
      return cost + (BODYPART_COST[part] * body[part])
    }, 0)
  }

  const lifespan = () => {
    if(body.claim > 0){
      return 500
    }else{
      return 1500
    }
  }

  const parts = () => {
    return PART_CONSTANTS.reduce((s, part) => {
      let add = ''
      for(let i = 0; i < body[part]; i++){
        add += BODYPARTS[part] + ','
      }

      return s + add
    }, '[').slice(0, -1) + ']'
  }

  const rcl = () => {
    let rcl = 8
    const cost = partCost()
    Object.keys(RCL_ENERGY).reverse().forEach((rclLevel) => {
      if(cost <= RCL_ENERGY[parseInt(rclLevel)]){
        rcl = parseInt(rclLevel)
      }
    })

    return rcl
  }

  const shareLink = () => {
    const counts = PART_CONSTANTS.map((part) => body[part]).join('-')

    return `/creep-designer?share=${counts}`
  }

  return <CDLayout>
    <Box>
      <table>
        <thead>
          <tr>
            <th>Body Part</th>
            <th>Cost</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {PART_CONSTANTS.map((part) => {
            return <tr key={part}>
              <td>{BODYPARTS[part]}</td>
              <td>{BODYPART_COST[part]}</td>
              <td>
                <button onClick={() => remove(part)}>Remove</button>
                <input 
                type="number"
                value={body[part]}
                max={50 - partCount() + body[part]}
                onChange={(e) => {
                  set(part, parseInt(e.target.value))
                }} />
                <button onClick={() => add(part)}>Add</button></td>
            </tr>
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{partCost()} (RCL {rcl()})</td>
            <td>{partCount()}</td>
          </tr>
          <tr>
            <td>Body</td>
            <td colSpan={2}>
              <textarea value={parts()} />
              <a href={shareLink()}>Shareable Link</a>
            </td>
          </tr>
        </tfoot>
      </table>
      <Creep body={body} />
    </Box>
    <Box>
      <SummaryTable>
        <thead>
          <tr>
            <td>Action</td>
            <td>Standard</td>
            <td>t1 Boost</td>
            <td>t2 Boost</td>
            <td>t3 Boost</td>
            <td>Lifetime</td>
          </tr>
        </thead>
        <tbody>
          {ACTION_CONSTANTS.map((key) => {
            const part = ACTIONS[key].part as keyof typeof BODYPARTS

            return <ActionRow
              key={key}
              {...ACTIONS[key]}
              partCount={body[part]}
              lifespan={lifespan()}
            />
          })}
          <tr>
            <td>
              Carry
            </td>
            <td>{body.carry * 50}</td>
            <td>{(body.carry * 50) * 2}</td>
            <td>{(body.carry * 50) * 3}</td>
            <td>{(body.carry * 50) * 4}</td>
            <td></td>
          </tr>
          <tr style={{backgroundColor: '#a9b7c6', color: '#444'}}>
            <td>Move</td>
            <td>{body.move * 2}</td>
            <td>{(body.move * 2) * 2}</td>
            <td>{(body.move * 2) * 3}</td>
            <td>{(body.move * 2) * 4}</td>
            <td></td>
          </tr>
          <tr style={{backgroundColor: '#a9b7c6', color: '#444'}}>
            <td>Ticks to Move (Laden)</td>
            <td>{(partCount() / (body.move * 2)).toLocaleString()}</td>
            <td>{(partCount() / ((body.move * 2) * 2)).toLocaleString()}</td>
            <td>{(partCount() / ((body.move * 2) * 3)).toLocaleString()}</td>
            <td>{(partCount() / ((body.move * 2) * 4)).toLocaleString()}</td>
            <td></td>
          </tr>
          <tr style={{backgroundColor: '#a9b7c6', color: '#444'}}>
            <td>Ticks to Move (Empty)</td>
            <td>{((partCount() - body.carry) / (body.move * 2)).toLocaleString()}</td>
            <td>{((partCount() - body.carry) / ((body.move * 2) * 2)).toLocaleString()}</td>
            <td>{((partCount() - body.carry) / ((body.move * 2) * 3)).toLocaleString()}</td>
            <td>{((partCount() - body.carry) / ((body.move * 2) * 4)).toLocaleString()}</td>
            <td></td>
          </tr>
          <tr style={{backgroundColor: '#ffe56d', color: '#444'}}>
            <td>Ticks to Drain Source</td>
            <td>{(3000 / (body.work * 2)).toLocaleString()}</td>
            <td>{(3000 / ((body.work * 2) * 3)).toLocaleString()}</td>
            <td>{(3000 / ((body.work * 2) * 5)).toLocaleString()}</td>
            <td>{(3000 / ((body.work * 2) * 7)).toLocaleString()}</td>
            <td></td>
          </tr>
          <tr>
            <td>Health</td>
            <td colSpan={5}>{(partCount() * 100).toLocaleString()} ({(body.tough * 100).toLocaleString()} from TOUGH)</td>
          </tr>
        </tbody>
      </SummaryTable>
      <h3>Creep Methods</h3>
      <ul>
        <Method active={body.attack > 0}>attack</Method>
        <Method active={body.claim > 0}>attackController</Method>
        <Method active={body.carry > 0 && body.work > 0}>build</Method>
        <Method active={body.claim > 0}>claimController</Method>
        <Method active={body.work > 0}>dismantle</Method>
        <Method active={body.carry > 0}>drop</Method>
        <Method active={body.carry > 20}>generateSafeMode</Method>
        <Method active={body.work > 0}>harvest</Method>
        <Method active={body.heal > 0}>heal</Method>
        <Method active={body.move > 0}>move</Method>
        <Method active={body.carry > 0}>pickup</Method>
        <Method active={body.ranged_attack > 0}>rangedAttack</Method>
        <Method active={body.heal > 0}>rangedHeal</Method>
        <Method active={body.ranged_attack > 0}>rangedMassAttack</Method>
        <Method active={body.carry > 0 && body.work > 0}>repair</Method>
        <Method active={body.claim > 0}>reserveController</Method>
        <Method active={body.carry > 0}>transfer</Method>
        <Method active={body.carry > 0 && body.work > 0}>upgradeController</Method>
        <Method active={body.carry > 0}>withdraw</Method>
      </ul>
    </Box>
  </CDLayout>
}

const ActionRow: React.FC<{
  standard: number
  lifespan: number
  action: string
  partCount: number
  boost: number[]
  background: string
  color: string
}> = ({
  standard,
  lifespan,
  action,
  partCount,
  boost,
  background,
  color
}) => {
  const rate = standard * partCount

  return <tr style={
    {
      backgroundColor: background,
      color
    }
  }>
    <td>{action}</td>
    <td>{rate}/T</td>
    <td>{(rate * boost[0]).toLocaleString()}/T</td>
    <td>{(rate * boost[1]).toLocaleString()}/T</td>
    <td>{(rate * boost[2]).toLocaleString()}/T</td>
    <td>{(rate * lifespan).toLocaleString()}</td>
  </tr>
}

const getQueryVariable = (variable: string) => {
  const query = window.location.search.substring(1)
  const vars = query.split("&")
  return vars.reduce<boolean | string>((r, v) => {
    const pair = v.split('=')

    if(pair[0] === variable){
      return pair[1]
    }

    return r
  }, false)
}