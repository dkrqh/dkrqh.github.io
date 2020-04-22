'use strict';
importScripts('cryptography-base.js');

class Cryptography {

    getShuffleMatrix(seed, length = 1000) {
        let index = 0;
        let hashbin = '';
        let matrix = [0, 1];
        for (let value = matrix.length; value < length; value++) {
            if (hashbin.length < 3) { hashbin += Md5.init((seed - value).toString()); }
            index = parseInt(hashbin.slice(0, 3), 16) % (value + 1)
            matrix.splice(index, 0, value);
            hashbin = hashbin.slice(1);
        }
        return matrix;
    }

    shuffleSegment(data, newdata, offset, finish, position) {
        if (typeof(newdata) === 'string') {
            return newdata.concat(data.slice(offset, finish));
        }
        newdata.set(new Int8Array(data.slice(offset, finish)), position);
        return newdata;
    }

    shuffleStringSegment(data, newdata, offset, finish, position) {
        newdata.concat(data.slice(offset, finish));
    }

    shuffleInt8ArraySegment(data, newdata, offset, finish, position) {
        newdata.set(new Int8Array(data.slice(offset, finish)), position);
    }

    shuffle(data) {
        let offset;
        let finish;
        let position;
        if (typeof(data) !== 'string') { data.length = data.byteLength; }
        let newData = (typeof(data) === 'string') ? '' : new Int8Array(data.length);
        const matrix = this.getShuffleMatrix(data.length);
        const segmentLength = Math.floor(data.length / (matrix.length + 1));

        for (let i = 0; i < matrix.length; i++) {
            for (let ii = 0; ii < matrix.length; ii++) {
                if (matrix[ii] === i) {
                    offset = ii * segmentLength;
                    finish = offset + segmentLength;
                    position = i * segmentLength;
                    this.shuffleSegment(data, newData, offset, finish, position);
                    break;
                }
            }
        }

        offset = matrix.length * segmentLength;
        finish = data.length;
        position = matrix.length * segmentLength;
        this.shuffleSegment(data, newData, offset, finish, position);
        if (typeof(data) !== 'string') {
            newData = newData.buffer.slice(0);
        }
        return newData;
    }

    unShuffle(data) {
        // const tic = new Date().getTime();
        // let offset;
        // let finish;
        // let position;
        let matrixOffset;
        if (typeof(data) !== 'string') { data.length = data.byteLength; }
        let newData = (typeof(data) === 'string') ? '' : new Int8Array(data.length);
        const matrix = this.getShuffleMatrix(data.length);
        const segmentLength = Math.floor(data.length / (matrix.length + 1));
        const dataLength = data.length;
        const matrixLength = matrix.length;
        if (typeof(newdata) === 'string') {
            for (let i = 0; i < matrixLength; i++) {
                matrixOffset = matrix[i];
                newData.concat(data.slice(matrixOffset * segmentLength, (matrixOffset + 1) * segmentLength));
            }
            newData.concat(data.slice(matrixLength * segmentLength, dataLength));
        } else {
            for (let i = 0; i < matrixLength; i++) {
                matrixOffset = matrix[i];
                newData.set(new Int8Array(data.slice(matrixOffset * segmentLength, (matrixOffset + 1) * segmentLength)), i * segmentLength);
            }
            newData.set(new Int8Array(data.slice(matrixLength * segmentLength, dataLength)), matrixLength * segmentLength);
        }
        if (typeof(data) !== 'string') {
            newData = newData.buffer.slice(0);
        }
        data = null;
        // console.log((new Date().getTime() - tic) / 1000);
        return newData;
    }
}
