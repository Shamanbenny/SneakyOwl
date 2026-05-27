"use client";

import { type HTMLAttributes, useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

type BlogSilkBackgroundProps = HTMLAttributes<HTMLDivElement> & {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
};

const vertexShader = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uNoiseIntensity;
  uniform float uRotation;

  varying vec2 vUv;

  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    vec2 centered = uv - 0.5;
    centered.x *= uResolution.x / max(uResolution.y, 1.0);
    centered = rotate2d(uRotation) * centered;

    float waveScale = max(uScale, 0.001);
    vec2 tex = centered * waveScale * 2.2;
    float t = uTime * 0.08 * uSpeed;

    float primaryWave = sin((8.0 * tex.x) - t);
    float patternWave = sin(5.0 * (tex.x + tex.y + cos(t + tex.x * 2.0)));
    float detailWave = sin(20.0 * (tex.x + tex.y - (0.1 * t)));

    float pattern = primaryWave + (0.55 * patternWave) + (0.12 * detailWave);
    float folds = smoothstep(-1.45, 1.75, pattern);

    vec3 base = mix(vec3(0.0), uColor, folds);

    vec2 noiseCoord = fract(tex * vec2(123.34, 456.21));
    float noise = random(noiseCoord + floor(tex * 4.0));
    base += (noise - 0.5) * (0.18 * uNoiseIntensity);

    float sheen = smoothstep(0.16, 0.98, folds);
    sheen += 0.18 * sin((tex.y * 7.5) - (t * 0.45));
    base += uColor * sheen * 0.2;

    float vignette = smoothstep(1.45, 0.08, length(centered));
    vec3 finalColor = max(base, 0.0) * vignette;

    gl_FragColor = vec4(finalColor, 0.72);
  }
`;

const hexToRgb = (value: string) => {
  const normalized = value.trim().replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) {
    return [0.482, 0.455, 0.506] as const;
  }

  return [
    Number.parseInt(expanded.slice(0, 2), 16) / 255,
    Number.parseInt(expanded.slice(2, 4), 16) / 255,
    Number.parseInt(expanded.slice(4, 6), 16) / 255,
  ] as const;
};

export default function BlogSilkBackground({
  speed = 5,
  scale = 1,
  color = "#5f7f73",
  noiseIntensity = 1.1,
  rotation = 0.18,
  className,
  ...rest
}: BlogSilkBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const { gl } = renderer;
    gl.clearColor(0, 0, 0, 0);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uResolution: { value: [container.offsetWidth, container.offsetHeight] },
        uTime: { value: 0 },
        uColor: { value: hexToRgb(color) },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uNoiseIntensity: { value: noiseIntensity },
        uRotation: { value: rotation },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const canvas = gl.canvas;
    canvas.className = "blog-silk-canvas";
    container.appendChild(canvas);

    const resize = () => {
      const width = container.offsetWidth || window.innerWidth;
      const height = container.offsetHeight || window.innerHeight;

      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;

    const renderFrame = (time: number) => {
      program.uniforms.uTime.value = time * 0.001;
      renderer.render({ scene: mesh });
      frameId = window.requestAnimationFrame(renderFrame);
    };

    const renderStaticFrame = () => {
      renderer.render({ scene: mesh });
    };

    resize();

    if (mediaQuery.matches) {
      renderStaticFrame();
    } else {
      frameId = window.requestAnimationFrame(renderFrame);
    }

    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);

      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }

      geometry.remove();
      program.remove();
      renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color, noiseIntensity, rotation, scale, speed]);

  return <div ref={containerRef} className={className} aria-hidden="true" {...rest} />;
}
