import CanvasBackground from './CanvasBackground'
import {fadeInOut, rand, HALF_PI, angle, lerp} from "../utils/Math";

const {cos, sin} = Math;
const particleCount = 700;
const particlePropCount = 9;
const particlePropsLength = particleCount * particlePropCount;
const baseTTL = 100;
const rangeTTL = 500;
const baseSpeed = 0.1;
const rangeSpeed = 1;
const baseSize = 2;
const rangeSize = 10;
const baseHue = 10;
const rangeHue = 100;
const backgroundColor = 'hsla(60,50%,3%,1)';

class Coalesce extends CanvasBackground {
	constructor(props) {
		super(props);
		this.tick = null;
		this.particleProps = null;
		this.positions = null;
		this.sizes = null;
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
		this.renderCoalesce();
	}

	initParticles() {
		this.tick = 0;
		this.particleProps = new Float32Array(particlePropsLength);
		for (let i = 0; i < particlePropsLength; i += particlePropCount) {
			this.initParticle(i);
		}
	}

	initParticle(i) {
		let theta, x, y, vx, vy, life, ttl, speed, size, hue;

		x = rand(this.canvas.a.width);
		y = rand(this.canvas.a.height);
		theta = angle(x, y, this.center[0], this.center[1]);
		vx = cos(theta) * 6;
		vy = sin(theta) * 6;
		life = 0;
		ttl = baseTTL + rand(rangeTTL);
		speed = baseSpeed + rand(rangeSpeed);
		size = baseSize + rand(rangeSize);
		hue = baseHue + rand(rangeHue);

		this.particleProps.set([x, y, vx, vy, life, ttl, speed, size, hue], i);
	}

	drawParticles() {
		for (let i = 0; i < particlePropsLength; i += particlePropCount) {
			this.updateParticle(i);
		}
	}

	updateParticle(i) {
		let i2=1+i, i3=2+i, i4=3+i, i5=4+i, i6=5+i, i7=6+i, i8=7+i, i9=8+i;
		let x, y, theta, vx, vy, life, ttl, speed, x2, y2, size, hue;

		x = this.particleProps[i];
		y = this.particleProps[i2];
		theta = angle(x, y, this.center[0], this.center[1]) + 0.75 * HALF_PI;
		vx = lerp(this.particleProps[i3], 2 * cos(theta), 0.05);
		vy = lerp(this.particleProps[i4], 2 * sin(theta), 0.05);
		life = this.particleProps[i5];
		ttl = this.particleProps[i6];
		speed = this.particleProps[i7];
		x2 = x + vx * speed;
		y2 = y + vy * speed;
		size = this.particleProps[i8];
		hue = this.particleProps[i9];

		this.drawParticle(x, y, theta, life, ttl, size, hue);

		life++;

		this.particleProps[i] = x2;
		this.particleProps[i2] = y2;
		this.particleProps[i3] = vx;
		this.particleProps[i4] = vy;
		this.particleProps[i5] = life;

		life > ttl && this.initParticle(i);
	}

	drawParticle(x, y, theta, life, ttl, size, hue) {
		let xRel = x - (0.5 * size), yRel = y - (0.5 * size);

		this.ctx.a.save();
		this.ctx.a.lineCap = 'round';
		this.ctx.a.lineWidth = 1;
		this.ctx.a.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
		this.ctx.a.beginPath();
		this.ctx.a.translate(xRel, yRel);
		this.ctx.a.rotate(theta);
		this.ctx.a.translate(-xRel, -yRel);
		this.ctx.a.strokeRect(xRel, yRel, size, size);
		this.ctx.a.closePath();
		this.ctx.a.restore();
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

	renderCoalesce() {
		this.ctx.b.save();
		this.ctx.b.globalCompositeOperation = 'lighter';
		this.ctx.b.drawImage(this.canvas.a, 0, 0);
		this.ctx.b.restore();
	}
}

export default Coalesce;
