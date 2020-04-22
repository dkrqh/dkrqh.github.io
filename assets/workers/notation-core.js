'use strict';
// importScripts('cryptography-base.js');

class Notation {

    constructor(params = { eventText: undefined, notationText: undefined }) {
        let measures = JSON.parse(params.eventText);
        this.notation = JSON.parse(params.notationText);
        // return { measures: this.measures, notation: this.notation };
        let systemMeasureIndexes = [];
        let currentSystemMesaureIndexes = [];
        let lastOffsetY = measures[0].offset.y;
        for (let i = 0; i < measures.length; i++) {
            if (measures[i].offset.y !== lastOffsetY) {
                lastOffsetY = measures[i].offset.y;
                systemMeasureIndexes.push(currentSystemMesaureIndexes);
                currentSystemMesaureIndexes = [];
            }
            currentSystemMesaureIndexes.push(i);
        }
        systemMeasureIndexes.push(currentSystemMesaureIndexes);
        for (let i = 0; i < measures.length; i++) {
            for (let ii = 0; ii < systemMeasureIndexes.length; ii++) {
                if (i >= systemMeasureIndexes[ii][0] &&
                    i <= systemMeasureIndexes[ii][systemMeasureIndexes[ii].length - 1]) {
                    measures[i].systemIndex = ii;
                    break;
                }
            }
        }
        // 마디 비트 인덱스 설정.
        let beatIndex = 0;
        let measureIndex = 0;
        for (let i = 0; i < measures.length; i++) {
            measures[i].index = measureIndex;
            measureIndex = measureIndex + 1;
            for (let ii = 0; ii < measures[i].beats.length; ii++) {
                measures[i].beats[ii].index = beatIndex;
                beatIndex = beatIndex + 1;
            }
        }
        // 마디 비트 시간 설정.
        for (let i = 0; i < measures.length; i++) {
            measures[i].isSecond = (second) => {
                // second = second / this.parent.audio.timeStretch;
                return (i < measures.length - 1 &&
                        second >= measures[i].offset.second / this.parent.audio.tempoRatio &&
                        second < measures[i].finish.second / this.parent.audio.tempoRatio) ||
                    (i === measures.length - 1 &&
                        second >= measures[i].offset.second / this.parent.audio.tempoRatio);
            };
            for (let ii = 0; ii < measures[i].beats.length; ii++) {
                measures[i].beats[ii].isSecond = (second) => {
                    // second = second / this.parent.audio.timeStretch;
                    return ((i < measures.length - 1 || ii < measures[i].beats.length - 1) &&
                            second >= measures[i].beats[ii].offset.second / this.parent.audio.tempoRatio &&
                            second < measures[i].beats[ii].finish.second / this.parent.audio.tempoRatio) ||
                        ((i === measures.length - 1 && ii === measures[i].beats.length - 1) &&
                            second >= measures[i].beats[ii].offset.second / this.parent.audio.tempoRatio);
                };
            }
        }
        this.measures = measures;
    }

    getSystems(params = { clientWidth: undefined, offsetY: undefined, divElement: undefined }) {
        let width = params.clientWidth;
        let offsetY = params.offsetY;
        this.clientWidth = params.clientWidth;
        if (!this.systems) {
            this.systems = [];
            for (let i = 0; i < this.notation.length; i++) {
                // let visible = document.createElement('div');
                let visible = divElement.slice(0);
                visible.setAttribute('id', 'svg-system-' + i.toString());
                visible.innerHTML = this.notation[i].svg.trim();
                let visibleSVG = visible.children[0];
                let height = this.notation[i].viewbox.height *
                    (this.clientWidth / this.notation[i].viewbox.width);
                visibleSVG.setAttribute('style', 'width: 100%;');
                visibleSVG.setAttribute('width', width.toString() + 'px');
                visibleSVG.setAttribute('height', height.toString() + 'px');

                // let invisible = document.createElement('div');
                let invisible = divElement.slice(0);
                invisible.setAttribute('class', 'invisible');
                invisible.setAttribute('style', [
                    'width: ' + width.toString() + 'px',
                    'height: ' + (height + 4).toString() + 'px',
                    // 'background-color: #808080'
                ].join('; '));
                this.systems.push({
                    index: i,
                    offset: { x: 0, y: offsetY },
                    finish: { x: width, y: offsetY + height },
                    width: width,
                    height: height,
                    aspectRatio: height / width,
                    viewBox: this.notation[i].viewbox,
                    isVisible: false,
                    svg: {
                        visible: visible,
                        invisible: invisible
                    },
                });
                offsetY += height + 4;
            }
        } else {
            for (let i = 0; i < this.systems.length; i++) {
                let height = width * this.systems[i].aspectRatio;
                this.systems[i].svg.visible.children[0].setAttribute('width', width.toString() + 'px');
                this.systems[i].svg.visible.children[0].setAttribute('height', height.toString() + 'px');
                this.systems[i].svg.invisible.setAttribute('style', [
                    'width: ' + width.toString() + 'px',
                    'height: ' + (height + 4).toString() + 'px',
                ].join('; '));
                this.systems[i].width = width;
                this.systems[i].height = height;
                this.systems[i].offset = { x: 0, y: offsetY };
                this.systems[i].finish = { x: width, y: offsetY + height };
                offsetY += height + 4;
            }
        }
        return { systems: this.systems, offsetY: offsetY };
    }

    setNotationSystems(params = { clientWidth: 0, clientHeight: 0, eventText: undefined, notationText: undefined }) {

        let measures;
        if (params.eventText) { measures = JSON.parse(params.eventText); }
        if (params.notationText) { this.notation = JSON.parse(params.notationText); }

        // console.log(this.notation);
        this.clientWidth = params.clientWidth;
        this.clientHeight = params.clientHeight;
        // this.clientWidth = this.element.clientWidth(true);
        // this.clientHeight = this.element.clientHeight(true);
        let scale = this.clientWidth / this.notation[0].viewbox.width;
        this.scale = scale;
        let systemHeight = this.notation[0].viewbox.height * scale;
        let staffHeight = this.notation[0].measures[0].height * scale;
        let systemMarginHeight = systemHeight - staffHeight;

        // 악보 상하 여백설정.
        // this.element.notationHeaderBottomMargin().css({
        //     'height': +(systemMarginHeight * 0.5).toString() + 'px'
        // });
        // this.element.notationFooterMargin().css({
        //     'position': 'absolute',
        //     'height': +(this.element.toolbar().height() + systemMarginHeight * 0.5).toString() + 'px'
        // });

        let offsetY = this.element.notationHeader(true)[0].offsetHeight;
        let width = this.clientWidth;
        if (notationText) {
            this.systems = [];
            for (let i = 0; i < this.notation.length; i++) {
                let visible = document.createElement('div');
                visible.setAttribute('id', 'svg-system-' + i.toString());
                visible.innerHTML = this.notation[i].svg.trim();
                let visibleSVG = visible.children[0];
                let height = this.notation[i].viewbox.height *
                    (this.clientWidth / this.notation[i].viewbox.width);
                visibleSVG.setAttribute('style', 'width: 100%;');
                visibleSVG.setAttribute('width', width.toString() + 'px');
                visibleSVG.setAttribute('height', height.toString() + 'px');

                let invisible = document.createElement('div');
                invisible.setAttribute('class', 'invisible');
                invisible.setAttribute('style', [
                    'width: ' + width.toString() + 'px',
                    'height: ' + (height + 4).toString() + 'px',
                    // 'background-color: #808080'
                ].join('; '));
                this.systems.push({
                    index: i,
                    offset: { x: 0, y: offsetY },
                    finish: { x: width, y: offsetY + height },
                    width: width,
                    height: height,
                    aspectRatio: height / width,
                    viewBox: this.notation[i].viewbox,
                    isVisible: false,
                    svg: {
                        visible: visible,
                        invisible: invisible
                    },
                });
                offsetY += height + 4;
            }
        } else {
            for (let i = 0; i < this.systems.length; i++) {
                let height = width * this.systems[i].aspectRatio;
                this.systems[i].svg.visible.children[0].setAttribute('width', width.toString() + 'px');
                this.systems[i].svg.visible.children[0].setAttribute('height', height.toString() + 'px');
                this.systems[i].svg.invisible.setAttribute('style', [
                    'width: ' + width.toString() + 'px',
                    'height: ' + (height + 4).toString() + 'px',
                ].join('; '));
                this.systems[i].width = width;
                this.systems[i].height = height;
                this.systems[i].offset = { x: 0, y: offsetY };
                this.systems[i].finish = { x: width, y: offsetY + height };
                offsetY += height + 4;
            }
        }
        this.notationHeight = offsetY + this.element.notationFooter()[0].offsetHeight;

        this.element.notationFooterMargin().css({
            'top': offsetY.toString() + 'px'
        });

        if (measures !== undefined) {
            // 시스템 인덱스 찾기.
            let systemMeasureIndexes = [];
            let currentSystemMesaureIndexes = [];
            let lastOffsetY = measures[0].offset.y;
            for (let i = 0; i < measures.length; i++) {
                if (measures[i].offset.y !== lastOffsetY) {
                    lastOffsetY = measures[i].offset.y;
                    systemMeasureIndexes.push(currentSystemMesaureIndexes);
                    currentSystemMesaureIndexes = [];
                }
                currentSystemMesaureIndexes.push(i);
            }
            systemMeasureIndexes.push(currentSystemMesaureIndexes);
            for (let i = 0; i < measures.length; i++) {
                for (let ii = 0; ii < systemMeasureIndexes.length; ii++) {
                    if (i >= systemMeasureIndexes[ii][0] &&
                        i <= systemMeasureIndexes[ii][systemMeasureIndexes[ii].length - 1]) {
                        measures[i].systemIndex = ii;
                        break;
                    }
                }
            }
            // 마디 비트 인덱스 설정.
            let beatIndex = 0;
            let measureIndex = 0;
            for (let i = 0; i < measures.length; i++) {
                measures[i].index = measureIndex;
                measureIndex = measureIndex + 1;
                for (let ii = 0; ii < measures[i].beats.length; ii++) {
                    measures[i].beats[ii].index = beatIndex;
                    beatIndex = beatIndex + 1;
                }
            }
            // 마디 비트 시간 설정.
            for (let i = 0; i < measures.length; i++) {
                measures[i].isSecond = (second) => {
                    // second = second / this.parent.audio.timeStretch;
                    return (i < measures.length - 1 &&
                            second >= measures[i].offset.second / this.parent.audio.tempoRatio &&
                            second < measures[i].finish.second / this.parent.audio.tempoRatio) ||
                        (i === measures.length - 1 &&
                            second >= measures[i].offset.second / this.parent.audio.tempoRatio);
                };
                for (let ii = 0; ii < measures[i].beats.length; ii++) {
                    measures[i].beats[ii].isSecond = (second) => {
                        // second = second / this.parent.audio.timeStretch;
                        return ((i < measures.length - 1 || ii < measures[i].beats.length - 1) &&
                                second >= measures[i].beats[ii].offset.second / this.parent.audio.tempoRatio &&
                                second < measures[i].beats[ii].finish.second / this.parent.audio.tempoRatio) ||
                            ((i === measures.length - 1 && ii === measures[i].beats.length - 1) &&
                                second >= measures[i].beats[ii].offset.second / this.parent.audio.tempoRatio);
                    };
                }
            }
        }

        if (measures === undefined) { measures = this.measures; }

        // 마디 터치 이벤트 좌표 설정.
        // 마디 자동 스크롤 최적 위치 설정.
        let bestTopMargin = 0;
        // 가운데 정렬(시스템이 하나이거나 하단으로 쏠림이 발생하는 경우).
        if (systemMarginHeight === 0 || this.clientHeight - systemHeight - systemMarginHeight - 2 < 0) {
            bestTopMargin = (this.clientHeight - staffHeight) * 0.5;
        }
        // 가운데 일단마진 정렬.
        else if (this.clientHeight - systemHeight * 2 - systemMarginHeight - 2 < 0) {
            bestTopMargin = (this.clientHeight - staffHeight - systemHeight - 2) * 0.5;
        }
        // 상단 일단마진 정렬.
        else if (this.clientHeight - systemHeight * 3 - systemMarginHeight - 2 < 0) {
            bestTopMargin = systemMarginHeight - 2;
        }
        // 상단 이단마진 정렬.
        else {
            bestTopMargin = systemHeight + systemMarginHeight - 2;
        }

        let touchMargin = 10;
        for (let i = 0; i < measures.length; i++) {
            let system = this.systems[measures[i].systemIndex];

            // let scale = this.clientWidth / system.viewBox.width;
            // let systemHeight = this.notation[0].viewbox.height * scale;
            // let staffHeight = this.notation[0].measures[0].height * scale;
            // console.log(scale);

            let left = (measures[i].offset.x - system.viewBox.offset.x) * scale;
            let right = (measures[i].finish.x - system.viewBox.offset.x) * scale;
            let top = (this.notation[measures[i].systemIndex].measures[0].offset.y -
                system.viewBox.offset.y) * scale + system.offset.y;
            let bottom = (this.notation[measures[i].systemIndex].measures[0].finish.y -
                system.viewBox.offset.y) * scale + system.offset.y;
            measures[i].event = {
                offset: { x: left, y: top },
                finish: { x: right, y: bottom }
            };
            measures[i].isTouched = (event) => {
                return event.offsetY >= this.measures[i].event.offset.y - touchMargin &&
                    event.offsetY < this.measures[i].event.finish.y + touchMargin &&
                    event.offsetX >= this.measures[i].event.offset.x &&
                    event.offsetX < this.measures[i].event.finish.x
            }
            measures[i].bestScrollTop = Math.floor(top - bestTopMargin);

            measures[i].cursor = {
                class: ['cursor-measure-' + i.toString()],
                offset: { x: left, y: top },
                finish: { x: right, y: bottom },
                width: right - left,
                height: bottom - top,
                selected: false
            };
        }
        this.measures = measures;
        // console.log(this.measures);

        if (notationText) {
            this.updateVisibleSystem(0, true);
        } else {
            this.lockScroll();
            let current = this.getCurrent();
            this.scrollToMeasure(current.measure, true, 1, () => {
                let current = this.getCurrent();
                this.parent.animation.current.measure = current.measure;
                this.updateVisibleSystem(current.measure.bestScrollTop, true);
                this.setCursorMeasure(current.measure);
            });
        }

        return [this.systems, this.measures, this.notationHeight, offsetY, systemMarginHeight];
    }

    getMeasureBeatByIndex(second, i, ii) {
        let measure = $.extend(true, {}, this.measures[i]);
        measure.offset.second = measure.offset.second / this.parent.audio.tempoRatio;
        measure.finish.second = measure.finish.second / this.parent.audio.tempoRatio;
        measure.duration = measure.duration / this.parent.audio.tempoRatio;
        let beat = $.extend(true, {}, this.measures[i].beats[ii]);
        beat.offset.tempo = beat.offset.tempo * this.parent.audio.tempoRatio;
        beat.offset.second = beat.offset.second / this.parent.audio.tempoRatio;
        beat.finish.tempo = beat.finish.tempo * this.parent.audio.tempoRatio;
        beat.finish.second = beat.finish.second / this.parent.audio.tempoRatio;
        beat.duration = beat.duration / this.parent.audio.tempoRatio;
        for (let i = 0; i < measure.beats.length; i++) {
            measure.beats[i].offset.tempo = measure.beats[i].offset.tempo * this.parent.audio.tempoRatio;
            measure.beats[i].offset.second = measure.beats[i].offset.second / this.parent.audio.tempoRatio;
            measure.beats[i].finish.tempo = measure.beats[i].finish.tempo * this.parent.audio.tempoRatio;
            measure.beats[i].finish.second = measure.beats[i].finish.second / this.parent.audio.tempoRatio;
            measure.beats[i].duration = measure.beats[i].duration / this.parent.audio.tempoRatio;
        }
        return { beat: beat, second: second, measure: measure };
    }

    getCurrent(audioCurrentSecond) {
        let second = audioCurrentSecond;
        for (let i = 0; i < this.measures.length; i++) {
            if (this.measures[i].isSecond(second)) {
                for (let ii = 0; ii < this.measures[i].beats.length; ii++) {
                    if (this.measures[i].beats[ii].isSecond(second)) {
                        return this.getMeasureBeatByIndex(second, i, ii);
                    }
                }
            }
        }
        return this.getMeasureBeatByIndex(0, 0, 0);
    }

    getMeasureBySecond(second) {
        for (let i = 0; i < this.measures.length; i++) {
            if (this.measures[i].isSecond(second)) {
                return this.getMeasureBeatByIndex(second, i, 0).measure;
            }
        }
        return this.measures[0];
    }
}
