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

function PlusMinus(_ref) {
    var state = _ref.state,
        setState = _ref.setState,
        step = _ref.step;

    return React.createElement(
        'span',
        { className: 'plusminus' },
        React.createElement(
            'button',
            { onClick: function onClick() {
                    return setState(state + step);
                } },
            '+'
        ),
        React.createElement(
            'button',
            { onClick: function onClick() {
                    return setState(state - step);
                } },
            '-'
        )
    );
}

function ModeSelector(_ref2) {
    var mode = _ref2.mode,
        setMode = _ref2.setMode;

    var change = function change() {
        if (mode === "bidirect") setMode("salesman");else setMode("bidirect");
    };

    return React.createElement(
        'div',
        { className: 'selector radio' },
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

function ConnectionModeSelector(_ref3) {
    var mode = _ref3.mode,
        setMode = _ref3.setMode;

    var change = function change() {
        if (mode === "nearest") setMode("random");else setMode("nearest");
    };

    return React.createElement(
        'div',
        { className: 'selector radio' },
        React.createElement('input', { type: 'radio', name: 'connectionMode', id: 'nearest', value: 'nearest',
            onChange: change, checked: mode === "nearest" }),
        React.createElement(
            'label',
            { htmlFor: 'nearest' },
            'Connect nearest cities'
        ),
        React.createElement('input', { type: 'radio', name: 'connectionMode', id: 'random', value: 'random',
            onChange: change, checked: mode === "random" }),
        React.createElement(
            'label',
            { htmlFor: 'random' },
            'Connect random cities'
        )
    );
}

function CityNoSelector(_ref4) {
    var cityNo = _ref4.cityNo,
        setCityNo = _ref4.setCityNo;

    var handleChange = function handleChange(val) {
        val = parseInt(val);
        if (val < 2 || !val) val = 2;else if (val > 300) val = 300;
        setCityNo(val);
    };
    return React.createElement(
        'div',
        { className: 'selector number' },
        React.createElement(
            'label',
            null,
            'Enter no of cities:',
            React.createElement(
                'span',
                null,
                React.createElement('input', { type: 'number', min: '2', max: '300',
                    value: cityNo, onChange: function onChange(e) {
                        return handleChange(e.target.value);
                    } }),
                React.createElement(PlusMinus, { state: cityNo, setState: handleChange, step: 1 })
            )
        )
    );
}

function RoadSelector(_ref5) {
    var roadFr = _ref5.roadFr,
        setRoadFr = _ref5.setRoadFr;

    var handleChange = function handleChange(val) {
        val = parseFloat(val);
        if (val < 0.05 || !val) val = 0.05;else if (val > 1) val = 1;
        setRoadFr(val);
    };
    return React.createElement(
        'div',
        { className: 'selector number' },
        React.createElement(
            'label',
            null,
            'Enter fraction of roads:',
            React.createElement(
                'span',
                null,
                React.createElement('input', { type: 'number', min: '0.05', max: '1', step: '0.01',
                    value: roadFr, onChange: function onChange(e) {
                        return handleChange(e.target.value);
                    } }),
                React.createElement(PlusMinus, { state: roadFr, setState: handleChange, step: 0.01 })
            )
        )
    );
}

function SolverSelector(_ref6) {
    var solver = _ref6.solver,
        setSolver = _ref6.setSolver;

    return React.createElement(
        'div',
        { className: 'selector' },
        React.createElement(
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
        )
    );
}

function CitySelector(_ref7) {
    var cityNo = _ref7.cityNo,
        setCityNo = _ref7.setCityNo,
        maxNo = _ref7.maxNo,
        prompt = _ref7.prompt;

    var handleChange = function handleChange(val) {
        val = parseInt(val);
        if (val > maxNo) val = maxNo;
        if (val < 0 || !val) val = 0;
        setCityNo(val);
    };
    return React.createElement(
        'div',
        { className: 'selector number' },
        React.createElement(
            'label',
            null,
            'Enter ',
            prompt,
            ' city id:',
            React.createElement(
                'span',
                null,
                React.createElement('input', { type: 'number', min: '0', max: maxNo,
                    value: cityNo, onChange: function onChange(e) {
                        return handleChange(e.target.value);
                    } }),
                React.createElement(PlusMinus, { setState: handleChange, state: cityNo, step: 1 })
            )
        )
    );
}

function ShowPathInfo(_ref8) {
    var path = _ref8.path;

    if (path === -1) return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            'h4',
            null,
            'No path has been found'
        ),
        React.createElement(
            'ul',
            null,
            React.createElement(
                'p',
                null,
                'Try selecting different endpoints or increasing the fraction of roads'
            )
        )
    );

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            'h4',
            null,
            'Path details:'
        ),
        React.createElement(
            'ul',
            null,
            React.createElement(
                'li',
                null,
                'path length: ',
                Math.ceil(path.dist)
            ),
            React.createElement(
                'li',
                null,
                'nodes in path: ',
                path.nodes.length
            ),
            React.createElement(
                'li',
                null,
                'computation time: ',
                path.calcTime,
                'ms'
            )
        )
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

    var _React$useState7 = React.useState("nearest"),
        _React$useState8 = _slicedToArray(_React$useState7, 2),
        connectionMode = _React$useState8[0],
        setConnectionMode = _React$useState8[1];

    var _React$useState9 = React.useState("mst"),
        _React$useState10 = _slicedToArray(_React$useState9, 2),
        solver = _React$useState10[0],
        setSolver = _React$useState10[1];

    var _React$useState11 = React.useState(new World(cityNo, roadFr, connectionMode)),
        _React$useState12 = _slicedToArray(_React$useState11, 2),
        world = _React$useState12[0],
        setWorld = _React$useState12[1];

    React.useEffect(function () {
        setWorld(new World(cityNo, roadFr, connectionMode));
    }, [cityNo, roadFr, connectionMode]);

    var shouldCalcPath = cityNo <= 10 || mode === "bidirect" || !["dfs", "bfs"].includes(solver);
    if (!shouldCalcPath) {
        alert('Setting no of cities to ' + cityNo + ' with the ' + solver + ' solver will resoult in the app freezing. Setting no of cities back to 10.');
        setCityNo(10);
    }

    var _React$useState13 = React.useState(0),
        _React$useState14 = _slicedToArray(_React$useState13, 2),
        startCityId = _React$useState14[0],
        setStartCityId = _React$useState14[1];

    var _React$useState15 = React.useState(1),
        _React$useState16 = _slicedToArray(_React$useState15, 2),
        endCityId = _React$useState16[0],
        setEndCityId = _React$useState16[1];

    var path = -1;
    if (shouldCalcPath) path = mode === "bidirect" ? world.findPath(startCityId, endCityId) : world.salesmanSolver(solver, startCityId);

    clearCanvas();
    drawRoads(world);
    if (path !== -1) drawPath(path);
    drawCities(world);

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            'form',
            { onSubmit: function onSubmit(e) {
                    return e.preventDefault();
                } },
            React.createElement(ConnectionModeSelector, { mode: connectionMode, setMode: setConnectionMode }),
            React.createElement(ModeSelector, { mode: mode, setMode: setMode }),
            React.createElement(CityNoSelector, { cityNo: cityNo, setCityNo: setCityNo }),
            React.createElement(RoadSelector, { roadFr: roadFr, setRoadFr: setRoadFr }),
            React.createElement(CitySelector, { cityNo: startCityId, setCityNo: setStartCityId,
                maxNo: cityNo - 1, prompt: 'start' }),
            mode === "salesman" ? React.createElement(SolverSelector, { solver: solver, setSolver: setSolver }) : React.createElement(CitySelector, { cityNo: endCityId, setCityNo: setEndCityId,
                maxNo: cityNo - 1, prompt: 'end' })
        ),
        React.createElement(ShowPathInfo, { path: path })
    );
}

var root = document.querySelector('#root');
ReactDOM.render(React.createElement(App, null), root);