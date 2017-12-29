import * as jQuery from 'jquery'
import * as React from 'react'
import ReactJson from 'react-json-view'
import jq from 'jq-web'

type SelectOptions = Array<{
  value: string
  label: string
}>

export class MemoryViewer extends React.Component{
  state: {
    token: string
    data: any
    oData: any
    shards: SelectOptions
    shard: string
    query: string
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
      oData: {},
      shards: [],
      shard: 'shard0',
      query: ''
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
        component.setState({data: data, oData: data})
      }
    })
  }

  setQuery(e: any){
    this.setState({query: e.target.value})
  }

  query(){
    let data = jq(this.state.oData, this.state.query)

    this.setState({data: data})
  }

  refresh(){
    let component = this
    jQuery.ajax({
      url: '/api/memory/' + this.state.shard,
      method: 'get',
      dataType: 'json',
      headers: {
        'X-Token': this.state.token
      },
      success: (data: any) => {
        component.setState({oData: data})
        component.query()
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
        <p>
          You can query your data using <a href="https://stedolan.github.io/jq/">JQ</a>. Enter your query here and hit <i>Run JQ</i> to run it.
        </p>
        <p>
          <textarea placeholder="JQ Query" onChange={(e) => this.setQuery(e)} />
          <button onClick={(e) => this.query()}>Run JQ</button>
          <button onClick={(e) => this.refresh()}>Refresh Data</button>
        </p>
      </div>
      <div className="panel">
        <ReactJson src={this.state.data} theme="railscasts" name="Memory" collapsed={1} />
      </div>
    </div>
  }
}