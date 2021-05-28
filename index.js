import { World } from "./pathFinding.js"

const SIZE = 500
const SIZE_FACTOR = 5
const HOW_MANY_CITIES = 10
const FRACTION_OF_ROADS = 1

function drawCities(ctx, world) {

}

function drawRoads(ctx, world) {

}

function drawPath(ctx, path) {
    
}

function run() {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext('2d')
    const world = new World(HOW_MANY_CITIES, FRACTION_OF_ROADS)
    console.log(world.cities)
    
}

export { run }