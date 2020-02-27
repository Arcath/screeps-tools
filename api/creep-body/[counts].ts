import {NowRequest, NowResponse} from '@now/node'
import ReactDOMServer from 'react-dom/server'
import React from 'react'

import {Creep} from '../../src/components/creep'

export default (req: NowRequest, res: NowResponse) => {
  const counts = (req.query.counts as string).split('-').map((count) => parseInt(count, 10))

  const body = {
    move: counts[0],
    work: counts[1],
    attack: counts[2],
    ranged_attack: counts[3],
    tough: counts[4],
    heal: counts[5],
    claim: counts[6],
    carry: counts[7]
  }

  res.send(ReactDOMServer.renderToString(React.createElement(Creep, {body})))
}