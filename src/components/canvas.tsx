import React from 'react';

import * as Constants from '../constants'

class Canvas extends React.Component {

    render() {
        return <canvas id="mainCanvas" width={Constants.FIELD_WIDTH} height={Constants.FIELD_HEIGHT} className="main-canvas"></canvas>
    }

}

export default Canvas;
  