import {NowRequest, NowResponse} from '@now/node'
import superagent from 'superagent'

export default (req: NowRequest, res: NowResponse) => {
  const url = 'https://screeps.com/api/game/shards/info'
  superagent.get(url).end((err, agentRes) => {
    if(agentRes){
      res.json(agentRes.body)
    }else{
      res.end()
    }
  })
}