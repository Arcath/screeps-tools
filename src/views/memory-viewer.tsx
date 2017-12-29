import * as jQuery from 'jquery'
import * as React from 'react'
import ReactJson from 'react-json-view'

type SelectOptions = Array<{
  value: string
  label: string
}>

export class MemoryViewer extends React.Component{
  state: {
    token: string
    data: any
    shards: SelectOptions
    shard: string
  }

  constructor(props: any){
    super(props)

    let token = ''

    if(localStorage.getItem('token')){
      token = localStorage.getItem('token')!
    }

    this.state = {
      token: token,
      data: {},
      shards: [],
      shard: 'shard0'
    }
  }

  componentDidMount(){
    let component = this

    jQuery.ajax({
      url: '/api/shards',
      dataType: 'json',
      success: (data: any) => {
        let shards: SelectOptions = []
        data.shards.forEach((shard: {name: string}) => {
          shards.push({label: shard.name, value: shard.name})
        })

        component.setState({shards: shards})
      }
    })
  }

  setToken(e: any){
    this.setState({token: e.target.value})
    localStorage.setItem('token', e.target.value)
  }

  setShard(e: any){
    this.setState({shard: e.target.value})
  }

  loadMemory(){
    let component = this
    jQuery.ajax({
      url: '/api/memory/' + this.state.shard,
      method: 'get',
      dataType: 'json',
      headers: {
        'X-Token': this.state.token
      },
      success: (data: any) => {
        component.setState({data: data})
      }
    })
  }

  render(){
    return <div className="memory-viewer">
      <div className="panel">
        <p>
          <input type="text" placeholder="AUTH Token" onChange={(e) => this.setToken(e)} value={this.state.token} />
          <select onChange={(e) => this.setShard(e)}>
            {this.state.shards.map((shard) => (
              <option value={shard.value}>{shard.label}</option>
            ))}
          </select>
          <button onClick={(e) => this.loadMemory()}>Load Memory</button>
        </p>
        <p>
          Generate an Auth Token from your <a href="https://screeps.com/a/#!/account/auth-tokens" target="_BLANK">account page</a>.
        </p>
        <p>
          Your Token will be saved into local storage (you can clear it by running <i>localStorage.removeItem('token')</i> in your dev console)
        </p>
      </div>
      <div className="panel">
        <ReactJson src={this.state.data} theme="railscasts" name="Memory" collapsed={1} />
      </div>
    </div>
  }
}