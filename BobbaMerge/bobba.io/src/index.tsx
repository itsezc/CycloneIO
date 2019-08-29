import * as React from 'react'
import * as ReactDOM from "react-dom";
import BobbaUI from './ui/BobbaUI';
import BobbaEnvironment from './bobba/BobbaEnvironment';

const win: any = window;
win.mainGame = BobbaEnvironment.getGame();

ReactDOM.render(<BobbaUI />, document.getElementById('root'));