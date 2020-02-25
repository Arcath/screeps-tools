import React from 'react'

export const Creep: React.FC<{body: {[part: string]: number}}> = ({body}) => (
  <svg width="200" height="200">
    {/* TOUGH */}
    <circle cx={100} cy={100} r={65} fill="#525252" opacity={body.tough > 0 ? body.tough / 50 : 0 } />

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

const bodyPartCountToDeg = (count: number) => {
  return (count * 7.2) / 2
}

const bodyPartWedge = (startX: number, startY: number, startAngle: number, endAngle: number, radius: number) => {
  var x1 = startX + radius * Math.cos(Math.PI * startAngle/180);
  var y1 = startY + radius * Math.sin(Math.PI * startAngle/180);
  var x2 = startX + radius * Math.cos(Math.PI * endAngle/180);
  var y2 = startY + radius * Math.sin(Math.PI * endAngle/180);

  let largeArc = 0
  let travel = startAngle - endAngle

  if(travel < -180){
    largeArc = 1
  }

  var pathString = "M"+ startX + " " + startY + " L" + x1 + " " + y1 + " A" + radius + " " + radius + " 0 " + largeArc + " 1 " + x2 + " " + y2 + " z";

  return pathString;

}