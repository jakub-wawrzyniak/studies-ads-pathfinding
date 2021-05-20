'use strict';

const HOW_MANY_CITIES = 4
const HOW_MANY_ROADS = 1 // 0.8 = 80% of all roads
function assert(cond) {
    if (!cond) {
        throw Error
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

class City {
    constructor(id, neighbours) {
        this.id = id
        this.neighbours = neighbours // array of ids, not objects
        //Potencjalny bug: koordynaty mogą się powtarzać
        this.x = getRandCoor()
        this.y = getRandCoor()
    }
}

function getDist(city1, city2) {
    assert(city1.neighbours.includes(city2.id))
    const dx = city1.x - city2.x
    const dy = city1.y - city2.y
    const dist = (dx**2 + dy**2)**0.5
    // assert(dist != 0)
    return dist
}

function getNeighbours(ids, thisId) {
    const howMany = Math.floor(HOW_MANY_CITIES*HOW_MANY_ROADS)
    if (howMany === ids.length) return ids.filter(id => id !== thisId);
    assert(howMany < ids.length)
    
    const out = []
    while (out.length < howMany) {
        const randId = Math.floor(Math.random() * ids.length)
        if (out.includes(randId)) continue;
        out.push(randId);
    }
    
    if (out.includes(thisId)) {
        const pos = out.indexOf(thisId)
        out.splice(pos, 1)
    }
    return out
}

function getCities() {
    const ids = range(HOW_MANY_CITIES)
    const cities = [];
    for (let id of ids) {
        const neighbours = getNeighbours(ids, id)
        const city = new City(id, neighbours)
        cities.push(city)
    }
    return cities
}

function chooseBetterPath(path1, path2) {
    // Only path2 can be undefined
    if (!path2) return path1;
    if (path2.dist > path1.dist) return path1;
    return path2;
}


//Optymalizacja: najpierw policz wszystkie drogi
function salesmanDFS(cities, path={nodes: [cities[0]], dist: 0}, bestPath=undefined) {
    if (cities.length === path.nodes.length)
        return chooseBetterPath(path, bestPath);

    const thisCity = path.nodes[path.nodes.length-1]
    const nextCities = thisCity.neighbours.filter(id => !path.nodes.includes(cities[id]))
    assert(nextCities)
    for (let cityId of nextCities) {
        const city = cities[cityId]
        // Potencjalne przyspieszenie: jeśli widzisz, że droga jest już dłuższa od bestPath,
        // to szukaj dalej
        const newPath = {}
        newPath.nodes = [...path.nodes, city]
        newPath.dist = path.dist + getDist(thisCity, city)
        bestPath = salesmanDFS(cities, newPath, bestPath)
    }
    return bestPath
}

function permutations(arr) {
    assert(arr.length > 0)
    if (arr.length == 1) return [[...arr]]; //Worthless ...?
    // if (arr.length == 2) return [
    //     [...arr],
    //     [...arr.reverse()] //Worthless ...?
    // ]

    const out = []
    for (let el of arr) {
        const rest = permutations(
            arr.filter(e => e !== el)
        )

        const perm = rest.map(p => [el, ...p])
        out.push(
            ...rest.map( perm => [el, ...perm])
        )
    }
    return out
}

function getFullDist(cities) {
    if (cities.length == 2) return getDist(...cities)
    const first = cities.shift()
    const dist = getDist(first, cities[0])
    return dist + getFullDist(cities)
}

function salesmanBFS(cities) {
    // const paths = []
    // for (let cityId of cities[0].neighbours) {
    //     const city = cities[cityId]
    //     const path = {nodes: [cities[0], city]}
    //     path.dist = getDist(cities[0], city)
    //     paths.push(path)
    // }

    // while (paths.every(e => e.length === cities.length))
    const perms = permutations(cities)
    const paths = perms.map(perm => { return {
        nodes: perm,
        dist: getFullDist(perm)
    }})
}

function main() {
    const cities = getCities()
    const t = Date.now()
    const path = salesmanDFS(cities)
    // console.log(cities)
    console.log(path)
    const t0 = Date.now()
    console.log(`Computed in ${(t0-t)/1000}s`)
}

// main()
// console.log(permutations([1, 2, 3]))
// console.log(permutations([1, 2]))
// const perms = permutations(getCities())
// perms.forEach( p => {
//     console.log(getFullDist(p))
// })

console.log(getFullDist(getCities()))