## Canvas Background

Animated canvas backgrounds in React.js

This module was adaptated to React from of [crnacura/AmbientCanvasBackgrounds](https://github.com/crnacura/AmbientCanvasBackgrounds). Also it contains additional code improvements.

### Install
```bash
$ npm install canvas-bg
```

### Usage
Example:
```js
import {Component} from 'react';
import Pipeline from 'canvas-bg';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Pipeline/>
			</div>
		);
	}
}

export default App;
```
