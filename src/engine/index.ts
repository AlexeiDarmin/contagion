import * as Models from '../models'
import * as Constants from '../constants'

export interface EngineOptions {
    unitQty: number
    unitSize: number
}

export class Engine {
    units: Models.Node[]

    constructor({ unitQty, unitSize }: EngineOptions) {
        this.units = []

        for (let i = 0; i < unitQty; i++) {
            const unit = createUnit(this.units, unitSize)

            this.units.push(unit)
        }
    }

    update(canvas: HTMLCanvasElement) {
        console.log(canvas)
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

        if (!ctx) {
            throw 'expected canvas ctx to exist by now'
        }

        ctx.fillStyle = "#fff5f5";
        ctx.fillRect(0, 0, Constants.FIELD_WIDTH, Constants.FIELD_HEIGHT);

        ctx.lineWidth = 0.5;
        for (let i = 0; i < this.units.length; i++) {
            const { x, y, size } = this.units[i]
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.arc((x + size / 2), (y + size / 2), size, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }
}



/**
* Creates a new unit with whose (x, y) position does not collide with any other unit from units.
* @param units list of units
* @param unitSize the size of the unit to be created
* @returns an instance of a unit
*/
export const createUnit = (units: Models.Node[], unitSize: number): Models.Node => {
    const unit = new Models.Node(0, 0, unitSize)

    console.log('nums')
    let x = genRandomNumber(0, Constants.FIELD_WIDTH - unitSize)
    let y = genRandomNumber(0, Constants.FIELD_HEIGHT - unitSize)

    let laps = 0
    while (true) {
        unit.x = x
        unit.y = y

        let collisionFree = true
        for (let i = 0; i < units.length; i++) {
            const unitB = units[i]

            if (collides(unit, unitB)) {
                collisionFree = false
                break
            }
        }

        if (collisionFree) {
            console.log(unit.x, unit.y)
            return unit
        }

        // TODO: Find a cleaner way to shift colliding units.
        x += unitSize
        console.log(x)
        if (x + unitSize >= Constants.FIELD_WIDTH) {
            console.log('x lap!')
            x = 0
            y += unitSize
            if (y >= Constants.FIELD_HEIGHT) {
                console.log('y lap!')
                if (laps == 1) {
                    throw 'after scanning the entire field, no position available to insert next unit'
                }
                y = 0
                laps += 1
            }
        }
    }
}

/**
* Checks if two units collide. Returns true if they do, false otherwise.
* @param unitA a unit
* @param unitB a unit
* @returns an instance of a unit
*/
export const collides = (unitA: Models.Node, unitB: Models.Node) => {
    if (!unitA || !unitB) {
        throw 'collides() expects two units to compare, received one or less'
    }

    const size = unitA.size

    return Math.abs(unitA.x - unitB.x) <= size && Math.abs(unitA.y - unitB.y) <= size
}




/**
* Generates a random number within the provided bounds of min and max.
* @param min the inclusive lower bound
* @param max the exclusive upper bound
* @returns models.Node
*/
export const genRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Problems to solve:
    1 - generate sudo-random starting positions for objects effectively
    2 - make it impossible for simulation to crash (limit object creation)
    3 - find collisions efficiently
    4 - calculate new travel vectors
 * **/
