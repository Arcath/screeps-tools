import React, {useState, CSSProperties} from 'react'
import styled from '@emotion/styled'

const BPLayout = styled.div`
  display:grid;
  grid-template-columns:minmax(1.2em, 1fr) calc(95vh - 100px) 200px minmax(1.2em, 1fr);
  grid-gap:10px;

  img{
    width:20px;
  }
`

const Room = styled.div`
  display:grid;
  max-height:95vh;
  width:100%;
  grid-template-columns:repeat(50, 1fr);
  grid-template-rows:repeat(50, 1fr);
  background-color:#000;
  
  & > *{
    background-color:#ccc;
    box-sizing:border-box;
    border:1px solid #000;
    line-height:calc((95vh - 100px) / 50);
    cursor:pointer;

    &:hover{
      border:1px solid #fff;
    }
  }
`

const Controls = styled.div`
  background-color:#222;
`


interface StructureList{
  [structure: string]: {
    [level: number]: number
  }
}

const CONTROLLER_STRUCTURES: StructureList = {
    "spawn": { 0: 0, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 2, 8: 3 },
    "extension": { 0: 0, 1: 0, 2: 5, 3: 10, 4: 20, 5: 30, 6: 40, 7: 50, 8: 60 },
    "link": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2, 6: 3, 7: 4, 8: 6 },
    "road": { 0: 2500, 1: 2500, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500 },
    "constructedWall": { 1: 0, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500 },
    "rampart": { 1: 0, 2: 2500, 3: 2500, 4: 2500, 5: 2500, 6: 2500, 7: 2500, 8: 2500 },
    "storage": { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1 },
    "tower": { 1: 0, 2: 0, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 6 },
    "observer": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1 },
    "powerSpawn": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1 },
    "extractor": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1 },
    "terminal": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 1, 7: 1, 8: 1 },
    "lab": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 3, 7: 6, 8: 10 },
    "container": { 0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5 },
    "nuker": { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1 }
};

const STRUCTURES = {
  spawn: "Spawn",
  extension: "Extension",
  link: "Link",
  road: "Road",
  constructedWall: "Wall",
  rampart: "Rampart",
  tower: "Tower",
  observer: "Observer",
  powerSpawn: "Power Spawn",
  extractor: "Extractor",
  terminal: "Terminal",
  lab: "Lab",
  container: "Container",
  nuker: "Nuker",
  storage: "Storage"
}

const STRUCTURE_CONSTANTS = (Object.keys(STRUCTURES) as (keyof typeof STRUCTURES)[])

export const BuildingPlanner: React.FC<{path: string}> = () => {
  const [RCL, setRCL] = useState(8)
  const [cursorX, setCursorX] = useState(0)
  const [cursorY, setCursorY] = useState(0)
  const [brush, setBrush] = useState<keyof typeof STRUCTURES>('spawn')
  const [buildings, setBuildings] = useState<{[building: string]: [number, number][]}>({})
  const [asJson, setAsJson] = useState('Regenerate')
  const [roomName, setRoomName] = useState('')
  const [shards, setShards] = useState([])
  const [shard, setShard] = useState('shard0')
  const [terrain, setTerrain] = useState('0'.repeat(50 * 50))

  if(shards.length === 0){
    fetch('/api/shards').then((response) => {
      response.json().then((data) => {
        setShards(data.shards.map((d: any) => {
          return d.name
        }))
      })
    })
  }

  const add = () => {
    const newBuildings = {...buildings}

    if(!newBuildings[brush]){
      newBuildings[brush] = []
    }

    if(newBuildings[brush].length < CONTROLLER_STRUCTURES[brush][RCL]){
      newBuildings[brush].push([cursorX, cursorY])
    }

    setBuildings(newBuildings)
    setAsJson('Regenerate')
  }

  const remove = () => {
    const structure = structureAt(cursorX, cursorY)

    if(structure){
      const newBuildings = {...buildings}

      newBuildings[structure] = newBuildings[structure].filter((pos) => {
        return !(pos[0] === cursorX && pos[1] === cursorY)
      })

      setBuildings(newBuildings)
      setAsJson('Regenerate')

      return // Done End Processing
    }
  }

  const structureAt = (x: number, y: number): string | undefined => {
    let structure
    
    Object.keys(buildings).forEach((building) => {
      if(building !== 'road' && building !== 'rampart'){
        buildings[building].forEach((pos) => {
          if(pos[0] === x && pos[1] === y){
            structure = building
          }
        })
      }
    })

    return structure
  }

  const isRoad = (x: number, y: number): boolean => {
    if(buildings['road']){
      const roads = buildings['road'].filter((pos) => {
        return (pos[0] === x && pos[1] === y)
      })

      return roads.length > 0
    }

    return false
  }

  const isRampart = (x: number, y: number): boolean => {
    if(buildings['rampart']){
      const ramparts = buildings['rampart'].filter((pos) => {
        return (pos[0] === x && pos[1] === y)
      })

      return ramparts.length > 0
    }

    return false
  }

  const createJSON = () => {
    const json: any = {}

    Object.keys(buildings).forEach((building) => {
      json[building] = {pos: buildings[building].map((p) => {
        return {x: p[0], y: p[1]}
      })}
    })

    setAsJson(JSON.stringify(json))
  }

  const cellStyle = (x: number, y: number, tile: number): CSSProperties => {
    let backgroundImage
    let backgroundColor = '#222'
    let borderColor = '#000'

    const structure = structureAt(x, y)

    if(structure){
      backgroundImage = `url(/img/screeps/${structure}.png)`
    }

    switch(tile){
      case 0:
        backgroundColor = '#222'
        break
      case 1:
        backgroundColor = '#000'
        break
      case 2:
        backgroundColor = '#292b18'
        break
    }

    if(isRoad(x, y) && tile !== 1){
      backgroundColor = '#636363'
    }

    if(isRampart(x, y)){
      borderColor = '#2f3a30'
    }

    return {
      backgroundImage,
      backgroundSize: 'contain',
      backgroundPosition: 'middle',
      backgroundRepeat: 'no-repeat',
      backgroundColor,
      borderColor
    }
  }

  const getTerrain = async () => {
    const response = await fetch(`/api/terrain/${roomName}-${shard}`)

    const data = await response.json() as {
      ok: number
      terrain: {
        _id: string
        room: string
        terrain: string
        type: string
      }[]
    }

    setTerrain(data.terrain[0].terrain)
  }
  
  return <BPLayout>
    <div />
    <Room>
      {[...Array(50)].map((x: number, j) => {
        return [...Array(50)].map((y: number, i) => {
          const terrainTile = parseInt(terrain.substr((j * 50) + i, 1))

          return <div key={`${i}-${j}`} 
          onMouseEnter={() => {
            setCursorX(i)
            setCursorY(j)
          }}
          onClick={() => {
            add()
          }}
          onContextMenu={(e) => {
            e.preventDefault()
            remove()
          }}
          style={cellStyle(i, j, terrainTile)}
          >&nbsp;</div>
        })
      })}
    </Room>
    <Controls>
      <p>
        <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
        <select value={shard} onChange={(e) => setShard(e.target.value)}>
          {shards.map((s) => {
            return <option key={s} value={s}>{s}</option>
          })}
        </select>
        <button onClick={() => getTerrain()}>Get Terrain</button>
      </p>
      <p>RCL: <select value={RCL} onChange={(e) => setRCL(parseInt(e.target.value))}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
        <option value={6}>6</option>
        <option value={7}>7</option>
        <option value={8}>8</option>
      </select></p>
      <p>X: {cursorX} Y: {cursorY}</p>
      <table>
        <tbody>
          {STRUCTURE_CONSTANTS.map((structure) => {
            return <tr key={structure} onClick={() => setBrush(structure)} style={{
              border: '1px solid #ccc',
              backgroundColor: structure === brush ? '#ccc' : 'inherit'
            }}>
              <td><img src={`/img/screeps/${structure}.png`} alt={structure} /></td>
              <td>{STRUCTURES[structure]}</td>
              <td>{buildings[structure] ? buildings[structure].length : 0} / {CONTROLLER_STRUCTURES[structure][RCL]}</td>
            </tr>
          })}
        </tbody>
      </table>
      <textarea value={asJson} />
      <button onClick={() => createJSON()}>Generate</button>
    </Controls>
    <div />
  </BPLayout>
}