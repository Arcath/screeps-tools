import {NowRequest, NowResponse} from '@now/node'

import {PART_CONSTANTS, BODYPARTS} from '../src/tools/creep-designer'


export default (req: NowRequest, res: NowResponse) => {
  const partArray = req.body.text
  const body: any = {}

  PART_CONSTANTS.forEach((part) => {
    body[part] = (partArray.match(new RegExp(BODYPARTS[part], 'g')) || []).length
  })

  const counts = PART_CONSTANTS.map((part) => body[part]).join('-')

  const text = PART_CONSTANTS.map((part) => `${BODYPARTS[part]} - ${body[part]}`).join('\n')

  res.json({
    response_type: 'in_channel',
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": text
        },
        "accessory": {
          "type": "image",
          "image_url": `https://screeps.arcath.net/api/creep-body/${counts}.svg`,
          "alt_text": counts
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "mrkdwn",
            "text": `https://screeps.arcath.net/creep-designer?share=${counts}`
          }
        ]
      }
    ]
  })
}