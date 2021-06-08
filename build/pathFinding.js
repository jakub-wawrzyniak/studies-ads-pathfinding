'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function assert(cond) {
    var warn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

    if (!cond) {
        throw Error(warn);
    }
}

function range(x) {
    return [].concat(_toConsumableArray(Array(x).keys()));
}

function getRandCoor() {
    var c = Math.random() * 200 - 100;
    c = Math.floor(c);
    assert(-100 <= c <= 100);
    return c;
}

function newton(arr) {
    // Returns unique pairs of
    // elements of a given array
    assert(arr.length >= 2);
    var out = [];
    for (var id1 = 0; id1 < arr.length - 1; id1++) {
        for (var id2 = id1 + 1; id2 < arr.length; id2++) {
            out.push([arr[id1], arr[id2]]);
        }
    }
    return out;
}

function getRandArr(arr, count) {
    // Randomly chooses specified no
    // of elements from a given array
    var out = arr;
    while (out.length > count) {
        var id = Math.floor(Math.random() * out.length);
        out.splice(id, 1);
    }
    return out;
}

var City = function () {
    function City(id) {
        _classCallCheck(this, City);

        this.id = id;
        this.distTo = {}; // {city.id: dist}
        this.neighbours = []; // [city1, city2, ...]
        this.areNeighboursSorted = false;

        this.x = getRandCoor();
        this.y = getRandCoor();
    }

    _createClass(City, [{
        key: "connect",
        value: function connect(city, dist) {
            this.neighbours.push(city);
            this.distTo[city.id] = dist;
        }
    }, {
        key: "emptyCopy",
        value: function emptyCopy() {
            var copy = new City(this.id);
            copy.x = this.x;
            copy.y = this.y;
            return copy;
        }
    }, {
        key: "sortNeighbours",
        value: function sortNeighbours() {
            if (!this.areNeighboursSorted) {
                var compFn = function compFn(c1, c2) {
                    return this.distTo[c1.id] - this.distTo[c2.id];
                };

                this.neighbours.sort(compFn.bind(this));
                this.areNeighboursSorted = true;
            }
        }
    }]);

    return City;
}();

function getDist(city1, city2) {
    var dx = city1.x - city2.x;
    var dy = city1.y - city2.y;
    var dist = Math.pow(Math.pow(dx, 2) + Math.pow(dy, 2), 0.5);
    return dist;
}

var Path = function () {
    function Path(start) {
        _classCallCheck(this, Path);

        this.nodes = [start]; // Array of City objects
        this.dist = 0;
    }

    _createClass(Path, [{
        key: "extend",
        value: function extend(city) {
            assert(this.end.neighbours.includes(city));
            this.dist += this.end.distTo[city.id];
            this.nodes.push(city);
            return this;
        }
    }, {
        key: "copy",
        value: function copy() {
            var copy = new Path();
            copy.nodes = [].concat(_toConsumableArray(this.nodes));
            copy.dist = this.dist;
            return copy;
        }
    }, {
        key: "merge",
        value: function merge(path) {
            var _merged$nodes;

            var merged = this.copy();
            merged.dist += path.dist;
            merged.nodes.pop();
            (_merged$nodes = merged.nodes).push.apply(_merged$nodes, _toConsumableArray(path.copy().nodes.reverse()));
            return merged;
        }
    }, {
        key: "end",
        get: function get() {
            return this.nodes[this.nodes.length - 1];
        }
    }]);

    return Path;
}();

function chooseBetterPath(path1, path2) {
    if (!path2) return path1;
    if (path2.dist > path1.dist) return path1;
    return path2;
}

var World = function () {
    function World(howManyCities, fractionOfRoads) {
        _classCallCheck(this, World);

        this.mstTree = undefined;
        this.cities = range(howManyCities).map(function (id) {
            return new City(id);
        });

        var pairs = newton(this.cities);
        var noOfRoads = Math.ceil(fractionOfRoads * pairs.length);
        this.roads = getRandArr(pairs, noOfRoads);

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.roads[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var pair = _step.value;

                var _pair = _slicedToArray(pair, 2),
                    city1 = _pair[0],
                    city2 = _pair[1];

                var dist = getDist(city1, city2);
                city1.connect(city2, dist);
                city2.connect(city1, dist);
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

    _createClass(World, [{
        key: "__bfsSolver",
        value: function __bfsSolver(path) {
            var paths = path.end.neighbours.map(function (n) {
                return path.copy().extend(n);
            });

            while (paths[0].nodes.length !== this.cities.length) {
                var newPaths = [];

                var _loop = function _loop(_path) {
                    var nextCities = _path.end.neighbours.filter(function (city) {
                        return !_path.nodes.includes(city);
                    });
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = nextCities[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var city = _step3.value;

                            newPaths.push(_path.copy().extend(city));
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
                };

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = paths[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _path = _step2.value;

                        _loop(_path);
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

                paths = newPaths;
            }

            var bestPath = undefined;
            var startCity = path.nodes[0];
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = paths[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _path2 = _step4.value;

                    if (_path2.end.neighbours.includes(startCity)) {
                        _path2.extend(startCity);
                        bestPath = chooseBetterPath(_path2, bestPath);
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return bestPath;
        }
    }, {
        key: "__dfsSolver",
        value: function __dfsSolver(path) {
            var bestPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            if (path.nodes.length === this.cities.length) {
                if (path.end.neighbours.includes(path.nodes[0])) {
                    path.extend(path.nodes[0]);
                    return chooseBetterPath(path, bestPath);
                }
                return bestPath;
            }

            var nextCities = path.end.neighbours.filter(function (city) {
                return !path.nodes.includes(city);
            });

            if (nextCities.length === 0) return bestPath;
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = nextCities[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var city = _step5.value;

                    var newPath = path.copy().extend(city);
                    bestPath = this.__dfsSolver(newPath, bestPath);
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return bestPath;
        }
    }, {
        key: "makeMstTree",
        value: function makeMstTree() {
            var start = this.cities[0];
            var tree = [start.emptyCopy()]; // List of connected cities
            var reachable = start.neighbours.map(function (c) {
                return {
                    city: c,
                    from: tree[0],
                    dist: start.distTo[c.id]
                };
            });

            var _loop2 = function _loop2() {
                var _reachable;

                var nearest = reachable.reduce(function (acc, el) {
                    if (el.dist < acc.dist) return el;
                    return acc;
                }, reachable[0]);

                var newNode = nearest.city.emptyCopy();
                nearest.from.connect(newNode, nearest.dist);
                newNode.connect(nearest.from, nearest.dist);
                tree.push(newNode);

                reachable = reachable.filter(function (r) {
                    return r.city.id !== newNode.id;
                });
                var newReachables = nearest.city.neighbours.map(function (c) {
                    return {
                        city: c,
                        from: newNode,
                        dist: c.distTo[newNode.id]
                    };
                }).filter(function (r) {
                    return !tree.some(function (el) {
                        return el.id === r.city.id;
                    });
                });
                (_reachable = reachable).push.apply(_reachable, _toConsumableArray(newReachables));
            };

            while (tree.length !== this.cities.length) {
                _loop2();
            }

            this.mstTree = tree;
        }
    }, {
        key: "__mstSolver",
        value: function __mstSolver(path) {
            var _this = this;

            if (this.mstTree === undefined) this.makeMstTree();
            var currentCity = path.end;
            var currentId = currentCity.id;
            var nextCities = this.mstTree.find(function (city) {
                return city.id === currentId;
            }).neighbours.map(function (n) {
                return _this.cities[n.id];
            }).filter(function (n) {
                return !path.nodes.includes(n);
            });

            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = nextCities[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var city = _step6.value;

                    var nextPath = path.copy().extend(city);
                    nextPath = this.__mstSolver(nextPath);
                    path = nextPath.extend(currentCity);
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return path;
        }
    }, {
        key: "__greedySolver",
        value: function __greedySolver(path) {
            if (path.nodes.length === this.cities.length) {
                if (path.end.neighbours.includes(path.nodes[0])) {
                    return path.extend(path.nodes[0]);
                }
                return -1;
            }

            path.end.sortNeighbours();
            var nextCities = path.end.neighbours.filter(function (city) {
                return !path.nodes.includes(city);
            });

            if (nextCities.length === 0) return -1;
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = nextCities[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var city = _step7.value;

                    var newPath = path.copy().extend(city);
                    newPath = this.__greedySolver(newPath);
                    if (newPath !== -1) return newPath;
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            return -1;
        }
    }, {
        key: "salesmanSolver",
        value: function salesmanSolver(method) {
            var startCityId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            assert(0 <= startCityId < this.cities.length, "Provided startCityId is out of range");
            var start = this.cities[startCityId];
            var path = new Path(start);
            var solver = {
                'bfs': this.__bfsSolver,
                'dfs': this.__dfsSolver,
                'mst': this.__mstSolver,
                'greedy': this.__greedySolver
            }[method].bind(this);
            return solver(path);
        }
    }, {
        key: "mergePaths",
        value: function mergePaths(paths) {
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = paths.from1[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var path1 = _step8.value;
                    var _iteratorNormalCompletion9 = true;
                    var _didIteratorError9 = false;
                    var _iteratorError9 = undefined;

                    try {
                        for (var _iterator9 = paths.from2[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                            var path2 = _step9.value;

                            if (path1.end == path2.end) {
                                var _ret3 = function () {
                                    var path = path1.copy();
                                    path.nodes.pop();
                                    path2.nodes.reverse().forEach(function (n) {
                                        return path.extend(n);
                                    });
                                    return {
                                        v: path
                                    };
                                }();

                                if ((typeof _ret3 === "undefined" ? "undefined" : _typeof(_ret3)) === "object") return _ret3.v;
                            }
                        }
                    } catch (err) {
                        _didIteratorError9 = true;
                        _iteratorError9 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                _iterator9.return();
                            }
                        } finally {
                            if (_didIteratorError9) {
                                throw _iteratorError9;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }

            return -1;
        }
    }, {
        key: "findPath",
        value: function findPath(city1Id, city2Id) {
            var _this2 = this;

            var paths = {
                from1: [new Path(this.cities[city1Id])],
                from2: [new Path(this.cities[city2Id])]
            };
            var path = this.mergePaths(paths);
            while (path === -1) {
                var _loop3 = function _loop3(_ref) {
                    _ref2 = _slicedToArray(_ref, 2);
                    var key = _ref2[0];
                    var from = _ref2[1];

                    var newPaths = [];

                    var _loop4 = function _loop4(p) {
                        p.end.sortNeighbours();
                        var nextCities = p.end.neighbours.filter(function (n) {
                            return !p.nodes.includes(n);
                        });
                        nextCities.forEach(function (c) {
                            return newPaths.push(p.copy().extend(c));
                        });
                    };

                    var _iteratorNormalCompletion11 = true;
                    var _didIteratorError11 = false;
                    var _iteratorError11 = undefined;

                    try {
                        for (var _iterator11 = from[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                            var p = _step11.value;

                            _loop4(p);
                        }
                    } catch (err) {
                        _didIteratorError11 = true;
                        _iteratorError11 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion11 && _iterator11.return) {
                                _iterator11.return();
                            }
                        } finally {
                            if (_didIteratorError11) {
                                throw _iteratorError11;
                            }
                        }
                    }

                    paths[key] = newPaths;
                    path = _this2.mergePaths(paths);
                    if (path !== -1) return "break";
                };

                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                    for (var _iterator10 = Object.entries(paths)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                        var _ref = _step10.value;

                        var _ref2;

                        var _ret4 = _loop3(_ref);

                        if (_ret4 === "break") break;
                    }
                } catch (err) {
                    _didIteratorError10 = true;
                    _iteratorError10 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
                            _iterator10.return();
                        }
                    } finally {
                        if (_didIteratorError10) {
                            throw _iteratorError10;
                        }
                    }
                }
            }
            return path;
        }
    }, {
        key: "findPathDikstra",
        value: function findPathDikstra(city1Id, city2Id) {
            var processed1 = [];
            var processed2 = [];
            var unprocessed1 = [].concat(_toConsumableArray(this.cities));
            var unprocessed2 = [].concat(_toConsumableArray(this.cities));

            var path1To = {};
            var path2To = {};
            this.cities.forEach(function (c) {
                path1To[c.id] = -1;
                path2To[c.id] = -1;
            });
            path1To[city1Id] = new Path(this.cities[city1Id]);
            path2To[city2Id] = new Path(this.cities[city2Id]);

            var popNearesetUnprocessed = function popNearesetUnprocessed(unprocessed, pathTo) {
                var nearest = unprocessed[0];
                var _iteratorNormalCompletion12 = true;
                var _didIteratorError12 = false;
                var _iteratorError12 = undefined;

                try {
                    for (var _iterator12 = unprocessed.slice(1)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                        var city = _step12.value;

                        if (pathTo[city.id] === -1) continue;
                        if (pathTo[nearest.id] === -1) nearest = city;else if (pathTo[city.id].dist < pathTo[nearest.id].dist) {
                            nearest = city;
                        }
                    }
                } catch (err) {
                    _didIteratorError12 = true;
                    _iteratorError12 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion12 && _iterator12.return) {
                            _iterator12.return();
                        }
                    } finally {
                        if (_didIteratorError12) {
                            throw _iteratorError12;
                        }
                    }
                }

                var id = unprocessed.indexOf(nearest);
                unprocessed.splice(id, 1);
                return nearest;
            };

            var updateDist = function updateDist(pathTo, city, neighbour, startCityId) {
                if (neighbour.id === startCityId) {
                    return;
                }
                var newPath = pathTo[city.id].copy().extend(neighbour);
                if (pathTo[neighbour.id] === -1) pathTo[neighbour.id] = newPath;else pathTo[neighbour.id] = chooseBetterPath(newPath, pathTo[neighbour.id]);
            };

            var bestPath = -1;
            while (unprocessed1.length !== 0 || unprocessed2.length !== 0) {
                var nearest1 = popNearesetUnprocessed(unprocessed1, path1To);
                var nearest2 = popNearesetUnprocessed(unprocessed2, path2To);
                processed1.push(nearest1);
                processed2.push(nearest2);

                if (bestPath !== -1 && bestPath.dist <= path1To[nearest1.id].dist + path2To[nearest2.id].dist) {
                    break;
                }

                var _iteratorNormalCompletion13 = true;
                var _didIteratorError13 = false;
                var _iteratorError13 = undefined;

                try {
                    for (var _iterator13 = nearest1.neighbours[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                        var n = _step13.value;

                        updateDist(path1To, nearest1, n, city1Id);
                        if (processed2.includes(n)) {
                            var p1 = path1To[n.id];
                            var p2 = path2To[n.id];
                            if (path1To[n.id].dist + path2To[n.id].dist < bestPath.dist || bestPath === -1) bestPath = p1.merge(p2);
                        }
                    }
                } catch (err) {
                    _didIteratorError13 = true;
                    _iteratorError13 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion13 && _iterator13.return) {
                            _iterator13.return();
                        }
                    } finally {
                        if (_didIteratorError13) {
                            throw _iteratorError13;
                        }
                    }
                }

                var _iteratorNormalCompletion14 = true;
                var _didIteratorError14 = false;
                var _iteratorError14 = undefined;

                try {
                    for (var _iterator14 = nearest2.neighbours[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                        var _n = _step14.value;

                        updateDist(path2To, nearest2, _n, city2Id);
                        if (processed1.includes(_n)) {
                            var _p = path1To[_n.id];
                            var _p2 = path2To[_n.id];
                            if (path1To[_n.id].dist + path2To[_n.id].dist < bestPath.dist || bestPath === -1) bestPath = _p.merge(_p2);
                        }
                    }
                } catch (err) {
                    _didIteratorError14 = true;
                    _iteratorError14 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion14 && _iterator14.return) {
                            _iterator14.return();
                        }
                    } finally {
                        if (_didIteratorError14) {
                            throw _iteratorError14;
                        }
                    }
                }
            }

            return bestPath;
        }
    }]);

    return World;
}();

function testSalesman() {
    var HOW_MANY_CITIES = 300;
    var FRACTION_OF_ROADS = 0.8; // 0.8 = 80% of all roads
    var t = void 0;
    t = Date.now();
    var world = new World(HOW_MANY_CITIES, FRACTION_OF_ROADS);
    console.log("Cities created, distances calculated in " + (Date.now() - t) / 1000 + "s");

    var paths = [];
    var _arr = ['bfs', 'dfs', 'mst', 'greedy'];
    for (var _i = 0; _i < _arr.length; _i++) {
        var method = _arr[_i];
        console.log();
        t = Date.now();
        var path = world.salesmanSolver(method);
        paths.push(path);
        console.log(method + ": path found in " + (Date.now() - t) / 1000 + "s");
        console.log("Distance: " + path.dist);
    }
}

function testBidirectSearch() {
    var HOW_MANY_CITIES = 300;
    var FRACTION_OF_ROADS = 0.2; // 0.8 = 80% of all roads
    var t = void 0;
    t = Date.now();
    var world = new World(HOW_MANY_CITIES, FRACTION_OF_ROADS);
    console.log("Cities created, distances calculated in " + (Date.now() - t) / 1000 + "s");

    var paths = [];
    for (var i = 0; i < 10; i++) {
        var city1Id = Math.floor(HOW_MANY_CITIES * Math.random());
        var city2Id = Math.floor(HOW_MANY_CITIES * Math.random());
        console.log();
        t = Date.now();
        var path = world.findPathDikstra(city1Id, city2Id);
        console.log("Path between " + city1Id + " and " + city2Id + " found in " + (Date.now() - t) / 1000 + "s");
        console.log("Distance: " + path.dist + "; Nodes: " + path.nodes.length);
        paths.push(path);
    }
    console.log("");
}

// Functions below can be used either in node.js or in the browser
// testSalesman()
// testBidirectSearch()