import {NowRequest, NowResponse} from '@now/node'
import superagent from 'superagent'

export default (req: NowRequest, res: NowResponse) => {
  const [room, shard] = (req.query.room as string).split('-')

  const url = `https://screeps.com/api/game/room-terrain?room=${room}&encoded=1&shard=${shard}`
  superagent.get(url).end((err, agentRes) => {
    if(agentRes){
      res.json(agentRes.body)
    }else{
      res.end()
    }
  })
}