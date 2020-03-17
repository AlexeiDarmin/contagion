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
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

        if (!ctx) {
            throw 'expected canvas ctx to exist by now'
        }

        this.units = updateUnits(this.units)

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
* Moves each unit and updates their direction vectors based on collisions.
* @param unit a unit
* @param units units
* @returns an instance of a unit
*/
export const updateUnits = (units: Models.Node[]) => {
    const nextUnits = []

    while (units.length > 0) {
        const unitA = units.pop()

        if (!unitA) {
            continue
        }

        let collided = false
        unitA.move()
        for (let i = 0; i < units.length; i++){
            const unitB = units[i]
            if (!unitB){
                continue
            }
            unitB.move()
            if (collides(unitA, unitB)) {
                unitA.vx *= -1
                unitA.vy *= -1
                unitB.vx *= -1
                unitB.vy *= -1
                nextUnits.push(unitA)
                nextUnits.push(unitB)
                collided = true
                delete units[i]
                break
            } else {
                unitB.undoMove()
            }
        }

        if (!collided) {
            nextUnits.push(unitA)
        }
    }
    
    return nextUnits
}

/**
* Updates the X, Y position of the unit with respect to its movement vector.
* @param unit a unit
* @returns an instance of a unit
*/
export const moveUnit = (unit: Models.Node) => {
    unit.x += unit.vx
    unit.y += unit.vy
}

/**
* Creates a new unit with whose (x, y) position does not collide with any other unit from units.
* @param units list of units
* @param unitSize the size of the unit to be created
* @returns an instance of a unit
*/
export const createUnit = (units: Models.Node[], unitSize: number): Models.Node => {
    const unit = new Models.Node(0, 0, unitSize)

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
            return unit
        }

        // TODO: Find a cleaner way to shift colliding units.
        x += unitSize
        if (x + unitSize >= Constants.FIELD_WIDTH) {
            x = 0
            y += unitSize
            if (y >= Constants.FIELD_HEIGHT) {
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

    const size = unitA.size + unitA.size

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
