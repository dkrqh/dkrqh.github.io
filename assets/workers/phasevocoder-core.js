'use strict';
importScripts('phasevocoder-base.js');


// https://blog.mide.com/fourier-transform-basics
// http://sethares.engr.wisc.edu/vocoders/phasevocoder.html
// https://christianfloisand.wordpress.com/2014/06/09/dynamics-processing-compressorlimiter-part-1/
// https://www.gaussianwaves.com/2015/11/interpreting-fft-results-obtaining-magnitude-and-phase-information/


class PhaseVocoder {
    // debug = true;

    // constructor(windowLength, analysisLength, synthesisLength) {
    constructor(params = { channel: 0, bufferLength: 0, windowLength: 4096, sampleRate: 44100, inputBufferLength: 0 }) {
        this.debug = false;

        // if (params.inputBufferLength) {
        //     this.inputBuffer = new Float32Array(params.inputBufferLength).fill(0);
        // } else {
        //     this.inputBuffer = params.inputBuffer;
        //     params.inputBuffer = null;
        // }

        this.inputBufferLength = params.inputBufferLength;
        this.channel = params.channel;
        this.sampleRate = params.sampleRate;
        this.bufferLength = params.bufferLength;
        this.windowLength = params.windowLength;
        this.windowData = new Float32Array(this.windowLength).fill(0);
        // this.outputBuffer = new Float32Array(this.bufferLength).fill(0);
        this.prevOutputBuffer = new Float32Array(this.bufferLength * 2 + this.windowLength * 2).fill(0);

        if (this.debug) { console.log('phaseVocoder.constructor(): prevOutputBuffer'); }

        this.real = true;
        this.ip = new Int16Array(2 + Math.sqrt(this.windowLength));
        this.w = new Float32Array(this.windowLength / 2);
        this.internal = new Float32Array(this.windowLength);
        init.makewt(this.windowLength / 4, this.ip.buffer, this.w.buffer);
        init.makect(this.windowLength / 4, this.ip.buffer, this.w.buffer, this.windowLength / 4);

        if (this.debug) { console.log('phaseVocoder.constructor(): init.makect()'); }

        this.pi2 = Math.PI * 2;
        this.windowHalfLength = Math.round(this.windowLength / 2);
        this.phaseLength = Math.round(this.windowLength / 2) + 1;
        this.hannWindow = this.hanningWindowFactory(this.windowLength);
        this.unwrap = new Array(this.phaseLength);
        this.magnitude = new Array(this.phaseLength);
        this.angle = new Array(this.phaseLength).fill(0);
        this.angleSum = new Float64Array(this.phaseLength).fill(0);
        this.prevAngle = new Array(this.phaseLength).fill(0);
        this.unwrapData = new Array(this.phaseLength);
        this.fadeInWindowLength = 64;
        this.fadeInWindow = this.getFadeInWindow(this.fadeInWindowLength);
        this.fadeInRemainderOffset = undefined;
    }

    getFadeInWindow(length = 64, curve = 1.5) {
        // return new Float32Array(length).map((x, i) => i / (length - 1));
        const factor = 0.5 * Math.PI / (length - 1);
        return new Float32Array(length).map((x, i) => Math.sin(factor * i) ** curve);
    }

    setBufferSegment(params = { offset: 0, inputBufferSegment: [] }) {
        this.inputBuffer.set(new Float32Array(params.inputBufferSegment), params.offset);
        params.inputBufferSegment = null;
    }

    destroy() {
        this.windowData = null;
        this.outputBuffer = null;
        this.prevOutputBuffer = null;
        this.hannWindow = null;
        this.powerWindow = null;
        this.outputHannWindow = null;
        if (this.w) { this.w.buffer = null; }
        if (this.ip) { this.ip.buffer = null; }
        this.w = null;
        this.ip = null;
        this.internal = null;
        this.unwrap = null;
        this.angle = null;
        this.angleSum = null;
        this.prevAngle = null;
        this.unwrapData = null;
    }

    setParameters(params = { windowLength: 1.0, tempoRatio: 1.0 }) {
        // console.log('setParameters():', params);
        this.windowLength = params.windowLength;
        this.tempoRatio = params.tempoRatio;
        this.windowData = new Float32Array(this.windowLength).fill(0);
        this.prevOutputBuffer = new Float32Array(this.bufferLength * 2 + this.windowLength * 2).fill(0);

        this.analysisLengthFactor = 2 ** (Math.log(this.tempoRatio) / Math.log(2) * 0.5);
        this.analysisLength = Math.round(this.windowLength / 4 * this.analysisLengthFactor);
        this.synthesisLength = Math.round(this.analysisLength / this.tempoRatio);
        this.hopRatio = this.synthesisLength / this.analysisLength;
        this.hannWindow = this.hanningWindowFactory(this.windowLength);
        this.powerWindow = this.hannWindow.map((x) => x ** 2);
        this.gain = 2 / this.windowLength;
        this.outputHannWindow = new Float32Array(this.hannWindow).map(x => x * this.gain);
        this.real = true;
        this.ip = new Int16Array(2 + Math.sqrt(this.windowLength));
        this.w = new Float32Array(this.windowLength / 2);
        this.internal = new Float32Array(this.windowLength);

        init.makewt(this.windowLength / 4, this.ip.buffer, this.w.buffer);
        init.makect(this.windowLength / 4, this.ip.buffer, this.w.buffer, this.windowLength / 4);

        this.windowHalfLength = Math.round(this.windowLength / 2);
        this.phaseLength = Math.round(this.windowLength / 2) + 1;
        this.unwrap = new Array(this.phaseLength);
        this.magnitude = new Array(this.phaseLength);
        this.angle = new Array(this.phaseLength).fill(0);
        this.angleSum = new Float64Array(this.phaseLength).fill(0);
        this.prevAngle = new Array(this.phaseLength).fill(0);
        this.unwrapData = new Array(this.phaseLength);
        this.unwrapData = this.unwrapData.fill(this.pi2 * this.analysisLength / this.windowLength).map((x, i) => x * i);
        this.frameCount = 0;
        this.fadeInRemainderOffset = undefined;
    }

    setTempoRatio(params = { tempoRatio: 1.0 }) {
        if (this.tempoRatio !== params.tempoRatio) {
            this.tempoRatio = params.tempoRatio;
            this.analysisLengthFactor = 2 ** (Math.log(this.tempoRatio) / Math.log(2) * 0.5);
            this.analysisLength = Math.round(this.windowLength / 4 * this.analysisLengthFactor);
            this.synthesisLength = Math.round(this.analysisLength / this.tempoRatio);
            this.hopRatio = this.synthesisLength / this.analysisLength;
            this.powerWindow = this.hannWindow.map((x) => x ** 2);
            // this.gainFactor = Math.sin(Math.PI * 0.25) * 4;
            // this.gain = this.synthesisLength / (this.powerWindow.reduce((a, b) => a + b, 0) * this.windowLength) * this.gainFactor;
            // this.gain = 1 / (this.windowLength * this.powerWindow.reduce((a, b) => a + b, 0) / this.synthesisLength);
            this.gain = 2 / this.windowLength;
            this.outputHannWindow = new Float32Array(this.hannWindow).map(x => x * this.gain);
            this.unwrapData = this.unwrapData.fill(this.pi2 * this.analysisLength / this.windowLength).map((x, i) => x * i);
        }
        this.angle.fill(0);
        this.angleSum.fill(0);
        this.prevAngle.fill(0);
        this.prevOutputBuffer.fill(0);
        this.frameCount = 0;
        this.fadeInRemainderOffset = undefined;
    }

    process(params = { offsetSecond: 0.0, delaySecond: 0.0, fadeIn: false, bufferCount: 0, inputBuffer: [] }) {

        // console.log(params.fadeIn);

        if (this.tempoRatio === 1.0 && fadeIn === false && this.fadeInRemainderOffset === undefined) {
            return params.inputBuffer;
        }

        let inputBuffer = new Float32Array(params.inputBuffer);

        if (params.fadeIn) {
            this.fadeInRemainderOffset = undefined;
            const length = Math.min(this.fadeInWindowLength, inputBuffer.length);
            if (length < this.fadeInWindowLength) {
                this.fadeInRemainderOffset = this.fadeInWindowLength - length;
            }
            for (let i = 0; i < length; i++) {
                inputBuffer[i] = inputBuffer[i] * this.fadeInWindow[i];
            }
        }

        if (this.fadeInRemainderOffset !== undefined) {
            const lenght = this.fadeInWindowLength - this.fadeInRemainderOffset;
            for (let i = 0; i < length; i++) {
                inputBuffer[i] = inputBuffer[i] * this.fadeInWindow[this.fadeInRemainderOffset + i];
            }
            this.fadeInRemainderOffset = undefined;
        }

        if (this.tempoRatio === 1.0) {
            return inputBuffer.buffer;
        }

        this.outputBuffer = new Float32Array(this.bufferLength).fill(0);

        // const bufferDelay = Math.ceil(params.delaySecond * this.sampleRate / this.analysisLength) * this.analysisLength;
        // this.outputBufferLength = Math.ceil(this.inputBufferLength / this.tempoRatio);
        // const bufferOffset = Math.ceil(params.offsetSecond  * this.sampleRate + params.bufferCount * this.bufferLength);
        const bufferOffset = Math.ceil((params.offsetSecond - params.delaySecond) * this.sampleRate + params.bufferCount * this.bufferLength);
        const bufferInputOffset = Math.ceil(bufferOffset * this.tempoRatio / this.analysisLength) * this.analysisLength;
        const bufferInputFinish = Math.ceil((bufferOffset + this.bufferLength) * this.tempoRatio / this.analysisLength) * this.analysisLength;
        const offsetOutputDelta = Math.ceil(bufferInputOffset / this.tempoRatio) - bufferOffset;
        const inputBufferLength = bufferInputFinish - bufferInputOffset + this.windowLength;
        const setOffset = inputBufferLength - inputBuffer.length;
        if (setOffset > 0) {
            let buffer = new Float32Array(inputBufferLength).fill(0);
            buffer.set(inputBuffer, setOffset);
            inputBuffer = buffer;
        }

        for (let inputOffset = bufferInputOffset; inputOffset < bufferInputFinish; inputOffset += this.analysisLength) {
            // console.log(inputOffset - bufferDelay);
            // if (Math.ceil(inputOffset / this.tempoRatio) + this.windowLength > this.outputBufferLength + bufferDelay) {
            // if (Math.ceil((inputOffset) / this.tempoRatio) + this.windowLength > this.outputBufferLength + bufferDelay + this.bufferLength) {
            //     return;
            // }

            this.windowData.set(inputBuffer.slice(
                (inputOffset - bufferInputOffset), (inputOffset + this.windowLength - bufferInputOffset)));

            // this.windowData.set(new Float32Array(params.inputBuffer.slice(
            //     (inputOffset - bufferInputOffset) * 4, (inputOffset + this.windowLength - bufferInputOffset) * 4)));

            // if (params.inputBuffer) {
            //     this.windowData.set(new Float32Array(params.inputBuffer.slice(
            //         (inputOffset - bufferInputOffset) * 4, (inputOffset + this.windowLength - bufferInputOffset) * 4)));
            // } else {
            //     this.windowData.set(new Float32Array(this.inputBuffer.slice(inputOffset, (inputOffset + this.windowLength))));
            // }

            this.internal.set(this.hannWindow.map((x, i) => x * this.windowData[i]), 0);
            trans.rdft(this.windowLength, trans.DIRECTION.FORWARDS, this.internal.buffer, this.ip.buffer, this.w.buffer);

            let i = 0;
            let mi = 0;
            let mo = 0;
            let reX = 0;
            let imX = 0;
            let angleX = 0;
            let angleSumX = 0;
            let unwrapX = 0;
            let unwrapDataX = 0;
            let magnitudeX = 0;

            if (this.frameCount === 0) {
                while (i !== this.phaseLength) {
                    reX = this.internal[mi++];
                    imX = -this.internal[mi++];
                    angleX = Math.atan2(imX, reX);
                    magnitudeX = (reX ** 2 + imX ** 2) ** 0.5;
                    this.magnitude[i] = magnitudeX;
                    this.angle[i] = angleX;
                    unwrapDataX = this.unwrapData[i];
                    unwrapX = angleX - this.prevAngle[i] - unwrapDataX;
                    this.unwrap[i] = (unwrapX - Math.round(unwrapX / this.pi2) * this.pi2 + unwrapDataX) * this.hopRatio;
                    this.internal[mo++] = magnitudeX * Math.cos(angleX);
                    this.internal[mo++] = -magnitudeX * Math.sin(angleX);
                    this.angleSum[i] = angleX;
                    i++;
                }
            } else {
                while (i !== this.phaseLength) {
                    reX = this.internal[mi++];
                    imX = -this.internal[mi++];
                    angleX = Math.atan2(imX, reX);
                    magnitudeX = (reX ** 2 + imX ** 2) ** 0.5;
                    this.magnitude[i] = magnitudeX;
                    this.angle[i] = angleX;
                    unwrapDataX = this.unwrapData[i];
                    unwrapX = angleX - this.prevAngle[i] - unwrapDataX;
                    this.unwrap[i] = (unwrapX - Math.round(unwrapX / this.pi2) * this.pi2 + unwrapDataX) * this.hopRatio;
                    angleSumX = (this.angleSum[i] + this.unwrap[i]);
                    this.internal[mo++] = magnitudeX * Math.cos(angleSumX);
                    this.internal[mo++] = -magnitudeX * Math.sin(angleSumX);
                    this.angleSum[i] = angleSumX;
                    i++;
                }
            }

            this.angle[0] = 0.0;
            this.angle[this.windowHalfLength] = 0.0;
            this.magnitude[0] = (this.internal[0] ** 2) ** 0.5;
            this.magnitude[this.windowHalfLength] = (this.internal[1] ** 2) ** 0.5;
            this.unwrap[0] = 0.0;
            this.unwrap[this.windowHalfLength] = this.unwrapData[this.windowHalfLength] * this.hopRatio;

            this.angleSum[0] = 0.0;
            this.angleSum[this.windowHalfLength] = this.unwrap[this.windowHalfLength] * this.frameCount;
            this.internal[0] = this.magnitude[0];
            this.internal[1] = 0.0;
            this.internal[this.windowLength - 2] = this.magnitude[this.windowHalfLength] * Math.cos(this.angleSum[this.windowHalfLength]);
            this.internal[this.windowLength - 1] = this.magnitude[this.windowHalfLength] * Math.sin(this.angleSum[this.windowHalfLength]);

            this.prevAngle = this.angle.slice(0);
            this.internal[1] = this.internal[this.windowLength - 1];
            trans.rdft(this.windowLength, trans.DIRECTION.BACKWARDS, this.internal.buffer, this.ip.buffer, this.w.buffer);
            this.windowData.set(this.outputHannWindow.map((x, i) => x * this.internal[i]), 0);
            // this.outputBufferOffset = Math.ceil((inputOffset - bufferInputOffset) / this.tempoRatio) + offsetOutputDelta;
            this.outputBufferOffset = Math.ceil((inputOffset - bufferInputOffset) / this.tempoRatio) + offsetOutputDelta;
            for (let i = 0; i < this.windowLength; i++) { this.prevOutputBuffer[this.outputBufferOffset + i] += this.windowData[i]; }
            this.frameCount++;
        }
        this.outputBuffer.set(this.prevOutputBuffer.slice(0, this.bufferLength));
        this.prevOutputBuffer.set(this.prevOutputBuffer.slice(this.bufferLength), 0);
        return this.outputBuffer.buffer;
    }

    limiterWindowFactory(length, amplitude) {
        const getFadeIn = (length, curve = 2) => {
            const factor = 0.5 * Math.PI / (length - 1);
            return new Float32Array(length).map((x, i) => 1 - (Math.sin(factor * i) ** curve) / amplitude);
        }
        const halfLength = Math.floor(length / 2);
        const limiterWindow = new Float32Array(length).fill(1.0);
        const fadeInWindow = getFadeIn(halfLength);
        limiterWindow.set(fadeInWindow, 0);
        limiterWindow.set(fadeInWindow.reverse(), halfLength);
        return limiterWindow;
    }

    hanningWindowFactory(length) {
        const getFadeIn = (length, curve = 2) => {
            const factor = 0.5 * Math.PI / (length - 1);
            return new Float32Array(length).map((x, i) => Math.sin(factor * i) ** curve);
        }
        const halfLength = Math.floor(length / 2);
        const hanningWindow = new Float32Array(length).fill(1.0);
        const fadeInWindow = getFadeIn(halfLength);
        hanningWindow.set(fadeInWindow, 0);
        hanningWindow.set(fadeInWindow.reverse(), halfLength);
        return hanningWindow;
    }
}
