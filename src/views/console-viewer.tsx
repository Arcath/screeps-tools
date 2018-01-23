import * as jQuery from 'jquery'
import * as React from 'react'
import ReactJson from 'react-json-view'
import * as ReactGA from 'react-ga'

type SelectOptions = Array<{
  value: string
  label: string
}>

type ConsoleEvent = {
  channel: string
  id: string
  type: string
  data: {
    messages: {
      log: string[]
    },
    shard: string
  }
}

type ConsoleMessage = {
  type: string
  data: string
  key: string
  shard: string
}

export class ConsoleViewer extends React.Component{
  state: {
    token: string
    shards: SelectOptions
    events: ConsoleEvent[]
    limit: number
    messages: ConsoleMessage[]
    paused: boolean
    shard: string | false
  }

  socket: SocketIOClient.Socket

  messagesEnd: any

  constructor(props: any){
    super(props)

    let token = ''

    if(localStorage.getItem('token')){
      token = localStorage.getItem('token')!
    }

    this.state = {
      token: token,
      shards: [],
      events: [],
      limit: 200,
      messages: [],
      paused: false,
      shard: false
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

    this.socket = io()

    this.socket.on('welcome', (data: any) => {
      if(data.ok){
        console.log('connected to screeps tools server')
        let events = component.state.events
        events.push({
          channel: 'console',
          id: 'connest',
          data: {
            messages: {
              log: ['Connected to Screeps Tools (WebSocket)']
            },
            shard: 'shard0'
          },
          type: 'user'
        })
      }
    })

    this.socket.on('message', (event: ConsoleEvent) => {
      let events = component.state.events
      events.push(event)
      if(events.length > component.state.limit){
        events.shift()
      }
      component.setState({events: events})
    })
  }

  setToken(e: any){
    this.setState({token: e.target.value})
    localStorage.setItem('token', e.target.value)
  }

  setShard(shard: string){
    if(this.state.shard === shard){
      this.setState({shard: false})
    }else{
      this.setState({shard: shard})
    }
  }

  connectConsole(){
    ReactGA.event({
      category: 'Console',
      action: 'Connected Console to Screeps'
    })

    this.socket.emit('connect-console', {token: this.state.token})
  }

  messages(){
    let messages: ConsoleMessage[] = []

    let component = this

    if(this.state.messages.length > 0){
      messages = this.state.messages
    }else{
      this.state.events.forEach((event) => {
        let i = 0
        event.data.messages.log.forEach((message) => {
          let type = 'string'
  
          if((message.match(/^{.*}$/) || []).length > 0){
            type = 'json'
          }
  
          if(!component.state.shard || event.data.shard === component.state.shard){
            messages.push({
              type: type,
              data: message,
              key: event.id + '-' + i,
              shard: event.data.shard
            })
          }
          i += 1
        })
      })
    }

    return messages
  }

  pause(){
    if(this.state.paused){
      this.setState({messages: [], paused: false})
    }else{
      let messages = this.messages()
      this.setState({messages: messages, paused: true})
    }
  }

  render(){
    return <div className="console-viewer">
      <div className="console">
        {this.messages().map((message) => {
          return <Message message={message} key={message.key} />
        })}
      </div>
      <div className="options">
        <h2>Options</h2>
        <p>
          <input type="text" placeholder="AUTH Token" onChange={(e) => this.setToken(e)} value={this.state.token} />
          <button onClick={(e) => this.connectConsole()}>Connect To Console</button>
        </p>
        <p>
          <button onClick={(e) => this.pause()}>{this.state.paused ? 'Resume Output' : 'Pause Output'}</button>
        </p>
        <h3>Info</h3>
        <p>
          {this.state.events.length}/{this.state.limit} Ticks Captured.
        </p>
        <h3>Shard</h3>
        <ul>
          {this.state.shards.map((shard) => {
            return <li key={shard.value} onClick={(e) => this.setShard(shard.value)} className={this.state.shard === shard.value ? 'active' : ''}>{shard.label}</li>
          })}
        </ul>
      </div>
      <div style={{ float:"left", clear: "both", marginTop: "50px" }} ref={(el) => { this.messagesEnd = el; }} />
    </div>
  }

  componentDidUpdate(){
    this.messagesEnd.scrollIntoView({ behavior: "smooth" })
  }
}

class Message extends React.Component<{
  message: ConsoleMessage
}>{
  contents(){
    if(this.props.message.type === 'json'){
      let json = JSON.parse(this.props.message.data)
      return <ReactJson src={json} theme="railscasts" name="Memory" collapsed={1} />
    }

    return <span dangerouslySetInnerHTML={{__html: this.props.message.data}} />
  }

  render(){
    return <div className="message">
      [{this.props.message.shard}] {this.contents()}
    </div>
  }
}