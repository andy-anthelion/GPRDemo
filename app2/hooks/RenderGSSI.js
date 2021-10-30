import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const useRenderGSSI = () => {
  const eventResetZoom = new Event("resetzoom");

  const dataset = React.useRef({});
  const data = React.useRef({ hdr: null, val: null, bgcan: null });
  const disp = React.useRef(null);
  const vp = React.useRef({ sx: 0, sy: 0, sw: 100, sh: 100 });

  const [dispActivated, setDispActivated] = React.useState(false);
  const [dataLoaded, setDataLoaded] = React.useState(false);
  const [hasEvent, setHasEvent] = React.useState(false);

  const c0 = 29.9792458;
  const getShort = (d, s, e) => {
    return new Uint16Array(d.slice(s, e))[0];
  };
  const getFloat = (d, s, e) => {
    return new Float32Array(d.slice(s, e))[0];
  };

  const storeGSSIData = args => {
    const { fn, hdr, vals, bgcan } = args;

    dataset.current[fn] = { hdr: hdr, val: vals, bgcan: bgcan };
  };

  const getGSSIDataVal = () => {
    if (data.current.val === null) {
      return null;
    }

    return data.current.val.slice();
  };

  const getGSSIDataHdr = key => {
    if (data.current.hdr === null) {
      return null;
    }
    if (data.current.hdr.hasOwnProperty(key) === false) {
      return null;
    }

    return data.current.hdr[key];
  };

  const getGSSIDataCan = () => {
    return data.current.bgcan;
  };

  const handleFileLoad = (fn, fd) => {
    if (fd === null) {
      return;
    }

    const offconst = getShort(fd, 2, 4);
    const samps = getShort(fd, 4, 6);
    const bits = getShort(fd, 6, 8);
    const chans = getShort(fd, 52, 54);
    const file_epsr = getFloat(fd, 54, 58);
    const tpm = getFloat(fd, 14, 18);
    const rng_ns = getFloat(fd, 26, 30);
    const rng_m = getFloat(fd, 62, 66);

    const offset = offconst < 1024 ? 1024 * offconst : 1024 * chans;
    const vals = new Uint16Array(fd.slice(offset, fd.byteLength));
    let file_traces = vals.length / (chans * samps);
    const traces = file_traces <= 32767 ? file_traces : 32767;
    const pathlen = traces / tpm;

    let lut = [];
    let [minval, maxval] = d3.extent(vals);
    let minmaxnorm = d => (d - minval) / (maxval - minval);
    let colorScale = d => d3.color(d3.interpolateGreys(minmaxnorm(d)));
    for (let i = 0; i <= 65535; i++) lut[i] = colorScale(i);

    const bgcan = document.createElement("canvas");
    bgcan.width = traces;
    bgcan.height = samps;
    bgcan.style.display = "none";
    bgcan.style.rendering = "pixalated";
    let ctx = bgcan.getContext("2d");
    let img = ctx.getImageData(0, 0, traces, samps);
    //let len = traces * samps * 4
    let buff = new ArrayBuffer(img.data.length);
    let data8 = new Uint8ClampedArray(buff);
    let data32 = new Uint32Array(buff);
    const opaque = 255 << 24;
    vals.forEach((d, i) => {
      let color = lut[d];
      let z = i % samps;
      let idx = (i - z) / samps + z * traces;
      data32[idx] = opaque | (color.b << 16) | (color.g << 8) | color.r;
    });
    img.data.set(data8);
    ctx.putImageData(img, 0, 0);

    const hdr = {
      samps: samps,
      chans: chans,
      traces: traces,
      bits: bits,
      pathlen: pathlen,
      epsr: file_epsr,
      rng: rng_ns,
      depth: rng_m
    };

    storeGSSIData({ fn, hdr, vals, bgcan });
    setCurrentData(fn);
  };

  const getHorzAxisDomain = () => {
    let [min, max] = [0, 100];

    min = vp.current.sx;
    max = vp.current.sx + vp.current.sw;

    return [min, max];
  };

  const getVertAxisDomain = () => {
    let [min, max] = [0, 100];

    min = vp.current.sy;
    max = vp.current.sy + vp.current.sh;

    return [min, max];
  };

  const eventZoom = tobj => {
    if (tobj.sourceEvent === null) return false;

    //console.log(tobj)
    let w = data.current.hdr.traces;
    let h = data.current.hdr.samps;
    let cw = disp.current.canvas.width;
    let ch = disp.current.canvas.height;

    let rect = tobj.sourceEvent.target.getBoundingClientRect();
    let mx = Math.round(tobj.sourceEvent.clientX - rect.left);
    let my = Math.round(tobj.sourceEvent.clientY - rect.top);
    let k = tobj.transform.k;

    let sw = Math.round(d3.max([w / k, cw]));
    let sh = Math.round(d3.max([h / k, ch]));
    let dx = (mx * (sw - vp.current.sw)) / cw;
    let dy = (my * (sh - vp.current.sh)) / ch;

    let sx = vp.current.sx - dx; //Math.round((w-sw)/2.0) + dx
    let sy = vp.current.sy - dy; //Math.round((h-sh)/2.0) + dy
    //console.log(sx,sy,sw,sh)
    //clipping

    if (sx < 0) {
      sx = 0;
    }
    if (sx > w) {
      sx = w;
    }
    if (sy < 0) {
      sy = 0;
    }
    if (sy > h) {
      sy = h;
    }
    if (sx + sw > w) {
      sx = w - sw;
    }
    if (sy + sh > h) {
      sy = h - sh;
    }

    console.log("Zoom event:");
    vp.current = { sx: sx, sy: sy, sw: sw, sh: sh };

    setHasEvent(d => !d);

    return false;
  };

  const eventPan = tobj => {
    let w = data.current.hdr.traces;
    let h = data.current.hdr.samps;
    let rect = tobj.sourceEvent.target.getBoundingClientRect();
    let mx = Math.round(tobj.sourceEvent.clientX - rect.left);
    let my = Math.round(tobj.sourceEvent.clientY - rect.top);
    let sx = vp.current.sx;
    let sy = vp.current.sy;
    let sw = vp.current.sw;
    let sh = vp.current.sh;

    sx -= tobj.dx;
    sy -= tobj.dy;

    if (sx < 0) {
      sx = 0;
    }
    if (sx > w) {
      sx = w;
    }
    if (sy < 0) {
      sy = 0;
    }
    if (sy > h) {
      sy = h;
    }
    if (sx + sw > w) {
      sx = w - sw;
    }
    if (sy + sh > h) {
      sy = h - sh;
    }

    console.log("Pan event:");

    vp.current = { sx: sx, sy: sy, sw: sw, sh: sh };

    setHasEvent(d => !d);
    return false;
  };

  const renderProfileFromViewport = () => {
    if (dispActivated === false) {
      return;
    }

    let w = disp.current.canvas.width;
    let h = disp.current.canvas.height;

    disp.current.clearRect(0, 0, w, h);
    disp.current.drawImage(
      data.current.bgcan,
      vp.current.sx,
      vp.current.sy,
      vp.current.sw,
      vp.current.sh,
      0,
      0,
      w,
      h
    );
  };

  const fetchRenderContext = _ctx => {
    console.log("fetchRenderContext runs");
    disp.current = _ctx;
    setDispActivated(true);
  };

  const setCurrentData = fname => {
    data.current.hdr = dataset.current[fname].hdr;
    data.current.val = dataset.current[fname].val;
    data.current.bgcan = dataset.current[fname].bgcan;

    vp.current = {
      sx: 0,
      sy: 0,
      sw: data.current.hdr.traces,
      sh: data.current.hdr.samps
    };
    d3.select(disp.current.canvas).dispatch("resetzoom");
    //disp.current.canvas.dispatchEvent(eventResetZoom)

    setDataLoaded(true);
    setHasEvent(d => !d);
  };

  React.useEffect(() => {
    if (dispActivated === false) {
      return;
    }

    let can = d3.select(disp.current.canvas);

    let canzoom = d3
      .zoom()
      .scaleExtent([1, 500])
      .on("zoom", t => {
        eventZoom(t);
      });

    let canpan = d3
      .drag()
      .on("start", e => {
        d3.select(e.sourceEvent.target).style("cursor", "grabbing");
      })
      .on("drag", t => {
        eventPan(t);
      })
      .on("end", e => {
        d3.select(e.sourceEvent.target).style("cursor", "default");
      });

    can.call(canpan);
    can.call(canzoom).on("mousedown.zoom", null);
    can.on("resetzoom", e => {
      can.call(canzoom.transform, d3.zoomIdentity);
    });
  }, [dispActivated]);

  return {
    fetchRenderContext,
    handleFileLoad,
    dataLoaded,
    getHorzAxisDomain,
    getVertAxisDomain,
    getGSSIDataHdr,
    getGSSIDataVal,
    getGSSIDataCan,
    hasEvent,
    renderProfileFromViewport,
    storeGSSIData,
    setCurrentData
  };
};

export default useRenderGSSI;
