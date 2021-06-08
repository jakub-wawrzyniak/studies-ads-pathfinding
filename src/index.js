'use strict';

const CITY_RAD = 5
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

function translateCoor(coor) {
    const off = 100 + CITY_RAD
    return (coor+off)*(canvas.width/(off*2))
}

function drawCities(world) {
    ctx.fillStyle = "#000"
    for (let city of world.cities) {
        const circle = new Path2D()
        const x = translateCoor(city.x)
        const y = translateCoor(city.y)
        circle.arc(x, y, CITY_RAD, 0, 2 * Math.PI, 0)
        ctx.fill(circle)
    }
}

function drawRoads(world) {
    ctx.strokeStyle = "#bbb"
    for (let pair of world.roads) {
        const [city1, city2] = pair
        const coors = [
            translateCoor(city1.x),
            translateCoor(city1.y),
            translateCoor(city2.x),
            translateCoor(city2.y),
        ]
        ctx.beginPath()
        ctx.moveTo(coors[0], coors[1])
        ctx.lineTo(coors[2], coors[3])
        ctx.stroke()
    }
}

function drawPath(path) {
    ctx.strokeStyle = "#0056F5"
    ctx.beginPath()
    ctx.moveTo(
        translateCoor(path.nodes[0].x),
        translateCoor(path.nodes[0].y),
    )
    for (let node of path.nodes.slice(1)) {
        ctx.lineTo(
            translateCoor(node.x),
            translateCoor(node.y),
        )
    }
    ctx.stroke()
}

function clearCanvas() {
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function ModeSelector({mode, setMode}) {
    const change = () => {
        if (mode === "bidirect") setMode("salesman")
        else setMode("bidirect")
    }

    return (
        <form>
            <input type="radio" name="mode" id="bidirect" value="bidirect"
                onChange={change} checked={mode === "bidirect"}/>
            <label htmlFor="bidirect">Bidirectional pathfinding</label>
            <input type="radio" name="mode" id="salesman" value="salesman"
                onChange={change} checked={mode === "salesman"}/>
            <label htmlFor="salesman">Salesman problem</label>
        </form>
    )
}

function CitySelector({cityNo, setCityNo}) {
    const inputEl = React.useRef()
    const handleChange = (e) => {
        setCityNo(parseInt(inputEl.current.value))
        e.preventDefault()
    }
    return (<form onSubmit={handleChange}>
        <label>Enter no of cities:
        <input type="number" min="2" max="100"
            defaultValue={cityNo} ref={inputEl}/>
        </label>
        <button type="sumbit">Save</button>
    </form>)
}

function RoadSelector({roadFr, setRoadFr}) {
    const inputEl = React.useRef()
    const handleChange = (e) => {
        const val = parseFloat(inputEl.current.value)
        setRoadFr(val)
        e.preventDefault()
    }
    return (<form onSubmit={handleChange}>
        <label>Enter fraction of roads:
        <input type="number" min="0.5" max="1" step="0.01"
            defaultValue={roadFr} ref={inputEl}/>
        </label>
        <button type="sumbit">Save</button>
    </form>)
}

function App() {
    const [cityNo, setCityNo] = React.useState(10)
    const [roadFr, setRoadFr] = React.useState(1) // 0.8 = 80% of all roads
    const [mode, setMode] = React.useState("salesman") // bidirect, salesman
    const [solver, setSolver] = React.useState("mst") // bfs, dfs, mst, greedy
    
    const [world, setWorld] = React.useState(new World(cityNo, roadFr))
    React.useEffect(() => {
        setWorld(new World(cityNo, roadFr))
    }, [cityNo, roadFr])

    const path = mode === "bidirect"
        ? world.findPathDikstra(0, 5)
        : world.salesmanSolver(solver)
    
    clearCanvas()
    drawRoads(world)
    drawPath(path)
    drawCities(world)

    return (<div>
        <CitySelector cityNo={cityNo} setCityNo={setCityNo}/>
        <RoadSelector roadFr={roadFr} setRoadFr={setRoadFr}/>
        <ModeSelector mode={mode} setMode={setMode}/>
        <p>Current mode: {mode}</p>
        <p>Current city no: {cityNo}</p>
    </div>)
}

  const root = document.querySelector('#root');
  ReactDOM.render(<App/>, root)