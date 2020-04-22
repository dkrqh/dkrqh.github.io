'use strict';
importScripts('notation-core.js');

self.onmessage = function(event) {
    self[event.data.method](event.data.params);
};

self.constructor = function(params = { eventText: undefined, notationText: undefined }) {
    if (!self.notation) { self.notation = new Notation(params); }
    self.postMessage({ result: { notation: self.notation.notation, measures: self.notation.measures } });
}

self.getSystems = function(params = { clientWidth: undefined, offsetY: undefined, divElement: undefined }) {
    self.postMessage({ result: self.notation.getSystems(params) });
}

self.setNotationSystems = function(
    params = { clientWidth: 0, clientHeight: 0, eventText: undefined, notationText: undefined }) {
    self.postMessage({ result: self.notation.setNotationSystems(params) });
}

self.getCurrent = function(params = { second: 0.0 }) {
    self.postMessage({ result: self.notation.getCurrent(params) });
};

self.getTouchedSecound = function(params = { offsetX: 0.0, offsetY: 0.0 }) {
    self.postMessage({ result: self.notation.getTouchedSecound(params) });
};

self.getMeasureBySecond = function(params = { second: 0.0 }) {
    self.postMessage({ result: self.notation.getMeasureBySecond(params) });
};
