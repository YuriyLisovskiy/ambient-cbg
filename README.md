## React Ambient Canvas Backgrounds

Animated canvas backgrounds in React.js

This module is React adaptation of [crnacura/AmbientCanvasBackgrounds](https://github.com/crnacura/AmbientCanvasBackgrounds) project with additional code refactoring and improvements.

Check the [example](https://yuriylisovskiy.github.io/ambient-cbg) web application.

### Installation
```bash
$ npm install ambient-cbg
```

### Usage
Example:
```js
// App.js
import React, {Component} from 'react';
import './App.css';

import {Coalesce} from 'ambient-cbg'

class App extends Component {
    render() {
        return (
            <div className="App">
                <Coalesce/>
                <h1>Hello, World!</h1>
            </div>
        );
    }
}

export default App;
```

### License
This project is licensed under the conditions of the MIT software license, see [LICENSE](LICENSE) file for more details.
