'use strict';
importScripts('phasevocoder-core.js');

let methodName;

self.onmessage = function(event) {
    self.methodName = event.data.method;
    let targetOrigin = undefined;
    if (event && event.target &&
        event.target.location && event.target.location.origin) {
        targetOrigin = event.target.location.origin;
    }
    self[event.data.method](event.data.params, targetOrigin);
    self.methodName = undefined;
};

self.construct = function(params = { channel: 0, bufferLength: 0, windowLength: 4096, sampleRate: 44100, inputBufferLength: 0, inputBuffer: [] }) {
    self.channel = params.channel;
    self.phaseVocoder = new PhaseVocoder(params);
    self.postMessage({ method: 'construct', result: true });
}

self.setBufferSegment = function(params = { offset: 0, inputBufferSegment: [] }) {
    self.phaseVocoder.setBufferSegment(params);
    self.postMessage({ method: 'setBufferSegment', result: true });
}

self.setTempoRatio = function(params = { tempoRatio: 0.0 }) {
    self.phaseVocoder.setTempoRatio(params);
    self.postMessage({ method: 'setTempoRatio', result: true });
}

self.setParameters = function(params = { windowLength: 4096, tempoRatio: 0.0 }) {
    self.phaseVocoder.setParameters(params);
    self.postMessage({ method: 'setParameters', result: true });
}

self.process = function(params = { offsetSecond: 0.0, delaySecond: 0.0, fadeIn: false, bufferCount: 0, inputBuffer: [] }, targetOrigin) {
    const result = self.phaseVocoder.process(params);
    if (!result) {
        self.postMessage({ method: 'process', result: result });
    } else {
        self.postMessage({ method: 'process', result: result }, [result]);
    }
    // self.postMessage({ method: 'process', result: result }, targetOrigin, [result]);
    // self.postMessage({ method: 'process', result: self.phaseVocoder.process(params) });
};

self.destroy = function() {
    self.phaseVocoder.destroy();
    self.postMessage({ method: 'destroy', result: true });
};

self.onerror = function(error) {
    self.postMessage({ method: self.methodName, result: false });
}
