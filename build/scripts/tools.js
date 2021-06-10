'use strict';

function assert(cond, warn="") {
    if (!cond) {
        throw Error(warn)
    }
}

function range(x) {
    return [...Array(x).keys()]
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