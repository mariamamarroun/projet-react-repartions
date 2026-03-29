import { useRef, useEffect, useState } from "react";
import { Renderer, Program, Triangle, Mesh } from "ogl";
import "./LightRays.css";

const DEFAULT_COLOR = "#1a5ac1";

const hexToRgb = hex => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
};

const getAnchorAndDir = (origin, w, h) => {
  const outside = 0.2;
  switch (origin) {
    case "top-left": return { anchor: [0, -outside * h], dir: [0, 1] };
    case "top-right": return { anchor: [w, -outside * h], dir: [0, 1] };
    case "left": return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case "right": return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case "bottom-left": return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case "bottom-center": return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case "bottom-right": return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default: return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

const LightRays = ({
  raysOrigin = "bottom-center",
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1.5,
  lightSpread = 0.8,
  rayLength = 2,
  pulsating = true,
  className = ""
}) => {
  const containerRef = useRef(null);
  const uniformsRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);
  const animationIdRef = useRef(null);
  const cleanupFunctionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      entries => setIsVisible(entries[0].isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
    rendererRef.current = renderer;
    const gl = renderer.gl;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(gl.canvas);

    const vert = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }`;

    const frag = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec2 rayPos;
      uniform vec2 rayDir;
      uniform vec3 raysColor;
      uniform float raysSpeed;
      uniform float lightSpread;
      uniform float rayLength;
      uniform float pulsating;
      varying vec2 vUv;
      void main() { gl_FragColor = vec4(raysColor, 1.0); }`;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      rayPos: { value: [0, 0] },
      rayDir: { value: [0, 1] },
      raysColor: { value: hexToRgb(raysColor) },
      raysSpeed: { value: raysSpeed },
      lightSpread: { value: lightSpread },
      rayLength: { value: rayLength },
      pulsating: { value: pulsating ? 1.0 : 0.0 }
    };
    uniformsRef.current = uniforms;

    const program = new Program(gl, { vertex: vert, fragment: frag, uniforms, transparent: true });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    meshRef.current = mesh;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = containerRef.current;
      renderer.setSize(w, h);
      uniforms.iResolution.value = [w * renderer.dpr, h * renderer.dpr];
      const { anchor, dir } = getAnchorAndDir(raysOrigin, w * renderer.dpr, h * renderer.dpr);
      uniforms.rayPos.value = anchor;
      uniforms.rayDir.value = dir;
    };

    window.addEventListener("resize", resize);
    resize();

    const loop = t => {
      uniforms.iTime.value = t * 0.001;
      renderer.render({ scene: mesh });
      animationIdRef.current = requestAnimationFrame(loop);
    };
    animationIdRef.current = requestAnimationFrame(loop);

    cleanupFunctionRef.current = () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", resize);
    };

    return () => cleanupFunctionRef.current?.();
  }, [isVisible, raysOrigin, raysColor, raysSpeed, lightSpread, rayLength, pulsating]);

  return <div ref={containerRef} className={`light-rays-container ${className}`} />;
};

export default LightRays;