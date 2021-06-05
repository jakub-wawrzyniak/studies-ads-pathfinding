'use strict';

const CANVAS_SIZE = 500 // dont touch this
const CITY_RAD = 5
const HOW_MANY_CITIES = 10
const FRACTION_OF_ROADS = 1 // 0.8 = 80% of all roads
const SOLVER_MODE = "salesman" // bidirect, salesman
const SOLVER_METHOD = "dfs" // bfs, dfs, mst, greedy
// ^ matters only if SOLVER_MODE is "salesman"

function translateCoor(coor) {
    const off = 100 + CITY_RAD
    return (coor+off)*(CANVAS_SIZE/(off*2))
}

function drawCities(ctx, world) {
    ctx.fillStyle = "#000"
    for (let city of world.cities) {
        const circle = new Path2D()
        const x = translateCoor(city.x)
        const y = translateCoor(city.y)
        circle.arc(x, y, CITY_RAD, 0, 2 * Math.PI, 0)
        ctx.fill(circle)
    }
}

function drawRoads(ctx, world) {
    ctx.strokeStyle = "#bbb"
    for (let pair of world.roads) {
        const [city1, city2] = pair
        const coors = [
            translateCoor(city1.x),
            translateCoor(city1.y),
            translateCoor(city2.x),
            translateCoor(city2.y),
        ]
        ctx.beginPath()
        ctx.moveTo(coors[0], coors[1])
        ctx.lineTo(coors[2], coors[3])
        ctx.stroke()
    }
}

function drawPath(ctx, path) {
    ctx.strokeStyle = "#0056F5"
    ctx.beginPath()
    ctx.moveTo(
        translateCoor(path.nodes[0].x),
        translateCoor(path.nodes[0].y),
    )
    for (let node of path.nodes.slice(1)) {
        ctx.lineTo(
            translateCoor(node.x),
            translateCoor(node.y),
        )
    }
    ctx.stroke()
}

function printInfo(path, world) {
    document.getElementById('no-cities').innerText = world.cities.length
    document.getElementById('no-roads').innerText = world.roads.length
    document.getElementById('%-roads').innerText = `${FRACTION_OF_ROADS*100}%`
    if (SOLVER_MODE === "bidirect")
        document.getElementById('method').innerText = "bidirect dikstra"
    else document.getElementById('method').innerText = SOLVER_METHOD
    document.getElementById('len').innerText = Math.ceil(path.dist)
    document.getElementById('nodes').innerText = path.nodes.length
}

function run() {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext('2d')
    const world = new World(HOW_MANY_CITIES, FRACTION_OF_ROADS)

    const path = SOLVER_MODE === "bidirect"
        ? world.findPathDikstra(0, 5)
        : world.salesmanSolver(SOLVER_METHOD)

    drawRoads(ctx, world)
    drawPath(ctx, path)
    drawCities(ctx, world)
    printInfo(path, world)
}
