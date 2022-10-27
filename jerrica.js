function createTrack(ac, buf) {
    var track = {  };
    canon = 8363;
    track.ref = 428;
    track.iota = 0.005;
    track.sineTable = (function () {
        var span = (2 * Math.PI) / 63.0;
        var collecting805 = [];
        for (var i = 0; i <= 63; i += 1) {
            collecting805.push(Math.floor(256 * Math.sin(i * span)));
        };
        __PS_MV_REG = [];
        return collecting805;
    })();
    track.output = ac.createGain();
    track.left = ac.createStereoPanner();
    track.right = ac.createStereoPanner();
    track.left.connect(track.output);
    track.right.connect(track.output);
    track.output.connect(ac.destination);
    track.left.pan.value = -0.75;
    track.right.pan.value = 0.75;
    function semitones(n) {
        __PS_MV_REG = [];
        return Math.pow(Math.pow(2, 1 / 12.0), n);
    };
    track.samples = (function () {
        var b;
        var collecting806 = [];
        for (var i = 20; i <= 920; i += 30) {
            collecting806.push({ length : 2 * (256 * buf[i + 22] + buf[i + 23]),
                                 finetune : (b = buf[i + 24], (b &= 15, b > 7 ? (b -= 16) : null, b)),
                                 vol : buf[i + 25],
                                 loopStart : 2 * (256 * buf[i + 26] + buf[i + 27]),
                                 loopLength : 2 * (256 * buf[i + 28] + buf[i + 29])
                               });
        };
        __PS_MV_REG = [];
        return collecting806;
    })();
    track.samples.unshift(null);
    track.count = buf[950];
    track.jump = buf[951];
    track['final'] = 0;
    track.table = (function () {
        var _js807 = track.count - 1;
        var val = 0;
        var collecting808 = [];
        for (var i = 0; i <= _js807; i += 1) {
            val = buf[i + 952];
            track['final'] = Math.max(track['final'], val);
            collecting808.push(val);
        };
        __PS_MV_REG = [];
        return collecting808;
    })();
    track.tag = (function () {
        var collecting809 = [];
        for (var i = 0; i <= 3; i += 1) {
            collecting809.push(String.fromCharCode(buf[i + 1080]));
        };
        __PS_MV_REG = [];
        return collecting809;
    })();
    track.tag = track.tag.join('');
    track.patterns = (function () {
        var _js810 = track['final'];
        var collecting811 = [];
        for (var pt = 0; pt <= _js810; pt += 1) {
            collecting811.push((function () {
                var collecting812 = [];
                for (var ln = 0; ln <= 63; ln += 1) {
                    collecting812.push((function () {
                        var i;
                        var a;
                        var b;
                        var c;
                        var d;
                        var period;
                        var effect;
                        var collecting813 = [];
                        for (var ch = 0; ch <= 3; ch += 1) {
                            collecting813.push((i = 1084 + 1024 * pt + ln * 16 + ch * 4, (a = buf[i + 0], (b = buf[i + 1], (c = buf[i + 2], (d = buf[i + 3], (period = (a & 15) * 256 + b, (effect = c & 15, { sample : (a & 240) + (c & 240) / 16,
                                                                                                                          period : effect === 3 ? 0 : period,
                                                                                                                          effect : { effect : effect,
                                                                                                                                     xy : d,
                                                                                                                                     x : (d & 240) / 16,
                                                                                                                                     y : d & 15,
                                                                                                                                     z : period
                                                                                                                                   }
                                                                                                                        }))))))));
                        };
                        __PS_MV_REG = [];
                        return collecting813;
                    })());
                };
                __PS_MV_REG = [];
                return collecting812;
            })());
        };
        __PS_MV_REG = [];
        return collecting811;
    })();
    var i = 1084 + 1024 + track['final'] * 1024;
    for (var smp = 1; smp <= 31; smp += 1) {
        var sample = track.samples[smp];
        if (sample.length > 0) {
            var data = ac.createBuffer(1, sample.length, canon);
            var _js812 = sample.length - 1;
            var cd = data.getChannelData(0);
            for (var j = 0; j <= _js812; j += 1) {
                var val = buf[i];
                if (val > 127) {
                    val -= 256;
                };
                cd[j] = Math.max((sample.vol / 64) * (1 / 2.0) * (val / 127), -1);
                i += 1;
                sample.buf = data;
            };
        };
    };
    track.clock = -Infinity;
    track.bpm = 125;
    track.speed = 6;
    function tickSec() {
        return 5 / (2.0 * track.bpm);
    };
    function lineSec() {
        __PS_MV_REG = [];
        return tickSec() * track.speed;
    };
    track.pidx = 0;
    track.lidx = 0;
    track.chans = (function () {
        var gain;
        var collecting812 = [];
        for (var i = 0; i <= 3; i += 1) {
            collecting812.push((gain = ac.createGain(), (gain.period = 0, gain.vol = 1, gain.slideRate = 1, gain.slideGoal = track.ref, gain.vibTable = track.sineTable, gain.vibRetrigger = false, gain.vibIdx = 0, gain.vibSpeed = 1, gain.vibDepth = 1, gain.trmTable = track.sineTable, gain.trmRetrigger = false, gain.trmIdx = 0, gain.trmSpeed = 1, gain.trmDepth = 1, gain.loopStart = 0, gain.loopCount = 0, gain.lastSample = 0, gain.connect(i % 2 === 0 ? track.left : track.right), gain)));
        };
        __PS_MV_REG = [];
        return collecting812;
    })();
    track.voices = (function () {
        var collecting813 = [];
        for (var i = 0; i <= 3; i += 1) {
            collecting813.push(ac.createBufferSource());
        };
        __PS_MV_REG = [];
        return collecting813;
    })();
    var _js814 = track.voices;
    var _js816 = _js814.length;
    for (var _js815 = 0; _js815 < _js816; _js815 += 1) {
        var voice = _js814[_js815];
        voice.start(0);
    };
    function finetunePeriod(period, finetune) {
        __PS_MV_REG = [];
        return Math.round(period * Math.pow(Math.pow(2, 1 / (12 * 8.0)), -finetune));
    };
    function createNote(sample, period, cidx) {
        var note = ac.createBufferSource();
        note.connect(track.chans[cidx]);
        track.chans[cidx].vol = 1;
        note.buffer = sample.buf;
        note.period = finetunePeriod(period, sample.finetune);
        note.playbackRate.value = track.ref / note.period;
        if (sample.loopLength > 2) {
            note.loop = true;
            note.loopStart = sample.loopStart / canon;
            note.loopEnd = note.loopStart + sample.loopLength / canon;
        };
        __PS_MV_REG = [];
        return note;
    };
    function processChannel(ch, cidx) {
        var object817;
        var note = track.voices[cidx];
        var voice = track.voices[cidx];
        var gain = track.chans[cidx];
        var period818 = ch.period;
        var sample819 = track.samples[ch.sample];
        var offset = 0;
        var effect820 = (object817 = ch.effect, { effect : object817.effect,
                                               xy : object817.xy,
                                               x : object817.x,
                                               y : object817.y,
                                               z : object817.z
                                             });
        var mark = track.clock;
        if (period818 !== 0) {
            gain.period = period818;
        };
        period818 = gain.period;
        if (ch.sample !== 0) {
            gain.lastSample = ch.sample;
        };
        if (effect820.effect === 9) {
            offset = ((effect820.xy * 256) / sample819.length) * sample819.buf.duration;
        };
        if (effect820.effect === 14 && effect820.x === 13 && effect820.y < track.speed - 1) {
            mark += tickSec() * effect820.y;
        };
        if (ch.sample > 0 && period818 > 0) {
            note = createNote(sample819, period818, cidx);
            gain.gain.setTargetAtTime(gain.vol, mark, track.iota);
            voice.stop(mark);
            note.start(mark, offset);
        };
        if (effect820.effect === 0) {
            if (effect820.xy !== 0) {
                var _js821 = track.speed - 1;
                for (var i = 1; i <= _js821; i += 1) {
                    switch (i % 3) {
                    case 0:
                        note.playbackRate.setTargetAtTime(track.ref / note.period, mark + i * tickSec(), track.iota);
                        break;
                    case 1:
                        note.playbackRate.setTargetAtTime((track.ref / note.period) * semitones(effect820.x), mark + i * tickSec(), track.iota);
                        break;
                    case 2:
                        note.playbackRate.setTargetAtTime((track.ref / note.period) * semitones(effect820.y), mark + i * tickSec(), track.iota);
                    };
                };
            };
        };
        if (effect820.effect === 1) {
            note.playbackRate.setTargetAtTime(track.ref / (note.period - effect820.xy), mark + tickSec(), track.iota);
            note.period -= (track.speed - 1) * effect820.xy;
            note.playbackRate.linearRampToValueAtTime(track.ref / note.period, mark + lineSec());
        };
        if (effect820.effect === 2) {
            note.playbackRate.setTargetAtTime(track.ref / (note.period + effect820.xy), mark + tickSec(), track.iota);
            note.period += (track.speed - 1) * effect820.xy;
            note.playbackRate.linearRampToValueAtTime(track.ref / note.period, mark + lineSec());
        };
        if (effect820.effect === 10 || effect820.effect === 5 || effect820.effect === 6) {
            if (!(effect820.x > 0 && effect820.y > 0)) {
                var slide = (effect820.x - effect820.y) / 64.0;
                var vol822 = Math.max(Math.min(gain.vol + slide * (track.speed - 1), 1.0), 0);
                gain.gain.setTargetAtTime(gain.vol, mark + tickSec(), track.iota);
                gain.vol = vol822;
                gain.gain.linearRampToValueAtTime(vol822, mark + lineSec());
            };
            effect820.x = 0;
            effect820.y = 0;
        };
        if (effect820.effect === 3 || effect820.effect === 5) {
            if (effect820.z !== 0) {
                gain.slideGoal = effect820.z;
            };
            if (effect820.xy !== 0) {
                gain.slideRate = effect820.xy;
            };
            var diff = finetunePeriod(gain.slideGoal, track.samples[gain.lastSample].finetune) - note.period;
            var ticks = Math.min(Math.floor(Math.abs(diff) / gain.slideRate), track.speed - 1);
            var delta = gain.slideRate * ticks * Math.sign(diff);
            note.playbackRate.setTargetAtTime(track.ref / note.period, mark + tickSec(), track.iota);
            note.period += delta;
            note.playbackRate.linearRampToValueAtTime(track.ref / note.period, mark + lineSec());
        };
        if (effect820.effect === 4 || effect820.effect === 6) {
            if (effect820.x !== 0) {
                gain.vibSpeed = effect820.x;
            };
            if (effect820.y !== 0) {
                gain.vibDepth = effect820.y;
            };
            if (gain.vibRetrigger && period818 !== 0) {
                gain.vibIdx = 0;
            };
            var _js823 = track.speed - 1;
            for (var i = 1; i <= _js823; i += 1) {
                note.playbackRate.setTargetAtTime(track.ref / (note.period + (gain.vibTable[gain.vibIdx] * gain.vibDepth) / 128), mark + i * tickSec(), track.iota);
                gain.vibIdx += gain.vibSpeed;
                if (gain.vibIdx > 63) {
                    gain.vibIdx = 0;
                };
            };
        };
        if (effect820.effect === 7) {
            if (effect820.x !== 0) {
                gain.trmSpeed = effect820.x;
            };
            if (effect820.y !== 0) {
                gain.trmDepth = effect820.y;
            };
            if (gain.trmRetrigger && period818 !== 0) {
                gain.trmIdx = 0;
            };
            var _js824 = track.speed - 1;
            for (var i = 1; i <= _js824; i += 1) {
                gain.gain.setTargetAtTime(Math.max(Math.min(gain.vol + (gain.trmTable[gain.trmIdx] * gain.trmDepth) / 64 / 64, 1), 0), mark + i * tickSec(), track.iota);
                gain.trmIdx += gain.trmSpeed;
                if (gain.trmIdx > 63) {
                    gain.trmIdx = 0;
                };
            };
        };
        if (effect820.effect === 11) {
            track.lidx = -1;
            track.pidx = Math.min(effect820.xy, track.count - 1);
        };
        if (effect820.effect === 12) {
            gain.vol = Math.max(Math.min(effect820.xy / 64.0, 1), 0);
            gain.gain.setTargetAtTime(gain.vol, mark, track.iota);
        };
        if (effect820.effect === 13) {
            var dst = effect820.x * 10 + effect820.y;
            if (dst > 63) {
                dst = 0;
            };
            track.lidx = dst - 1;
            track.pidx += 1;
            if (track.pidx >= track.count) {
                if (track.jump < 127) {
                    track.pidx = track.jump;
                } else {
                    track.done = true;
                };
            };
        };
        if (effect820.effect === 14 && effect820.x === 1) {
            note.period -= effect820.y;
            note.playbackRate.setTargetAtTime(track.ref / note.period, mark, track.iota);
        };
        if (effect820.effect === 14 && effect820.x === 2) {
            note.period += effect820.y;
            note.playbackRate.setTargetAtTime(track.ref / note.period, mark, track.iota);
        };
        if (effect820.effect === 14 && effect820.x === 6) {
            if (effect820.y === 0) {
                gain.loopStart = track.lidx - 1;
            } else {
                gain.loopCount += 1;
                if (gain.loopCount <= effect820.y) {
                    track.lidx = gain.loopStart;
                } else {
                    gain.loopCount = 0;
                };
            };
        };
        if (effect820.effect === 14 && effect820.x === 9 && gain.lastSample !== 0) {
            var _js825 = track.speed - 1;
            for (var i = 1; i <= _js825; i += 1) {
                if (i % effect820.y === 0) {
                    note.stop(mark + i * tickSec());
                    note = createNote(track.samples[gain.lastSample], period818, cidx);
                    gain.gain.setTargetAtTime(gain.vol, mark + i * tickSec(), track.iota);
                    note.start(mark + i * tickSec(), offset);
                };
            };
        };
        if (effect820.effect === 14 && effect820.x === 10) {
            gain.vol = Math.max(Math.min(gain.vol + effect820.y / 64.0, 1), 0);
            gain.gain.setTargetAtTime(gain.vol, mark, track.iota);
        };
        if (effect820.effect === 14 && effect820.x === 11) {
            gain.vol = Math.max(Math.min(gain.vol - effect820.y / 64.0, 1), 0);
            gain.gain.setTargetAtTime(gain.vol, mark, track.iota);
        };
        if (effect820.effect === 14 && effect820.x === 12 && effect820.y < track.speed - 1) {
            gain.vol = 0;
            gain.gain.setTargetAtTime(gain.vol, mark + effect820.y * tickSec(), track.iota);
        };
        if (effect820.effect === 15) {
            if (effect820.xy > 31) {
                track.bpm = effect820.xy;
            } else {
                track.speed = effect820.xy;
            };
        };
        __PS_MV_REG = [];
        return track.voices[cidx] = note;
    };
    track.done = false;
    function processLine() {
        var _js826 = track.patterns[track.table[track.pidx]][track.lidx];
        var _js828 = _js826.length;
        var FIRST829 = true;
        for (var _js827 = 0; _js827 < _js828; _js827 += 1) {
            var ch = _js826[_js827];
            var i = FIRST829 ? 0 : i + 1;
            if (i > 3) {
                break;
            };
            processChannel(ch, i);
            FIRST829 = null;
        };
        track.lidx += 1;
        if (track.lidx > 63) {
            track.lidx = 0;
            track.pidx += 1;
            if (track.pidx >= track.count) {
                if (track.jump < 127) {
                    track.pidx = track.jump;
                } else {
                    track.done = true;
                };
            };
        };
        __PS_MV_REG = [];
        return track.clock += lineSec();
    };
    function sprocessMusic() {
        if (track.done) {
            return;
        };
        if (ac.currentTime - track.clock > 2) {
            track.clock = ac.currentTime;
        };
        while (track.clock - ac.currentTime < 1 && !track.done) {
            processLine();
        };
    };
    track.processMusic = sprocessMusic;
    __PS_MV_REG = [];
    return track;
};
