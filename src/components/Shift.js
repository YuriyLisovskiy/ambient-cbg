import React from 'react'
import CanvasBackground from './CanvasBackground'
import SimplexNoise from 'simplex-noise'
import {fadeInOut, rand, TAU} from "../utils/Math";

const {cos, sin} = Math;
const circleCount = 150;
const circlePropCount = 8;
const circlePropsLength = circleCount * circlePropCount;
const baseSpeed = 0.1;
const rangeSpeed = 1;
const baseTTL = 150;
const rangeTTL = 200;
const baseRadius = 100;
const rangeRadius = 200;
const rangeHue = 60;
const xOff = 0.0015;
const yOff = 0.0015;
const zOff = 0.0015;
const backgroundColor = 'hsla(0,0%,5%,1)';

class Shift extends CanvasBackground {
	constructor(props) {
		super(props);
		this.circleProps = null;
		this.simplex = null;
		this.baseHue = null;
	}

	init() {
		this.initCircles();
	}

	draw() {
		this.ctx.a.clearRect(0, 0, this.canvas.a.width, this.canvas.a.height);
		this.ctx.b.fillStyle = backgroundColor;
		this.ctx.b.fillRect(0, 0, this.canvas.b.width, this.canvas.b.height);
		this.updateCircles();
		this.renderShift();
	}

	initCircles() {
		this.circleProps = new Float32Array(circlePropsLength);
		this.simplex = new SimplexNoise();
		this.baseHue = 220;

		let i;

		for (i = 0; i < circlePropsLength; i += circlePropCount) {
			this.initCircle(i);
		}
	}

	initCircle(i) {
		let x, y, n, t, speed, vx, vy, life, ttl, radius, hue;

		x = rand(this.canvas.a.width);
		y = rand(this.canvas.a.height);
		n = this.simplex.noise3D(x * xOff, y * yOff, this.baseHue * zOff);
		t = rand(TAU);
		speed = baseSpeed + rand(rangeSpeed);
		vx = speed * cos(t);
		vy = speed * sin(t);
		life = 0;
		ttl = baseTTL + rand(rangeTTL);
		radius = baseRadius + rand(rangeRadius);
		hue = this.baseHue + n * rangeHue;

		this.circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
	}

	updateCircles() {
		let i;
		this.baseHue++;
		for (i = 0; i < circlePropsLength; i += circlePropCount) {
			this.updateCircle(i);
		}
	}

	updateCircle(i) {
		let i2=1+i, i3=2+i, i4=3+i, i5=4+i, i6=5+i, i7=6+i, i8=7+i;
		let x, y, vx, vy, life, ttl, radius, hue;

		x = this.circleProps[i];
		y = this.circleProps[i2];
		vx = this.circleProps[i3];
		vy = this.circleProps[i4];
		life = this.circleProps[i5];
		ttl = this.circleProps[i6];
		radius = this.circleProps[i7];
		hue = this.circleProps[i8];

		this.drawCircle(x, y, life, ttl, radius, hue);

		life++;

		this.circleProps[i] = x + vx;
		this.circleProps[i2] = y + vy;
		this.circleProps[i5] = life;

		(this.checkBounds(x, y, radius) || life > ttl) && this.initCircle(i);
	}

	drawCircle(x, y, life, ttl, radius, hue) {
		this.ctx.a.save();
		this.ctx.a.fillStyle = `hsla(${hue},60%,30%,${fadeInOut(life,ttl)})`;
		this.ctx.a.beginPath();
		this.ctx.a.arc(x,y, radius, 0, TAU);
		this.ctx.a.fill();
		this.ctx.a.closePath();
		this.ctx.a.restore();
	}

	checkBounds(x, y, radius) {
		return (
			x < -radius ||
			x > this.canvas.a.width + radius ||
			y < -radius ||
			y > this.canvas.a.height + radius
		);
	}

	renderShift() {
		this.ctx.b.save();
		this.ctx.b.filter = 'blur(50px)';
		this.ctx.b.drawImage(this.canvas.a, 0, 0);
		this.ctx.b.restore();
	}
}

export default Shift;
