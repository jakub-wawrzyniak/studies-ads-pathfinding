'use-strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function getPath(world, solvMode, solver, startId, endId) {
    var cityNo = world.cities.length;
    var shouldCalcPath = cityNo <= 9 || solvMode === "bidirect" || !["dfs", "bfs"].includes(solver);

    var path = -1;
    if (shouldCalcPath) path = solvMode === "bidirect" ? world.findPath(startId, endId) : world.salesmanSolver(solver, startId);
    return path;
}

function App() {
    var _React$useState = React.useState(10),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        cityNo = _React$useState2[0],
        setCityNo = _React$useState2[1];

    var _React$useState3 = React.useState(1),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        roadFr = _React$useState4[0],
        setRoadFr = _React$useState4[1];

    var _React$useState5 = React.useState("nearest"),
        _React$useState6 = _slicedToArray(_React$useState5, 2),
        connMode = _React$useState6[0],
        setConnMode = _React$useState6[1];

    var _React$useState7 = React.useState(new World(cityNo, roadFr, connMode)),
        _React$useState8 = _slicedToArray(_React$useState7, 2),
        world = _React$useState8[0],
        setWorld = _React$useState8[1];

    React.useEffect(function () {
        setWorld(new World(cityNo, roadFr, connMode));
    }, [cityNo, roadFr, connMode]);

    var _React$useState9 = React.useState("salesman"),
        _React$useState10 = _slicedToArray(_React$useState9, 2),
        solvMode = _React$useState10[0],
        setSolvMode = _React$useState10[1];

    var _React$useState11 = React.useState("mst"),
        _React$useState12 = _slicedToArray(_React$useState11, 2),
        solver = _React$useState12[0],
        setSolver = _React$useState12[1];

    var _React$useState13 = React.useState(0),
        _React$useState14 = _slicedToArray(_React$useState13, 2),
        startCityId = _React$useState14[0],
        setStartCityId = _React$useState14[1];

    var _React$useState15 = React.useState(1),
        _React$useState16 = _slicedToArray(_React$useState15, 2),
        endCityId = _React$useState16[0],
        setEndCityId = _React$useState16[1];

    var path = getPath(world, solvMode, solver, startCityId, endCityId);
    fillCanvas(world, path);

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            "form",
            { onSubmit: function onSubmit(e) {
                    return e.preventDefault();
                } },
            React.createElement(ConnectionModeSelector, { mode: connMode, setMode: setConnMode }),
            React.createElement(ModeSelector, { mode: solvMode, setMode: setSolvMode }),
            React.createElement(CityNoSelector, { cityNo: cityNo, setCityNo: setCityNo }),
            React.createElement(RoadSelector, { roadFr: roadFr, setRoadFr: setRoadFr }),
            React.createElement(CitySelector, { cityNo: startCityId, setCityNo: setStartCityId,
                maxNo: cityNo - 1, prompt: "start" }),
            solvMode === "salesman" ? React.createElement(SolverSelector, { solver: solver, setSolver: setSolver }) : React.createElement(CitySelector, { cityNo: endCityId, setCityNo: setEndCityId,
                maxNo: cityNo - 1, prompt: "end" })
        ),
        React.createElement(ShowPathInfo, { path: path })
    );
}

var root = document.querySelector('#root');
ReactDOM.render(React.createElement(App, null), root);

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