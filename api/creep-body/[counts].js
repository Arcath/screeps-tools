import ReactDOMServer from 'react-dom/server'
import React from 'react'
import svg2img from 'svg2img'

import {Creep} from '../../src/components/creep'

export default (req, res) => {
  const counts = req.query.counts.split('-').map((count) => parseInt(count, 10))

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

  const svg = ReactDOMServer.renderToString(React.createElement(Creep, {body}))

  svg2img(svg, (err, buffer) => {
    res.end(buffer, 'binary')
  })
}