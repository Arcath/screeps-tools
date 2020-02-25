import {NowRequest, NowResponse} from '@now/node'

export default (req: NowRequest, res: NowResponse) => {
  console.dir(req)

  res.send('foo')
}