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
}

  /**
  * Creates a new unit with whose (x, y) position does not collide with any other unit from units.
  * @param units list of units
  * @param unitSize the size of the unit to be created
  * @returns an instance of a unit
  */
export function createUnit(units: Models.Node[], unitSize: number):Models.Node {
    
    let count = 0
    while (count < 100) {
        count += 1

        const x = genRandomNumber(0, Constants.FIELD_WIDTH - unitSize)
        const y = genRandomNumber(0, Constants.FIELD_HEIGHT - unitSize)


    }

    throw 'failed to create a unit'
}

  /**
  * Checks if two units collide. Returns true if they do, false otherwise.
  * @param unitA a unit
  * @param unitB a unit
  * @returns an instance of a unit
  */
 export function collides(unitA: Models.Node, unitB: Models.Node):boolean {
     if (!unitA || !unitB) {
         throw 'collides() expects two units to compare, received one or less'
     }


    
 }




  /**
  * Generates a random number within the provided bounds of min and max.
  * @param min the inclusive lower bound
  * @param max the exclusive upper bound
  * @returns models.Node
  */
export const genRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) ) + min;
}


/** 
 * Problems to solve:
    1 - generate sudo-random starting positions for objects effectively
    2 - make it impossible for simulation to crash (limit object creation)
    3 - find collisions efficiently
    4 - calculate new travel vectors
 * **/
