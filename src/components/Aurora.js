import React from 'react'
import CanvasBackground from './CanvasBackground'
import SimplexNoise from 'simplex-noise'
import {fadeInOut, rand} from "../utils/Math";

const {round} = Math;

const rayCount = 500;
const rayPropCount = 8;
const rayPropsLength = rayCount * rayPropCount;
const baseLength = 200;
const rangeLength = 200;
const baseSpeed = 0.05;
const rangeSpeed = 0.1;
const baseWidth = 10;
const rangeWidth = 20;
const baseHue = 120;
const rangeHue = 60;
const baseTTL = 50;
const rangeTTL = 100;
const noiseStrength = 100;
const xOff = 0.0015;
const yOff = 0.0015;
const zOff = 0.0015;
const backgroundColor = 'hsla(220,60%,3%,1)';

class Aurora extends CanvasBackground {
	constructor(props) {
		super(props);
		this.tick = null;
		this.simplex = null;
		this.rayProps = null;
	}

	init() {
		this.initRays();
	}

	draw() {
		this.tick++;
		this.ctx.a.clearRect(0, 0, this.canvas.a.width, this.canvas.a.height);
		this.ctx.b.fillStyle = backgroundColor;
		this.ctx.b.fillRect(0, 0, this.canvas.b.width, this.canvas.a.height);
		this.drawRays();
		this.renderAurora();
	}

	initRays() {
		this.tick = 0;
		this.simplex = new SimplexNoise();
		this.rayProps = new Float32Array(rayPropsLength);
		for (let i = 0; i < rayPropsLength; i += rayPropCount) {
			this.initRay(i);
		}
	}

	initRay(i) {
		let length, x, y1, y2, n, life, ttl, width, speed, hue;

		length = baseLength + rand(rangeLength);
		x = rand(this.canvas.a.width);
		y1 = this.center[1] + noiseStrength;
		y2 = this.center[1] + noiseStrength - length;
		n = this.simplex.noise3D(x * xOff, y1 * yOff, this.tick * zOff) * noiseStrength;
		y1 += n;
		y2 += n;
		life = 0;
		ttl = baseTTL + rand(rangeTTL);
		width = baseWidth + rand(rangeWidth);
		speed = baseSpeed + rand(rangeSpeed) * (round(rand(1)) ? 1 : -1);
		hue = baseHue + rand(rangeHue);

		this.rayProps.set([x, y1, y2, life, ttl, width, speed, hue], i);
	}

	drawRays() {
		for (let i = 0; i < rayPropsLength; i += rayPropCount) {
			this.updateRay(i);
		}
	}

	updateRay(i) {
		let i2=1+i, i3=2+i, i4=3+i, i5=4+i, i6=5+i, i7=6+i, i8=7+i;
		let x, y1, y2, life, ttl, width, speed, hue;

		x = this.rayProps[i];
		y1 = this.rayProps[i2];
		y2 = this.rayProps[i3];
		life = this.rayProps[i4];
		ttl = this.rayProps[i5];
		width = this.rayProps[i6];
		speed = this.rayProps[i7];
		hue = this.rayProps[i8];

		this.drawRay(x, y1, y2, life, ttl, width, hue);

		x += speed;
		life++;

		this.rayProps[i] = x;
		this.rayProps[i4] = life;

		(this.checkBounds(x) || life > ttl) && this.initRay(i);
	}

	drawRay(x, y1, y2, life, ttl, width, hue) {
		let gradient = this.ctx.a.createLinearGradient(x, y1, x, y2);
		gradient.addColorStop(0, `hsla(${hue},100%,65%,0)`);
		gradient.addColorStop(0.5, `hsla(${hue},100%,65%,${fadeInOut(life, ttl)})`);
		gradient.addColorStop(1, `hsla(${hue},100%,65%,0)`);

		this.ctx.a.save();
		this.ctx.a.beginPath();
		this.ctx.a.strokeStyle = gradient;
		this.ctx.a.lineWidth = width;
		this.ctx.a.moveTo(x, y1);
		this.ctx.a.lineTo(x, y2);
		this.ctx.a.stroke();
		this.ctx.a.closePath();
		this.ctx.a.restore();
	}

	checkBounds(x) {
		return x < 0 || x > this.canvas.a.width;
	}

	renderAurora() {
		this.ctx.b.save();
		this.ctx.b.filter = 'blur(12px)';
		this.ctx.a.globalCompositeOperation = 'lighter';
		this.ctx.b.drawImage(this.canvas.a, 0, 0);
		this.ctx.b.restore();
	}
}

export default Aurora;
