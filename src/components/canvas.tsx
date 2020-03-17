import React from 'react';

import * as Constants from '../constants'
import * as Engine from '../engine'

class Canvas extends React.Component {
    canvasRef: React.RefObject<HTMLCanvasElement>
    engineInterval?: ReturnType<typeof setInterval>

    state = {
        engine: new Engine.Engine(Constants.ENGINE_OPTIONS)
    }

    constructor(props: any) {
        super(props)

        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }

    componentDidMount() {
        this.engineInterval = setInterval(this.runAnimationFrame, 1000);
        this.canvasRef.current?.getContext('2d')?.scale(Constants.FIELD_SCALE, Constants.FIELD_SCALE)
    }

    componentWillUnmount() {
        if (this.engineInterval) {
            clearInterval(this.engineInterval)
        }
    }

    runAnimationFrame = () => {
        const canvas = this.canvasRef.current
        if (!canvas) {
            return
            throw 'canvas should exist before executing runAnimationFrame()'
        }

        this.state.engine.update(canvas)
    }

    render() {
        return <canvas
            id="mainCanvas"
            ref={this.canvasRef}
            width={`${Constants.FIELD_WIDTH * Constants.FIELD_SCALE}px`}
            height={`${Constants.FIELD_HEIGHT * Constants.FIELD_SCALE}px`}
            style={{
                width: `${Constants.FIELD_WIDTH}px`,
                height: `${Constants.FIELD_HEIGHT}px`,
            }}
            className="main-canvas">

        </canvas>
    }

}

export default Canvas;
