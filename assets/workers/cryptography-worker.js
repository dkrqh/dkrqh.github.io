'use strict';
importScripts('cryptography-core.js');
// importScripts('text-encoding.js');
// import encoding from 'text-encoding';

self.onmessage = function(event) {
    let targetOrigin = undefined;
    if (event && event.target &&
        event.target.location && event.target.location.origin) {
        targetOrigin = event.target.location.origin;
    }
    self[event.data.method](event.data.params, targetOrigin);
};

self.unShuffle = function(params = { data: [], decodeText: false }, targetOrigin) {
    const cryptography = new Cryptography();
    let result = cryptography.unShuffle(params.data);
    if (params.decodeText) {
        // result = (new encoding.TextDecoder('utf-8')).decode(new Uint8Array(result));
        // result = (new TextDecoder('utf-8')).decode(new Uint8Array(result)).buffer;
        // result = new Uint8Array(result).buffer;
    }
    self.postMessage({ method: 'unShuffle', result: result }, [result]);
    result = null;
    // self.postMessage({ result: result }, '*', [result]);
};
