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

function CityNoSelector({cityNo, setCityNo}) {
    const handleChange = (e) => {
        let val = parseInt(e.target.value)
        if (val < 2 || !val) val = 2
        else if (val > 300) val = 300
        setCityNo(val)
    }
    return (<form>
        <label>Enter no of cities:
        <input type="number" min="2" max="300"
            value={cityNo} onChange={handleChange}/>
        </label>
    </form>)
}

function RoadSelector({roadFr, setRoadFr}) {
    const handleChange = (e) => {
        let val = parseFloat(e.target.value)
        if (val < 0.5 || !val) val = 0.5
        else if (val > 1) val = 1
        setRoadFr(val)
    }
    return (<form >
        <label>Enter fraction of roads:
        <input type="number" min="0.5" max="1" step="0.01"
            value={roadFr} onChange={handleChange}/>
        </label>
    </form>)
}

function SolverSelector({solver, setSolver}) {
    return (<select onChange={(e)=>setSolver(e.target.value)} value={solver}>
        <option value="bfs">breadth-first search</option>
        <option value="dfs">depth-first search</option>
        <option value="greedy">greedy search</option>
        <option value="mst">minimum spanning tree</option>
    </select>)
}

function CitySelector({cityNo, setCityNo, maxNo, prompt}) {
    const handleChange = (e) => {
        let val = parseInt(e.target.value)
        if (val > maxNo) val = maxNo
        if (val < 0 || !val) val = 0
        setCityNo(val)
    }
    return (
        <label>
        Enter {prompt} city id:
        <input type="number" min="0" max={maxNo}
            value={cityNo} onChange={handleChange}/>
        </label>
    )
}

function App() {
    const [cityNo, setCityNo] = React.useState(10)
    const [roadFr, setRoadFr] = React.useState(1)
    const [mode, setMode] = React.useState("salesman")
    const [solver, setSolver] = React.useState("mst")
    
    const [world, setWorld] = React.useState(new World(cityNo, roadFr))
    React.useEffect(() => {
        setWorld(new World(cityNo, roadFr))
    }, [cityNo, roadFr])

    if (cityNo > 10 && mode === "salesman" && ["dfs", "bfs"].includes(solver)) {
        alert(`Setting no of cities to ${cityNo} with the ${solver} \
        solver will resoult in the app freezing. Setting no of \
        cities back to 10.`)
        setCityNo(10)
    }

    const [startCityId, setStartCityId] = React.useState(0)
    const [endCityId, setEndCityId] = React.useState(1)
    const path = mode === "bidirect"
        ? world.findPathDikstra(startCityId, endCityId)
        : world.salesmanSolver(solver, startCityId)
    const wasPathFound = path !== -1
    
    clearCanvas()
    drawRoads(world)
    if (wasPathFound) drawPath(path)
    drawCities(world)

    return (<div>
        <CityNoSelector cityNo={cityNo} setCityNo={setCityNo}/>
        <RoadSelector roadFr={roadFr} setRoadFr={setRoadFr}/>
        <ModeSelector mode={mode} setMode={setMode}/>
        <CitySelector cityNo={startCityId} setCityNo={setStartCityId}
            maxNo={cityNo-1} prompt="start" />
        {mode === "salesman"
            ? <SolverSelector solver={solver} setSolver={setSolver}/>
            : <CitySelector cityNo={endCityId} setCityNo={setEndCityId}
            maxNo={cityNo-1} prompt="end" />
        }
        {wasPathFound === false
            ? <div>
                <h3>No path has been found</h3>
                <p>Try selecting different endpoints or increasing the fraction of roads</p>
            </div>
            : ""}
    </div>)
}

  const root = document.querySelector('#root');
  ReactDOM.render(<App/>, root)