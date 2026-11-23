"use client";

import { useEffect, useRef } from "react";

/**
 * ATC WebGL2 shader, used as a subtle background layer.
 *
 * The raymarching code in `fragSrc` is the supplied shader, unchanged, up to the
 * final `tanh` line. Differences from the original demo:
 *  - fills its positioned parent instead of forcing 100vh; never intercepts input
 *  - the colourful output is remapped onto the site palette (near-black -> dark olive -> olive,
 *    with a faint orange trace) so no new bright colours are introduced
 *  - renders at reduced resolution, capped fps and slowed time, then is scaled up by CSS
 *  - pauses when the tab is hidden or the element is off-screen
 *  - static single frame under prefers-reduced-motion
 *  - handles missing WebGL2, shader errors and WebGL context loss/restore
 */

const vertSrc = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
void main(){ gl_Position = vec4(a_pos,0.0,1.0); }`;

const fragSrc = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  u_res;
uniform float u_time;

// robust tanh fallback
float tanh1(float x){ float e = exp(2.0*x); return (e-1.0)/(e+1.0); }
vec4 tanh4(vec4 v){ return vec4(tanh1(v.x), tanh1(v.y), tanh1(v.z), tanh1(v.w)); }

void main(){
  vec3 FC = vec3(gl_FragCoord.xy, 0.0);
  vec3 r  = vec3(u_res, max(u_res.x, u_res.y));
  float t = u_time;

  vec4 o = vec4(0.0);

  vec3 p = vec3(0.0);
  vec3 v = vec3(1.0, 2.0, 6.0);
  float i = 0.0, z = 1.0, d = 1.0, f = 1.0;

  for ( ; i++ < 5e1;
        o.rgb += (cos((p.x + z + v) * 0.1) + 1.0) / d / f / z )
  {
    p = z * normalize(FC * 2.0 - r.xyy);

    vec4 m = cos((p + sin(p)).y * 0.4 + vec4(0.0, 33.0, 11.0, 0.0));
    p.xz = mat2(m) * p.xz;

    p.x += t / 0.2;

    z += ( d = length(cos(p / v) * v + v.zxx / 7.0) /
           ( f = 2.0 + d / exp(p.y * 0.2) ) );
  }

  o = tanh4(0.2 * o);

  // --- Palette remap (site palette only) ---------------------------------
  // Keep the shader's structure (luminance) but replace its colours.
  float l = dot(o.rgb, vec3(0.299, 0.587, 0.114));
  vec3 navy = vec3(0.043, 0.059, 0.051);   // #0B0F0D
  vec3 deep = vec3(0.071, 0.102, 0.082);   // #121A15
  vec3 cyan = vec3(0.471, 0.525, 0.416);   // #78866A (olive secondary)
  vec3 amber = vec3(0.773, 0.541, 0.271);  // #C58A45
  vec3 col = mix(navy, deep, smoothstep(0.02, 0.35, l));
  col = mix(col, cyan * 0.55, smoothstep(0.35, 0.95, l) * 0.8);
  // faint orange only where the original shader leaned warm
  col += amber * 0.05 * smoothstep(0.0, 0.25, o.r - o.b);
  fragColor = vec4(col, 1.0);
}`;

const SPEED = 0.3; // slows the original motion
const FPS = 30;
const STATIC_TIME = 7; // frame shown under prefers-reduced-motion
const MAX_PIXELS = 520_000;

interface GlState {
  prog: WebGLProgram;
  buf: WebGLBuffer;
  uRes: WebGLUniformLocation | null;
  uTime: WebGLUniformLocation | null;
}

export default function AtcShader({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      wrap.dataset.fallback = "true"; // CSS shows just the navy gradient
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let state: GlState | null = null;
    let inView = true;
    let lost = false;
    let running = false;
    let raf = 0;
    let last = 0;
    let virtualTime = STATIC_TIME;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) throw new Error("createShader failed");
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(sh) || "compile error";
        gl.deleteShader(sh);
        throw new Error(log);
      }
      return sh;
    };

    const setup = (): boolean => {
      try {
        const prog = gl.createProgram();
        const buf = gl.createBuffer();
        if (!prog || !buf) throw new Error("GL resource allocation failed");
        const vs = compile(gl.VERTEX_SHADER, vertSrc);
        const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(prog) || "link error");
        }
        gl.useProgram(prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
          gl.STATIC_DRAW,
        );
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        state = {
          prog,
          buf,
          uRes: gl.getUniformLocation(prog, "u_res"),
          uTime: gl.getUniformLocation(prog, "u_time"),
        };
        return true;
      } catch (error) {
        console.warn("[AtcShader] disabled:", error);
        wrap.dataset.fallback = "true";
        state = null;
        return false;
      }
    };

    const draw = () => {
      if (!state || lost) return;
      gl.uniform1f(state.uTime, virtualTime);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    // Render at a fraction of CSS size; CSS scales the canvas up. This is a soft
    // background, so the blur is a feature and the GPU cost drops ~4-10x.
    const resize = () => {
      if (!state || lost) return;
      const cssW = wrap.clientWidth || window.innerWidth;
      const cssH = wrap.clientHeight || window.innerHeight;
      const mobile = window.matchMedia("(max-width: 700px)").matches;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      let scale = (mobile ? 0.3 : 0.5) * dpr;
      const pixels = cssW * cssH * scale * scale;
      if (pixels > MAX_PIXELS) scale *= Math.sqrt(MAX_PIXELS / pixels);
      const w = Math.max(2, Math.round(cssW * scale));
      const h = Math.max(2, Math.round(cssH * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(state.uRes, w, h);
      if (!running) draw(); // keep a paused / static frame correct after resizing
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const elapsed = now - last;
      if (elapsed < 1000 / FPS) return;
      virtualTime += Math.min(elapsed, 100) / 1000 * SPEED; // clamp: no jump after a stall
      last = now;
      draw();
    };

    const canRun = () => inView && !document.hidden && !reduced.matches && !lost && !!state;
    const start = () => {
      if (running || !canRun()) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => (canRun() ? start() : stop());

    if (!setup()) return;
    resize();
    draw();
    sync();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrap);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "80px" },
    );
    intersectionObserver.observe(wrap);

    const onVisibility = () => sync();
    const onReducedChange = () => {
      sync();
      if (!running) draw();
    };
    const onLost = (e: Event) => {
      e.preventDefault(); // allow restoration
      lost = true;
      state = null;
      stop();
    };
    const onRestored = () => {
      lost = false;
      if (setup()) {
        resize();
        draw();
        sync();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onReducedChange);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onReducedChange);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      if (state && !lost) {
        gl.deleteProgram(state.prog);
        gl.deleteBuffer(state.buf);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div ref={wrapRef} className={`atc-shader ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="atc-shader-canvas" />
    </div>
  );
}
