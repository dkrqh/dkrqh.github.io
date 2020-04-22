'use strict';

self.onmessage = function(message) {

    const debug = false;
    const timeout = 1000 * 60 * 2;
    // const timeout = 30;
    // console.log(timeout);

    if (debug) { console.log('requestdata-worker()'); }
    let loadedSize = 0;
    const size = message.data.size;
    let request = new XMLHttpRequest();

    request.responseType = 'arraybuffer';

    request.onprogress = (event) => {
        loadedSize = event.loaded;
        self.postMessage({ loadedSize: loadedSize, result: 'onprogress' });
    }

    request.onload = (event) => {
        // if (!this.data.isPlayerPage) { return resolve(false); }
        if (loadedSize !== size) {
            if (this.debug) { console.log('requestdata-worker(): error:', message.data.request); }
            self.postMessage({ loadedSize: loadedSize, result: 'networkError' });
        } else {
            loadedSize = size;
            if (this.debug) { console.log('requestdata-worker(): success:', message.data.request); }
            self.postMessage({ loadedSize: loadedSize, result: request.response }, [request.response]);
            request.response = null;
            request = null;
        }
    }

    request.onerror = () => {
        if (this.debug) { console.log('requestdata-worker(): error:', message.data.request); }
        // self.postMessage({ loadedSize: loadedSize, result: false });
        self.postMessage({ loadedSize: loadedSize, result: 'networkError' });
    }

    request.ontimeout = () => {
        if (this.debug) { console.log('requestdata-worker(): ontimeout:', message.data.request); }
        // self.postMessage({ loadedSize: loadedSize, result: false });
        self.postMessage({ loadedSize: loadedSize, result: 'networkError' });
    }

    request.timeout = timeout;
    request.open('POST', message.data.appurl, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.send(JSON.stringify({
        json: JSON.stringify({
            request: message.data.request,
            data: {
                piece_id: message.data.piece_id,
                transpose: message.data.transpose,
                segment: message.data.segment
            }
        })
    }));
};
