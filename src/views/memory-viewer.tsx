import * as jQuery from 'jquery'
import * as React from 'react'
import ReactJson from 'react-json-view'

export class MemoryViewer extends React.Component{
  state: {
    token: string
    data: any
  }

  constructor(props: any){
    super(props)

    let token = ''

    if(localStorage.getItem('token')){
      token = localStorage.getItem('token')!
    }

    this.state = {
      token: token,
      data: {}
    }
  }

  setToken(e: any){
    this.setState({token: e.target.value})
    localStorage.setItem('token', e.target.value)
  }

  loadMemory(){
    let component = this
    jQuery.ajax({
      url: '/api/memory/shard1',
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