'use strict';

self.onmessage = function(event) {
    const debug = true;
    if (debug) { console.log('decodeaudio-worker()'); }

    console.log(Window);
    // console.log(window);
    console.log(self);
    console.log(this);
    const AudioContext = Window.AudioContext || Window.webkitAudioContext;
    const audioCtx = new AudioContext();

    audioCtx.decodeAudioData(event.arrayBuffer, (buffer) => {
        arrayBuffer = null;
        if (debug) { console.log('decodeaudio-worker(): decodeAudioData(): success'); }
        self.postMessage({ result: true, buffer: buffer }, [buffer]);
    }, (error) => {
        if (debug) { console.log('decodeaudio-worker(): decodeAudioData() error:', JSON.stringify(error)); }
        self.postMessage({ result: false, buffer: undefined });
    });
};

self.onerror = function(error) {
    console.log('onerror');
    self.postMessage({ result: false, buffer: undefined });
}
