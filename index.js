'use strict';

const HOW_MANY_CITIES = 4
const FRACTION_OF_ROADS = 1 // 0.8 = 80% of all roads
function assert(cond, warn="") {
    if (!cond) {
        throw Error(warn)
    }
}

// TODO: Wyczyść to
function range(x) {
    let out = []
    for (let i = 0; i < x; i++) {
        out.push(i)
    }
    return out
}

function getRandCoor() {
    let c = Math.random()*200 - 100
    c = Math.floor(c)
    assert(-100 <= c <= 100)
    return c
}

function newton(arr) {
    assert(arr.length >= 2)
    const out = []
    for (let id1 = 0; id1 < arr.length-1; id1++) {
        for (let id2 = id1+1; id2 < arr.length; id2++) {
            out.push([
                arr[id1], arr[id2]
            ])
        }
    }
    return out
}

function getRandArr(arr, count) {
    // Randomly chooses specified no
    // of elements from a given array
    const out = arr
    while(out.length > count) {
        const id = Math.floor(Math.random() * out.length)
        out.splice(id, 1)
    }
    return out
}

class City {
    constructor(id) {
        this.id = id
        this.distTo = {} // {city.id: dist}
        this.neighbours = [] // [city1, city2, ...]
        //Potencjalny bug: koordynaty mogą się powtarzać
        this.x = getRandCoor()
        this.y = getRandCoor()
    }

    // distTo(city) {
    //     return this.distances[city.id]
    // }

    // get neighbours() {
    //     return Object.keys(this.distTo)
    // }

    connect(city, dist) {
        this.neighbours.push(city)
        this.distTo[city.id] = dist
    }
}

function getDist(city1, city2) {
    const dx = city1.x - city2.x
    const dy = city1.y - city2.y
    const dist = (dx**2 + dy**2)**0.5
    return dist
}


class Path {
    constructor(start) {
        this.nodes = [start] // Array of City objects
        this.dist = 0
    }

    get end() {
        return this.nodes[this.nodes.length-1]
    }

    extend(city) {
        assert(this.end.neighbours.includes(city))
        this.dist += this.end.distTo[city.id]
        this.nodes.push(city)
    }

    copy() {
        const copy = new Path()
        copy.nodes = [...this.nodes]
        copy.dist = this.dist
        return copy
    }
}

function chooseBetterPath(path1, path2) {
    // Only path2 can be undefined
    if (!path2) return path1;
    if (path2.dist > path1.dist) return path1;
    return path2;
}

class World {
    constructor(howManyCities, fractionOfRoads) {
        this.cities = range(howManyCities).map(id => new City(id))

        const pairs = newton(this.cities)
        const noOfRoads = Math.ceil(fractionOfRoads * pairs.length)
        const pairsToConnect = getRandArr(pairs, noOfRoads)
        // TODO: Check connection validity

        for (let pair of pairsToConnect) {
            const [city1, city2] = pair;
            const dist = getDist(city1, city2)
            city1.connect(city2, dist)
            city2.connect(city1, dist)
        }
    }

    __bfsSolver(path){}
    
    __dfsSolver(path, bestPath=undefined){
        if (path.nodes.length === this.cities.length) {
            if (path.end.neighbours.includes(this.cities[0])) {
                path.extend(this.cities[0])
                return chooseBetterPath(path, bestPath)
            }
            return bestPath
        }

        const nextCities = path.end.neighbours.filter(
            city => !path.nodes.includes(city)
        )

        for (let city of nextCities) {
            const newPath = path.copy()
            newPath.extend(city)
            bestPath = this.__dfsSolver(newPath, bestPath)
        }

        return bestPath
    }
    __greedySolver(path){}

    salesmanSolver(method) {
        const path = new Path(this.cities[0])
        const solver = {
            'bfs': this.__bfsSolver,
            'dfs': this.__dfsSolver,
            'greedy': this.__greedySolver
        }[method].bind(this)
        return solver(path)
    }
}

function main() {
    let t;
    t = Date.now()
    const world = new World(HOW_MANY_CITIES, FRACTION_OF_ROADS)
    console.log(`Cities created, distances calculated in ${(Date.now()-t)/1000}s`)
    
    t = Date.now()
    const path = world.salesmanSolver('dfs')
    console.log(`Path found in ${(Date.now()-t)/1000}s`)
    
    // console.log(path)
}

main()