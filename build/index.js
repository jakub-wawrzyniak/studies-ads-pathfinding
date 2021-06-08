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

function App() {
    var _React$useState = React.useState(10),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        cityNo = _React$useState2[0],
        setCityNo = _React$useState2[1];

    var _React$useState3 = React.useState(1),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        roadFr = _React$useState4[0],
        setRoadFr = _React$useState4[1]; // 0.8 = 80% of all roads


    var _React$useState5 = React.useState("salesman"),
        _React$useState6 = _slicedToArray(_React$useState5, 2),
        mode = _React$useState6[0],
        setMode = _React$useState6[1]; // bidirect, salesman


    var _React$useState7 = React.useState("mst"),
        _React$useState8 = _slicedToArray(_React$useState7, 2),
        solver = _React$useState8[0],
        setSolver = _React$useState8[1]; // bfs, dfs, mst, greedy

    var _React$useState9 = React.useState(new World(cityNo, roadFr)),
        _React$useState10 = _slicedToArray(_React$useState9, 2),
        world = _React$useState10[0],
        setWorld = _React$useState10[1];

    var path = mode === "bidirect" ? world.findPathDikstra(0, 5) : world.salesmanSolver(solver);

    clearCanvas();
    drawRoads(world);
    drawPath(path);
    drawCities(world);
    return React.createElement(
        'div',
        null,
        React.createElement(ModeSelector, { mode: mode, setMode: setMode }),
        React.createElement(
            'p',
            null,
            'Current mode: ',
            mode
        )
    );
}

var root = document.querySelector('#root');
ReactDOM.render(React.createElement(App, null), root);