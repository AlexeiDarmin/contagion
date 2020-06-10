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
        // Multiple seperate collision detectors may cause issues...
        checkWallCollision(unitA)
        let collided = false
        unitA.move()
        if (unitA.collisionCooldown) {
            nextUnits.push(unitA)
            continue
        }
        for (let i = 0; i < units.length; i++){
            const unitB = units[i]
            if (!unitB){
                continue
            }
            if (unitB.collisionCooldown) {
                continue
            }
            unitB.move()

            if (collides(unitA, unitB)) {
                // applyCollisionRedirect(unitA, unitB)
                unitA.vx *= -1
                unitA.vy *= -1
                unitB.vx *= -1
                unitB.vy *= -1
                nextUnits.push(unitA)
                nextUnits.push(unitB)
                collided = true

                // Generalize to a function
                unitA.collisionCooldown = true
                unitB.collisionCooldown = true
                setTimeout(() => unitA.collisionCooldown = false, 100)
                setTimeout(() => unitB.collisionCooldown = false, 100)

                checkWallCollision(unitB)
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
* Modifies a unit's direction vector if it has collided with a wall
* @param unit a unit
* @returns void
*/
export const checkWallCollision = (unit: Models.Node) => {
    if (unit.x < 0){
        unit.vx *= -1
    }
    if (unit.x + unit.size >= Constants.FIELD_WIDTH) {
        unit.vx *= -1
    }
    if (unit.y < 0) {
        unit.vy *= -1
    }
    if (unit.y + unit.size >= Constants.FIELD_HEIGHT) {
        unit.vy *= -1
    }
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

    const size = unitA.size * 2 + 1

    return Math.abs(unitA.x - unitB.x) + Math.abs(unitA.y - unitB.y) <= size
}

/**
* Updates the motion vector for two units that have collided
* @param unitA a unit
* @param unitB a unit
* @returns void
*/
export const applyCollisionRedirect = (unitA: Models.Node, unitB: Models.Node) => {
    if (!unitA || !unitB) {
        throw 'applyCollisionRedirect() expects two units to compare, received one or less'
    }

    const newAVector = {
        vx: unitA.vx + unitB.vx / 4,
        vy: unitA.vy + unitB.vy / 4
    }
    const newBVector = {
        vx: unitB.vx + unitA.vx / 4,
        vy: unitB.vy + unitA.vy / 4
    }

    // normalize vectors to sum to one
    const s1 = newAVector.vx + newAVector.vy
    const s2 = newBVector.vx + newBVector.vy

    unitA.vx = newAVector.vx / s1
    unitA.vy = newAVector.vy / s1
    unitB.vx = newBVector.vx / s2
    unitB.vy = newBVector.vy / s2

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
    (done) 1 - generate sudo-random starting positions for objects effectively
    (ish)  2 - make it impossible for simulation to crash (limit object creation)
    (done) 3 - find collisions efficiently
    (wip)  4 - calculate new travel vectors
    (done) 5 - redirect on collision with map boundaries
 * **/
