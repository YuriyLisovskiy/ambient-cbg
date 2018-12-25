import CanvasBackground from './CanvasBackground'
import SimplexNoise from 'simplex-noise'
import {fadeInOut, rand, TAU, randRange, lerp} from "../utils/Math";

const {cos, sin} = Math;

const particleCount = 700;
const particlePropCount = 9;
const particlePropsLength = particleCount * particlePropCount;
const rangeY = 100;
const baseTTL = 50;
const rangeTTL = 150;
const baseSpeed = 0.1;
const rangeSpeed = 2;
const baseRadius = 1;
const rangeRadius = 4;
const baseHue = 220;
const rangeHue = 100;
const noiseSteps = 8;
const xOff = 0.00125;
const yOff = 0.00125;
const zOff = 0.0005;
const backgroundColor = 'hsla(260,40%,5%,1)';

class Swirl extends CanvasBackground {
	constructor(props) {
		super(props);
		this.container = null;
		this.gradient = null;
		this.tick = null;
		this.simplex = null;
		this.particleProps = null;
		this.positions = null;
		this.velocities = null;
		this.lifeSpans = null;
		this.speeds = null;
		this.sizes = null;
		this.hues = null;
	}

	init() {
		this.initParticles();
	}

	draw() {
		this.tick++;

		this.ctx.a.clearRect(0, 0, this.canvas.a.width, this.canvas.a.height);

		this.ctx.b.fillStyle = backgroundColor;
		this.ctx.b.fillRect(0, 0, this.canvas.a.width, this.canvas.a.height);

		this.drawParticles();
		this.renderGlow();
		this.renderToScreen();
	}

	initParticles() {
		this.tick = 0;
		this.simplex = new SimplexNoise();
		this.particleProps = new Float32Array(particlePropsLength);
		for (let i = 0; i < particlePropsLength; i += particlePropCount) {
			this.initParticle(i);
		}
	}

	initParticle(i) {
		let x, y, vx, vy, life, ttl, speed, radius, hue;
		x = rand(this.canvas.a.width);
		y = this.center[1] + randRange(rangeY);
		vx = 0;
		vy = 0;
		life = 0;
		ttl = baseTTL + rand(rangeTTL);
		speed = baseSpeed + rand(rangeSpeed);
		radius = baseRadius + rand(rangeRadius);
		hue = baseHue + rand(rangeHue);
		this.particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
	}

	drawParticles() {
		for (let i = 0; i < particlePropsLength; i += particlePropCount) {
			this.updateParticle(i);
		}
	}

	updateParticle(i) {
		let i2=1+i, i3=2+i, i4=3+i, i5=4+i, i6=5+i, i7=6+i, i8=7+i, i9=8+i;
		let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, hue;

		x = this.particleProps[i];
		y = this.particleProps[i2];
		n = this.simplex.noise3D(x * xOff, y * yOff, this.tick * zOff) * noiseSteps * TAU;
		vx = lerp(this.particleProps[i3], cos(n), 0.5);
		vy = lerp(this.particleProps[i4], sin(n), 0.5);
		life = this.particleProps[i5];
		ttl = this.particleProps[i6];
		speed = this.particleProps[i7];
		x2 = x + vx * speed;
		y2 = y + vy * speed;
		radius = this.particleProps[i8];
		hue = this.particleProps[i9];
		this.drawParticle(x, y, x2, y2, life, ttl, radius, hue);
		life++;
		this.particleProps[i] = x2;
		this.particleProps[i2] = y2;
		this.particleProps[i3] = vx;
		this.particleProps[i4] = vy;
		this.particleProps[i5] = life;
		(this.checkBounds(x, y) || life > ttl) && this.initParticle(i);
	}

	drawParticle(x, y, x2, y2, life, ttl, radius, hue) {
		this.ctx.a.save();
		this.ctx.a.lineCap = 'round';
		this.ctx.a.lineWidth = radius;
		this.ctx.a.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
		this.ctx.a.beginPath();
		this.ctx.a.moveTo(x, y);
		this.ctx.a.lineTo(x2, y2);
		this.ctx.a.stroke();
		this.ctx.a.closePath();
		this.ctx.a.restore();
	}

	checkBounds(x, y) {
		return(
			x > this.canvas.a.width ||
			x < 0 ||
			y > this.canvas.a.height ||
			y < 0
		);
	}

	renderGlow() {
		this.ctx.b.save();
		this.ctx.b.filter = 'blur(8px) brightness(200%)';
		this.ctx.b.globalCompositeOperation = 'lighter';
		this.ctx.b.drawImage(this.canvas.a, 0, 0);
		this.ctx.b.restore();

		this.ctx.b.save();
		this.ctx.b.filter = 'blur(4px) brightness(200%)';
		this.ctx.b.globalCompositeOperation = 'lighter';
		this.ctx.b.drawImage(this.canvas.a, 0, 0);
		this.ctx.b.restore();
	}

	renderToScreen() {
		this.ctx.b.save();
		this.ctx.b.globalCompositeOperation = 'lighter';
		this.ctx.b.drawImage(this.canvas.a, 0, 0);
		this.ctx.b.restore();
	}
}

export default Swirl;
