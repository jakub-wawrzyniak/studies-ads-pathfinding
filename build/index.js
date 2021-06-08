'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var CITY_RAD = 5;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

function translateCoor(coor) {
    var off = 100 + CITY_RAD;
    return (coor + off) * (canvas.width / (off * 2));
}

function drawCities(world) {
    ctx.fillStyle = "#000";
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = world.cities[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var city = _step.value;

            var circle = new Path2D();
            var x = translateCoor(city.x);
            var y = translateCoor(city.y);
            circle.arc(x, y, CITY_RAD, 0, 2 * Math.PI, 0);
            ctx.fill(circle);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

function drawRoads(world) {
    ctx.strokeStyle = "#bbb";
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = world.roads[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var pair = _step2.value;

            var _pair = _slicedToArray(pair, 2),
                city1 = _pair[0],
                city2 = _pair[1];

            var coors = [translateCoor(city1.x), translateCoor(city1.y), translateCoor(city2.x), translateCoor(city2.y)];
            ctx.beginPath();
            ctx.moveTo(coors[0], coors[1]);
            ctx.lineTo(coors[2], coors[3]);
            ctx.stroke();
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
}

function drawPath(path) {
    ctx.strokeStyle = "#0056F5";
    ctx.beginPath();
    ctx.moveTo(translateCoor(path.nodes[0].x), translateCoor(path.nodes[0].y));
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = path.nodes.slice(1)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var node = _step3.value;

            ctx.lineTo(translateCoor(node.x), translateCoor(node.y));
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    ctx.stroke();
}

function clearCanvas() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function ModeSelector(_ref) {
    var mode = _ref.mode,
        setMode = _ref.setMode;

    var change = function change() {
        if (mode === "bidirect") setMode("salesman");else setMode("bidirect");
    };

    return React.createElement(
        'form',
        null,
        React.createElement('input', { type: 'radio', name: 'mode', id: 'bidirect', value: 'bidirect',
            onChange: change, checked: mode === "bidirect" }),
        React.createElement(
            'label',
            { htmlFor: 'bidirect' },
            'Bidirectional pathfinding'
        ),
        React.createElement('input', { type: 'radio', name: 'mode', id: 'salesman', value: 'salesman',
            onChange: change, checked: mode === "salesman" }),
        React.createElement(
            'label',
            { htmlFor: 'salesman' },
            'Salesman problem'
        )
    );
}

function CityNoSelector(_ref2) {
    var cityNo = _ref2.cityNo,
        setCityNo = _ref2.setCityNo;

    var handleChange = function handleChange(e) {
        var val = parseInt(e.target.value);
        if (val < 2 || !val) val = 2;else if (val > 300) val = 300;
        setCityNo(val);
    };
    return React.createElement(
        'form',
        null,
        React.createElement(
            'label',
            null,
            'Enter no of cities:',
            React.createElement('input', { type: 'number', min: '2', max: '300',
                value: cityNo, onChange: handleChange })
        )
    );
}

function RoadSelector(_ref3) {
    var roadFr = _ref3.roadFr,
        setRoadFr = _ref3.setRoadFr;

    var handleChange = function handleChange(e) {
        var val = parseFloat(e.target.value);
        if (val < 0.5 || !val) val = 0.5;else if (val > 1) val = 1;
        setRoadFr(val);
    };
    return React.createElement(
        'form',
        null,
        React.createElement(
            'label',
            null,
            'Enter fraction of roads:',
            React.createElement('input', { type: 'number', min: '0.5', max: '1', step: '0.01',
                value: roadFr, onChange: handleChange })
        )
    );
}

function SolverSelector(_ref4) {
    var solver = _ref4.solver,
        setSolver = _ref4.setSolver;

    return React.createElement(
        'select',
        { onChange: function onChange(e) {
                return setSolver(e.target.value);
            }, value: solver },
        React.createElement(
            'option',
            { value: 'bfs' },
            'breadth-first search'
        ),
        React.createElement(
            'option',
            { value: 'dfs' },
            'depth-first search'
        ),
        React.createElement(
            'option',
            { value: 'greedy' },
            'greedy search'
        ),
        React.createElement(
            'option',
            { value: 'mst' },
            'minimum spanning tree'
        )
    );
}

function CitySelector(_ref5) {
    var cityNo = _ref5.cityNo,
        setCityNo = _ref5.setCityNo,
        maxNo = _ref5.maxNo,
        prompt = _ref5.prompt;

    var handleChange = function handleChange(e) {
        var val = parseInt(e.target.value);
        if (val > maxNo) val = maxNo;
        if (val < 0 || !val) val = 0;
        setCityNo(val);
    };
    return React.createElement(
        'label',
        null,
        'Enter ',
        prompt,
        ' city id:',
        React.createElement('input', { type: 'number', min: '0', max: maxNo,
            value: cityNo, onChange: handleChange })
    );
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

    var _React$useState5 = React.useState("salesman"),
        _React$useState6 = _slicedToArray(_React$useState5, 2),
        mode = _React$useState6[0],
        setMode = _React$useState6[1];

    var _React$useState7 = React.useState("mst"),
        _React$useState8 = _slicedToArray(_React$useState7, 2),
        solver = _React$useState8[0],
        setSolver = _React$useState8[1];

    var _React$useState9 = React.useState(new World(cityNo, roadFr)),
        _React$useState10 = _slicedToArray(_React$useState9, 2),
        world = _React$useState10[0],
        setWorld = _React$useState10[1];

    React.useEffect(function () {
        setWorld(new World(cityNo, roadFr));
    }, [cityNo, roadFr]);

    if (cityNo > 10 && mode === "salesman" && ["dfs", "bfs"].includes(solver)) {
        alert('Setting no of cities to ' + cityNo + ' with the ' + solver + '         solver will resoult in the app freezing. Setting no of         cities back to 10.');
        setCityNo(10);
    }

    var _React$useState11 = React.useState(0),
        _React$useState12 = _slicedToArray(_React$useState11, 2),
        startCityId = _React$useState12[0],
        setStartCityId = _React$useState12[1];

    var _React$useState13 = React.useState(1),
        _React$useState14 = _slicedToArray(_React$useState13, 2),
        endCityId = _React$useState14[0],
        setEndCityId = _React$useState14[1];

    var path = mode === "bidirect" ? world.findPathDikstra(startCityId, endCityId) : world.salesmanSolver(solver, startCityId);
    var wasPathFound = path !== -1;

    clearCanvas();
    drawRoads(world);
    if (wasPathFound) drawPath(path);
    drawCities(world);

    return React.createElement(
        'div',
        null,
        React.createElement(CityNoSelector, { cityNo: cityNo, setCityNo: setCityNo }),
        React.createElement(RoadSelector, { roadFr: roadFr, setRoadFr: setRoadFr }),
        React.createElement(ModeSelector, { mode: mode, setMode: setMode }),
        React.createElement(CitySelector, { cityNo: startCityId, setCityNo: setStartCityId,
            maxNo: cityNo - 1, prompt: 'start' }),
        mode === "salesman" ? React.createElement(SolverSelector, { solver: solver, setSolver: setSolver }) : React.createElement(CitySelector, { cityNo: endCityId, setCityNo: setEndCityId,
            maxNo: cityNo - 1, prompt: 'end' }),
        wasPathFound === false ? React.createElement(
            'div',
            null,
            React.createElement(
                'h3',
                null,
                'No path has been found'
            ),
            React.createElement(
                'p',
                null,
                'Try selecting different endpoints or increasing the fraction of roads'
            )
        ) : ""
    );
}

var root = document.querySelector('#root');
ReactDOM.render(React.createElement(App, null), root);