'use strict';

function assert(cond, warn="") {
    if (!cond) {
        throw Error(warn)
    }
}

function range(x) {
    return [...Array(x).keys()]
}

function getRandCoor() {
    let c = Math.random()*200 - 100
    c = Math.floor(c)
    assert(-100 <= c <= 100)
    return c
}

function newton(arr) {
    // Returns unique pairs of
    // elements of a given array
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

    merge(path) {
        const merged = this.copy()
        merged.dist += path.dist
        merged.nodes.pop()
        merged.nodes.push(...path.copy().nodes.reverse());
        return merged
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
        this.roads = getRandArr(pairs, noOfRoads)

        for (let pair of this.roads) {
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
        const currentCity = path.end
        const currentId = currentCity.id
        const nextCities = this.mstTree
            .find(city => city.id === currentId)
            .neighbours.map(n => this.cities[n.id])
            .filter(n => !path.nodes.includes(n))

        for (let city of nextCities) {
            let nextPath = path.copy().extend(city)
            nextPath = this.__mstSolver(nextPath)
            path = nextPath.extend(currentCity)
        }
        return path
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

    salesmanSolver(method, startCityId=0) {
        assert(0 <= startCityId < this.cities.length,
            "Provided startCityId is out of range")
        const start = this.cities[startCityId]
        const path = new Path(start)
        const solver = {
            'bfs': this.__bfsSolver,
            'dfs': this.__dfsSolver,
            'mst': this.__mstSolver,
            'greedy': this.__greedySolver,
        }[method].bind(this)
        return solver(path)
    }

    mergePaths(paths) {
        for (let path1 of paths.from1) {
            for (let path2 of paths.from2) {
                if (path1.end == path2.end) {
                    const path = path1.copy()
                    path.nodes.pop()
                    path2.nodes.reverse().forEach(
                        n => path.extend(n))
                    return path
        }}}
        return -1
    }

    findPath(city1Id, city2Id) {
        const paths = {
            from1: [new Path(this.cities[city1Id])],
            from2: [new Path(this.cities[city2Id])]
        }
        let path = this.mergePaths(paths);
        while (path === -1) {
            for (let [key, from] of Object.entries(paths)) {
                const newPaths = []
                for (let p of from) {
                    p.end.sortNeighbours()
                    const nextCities = p.end.neighbours.filter(
                        n => !p.nodes.includes(n))
                    nextCities.forEach(
                        c => newPaths.push(p.copy().extend(c)))
                }
                // from = newPaths
                paths[key] = newPaths
                path = this.mergePaths(paths)
                if (path !== -1) break
            }
        }
        return path
    }

    findPathDikstra(city1Id, city2Id) {
        const processed1 = []
        const processed2 = []
        const unprocessed1 = [...this.cities]
        const unprocessed2 = [...this.cities]

        const path1To = {}
        const path2To = {}
        this.cities.forEach(c => {
            path1To[c.id] = -1
            path2To[c.id] = -1
        })
        path1To[city1Id] = new Path(this.cities[city1Id])
        path2To[city2Id] = new Path(this.cities[city2Id])

        const popNearesetUnprocessed = (unprocessed, pathTo) => {
            let nearest = unprocessed[0]
            for (let city of unprocessed.slice(1)) {
                if (pathTo[city.id] === -1) continue
                if (pathTo[nearest.id] === -1) nearest = city
                else if (pathTo[city.id].dist < pathTo[nearest.id].dist) {
                    nearest = city
                }
            }
            const id = unprocessed.indexOf(nearest)
            unprocessed.splice(id, 1)
            return nearest;
        }

        const updateDist = (pathTo, city, neighbour, startCityId) => {
            if (neighbour.id === startCityId) {return}
            assert(pathTo[city.id].nodes[0].id === startCityId)
            assert(pathTo[city.id].end.id == city.id)
            const newPath = pathTo[city.id].copy().extend(neighbour)
            if (pathTo[neighbour.id] === -1) pathTo[neighbour.id] = newPath
            else pathTo[neighbour.id] = chooseBetterPath(newPath, pathTo[neighbour.id])
            assert(pathTo[neighbour.id].nodes[0].id === startCityId)
            assert(pathTo[neighbour.id] !== -1)
            assert(pathTo[neighbour.id].end.id === neighbour.id)
        }

        let bestPath = -1
        while(unprocessed1.length !== 0 || unprocessed2.length !== 0) {
            const nearest1 = popNearesetUnprocessed(unprocessed1, path1To)
            const nearest2 = popNearesetUnprocessed(unprocessed2, path2To)
            assert(nearest1 !== undefined)
            assert(nearest2 !== undefined)
            processed1.push(nearest1)
            processed2.push(nearest2)

            if (bestPath !== -1 && bestPath.dist <= path1To[nearest1.id].dist + path2To[nearest2.id].dist) {
                break
            }

            for (let n of nearest1.neighbours) {
                updateDist(path1To, nearest1, n, city1Id)
                if (processed2.includes(n)) {
                    const p1 = path1To[n.id]
                    const p2 = path2To[n.id]
                    if (path1To[n.id].dist + path2To[n.id].dist < bestPath.dist
                        || bestPath === -1) bestPath = p1.merge(p2)
                    }
                }
            for (let n of nearest2.neighbours) {
                updateDist(path2To, nearest2, n, city2Id)
                if (processed1.includes(n)) {
                    const p1 = path1To[n.id]
                    const p2 = path2To[n.id]
                    if (path1To[n.id].dist + path2To[n.id].dist < bestPath.dist
                        || bestPath === -1) bestPath = p1.merge(p2)
                }
            }
        }

        return bestPath
    }
}

function testSalesman() {
    const HOW_MANY_CITIES = 300
    const FRACTION_OF_ROADS = 0.8 // 0.8 = 80% of all roads
    let t;
    t = Date.now()
    const world = new World(HOW_MANY_CITIES, FRACTION_OF_ROADS)
    console.log(`Cities created, distances calculated in ${(Date.now()-t)/1000}s`)
    
    const paths=[]
    for (let method of ['bfs', 'dfs', 'mst', 'greedy']) {
        console.log()
        t = Date.now()
        let path = world.salesmanSolver(method)
        paths.push(path)
        console.log(`${method}: path found in ${(Date.now()-t)/1000}s`)
        console.log(`Distance: ${path.dist}`)
    }
}

function testBidirectSearch() {
    const HOW_MANY_CITIES = 300
    const FRACTION_OF_ROADS = 0.2 // 0.8 = 80% of all roads
    let t;
    t = Date.now()
    const world = new World(HOW_MANY_CITIES, FRACTION_OF_ROADS)
    console.log(`Cities created, distances calculated in ${(Date.now()-t)/1000}s`)
    
    const paths = []
    for (let i = 0; i < 1; i++) {
        const city1Id = Math.floor(HOW_MANY_CITIES*Math.random())
        const city2Id = Math.floor(HOW_MANY_CITIES*Math.random())
        console.log()
        t = Date.now()
        let path = world.findPathDikstra(city1Id, city2Id)
        console.log(`Path between ${city1Id} and ${city2Id} found in ${(Date.now()-t)/1000}s`)
        console.log(`Distance: ${path.dist}; Nodes: ${path.nodes.length}`)
        paths.push(path)
    }
    console.log("")
}

// testSalesman()
testBidirectSearch()