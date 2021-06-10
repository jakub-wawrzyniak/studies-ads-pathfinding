'use-strict';

function getPath(world, solvMode, solver, startId, endId) {
    const cityNo = world.cities.length
    const shouldCalcPath = cityNo <= 9 
        || solvMode === "bidirect"
        || !["dfs", "bfs"].includes(solver)

    let path = -1
    if (shouldCalcPath) path = solvMode === "bidirect"
        ? world.findPath(startId, endId)
        : world.salesmanSolver(solver, startId)
    return path
}

function App() {
    const [cityNo, setCityNo] = React.useState(10)
    const [roadFr, setRoadFr] = React.useState(1)
    const [connMode, setConnMode] = React.useState("nearest")
    
    const [world, setWorld] = React.useState(new World(cityNo, roadFr, connMode))
    React.useEffect(() => {
        setWorld(new World(cityNo, roadFr, connMode))
    }, [cityNo, roadFr, connMode])

    const [solvMode, setSolvMode] = React.useState("salesman")
    const [solver, setSolver] = React.useState("mst")
    const [startCityId, setStartCityId] = React.useState(0)
    const [endCityId, setEndCityId] = React.useState(1)

    const path = getPath(world, solvMode,
        solver, startCityId, endCityId)
    fillCanvas(world, path)

    return (<React.Fragment>
    <form onSubmit={e=>e.preventDefault()}>
        <ConnectionModeSelector mode={connMode} setMode={setConnMode} />
        <ModeSelector mode={solvMode} setMode={setSolvMode}/>
        <CityNoSelector cityNo={cityNo} setCityNo={setCityNo}/>
        <RoadSelector roadFr={roadFr} setRoadFr={setRoadFr}/>
        <CitySelector cityNo={startCityId} setCityNo={setStartCityId}
            maxNo={cityNo-1} prompt="start" />
        {solvMode === "salesman"
            ? <SolverSelector solver={solver} setSolver={setSolver}/>
            : <CitySelector cityNo={endCityId} setCityNo={setEndCityId}
            maxNo={cityNo-1} prompt="end" />
        }
    </form>
    <ShowPathInfo path={path}/>
    </React.Fragment>)
}

const root = document.querySelector('#root');
ReactDOM.render(<App/>, root)

/*
Problems:
    clutered code
    invalid outputs if no path is possible
        mst tree
    iritating user input
        uncontrolled forms?
        update on unfocus?
        data validation before path calc and on unfocus?
    the program is easy to hang up
        better input validation?
        reacting, when exe time is to high
        splitting between threads, so the UI thread will not hang up

Extentions:
    adding animated path finding
    adding webworkers
    
*/