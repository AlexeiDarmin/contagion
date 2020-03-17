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

        // Set line width
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.arc(5, 75, Constants.UNIT_SIZE, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

/**
* Creates a new unit with whose (x, y) position does not collide with any other unit from units.
* @param units list of units
* @param unitSize the size of the unit to be created
* @returns an instance of a unit
*/
export function createUnit(units: Models.Node[], unitSize: number): Models.Node {
    const unit = new Models.Node(0, 0, unitSize)

    let count = 0
    while (count < 100) {
        count += 1

        const x = genRandomNumber(0, Constants.FIELD_WIDTH - unitSize)
        const y = genRandomNumber(0, Constants.FIELD_HEIGHT - unitSize)

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
            return unit
        }
    }

    throw 'failed to create a unit'
}

/**
* Checks if two units collide. Returns true if they do, false otherwise.
* @param unitA a unit
* @param unitB a unit
* @returns an instance of a unit
*/
export function collides(unitA: Models.Node, unitB: Models.Node): boolean {
    if (!unitA || !unitB) {
        throw 'collides() expects two units to compare, received one or less'
    }

    const size = unitA.size

    // Swaps units for fewer comparisons
    if (unitA.x > unitB.x) {
        const temp = unitA
        unitA = unitB
        unitB = unitA
    }

    if ((unitB.x > unitA.x && unitB.x < unitA.x + size) &&
        ((unitB.y > unitA.y && unitB.y < unitA.y + size) || (
            unitB.y < unitA.y && unitB.y + size > unitA.y
        ))) {
        return true
    }

    return false
}




/**
* Generates a random number within the provided bounds of min and max.
* @param min the inclusive lower bound
* @param max the exclusive upper bound
* @returns models.Node
*/
export const genRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min;
}


/**
 * Problems to solve:
    1 - generate sudo-random starting positions for objects effectively
    2 - make it impossible for simulation to crash (limit object creation)
    3 - find collisions efficiently
    4 - calculate new travel vectors
 * **/
