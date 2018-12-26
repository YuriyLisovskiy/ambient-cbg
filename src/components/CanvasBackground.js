import React, {Component} from 'react'

class CanvasBackground extends Component {
	constructor(props) {
		super(props);
		this.canvas = null;
		this.ctx = null;
		this.center = null;
	}

	componentDidMount() {
		this.createCanvas();
		this.resize();
		this.init();
		this.initDraw();
		window.addEventListener('resize', this.resize.bind(this));
	}

	init() {}

	draw() {}

	render() {
		const styles = {
			position: 'fixed',
			zIndex: -1,
			top: 0,
			left: 0,
			width: 100 + 'vw',
			height: 100 + 'vh'
		};
		return (
			<div>
				<canvas id={'canvasA'} style={styles}/>
				<canvas id={'canvasB'} style={styles}/>
			</div>
		);
	}

	createCanvas() {
		this.canvas = {
			a: document.getElementById('canvasA'),
			b: document.getElementById('canvasB')
		};
		this.ctx = {
			a: this.canvas.a.getContext('2d'),
			b: this.canvas.b.getContext('2d')
		};
		this.center = [];
		this.tick = 0;
	}

	resize() {
		const { innerWidth, innerHeight } = window;

		this.canvas.a.width = innerWidth;
		this.canvas.a.height = innerHeight;

		this.ctx.a.drawImage(this.canvas.b, 0, 0);

		this.canvas.b.width = innerWidth;
		this.canvas.b.height = innerHeight;

		this.ctx.b.drawImage(this.canvas.a, 0, 0);

		this.center[0] = 0.5 * this.canvas.a.width;
		this.center[1] = 0.5 * this.canvas.a.height;
	}

	initDraw() {
		this.draw();
		window.requestAnimationFrame(this.initDraw.bind(this));
	}
}

export default CanvasBackground;
