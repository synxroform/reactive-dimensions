import {zeros, randomInt} from "mathjs"

// this is just a set of rectangular indices
//
function make_field(w, h) {
    let field = new Map()
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            let index = [x, y]
            field.add(JSON.toString(index), index)
        }
    }
    return field
}

// this is fastest way to sample map (faster than iteration)
//
function pop_random_entry(map) {
    let index = randomInt(0, map.size)
    let entry = [...map.entries()][index]
    map.delete(entry[0])
    return entry
}

function  pop_random_heighbor(from, node, id) {

}

// helper function to store objects by their representation
//
function push_entry(map, entry) {
    map.set(entry[0], entry[1])
}


// create partition of the grid(WxH) with size of each cluster (pmax)
//
export function partition(w, h, pmax) {
    let nodes = zeros(w, h)
    let edges = zeros(w + 1, h + 1)
    let field = make_field(w, h)


    for (let id = 0; field.size > 0; id++) {
        let block = new Map()
        push_entry(block, pop_random_entry(field))

        for (let n = 0; n < pmax; n++) {
            let node = pop_random_entry(block)
            let ngbr = pop_random_neighbor(field, node, id)
            // to do

        }
    }
}
