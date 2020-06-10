import { genRandomNumber } from "../engine"

enum HealthStatus {
    Healthy = 1,
    Sick,
    Immune
}


export class Node {
    x = 0
    y = 0
    vx = 0
    vy = 0
    size = 5
    status = HealthStatus.Healthy
    collisionCooldown = false

    constructor(x: number, y: number, size: number) {
        this.x = x
        this.y = y
        this.size = size

        const { vx, vy } = genVector()
        this.vx = vx
        this.vy = vy 
    }

    move = () => {
        this.x += this.vx
        this.y += this.vy
    }

    undoMove = () => {
        this.x -= this.vx
        this.y -= this.vy
    }
}

export interface Vector {
    vx: number
    vy: number
}

/**
* Generates a normalized vector where the sum of the x and y velocities' equals to one.
* @returns a vector
*/
export const genVector = () => {
    const distX = Math.random()
    const distY = 1 - distX
    const directionX = Math.round(genRandomNumber(0, 1)) == 1 ? 1 : -1
    const directionY = Math.round(genRandomNumber(0, 1)) == 1 ? 1 : -1

    return {
        vx: distX * directionX,
        vy: distY * directionY
    }
}

/**
* Returns a new vector with the vx, and vy signs inverted.
* @param a vector
* @returns a vector
*/
export const invertVector = (vector: Vector) => {
    return {
        vx: vector.vx * -1,
        vy: vector.vy * -1
    }
}