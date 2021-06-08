'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var CANVAS_SIZE = 500; // dont touch this
var CITY_RAD = 5;
var HOW_MANY_CITIES = 10;
var FRACTION_OF_ROADS = 1; // 0.8 = 80% of all roads
var SOLVER_MODE = "salesman"; // bidirect, salesman
var SOLVER_METHOD = "dfs"; // bfs, dfs, mst, greedy
// ^ matters only if SOLVER_MODE is "salesman"

function translateCoor(coor) {
    var off = 100 + CITY_RAD;
    return (coor + off) * (CANVAS_SIZE / (off * 2));
}

function drawCities(ctx, world) {
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

function drawRoads(ctx, world) {
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

function drawPath(ctx, path) {
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

function printInfo(path, world) {
    document.getElementById('no-cities').innerText = world.cities.length;
    document.getElementById('no-roads').innerText = world.roads.length;
    document.getElementById('%-roads').innerText = FRACTION_OF_ROADS * 100 + "%";
    if (SOLVER_MODE === "bidirect") document.getElementById('method').innerText = "bidirect dikstra";else document.getElementById('method').innerText = SOLVER_METHOD;
    document.getElementById('len').innerText = Math.ceil(path.dist);
    document.getElementById('nodes').innerText = path.nodes.length;
}

function run() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    var world = new World(HOW_MANY_CITIES, FRACTION_OF_ROADS);

    var path = SOLVER_MODE === "bidirect" ? world.findPathDikstra(0, 5) : world.salesmanSolver(SOLVER_METHOD);

    drawRoads(ctx, world);
    drawPath(ctx, path);
    drawCities(ctx, world);
    printInfo(path, world);
}

// class LikeButton extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = { liked: false };
//     }

//     render() {
//       if (this.state.liked) {
//         return 'You liked this.';
//       }

//       return e(
//         'button',
//         { onClick: () => this.setState({ liked: true }) },
//         'Like'
//       );
//     }
//   }

function LikeButton() {
    var _React$useState = React.useState(false),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        isLiked = _React$useState2[0],
        setIsLiked = _React$useState2[1];

    if (isLiked) return 'You like me :)';
    return React.createElement(
        "button",
        { onClick: function onClick() {
                return setIsLiked(true);
            } },
        "Like me!"
    );
}

var e = React.createElement;
var domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);