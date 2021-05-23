'use strict';

const HOW_MANY_CITIES = 6
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
        this.areNeighboursSorted = false
        //Potencjalny bug: koordynaty mogą się powtarzać
        this.x = getRandCoor()
        this.y = getRandCoor()
    }

    connect(city, dist) {
        this.neighbours.push(city)
        this.distTo[city.id] = dist
    }
    
    emptyCopy() {
        const copy = new City(this.id)
        copy.x = this.x
        copy.y = this.y
        return copy
    }

    sortNeighbours() {
        if (!this.areNeighboursSorted) {
            function compFn (c1, c2) {
                return this.distTo[c1.id] - this.distTo[c2.id]
            }
            this.neighbours.sort(compFn.bind(this))
            this.areNeighboursSorted = true
        }
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
        return this
    }

    copy() {
        const copy = new Path()
        copy.nodes = [...this.nodes]
        copy.dist = this.dist
        return copy
    }
}

function chooseBetterPath(path1, path2) {
    if (!path2) return path1;
    if (path2.dist > path1.dist) return path1;
    return path2;
}

class World {
    constructor(howManyCities, fractionOfRoads) {
        this.mstTree = undefined
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

    __bfsSolver(path){
        let paths = path.end.neighbours.map(n =>
            path.copy().extend(n))

        while(paths[0].nodes.length !== this.cities.length) {
            const newPaths = []
            for (let path of paths) {
                const nextCities = path.end.neighbours.filter(
                    city => !path.nodes.includes(city))
                for (let city of nextCities) {
                    newPaths.push(path.copy().extend(city))
                }
            }
            paths = newPaths
        }

        let bestPath = undefined;
        const startCity = path.nodes[0]
        for (let path of paths) {
            if (path.end.neighbours.includes(startCity)) {
                path.extend(startCity)
                bestPath = chooseBetterPath(path, bestPath)
            }
        }

        return bestPath
    }

    __dfsSolver(path, bestPath=undefined){
        if (path.nodes.length === this.cities.length) {
            if (path.end.neighbours.includes(path.nodes[0])) {
                path.extend(path.nodes[0])
                return chooseBetterPath(path, bestPath)
            }
            return bestPath
        }

        const nextCities = path.end.neighbours.filter(
            city => !path.nodes.includes(city))

        if (nextCities.length === 0) return bestPath
        for (let city of nextCities) {
            const newPath = path.copy().extend(city)
            bestPath = this.__dfsSolver(newPath, bestPath)
        }

        return bestPath
    }

    makeMstTree() {
        const start = this.cities[0]
        const tree = [start.emptyCopy()] // List of connected cities
        let reachable = start.neighbours.map(c => { return {
            city: c,
            from: tree[0],
            dist: start.distTo[c.id]
        }})

        while (tree.length !== this.cities.length) {
            const nearest = reachable.reduce((acc, el) => {
                if (el.dist < acc.dist) return el
                return acc
            }, reachable[0])

            const newNode = nearest.city.emptyCopy()
            nearest.from.connect(newNode, nearest.dist)
            newNode.connect(nearest.from, nearest.dist)
            tree.push(newNode)

            reachable = reachable.filter(r => r.city.id !== newNode.id)
            const newReachables = nearest.city.neighbours.map(c => {
                return {
                    city: c,
                    from: newNode,
                    dist: c.distTo[newNode.id]
                }
            }).filter(r => !tree.some(el => el.id === r.city.id))
            reachable.push(...newReachables)
        }

        this.mstTree = tree
    }

    __mstSolver(path) {
        if (this.mstTree === undefined) this.makeMstTree();
        const id = path.nodes[0].id
        const start = this.mstTree.find(city => city.id === id)
        path = new Path(start)
        return this.__dfsSolver(path)
    }

    __greedySolver(path) {
        if (path.nodes.length === this.cities.length) {
            if (path.end.neighbours.includes(path.nodes[0])) {
                return path.extend(path.nodes[0])
            }
            return -1
        }

        path.end.sortNeighbours()
        const nextCities = path.end.neighbours.filter(
            city => !path.nodes.includes(city)
        )

        if (nextCities.length === 0) return -1
        for (let city of nextCities) {
            let newPath = path.copy().extend(city)
            newPath = this.__greedySolver(newPath)
            if (newPath !== -1) return newPath
        }

        return -1
    }

    salesmanSolver(method) {
        const path = new Path(this.cities[0])
        const solver = {
            'bfs': this.__bfsSolver,
            'dfs': this.__dfsSolver,
            'mst': this.__mstSolver,
            'greedy': this.__greedySolver,
        }[method].bind(this)
        return solver(path)
    }
}

function main() {
    let t;
    t = Date.now()
    const world = new World(HOW_MANY_CITIES, FRACTION_OF_ROADS)
    console.log(`Cities created, distances calculated in ${(Date.now()-t)/1000}s`)
    
    for (let method of ['bfs', 'dfs', 'mst', 'greedy']) {
        console.log()
        t = Date.now()
        let path = world.salesmanSolver(method)
        console.log(`${method}: path found in ${(Date.now()-t)/1000}s`)
        console.log(`Distance: ${path.dist}`)
    }
    // let path = new Path(world.cities[0])
    // let out = world.__mstSolver(path)
    // console.log(out)
}

main()