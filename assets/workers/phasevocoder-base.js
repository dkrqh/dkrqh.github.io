'use strict';

let child = {

    bitrv2: (n, ipBuffer, ipOffset, aBuffer) => {
        let j, j1, k, k1, l, m;
        let xr, xi, yr, yi;

        // Create some views on the raw buffers
        const ip = new Int16Array(ipBuffer).subarray(ipOffset);
        const a = new Float32Array(aBuffer);

        ip[0] = 0;
        l = n;
        m = 1;
        while ((m << 3) < l) {
            l >>= 1;
            for (j = 0; j < m; j++) {
                ip[m + j] = ip[j] + l;
            }
            m <<= 1;
        }
        const m2 = 2 * m;
        if ((m << 3) === l) {
            for (k = 0; k < m; k++) {
                for (j = 0; j < k; j++) {
                    j1 = 2 * j + ip[k];
                    k1 = 2 * k + ip[j];
                    xr = a[j1];
                    xi = a[j1 + 1];
                    yr = a[k1];
                    yi = a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                    j1 += m2;
                    k1 += 2 * m2;
                    xr = a[j1];
                    xi = a[j1 + 1];
                    yr = a[k1];
                    yi = a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                    j1 += m2;
                    k1 -= m2;
                    xr = a[j1];
                    xi = a[j1 + 1];
                    yr = a[k1];
                    yi = a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                    j1 += m2;
                    k1 += 2 * m2;
                    xr = a[j1];
                    xi = a[j1 + 1];
                    yr = a[k1];
                    yi = a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                }
                j1 = 2 * k + m2 + ip[k];
                k1 = j1 + m2;
                xr = a[j1];
                xi = a[j1 + 1];
                yr = a[k1];
                yi = a[k1 + 1];
                a[j1] = yr;
                a[j1 + 1] = yi;
                a[k1] = xr;
                a[k1 + 1] = xi;
            }
        } else {
            for (k = 1; k < m; k++) {
                for (j = 0; j < k; j++) {
                    j1 = 2 * j + ip[k];
                    k1 = 2 * k + ip[j];
                    xr = a[j1];
                    xi = a[j1 + 1];
                    yr = a[k1];
                    yi = a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                    j1 += m2;
                    k1 += m2;
                    xr = a[j1];
                    xi = a[j1 + 1];
                    yr = a[k1];
                    yi = a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                }
            }
        }
    },
    bitrv2: (n, ipBuffer, ipOffset, aBuffer) => {
        let j, j1, k, k1, l, m;
        let xr, xi, yr, yi;

        // Create some views on the raw buffers
        const ip = new Int16Array(ipBuffer).subarray(ipOffset);
        const a = new Float32Array(aBuffer);

        ip[0] = 0;
        l = n;
        m = 1;
        while ((m << 3) < l) {
            l >>= 1;
            for (j = 0; j < m; j++) {
                ip[m + j] = ip[j] + l;
            }
            m <<= 1;
        }
        const m2 = 2 * m;
        if ((m << 3) === l) {
            for (k = 0; k < m; k++) {
                for (j = 0; j < k; j++) {
                    j1 = 2 * j + ip[k];
                    k1 = 2 * k + ip[j];
                    xr = a[j1];
                    xi = a[j1 + 1];
                    yr = a[k1];
                    yi = a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                    j1 += m2;
                    k1 += 2 * m2;
                    xr = a[j1];
                    xi = a[j1 + 1];
                    yr = a[k1];
                    yi = a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                    j1 += m2;
                    k1 -= m2;
                    xr = a[j1];
                    xi = a[j1 + 1];
                    yr = a[k1];
                    yi = a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                    j1 += m2;
                    k1 += 2 * m2;
                    xr = a[j1];
                    xi = a[j1 + 1];
                    yr = a[k1];
                    yi = a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                }
                j1 = 2 * k + m2 + ip[k];
                k1 = j1 + m2;
                xr = a[j1];
                xi = a[j1 + 1];
                yr = a[k1];
                yi = a[k1 + 1];
                a[j1] = yr;
                a[j1 + 1] = yi;
                a[k1] = xr;
                a[k1 + 1] = xi;
            }
        } else {
            for (k = 1; k < m; k++) {
                for (j = 0; j < k; j++) {
                    j1 = 2 * j + ip[k];
                    k1 = 2 * k + ip[j];
                    xr = a[j1];
                    xi = a[j1 + 1];
                    yr = a[k1];
                    yi = a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                    j1 += m2;
                    k1 += m2;
                    xr = a[j1];
                    xi = a[j1 + 1];
                    yr = a[k1];
                    yi = a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                }
            }
        }
    },
    bitrv2conj: (n, ipBuffer, ipOffset, aBuffer) => {
        let j, j1, k, k1, l, m;
        let xr, xi, yr, yi;

        const ip = new Int16Array(ipBuffer).subarray(ipOffset);
        const a = new Float32Array(aBuffer);

        ip[0] = 0;
        l = n;
        m = 1;
        while ((m << 3) < l) {
            l >>= 1;
            for (j = 0; j < m; j++) {
                ip[m + j] = ip[j] + l;
            }
            m <<= 1;
        }
        const m2 = 2 * m;
        if ((m << 3) === l) {
            for (k = 0; k < m; k++) {
                for (j = 0; j < k; j++) {
                    j1 = 2 * j + ip[k];
                    k1 = 2 * k + ip[j];
                    xr = a[j1];
                    xi = -a[j1 + 1];
                    yr = a[k1];
                    yi = -a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                    j1 += m2;
                    k1 += 2 * m2;
                    xr = a[j1];
                    xi = -a[j1 + 1];
                    yr = a[k1];
                    yi = -a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                    j1 += m2;
                    k1 -= m2;
                    xr = a[j1];
                    xi = -a[j1 + 1];
                    yr = a[k1];
                    yi = -a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                    j1 += m2;
                    k1 += 2 * m2;
                    xr = a[j1];
                    xi = -a[j1 + 1];
                    yr = a[k1];
                    yi = -a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                }
                k1 = 2 * k + ip[k];
                a[k1 + 1] = -a[k1 + 1];
                j1 = k1 + m2;
                k1 = j1 + m2;
                xr = a[j1];
                xi = -a[j1 + 1];
                yr = a[k1];
                yi = -a[k1 + 1];
                a[j1] = yr;
                a[j1 + 1] = yi;
                a[k1] = xr;
                a[k1 + 1] = xi;
                k1 += m2;
                a[k1 + 1] = -a[k1 + 1];
            }
        } else {
            a[1] = -a[1];
            a[m2 + 1] = -a[m2 + 1];
            for (k = 1; k < m; k++) {
                for (j = 0; j < k; j++) {
                    j1 = 2 * j + ip[k];
                    k1 = 2 * k + ip[j];
                    xr = a[j1];
                    xi = -a[j1 + 1];
                    yr = a[k1];
                    yi = -a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                    j1 += m2;
                    k1 += m2;
                    xr = a[j1];
                    xi = -a[j1 + 1];
                    yr = a[k1];
                    yi = -a[k1 + 1];
                    a[j1] = yr;
                    a[j1 + 1] = yi;
                    a[k1] = xr;
                    a[k1 + 1] = xi;
                }
                k1 = 2 * k + ip[k];
                a[k1 + 1] = -a[k1 + 1];
                a[k1 + m2 + 1] = -a[k1 + m2 + 1];
            }
        }
    },
    cftmdl: (n, l, aBuffer, wBuffer) => {
        let j, j1, j2, j3, k, k1, k2;
        let wk1r, wk1i, wk2r, wk2i, wk3r, wk3i;
        let x0r, x0i, x1r, x1i, x2r, x2i, x3r, x3i;

        const a = new Float32Array(aBuffer);
        const w = new Float32Array(wBuffer);

        const m = l << 2;
        for (j = 0; j < l; j += 2) {
            j1 = j + l;
            j2 = j1 + l;
            j3 = j2 + l;
            x0r = a[j] + a[j1];
            x0i = a[j + 1] + a[j1 + 1];
            x1r = a[j] - a[j1];
            x1i = a[j + 1] - a[j1 + 1];
            x2r = a[j2] + a[j3];
            x2i = a[j2 + 1] + a[j3 + 1];
            x3r = a[j2] - a[j3];
            x3i = a[j2 + 1] - a[j3 + 1];
            a[j] = x0r + x2r;
            a[j + 1] = x0i + x2i;
            a[j2] = x0r - x2r;
            a[j2 + 1] = x0i - x2i;
            a[j1] = x1r - x3i;
            a[j1 + 1] = x1i + x3r;
            a[j3] = x1r + x3i;
            a[j3 + 1] = x1i - x3r;
        }
        wk1r = w[2];
        for (j = m; j < l + m; j += 2) {
            j1 = j + l;
            j2 = j1 + l;
            j3 = j2 + l;
            x0r = a[j] + a[j1];
            x0i = a[j + 1] + a[j1 + 1];
            x1r = a[j] - a[j1];
            x1i = a[j + 1] - a[j1 + 1];
            x2r = a[j2] + a[j3];
            x2i = a[j2 + 1] + a[j3 + 1];
            x3r = a[j2] - a[j3];
            x3i = a[j2 + 1] - a[j3 + 1];
            a[j] = x0r + x2r;
            a[j + 1] = x0i + x2i;
            a[j2] = x2i - x0i;
            a[j2 + 1] = x0r - x2r;
            x0r = x1r - x3i;
            x0i = x1i + x3r;
            a[j1] = wk1r * (x0r - x0i);
            a[j1 + 1] = wk1r * (x0r + x0i);
            x0r = x3i + x1r;
            x0i = x3r - x1i;
            a[j3] = wk1r * (x0i - x0r);
            a[j3 + 1] = wk1r * (x0i + x0r);
        }
        k1 = 0;
        const m2 = 2 * m;
        for (k = m2; k < n; k += m2) {
            k1 += 2;
            k2 = 2 * k1;
            wk2r = w[k1];
            wk2i = w[k1 + 1];
            wk1r = w[k2];
            wk1i = w[k2 + 1];
            wk3r = wk1r - 2 * wk2i * wk1i;
            wk3i = 2 * wk2i * wk1r - wk1i;
            for (j = k; j < l + k; j += 2) {
                j1 = j + l;
                j2 = j1 + l;
                j3 = j2 + l;
                x0r = a[j] + a[j1];
                x0i = a[j + 1] + a[j1 + 1];
                x1r = a[j] - a[j1];
                x1i = a[j + 1] - a[j1 + 1];
                x2r = a[j2] + a[j3];
                x2i = a[j2 + 1] + a[j3 + 1];
                x3r = a[j2] - a[j3];
                x3i = a[j2 + 1] - a[j3 + 1];
                a[j] = x0r + x2r;
                a[j + 1] = x0i + x2i;
                x0r -= x2r;
                x0i -= x2i;
                a[j2] = wk2r * x0r - wk2i * x0i;
                a[j2 + 1] = wk2r * x0i + wk2i * x0r;
                x0r = x1r - x3i;
                x0i = x1i + x3r;
                a[j1] = wk1r * x0r - wk1i * x0i;
                a[j1 + 1] = wk1r * x0i + wk1i * x0r;
                x0r = x1r + x3i;
                x0i = x1i - x3r;
                a[j3] = wk3r * x0r - wk3i * x0i;
                a[j3 + 1] = wk3r * x0i + wk3i * x0r;
            }
            wk1r = w[k2 + 2];
            wk1i = w[k2 + 3];
            wk3r = wk1r - 2 * wk2r * wk1i;
            wk3i = 2 * wk2r * wk1r - wk1i;
            for (j = k + m; j < l + (k + m); j += 2) {
                j1 = j + l;
                j2 = j1 + l;
                j3 = j2 + l;
                x0r = a[j] + a[j1];
                x0i = a[j + 1] + a[j1 + 1];
                x1r = a[j] - a[j1];
                x1i = a[j + 1] - a[j1 + 1];
                x2r = a[j2] + a[j3];
                x2i = a[j2 + 1] + a[j3 + 1];
                x3r = a[j2] - a[j3];
                x3i = a[j2 + 1] - a[j3 + 1];
                a[j] = x0r + x2r;
                a[j + 1] = x0i + x2i;
                x0r -= x2r;
                x0i -= x2i;
                a[j2] = -wk2i * x0r - wk2r * x0i;
                a[j2 + 1] = -wk2i * x0i + wk2r * x0r;
                x0r = x1r - x3i;
                x0i = x1i + x3r;
                a[j1] = wk1r * x0r - wk1i * x0i;
                a[j1 + 1] = wk1r * x0i + wk1i * x0r;
                x0r = x1r + x3i;
                x0i = x1i - x3r;
                a[j3] = wk3r * x0r - wk3i * x0i;
                a[j3 + 1] = wk3r * x0i + wk3i * x0r;
            }
        }
    },

    cft1st: (n, aBuffer, wBuffer) => {
        let j, k1, k2;
        let wk1r, wk1i, wk2r, wk2i, wk3r, wk3i;
        let x0r, x0i, x1r, x1i, x2r, x2i, x3r, x3i;

        const a = new Float32Array(aBuffer);
        const w = new Float32Array(wBuffer);

        x0r = a[0] + a[2];
        x0i = a[1] + a[3];
        x1r = a[0] - a[2];
        x1i = a[1] - a[3];
        x2r = a[4] + a[6];
        x2i = a[5] + a[7];
        x3r = a[4] - a[6];
        x3i = a[5] - a[7];
        a[0] = x0r + x2r;
        a[1] = x0i + x2i;
        a[4] = x0r - x2r;
        a[5] = x0i - x2i;
        a[2] = x1r - x3i;
        a[3] = x1i + x3r;
        a[6] = x1r + x3i;
        a[7] = x1i - x3r;
        wk1r = w[2];
        x0r = a[8] + a[10];
        x0i = a[9] + a[11];
        x1r = a[8] - a[10];
        x1i = a[9] - a[11];
        x2r = a[12] + a[14];
        x2i = a[13] + a[15];
        x3r = a[12] - a[14];
        x3i = a[13] - a[15];
        a[8] = x0r + x2r;
        a[9] = x0i + x2i;
        a[12] = x2i - x0i;
        a[13] = x0r - x2r;
        x0r = x1r - x3i;
        x0i = x1i + x3r;
        a[10] = wk1r * (x0r - x0i);
        a[11] = wk1r * (x0r + x0i);
        x0r = x3i + x1r;
        x0i = x3r - x1i;
        a[14] = wk1r * (x0i - x0r);
        a[15] = wk1r * (x0i + x0r);
        k1 = 0;
        for (j = 16; j < n; j += 16) {
            k1 += 2;
            k2 = 2 * k1;
            wk2r = w[k1];
            wk2i = w[k1 + 1];
            wk1r = w[k2];
            wk1i = w[k2 + 1];
            wk3r = wk1r - 2 * wk2i * wk1i;
            wk3i = 2 * wk2i * wk1r - wk1i;
            x0r = a[j] + a[j + 2];
            x0i = a[j + 1] + a[j + 3];
            x1r = a[j] - a[j + 2];
            x1i = a[j + 1] - a[j + 3];
            x2r = a[j + 4] + a[j + 6];
            x2i = a[j + 5] + a[j + 7];
            x3r = a[j + 4] - a[j + 6];
            x3i = a[j + 5] - a[j + 7];
            a[j] = x0r + x2r;
            a[j + 1] = x0i + x2i;
            x0r -= x2r;
            x0i -= x2i;
            a[j + 4] = wk2r * x0r - wk2i * x0i;
            a[j + 5] = wk2r * x0i + wk2i * x0r;
            x0r = x1r - x3i;
            x0i = x1i + x3r;
            a[j + 2] = wk1r * x0r - wk1i * x0i;
            a[j + 3] = wk1r * x0i + wk1i * x0r;
            x0r = x1r + x3i;
            x0i = x1i - x3r;
            a[j + 6] = wk3r * x0r - wk3i * x0i;
            a[j + 7] = wk3r * x0i + wk3i * x0r;
            wk1r = w[k2 + 2];
            wk1i = w[k2 + 3];
            wk3r = wk1r - 2 * wk2r * wk1i;
            wk3i = 2 * wk2r * wk1r - wk1i;
            x0r = a[j + 8] + a[j + 10];
            x0i = a[j + 9] + a[j + 11];
            x1r = a[j + 8] - a[j + 10];
            x1i = a[j + 9] - a[j + 11];
            x2r = a[j + 12] + a[j + 14];
            x2i = a[j + 13] + a[j + 15];
            x3r = a[j + 12] - a[j + 14];
            x3i = a[j + 13] - a[j + 15];
            a[j + 8] = x0r + x2r;
            a[j + 9] = x0i + x2i;
            x0r -= x2r;
            x0i -= x2i;
            a[j + 12] = -wk2i * x0r - wk2r * x0i;
            a[j + 13] = -wk2i * x0i + wk2r * x0r;
            x0r = x1r - x3i;
            x0i = x1i + x3r;
            a[j + 10] = wk1r * x0r - wk1i * x0i;
            a[j + 11] = wk1r * x0i + wk1i * x0r;
            x0r = x1r + x3i;
            x0i = x1i - x3r;
            a[j + 14] = wk3r * x0r - wk3i * x0i;
            a[j + 15] = wk3r * x0i + wk3i * x0r;
        }
    },

    cftfsub: (n, aBuffer, wBuffer) => {
        let j, j1, j2, j3, l;
        let x0r, x0i, x1r, x1i, x2r, x2i, x3r, x3i;

        // Create some views on the raw buffers
        const a = new Float32Array(aBuffer);
        const w = new Float32Array(wBuffer);

        l = 2;
        if (n > 8) {
            child.cft1st(n, a.buffer, w.buffer);
            l = 8;
            while ((l << 2) < n) {
                child.cftmdl(n, l, a.buffer, w.buffer);
                l <<= 2;
            }
        }
        if ((l << 2) === n) {
            for (j = 0; j < l; j += 2) {
                j1 = j + l;
                j2 = j1 + l;
                j3 = j2 + l;
                x0r = a[j] + a[j1];
                x0i = a[j + 1] + a[j1 + 1];
                x1r = a[j] - a[j1];
                x1i = a[j + 1] - a[j1 + 1];
                x2r = a[j2] + a[j3];
                x2i = a[j2 + 1] + a[j3 + 1];
                x3r = a[j2] - a[j3];
                x3i = a[j2 + 1] - a[j3 + 1];
                a[j] = x0r + x2r;
                a[j + 1] = x0i + x2i;
                a[j2] = x0r - x2r;
                a[j2 + 1] = x0i - x2i;
                a[j1] = x1r - x3i;
                a[j1 + 1] = x1i + x3r;
                a[j3] = x1r + x3i;
                a[j3 + 1] = x1i - x3r;
            }
        } else {
            for (j = 0; j < l; j += 2) {
                j1 = j + l;
                x0r = a[j] - a[j1];
                x0i = a[j + 1] - a[j1 + 1];
                a[j] += a[j1];
                a[j + 1] += a[j1 + 1];
                a[j1] = x0r;
                a[j1 + 1] = x0i;
            }
        }
    },

    cftbsub: (n, aBuffer, wBuffer) => {
        let j, j1, j2, j3, l;
        let x0r, x0i, x1r, x1i, x2r, x2i, x3r, x3i;

        const a = new Float32Array(aBuffer);
        const w = new Float32Array(wBuffer);

        l = 2;
        if (n > 8) {
            child.cft1st(n, a.buffer, w.buffer);
            l = 8;
            while ((l << 2) < n) {
                child.cftmdl(n, l, a.buffer, w.buffer);
                l <<= 2;
            }
        }
        if ((l << 2) === n) {
            for (j = 0; j < l; j += 2) {
                j1 = j + l;
                j2 = j1 + l;
                j3 = j2 + l;
                x0r = a[j] + a[j1];
                x0i = -a[j + 1] - a[j1 + 1];
                x1r = a[j] - a[j1];
                x1i = -a[j + 1] + a[j1 + 1];
                x2r = a[j2] + a[j3];
                x2i = a[j2 + 1] + a[j3 + 1];
                x3r = a[j2] - a[j3];
                x3i = a[j2 + 1] - a[j3 + 1];
                a[j] = x0r + x2r;
                a[j + 1] = x0i - x2i;
                a[j2] = x0r - x2r;
                a[j2 + 1] = x0i + x2i;
                a[j1] = x1r - x3i;
                a[j1 + 1] = x1i - x3r;
                a[j3] = x1r + x3i;
                a[j3 + 1] = x1i + x3r;
            }
        } else {
            for (j = 0; j < l; j += 2) {
                j1 = j + l;
                x0r = a[j] - a[j1];
                x0i = -a[j + 1] + a[j1 + 1];
                a[j] += a[j1];
                a[j + 1] = -a[j + 1] - a[j1 + 1];
                a[j1] = x0r;
                a[j1 + 1] = x0i;
            }
        }
    },

    rftfsub: (n, aBuffer, nc, cBuffer, cOffset) => {
        let j, k, kk;
        let wkr, wki, xr, xi, yr, yi;

        const a = new Float32Array(aBuffer);
        const c = new Float32Array(cBuffer).subarray(cOffset);

        const m = n >> 1;
        const ks = 2 * nc / m;
        kk = 0;
        for (j = 2; j < m; j += 2) {
            k = n - j;
            kk += ks;
            wkr = 0.5 - c[nc - kk];
            wki = c[kk];
            xr = a[j] - a[k];
            xi = a[j + 1] + a[k + 1];
            yr = wkr * xr - wki * xi;
            yi = wkr * xi + wki * xr;
            a[j] -= yr;
            a[j + 1] -= yi;
            a[k] += yr;
            a[k + 1] -= yi;
        }
    },

    rftbsub: (n, aBuffer, nc, cBuffer, cOffset) => {
        let j, k, kk;
        let wkr, wki, xr, xi, yr, yi;

        const a = new Float32Array(aBuffer);
        const c = new Float32Array(cBuffer).subarray(cOffset);

        a[1] = -a[1];
        const m = n >> 1;
        const ks = 2 * nc / m;
        kk = 0;
        for (j = 2; j < m; j += 2) {
            k = n - j;
            kk += ks;
            wkr = 0.5 - c[nc - kk];
            wki = c[kk];
            xr = a[j] - a[k];
            xi = a[j + 1] + a[k + 1];
            yr = wkr * xr + wki * xi;
            yi = wkr * xi - wki * xr;
            a[j] -= yr;
            a[j + 1] = yi - a[j + 1];
            a[k] += yr;
            a[k + 1] = yi - a[k + 1];
        }
        a[m + 1] = -a[m + 1];
    }
};


let trans = {
    DIRECTION: {
        FORWARDS: +1,
        BACKWARDS: -1
    },
    rdft: (n, dir, aBuffer, ipBuffer, wBuffer) => {
        const ip = new Int16Array(ipBuffer);
        const a = new Float32Array(aBuffer);
        const nw = ip[0];
        const nc = ip[1];

        if (dir === trans.DIRECTION.FORWARDS) {
            if (n > 4) {
                child.bitrv2(n, ipBuffer, 2, aBuffer);
                child.cftfsub(n, aBuffer, wBuffer);
                child.rftfsub(n, aBuffer, nc, wBuffer, nw);
            } else if (n === 4) {
                child.cftfsub(n, aBuffer, wBuffer);
            }
            const xi = a[0] - a[1];
            a[0] += a[1];
            a[1] = xi;
        } else {
            a[1] = 0.5 * (a[0] - a[1]);
            a[0] -= a[1];
            if (n > 4) {
                child.rftbsub(n, aBuffer, nc, wBuffer, nw);
                child.bitrv2(n, ipBuffer, 2, aBuffer);
                child.cftbsub(n, aBuffer, wBuffer);
            } else if (n === 4) {
                child.cftfsub(n, aBuffer, wBuffer);
            }
        }
    },
    cdft: (n, dir, aBuffer, ipBuffer, wBuffer) => {
        if (n > 4) {
            if (dir === trans.DIRECTION.FORWARDS) {
                child.bitrv2(n, ipBuffer, 2, aBuffer);
                child.cftfsub(n, aBuffer, wBuffer);
            } else {
                child.bitrv2conj(n, ipBuffer, 2, aBuffer);
                child.cftbsub(n, aBuffer, wBuffer);
            }
        } else if (n === 4) {
            child.cftfsub(n, aBuffer, wBuffer);
        }
    }
};


class init {

    static makewt(nw, ipBuffer, wBuffer) {
        let nwh;
        let delta;
        let x;
        let y;

        const ip = new Int16Array(ipBuffer);
        const w = new Float32Array(wBuffer);

        ip[0] = nw;
        ip[1] = 1;
        if (nw > 2) {
            nwh = nw >> 1;
            delta = Math.atan(1.0) / nwh;
            w[0] = 1;
            w[1] = 0;
            w[nwh] = Math.cos(delta * nwh);
            w[nwh + 1] = w[nwh];

            if (nwh > 2) {
                for (let j = 2; j < nwh; j += 2) {
                    x = Math.cos(delta * j);
                    y = Math.sin(delta * j);
                    w[j] = x;
                    w[j + 1] = y;
                    w[nw - j] = y;
                    w[nw - j + 1] = x;
                }
                child.bitrv2(nw, ip.buffer, 2, w.buffer);
            }
        }
    }

    static makect(nc, ipBuffer, cBuffer, cOffset) {
        let j;
        let nch;
        let delta;

        const ip = new Int16Array(ipBuffer);
        const c = new Float32Array(cBuffer).subarray(cOffset);

        ip[1] = nc;
        if (nc > 1) {
            nch = nc >> 1;
            delta = Math.atan(1.0) / nch;
            c[0] = Math.cos(delta * nch);
            c[nch] = 0.5 * c[0];
            for (j = 1; j < nch; j++) {
                c[j] = 0.5 * Math.cos(delta * j);
                c[nc - j] = 0.5 * Math.sin(delta * j);
            }
        }
    }
}


class FFT {

    constructor(windowLength) {
        this.real = true;
        this.windowLength = windowLength;
        this.ip = new Int16Array(2 + Math.sqrt(windowLength));
        this.w = new Float32Array(windowLength / 2);
        this.internal = new Float32Array(windowLength);

        init.makewt(windowLength / 4, this.ip.buffer, this.w.buffer);
        init.makect(windowLength / 4, this.ip.buffer, this.w.buffer, windowLength / 4);
        this.fft = this.fftReal;
        this.ifft = this.ifftReal;
    }

    // Functions below here should be called via their aliases defined in the ctor
    fftReal(dataBuffer, reBuffer, imBuffer) {
        const data = new Float32Array(dataBuffer);
        this.internal.set(data);

        trans.rdft(this.windowLength, trans.DIRECTION.FORWARDS, this.internal.buffer, this.ip.buffer, this.w.buffer);

        const im = new Float32Array(imBuffer);
        const re = new Float32Array(reBuffer);

        // De-interleave data
        let nn = 0;
        let mm = 0;
        while (nn !== this.windowLength) {
            re[nn] = this.internal[mm++];
            im[nn++] = -this.internal[mm++];
        }

        // Post cleanup
        re[this.windowLength / 2] = -im[0];
        im[0] = 0.0;
        im[this.windowLength / 2] = 0.0;
    }

    ifftReal(dataBuffer, reBuffer, imBuffer) {
        const im = new Float32Array(imBuffer);
        const re = new Float32Array(reBuffer);

        // Pack complex into buffer
        let nn = 0;
        let mm = 0;
        while (nn !== this.windowLength) {
            this.internal[mm++] = re[nn];
            this.internal[mm++] = -im[nn++];
        }
        this.internal[1] = re[this.windowLength / 2];

        trans.rdft(this.windowLength, trans.DIRECTION.BACKWARDS, this.internal.buffer, this.ip.buffer, this.w.buffer);

        const data = new Float32Array(dataBuffer);
        data.set(this.internal.map(x => x * 2 / this.windowLength));
    }
}


// module.exports = FFT;
