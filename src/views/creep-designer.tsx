//import * as jQuery from 'jquery'
import * as React from 'react'

const BODYPART_COST: {[part: string]: number} = {
  move: 50,
  work: 100,
  attack: 80,
  carry: 50,
  heal: 250,
  ranged_attack: 150,
  tough: 10,
  claim: 600
}

const BODYPARTS: {[part: string]: string} = {
  move: "MOVE",
  work: "WORK",
  attack: "ATTACK",
  ranged_attack: "RANGED_ATTACK",
  tough: "TOUGH",
  heal: "HEAL",
  claim: "CLAIM",
  carry: "CARRY"
}

/*const MOVE = 'move'
const WORK = 'work'
const CARRY = 'carry'
const ATTACK = 'attack'
const RANGED_ATTACK = 'ranged_attack'
const HEAL = 'heal'
const CLAIM = 'claim'
const TOUGH = 'tough'

const CONSTANTS = [MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL, CLAIM, TOUGH]*/

export class CreepDesigner extends React.Component{
  state: Readonly<{
    body: {[part: string]: number}
  }>

  constructor(props: any){
    super(props)

    this.state = {
      body: {
        move: 1,
        work: 0,
        attack: 0,
        ranged_attack: 0,
        tough: 0,
        heal: 0,
        claim: 0,
        carry: 0
      }
    }
  }

  remove(part: string){
    let body = this.state.body

    if(body[part]){
      body[part] -= 1
    }

    this.setState({body: body})
  }

  add(part: string){
    let body = this.state.body
    
    if(this.count() < 50){
      if(body[part]){
        body[part] += 1
      }else{
        body[part] = 1
      }
    }

    this.setState({body: body})
  }

  totalCost(){
    let cost = 0
    let component = this

    Object.keys(BODYPARTS).forEach((part) => {
      cost += (component.state.body[part] * BODYPART_COST[part])
    })

    return cost
  }

  count(){
    let count = 0
    let component = this
    

    Object.keys(BODYPARTS).forEach((part) => {
      count += component.state.body[part]
    })

    return count
  }

  body(){
    let body = '['

    Object.keys(BODYPARTS).forEach((part) => {
      for(let i = 0; i < this.state.body[part]; i++){
        body += BODYPARTS[part] + ','
      }
    })

    return body.slice(0, -1) + ']'
  }

  render(){
    return <div className="creep-designer">
      <div className="panel">
        <table className="body">
          <thead>
            <tr>
              <th>Body Part</th>
              <th>Cost</th>
              <th colSpan={3}>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(BODYPARTS).map((part) => {
              return <tr>
                <td>{BODYPARTS[part]}</td>
                <td>{BODYPART_COST[part]}</td>
                <td>
                  <button onClick={() => this.remove(part)}>-</button>
                </td>
                <td>{this.state.body[part] ? this.state.body[part] : 0}</td>
                <td>
                  <button onClick={() => this.add(part)}>+</button>
                </td>
              </tr>
            })}
            <tr>
              <td>Totals</td>
              <td>{this.totalCost()}</td>
              <td colSpan={3}>{this.count()}</td>
            </tr>
          </tbody>
        </table>
        <Creep body={this.state.body} />
        <textarea value={this.body()}></textarea>
      </div>
      <div className="panel">
        <table className="stats">
          <thead>
            <tr>
              <th>Action</th>
              <th>Standard</th>
              <th>t1 Boost</th>
              <th>t2 Boost</th>
              <th>t3 Boost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Attack</td>
              <td>{this.state.body.attack * 30}/T</td>
              <td>{(this.state.body.attack * 30) * 2}/T</td>
              <td>{(this.state.body.attack * 30) * 3}/T</td>
              <td>{(this.state.body.attack * 30) * 4}/T</td>
            </tr>
            <tr>
              <td>Build</td>
              <td>{this.state.body.work * 5}/T</td>
              <td>{(this.state.body.work * 5) * 1.5}/T</td>
              <td>{(this.state.body.work * 5) * 1.8}/T</td>
              <td>{(this.state.body.work * 5) * 2}/T</td>
            </tr>
            <tr>
              <td>Dismantle</td>
              <td>{this.state.body.work * 50}/T</td>
              <td>{(this.state.body.work * 50) * 2}/T</td>
              <td>{(this.state.body.work * 50) * 3}/T</td>
              <td>{(this.state.body.work * 50) * 4}/T</td>
            </tr>
            <tr>
              <td>Harvest (Energy)</td>
              <td>{this.state.body.work * 2}/T</td>
              <td>{(this.state.body.work * 2) * 3}/T</td>
              <td>{(this.state.body.work * 2) * 5}/T</td>
              <td>{(this.state.body.work * 2) * 7}/T</td>
            </tr>
            <tr>
              <td>Harvest (Mineral)</td>
              <td>{this.state.body.work * 1}/T</td>
              <td>{(this.state.body.work * 1) * 3}/T</td>
              <td>{(this.state.body.work * 1) * 5}/T</td>
              <td>{(this.state.body.work * 1) * 7}/T</td>
            </tr>
            <tr>
              <td>Heal</td>
              <td>{this.state.body.heal * 12}/T</td>
              <td>{(this.state.body.heal * 12) * 2}/T</td>
              <td>{(this.state.body.heal * 12) * 3}/T</td>
              <td>{(this.state.body.heal * 12) * 4}/T</td>
            </tr>
            <tr>
              <td rowSpan={3}>Ranged Attack & Ranged Mass Attack</td>
              <td>{this.state.body.ranged_attack * 1}/T</td>
              <td>{(this.state.body.ranged_attack * 1) * 2}/T</td>
              <td>{(this.state.body.ranged_attack * 1) * 3}/T</td>
              <td>{(this.state.body.ranged_attack * 1) * 4}/T</td>
            </tr>
            <tr>
              <td>{this.state.body.ranged_attack * 4}/T</td>
              <td>{(this.state.body.ranged_attack * 4) * 2}/T</td>
              <td>{(this.state.body.ranged_attack * 4) * 3}/T</td>
              <td>{(this.state.body.ranged_attack * 4) * 4}/T</td>
            </tr>
            <tr>
              <td>{this.state.body.ranged_attack * 10}/T</td>
              <td>{(this.state.body.ranged_attack * 10) * 2}/T</td>
              <td>{(this.state.body.ranged_attack * 10) * 3}/T</td>
              <td>{(this.state.body.ranged_attack * 10) * 4}/T</td>
            </tr>
            <tr>
              <td>Ranged Heal</td>
              <td>{this.state.body.heal * 4}/T</td>
              <td>{(this.state.body.heal * 4) * 2}/T</td>
              <td>{(this.state.body.heal * 4) * 3}/T</td>
              <td>{(this.state.body.heal * 4) * 4}/T</td>
            </tr>
            <tr>
              <td>Repair</td>
              <td>{this.state.body.work * 100}/T</td>
              <td>{(this.state.body.work * 100) * 1.5}/T</td>
              <td>{(this.state.body.work * 100) * 1.8}/T</td>
              <td>{(this.state.body.work * 100) * 2}/T</td>
            </tr>
            <tr>
              <td>Upgrade Controller</td>
              <td>{this.state.body.work * 1}/T</td>
              <td>{(this.state.body.work * 1) * 1.5}/T</td>
              <td>{(this.state.body.work * 1) * 1.8}/T</td>
              <td>{(this.state.body.work * 1) * 2}/T</td>
            </tr>
            <tr>
              <td>Carry</td>
              <td>{this.state.body.carry * 50}</td>
              <td>{(this.state.body.carry * 50) * 2}</td>
              <td>{(this.state.body.carry * 50) * 3}</td>
              <td>{(this.state.body.carry * 50) * 4}</td>
            </tr>
            <tr>
              <td>Move</td>
              <td>{this.state.body.move * 2}</td>
              <td>{(this.state.body.move * 2) * 2}</td>
              <td>{(this.state.body.move * 2) * 3}</td>
              <td>{(this.state.body.move * 2) * 4}</td>
            </tr>
            <tr>
              <td>Health</td>
              <td colSpan={4} style={{textAlign: 'center'}}>{this.count() * 100} ({this.state.body.tough * 100} from TOUGH)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  }
}

const Creep = ({body}: {body: {[part: string]: number}}) => (
  <svg width="200" height="200">
    <circle cx={100} cy={100} r={60} fill="#222" />

    {/* RANGED_ATTACK */}
    <path d={bodyPartWedge(100,
      100,
      0 - bodyPartCountToDeg(body.claim + body.ranged_attack + body.attack + body.heal + body.work),
      bodyPartCountToDeg(body.claim + body.ranged_attack + body.attack + body.heal + body.work),
      65
    )} fill="#5d7fb2" transform="rotate(-90 100 100)" />

    {/* ATTACK */}
    <path d={bodyPartWedge(100,
      100,
      0 - bodyPartCountToDeg(body.claim + body.attack + body.heal + body.work),
      bodyPartCountToDeg(body.claim + body.attack + body.heal + body.work),
      65
    )} fill="#f93842" transform="rotate(-90 100 100)" />

    {/* HEAL */}
    <path d={bodyPartWedge(100,
      100,
      0 - bodyPartCountToDeg(body.claim + body.heal + body.work),
      bodyPartCountToDeg(body.claim + body.heal + body.work),
      65
    )} fill="#65fd62" transform="rotate(-90 100 100)" />

    {/* WORK */}
    <path d={bodyPartWedge(100,
      100,
      0 - bodyPartCountToDeg(body.claim + body.work),
      bodyPartCountToDeg(body.claim + body.work),
      65
    )} fill="#ffe56d" transform="rotate(-90 100 100)" />

    {/* CLAIM */}
    <path d={bodyPartWedge(100,
      100,
      0 - bodyPartCountToDeg(body.claim),
      bodyPartCountToDeg(body.claim),
      65
    )} fill="#b99cfb" transform="rotate(-90 100 100)" />

    {/* MOVE */}
    <path d={bodyPartWedge(100,
      100,
      0 - bodyPartCountToDeg(body.move),
      bodyPartCountToDeg(body.move),
    65)} fill="#a9b7c6" transform="rotate(90 100 100)" />
    

    <circle cx={100} cy={100} r={50} fill="#555" />
    <circle cx={100} cy={100} r={body.carry} fill="#ffe56d" />    
  </svg>
)

function bodyPartCountToDeg(count: number){
  return (count * 7.2) / 2
}

function bodyPartWedge(startX: number, startY: number, startAngle: number, endAngle: number, radius: number){
  var x1 = startX + radius * Math.cos(Math.PI * startAngle/180);
  var y1 = startY + radius * Math.sin(Math.PI * startAngle/180);
  var x2 = startX + radius * Math.cos(Math.PI * endAngle/180);
  var y2 = startY + radius * Math.sin(Math.PI * endAngle/180);

  let largeArc = 0
  let travel = startAngle - endAngle
  console.dir(travel)

  if(travel < -180){
    largeArc = 1
  }

  var pathString = "M"+ startX + " " + startY + " L" + x1 + " " + y1 + " A" + radius + " " + radius + " 0 " + largeArc + " 1 " + x2 + " " + y2 + " z";

  return pathString;

}