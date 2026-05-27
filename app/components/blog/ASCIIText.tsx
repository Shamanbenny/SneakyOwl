"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uEnableWaves;

void main() {
  vUv = uv;
  float time = uTime * 5.0;
  float waveFactor = uEnableWaves;
  vec3 transformed = position;

  transformed.x += sin(time + position.y) * 0.5 * waveFactor;
  transformed.y += cos(time + position.z) * 0.15 * waveFactor;
  transformed.z += sin(time + position.x) * waveFactor;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
  float time = uTime;
  vec2 pos = vUv;

  float r = texture2D(uTexture, pos + cos(time + pos.x) * 0.01).r;
  float g = texture2D(uTexture, pos + tan(time * 0.5 + pos.x - time) * 0.01).g;
  float b = texture2D(uTexture, pos - cos(time * 3.0 + pos.y) * 0.01).b;
  float a = texture2D(uTexture, pos).a;

  gl_FragColor = vec4(r, g, b, a);
}
`;

const mapRange = (
  n: number,
  start: number,
  stop: number,
  start2: number,
  stop2: number,
) => ((n - start) / (stop - start)) * (stop2 - start2) + start2;

const resolveCssColor = (color: string) => {
  const match = color.match(/^var\((--[^)]+)\)$/);
  if (!match) return color;

  return getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim() || color;
};

type AsciiFilterOptions = {
  fontSize?: number;
  fontFamily?: string;
  charset?: string;
  invert?: boolean;
  enableColorShifting?: boolean;
};

class AsciiFilter {
  renderer: THREE.WebGLRenderer;
  domElement: HTMLDivElement;
  pre: HTMLPreElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  deg = 0;
  invert: boolean;
  fontSize: number;
  fontFamily: string;
  charset: string;
  width = 0;
  height = 0;
  center = { x: 0, y: 0 };
  mouse = { x: 0, y: 0 };
  cols = 0;
  rows = 0;
  enableColorShifting: boolean;

  constructor(
    renderer: THREE.WebGLRenderer,
    {
      fontSize = 12,
      fontFamily = "'Ubuntu Mono', 'SFMono-Regular', Consolas, monospace",
      charset = " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
      invert = true,
      enableColorShifting = true,
    }: AsciiFilterOptions = {},
  ) {
    this.renderer = renderer;
    this.domElement = document.createElement("div");
    this.domElement.className = "ascii-text-container__filter";

    this.pre = document.createElement("pre");
    this.domElement.appendChild(this.pre);

    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.domElement.appendChild(this.canvas);

    this.invert = invert;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.charset = charset;
    this.enableColorShifting = enableColorShifting;

    if (this.context) {
      this.context.imageSmoothingEnabled = false;
    }

    if (this.enableColorShifting) {
      this.onMouseMove = this.onMouseMove.bind(this);
      document.addEventListener("mousemove", this.onMouseMove);
    }
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.reset();

    this.center = { x: width / 2, y: height / 2 };
    this.mouse = { x: this.center.x, y: this.center.y };
  }

  reset() {
    if (!this.context) return;

    this.context.font = `${this.fontSize}px ${this.fontFamily}`;
    const charWidth = this.context.measureText("A").width || this.fontSize;

    this.cols = Math.max(1, Math.floor(this.width / charWidth));
    this.rows = Math.max(1, Math.floor(this.height / this.fontSize));
    this.canvas.width = this.cols;
    this.canvas.height = this.rows;
    this.pre.style.fontFamily = this.fontFamily;
    this.pre.style.fontSize = `${this.fontSize}px`;
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);

    const w = this.canvas.width;
    const h = this.canvas.height;
    if (!this.context || w === 0 || h === 0) return;

    this.context.clearRect(0, 0, w, h);
    this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
    this.asciify(this.context, w, h);
    this.hue();
  }

  onMouseMove(e: MouseEvent) {
    this.mouse = { x: e.clientX, y: e.clientY };
  }

  get dx() {
    return this.mouse.x - this.center.x;
  }

  get dy() {
    return this.mouse.y - this.center.y;
  }

  hue() {
    if (!this.enableColorShifting) {
      this.domElement.style.filter = "none";
      return;
    }

    const deg = (Math.atan2(this.dy, this.dx) * 180) / Math.PI;
    this.deg += (deg - this.deg) * 0.075;
    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;
  }

  asciify(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const imgData = ctx.getImageData(0, 0, w, h).data;
    let str = "";

    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const i = x * 4 + y * 4 * w;
        const [r, g, b, a] = [imgData[i], imgData[i + 1], imgData[i + 2], imgData[i + 3]];

        if (a === 0) {
          str += " ";
          continue;
        }

        const gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255;
        let idx = Math.floor((1 - gray) * (this.charset.length - 1));
        if (this.invert) idx = this.charset.length - idx - 1;
        str += this.charset[idx];
      }
      str += "\n";
    }

    this.pre.textContent = str;
  }

  dispose() {
    if (this.enableColorShifting) {
      document.removeEventListener("mousemove", this.onMouseMove);
    }
  }
}

type CanvasTxtOptions = {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  color?: string;
};

class CanvasTxt {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  txt: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  font: string;
  paddingX: number;
  paddingY: number;

  constructor(
    txt: string,
    {
      fontSize = 200,
      fontFamily = "'Ubuntu Mono', 'SFMono-Regular', Consolas, monospace",
      fontWeight = 700,
      color = "#fdf9f3",
    }: CanvasTxtOptions = {},
  ) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.txt = txt;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;
    this.font = `${fontWeight} ${this.fontSize}px ${this.fontFamily}`;
    this.paddingX = Math.ceil(this.fontSize * 0.32);
    this.paddingY = Math.ceil(this.fontSize * 0.18);
  }

  resize() {
    if (!this.context) return;

    this.context.font = this.font;
    const metrics = this.context.measureText(this.txt);
    const leftOverhang = Math.max(0, -metrics.actualBoundingBoxLeft);
    const rightOverhang = Math.max(0, metrics.actualBoundingBoxRight - metrics.width);
    const textWidth = Math.ceil(metrics.width + leftOverhang + rightOverhang + this.paddingX * 2);
    const textHeight =
      Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) +
      this.paddingY * 2;

    this.canvas.width = textWidth;
    this.canvas.height = textHeight;
  }

  render() {
    if (!this.context) return;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;

    const metrics = this.context.measureText(this.txt);
    const leftOverhang = Math.max(0, -metrics.actualBoundingBoxLeft);
    const xPos = this.paddingX + leftOverhang;
    const yPos = this.paddingY + metrics.actualBoundingBoxAscent;
    this.context.fillText(this.txt, xPos, yPos);
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get texture() {
    return this.canvas;
  }
}

type CanvAsciiOptions = {
  text: string;
  asciiFontSize: number;
  textFontSize: number;
  textFontFamily: string;
  textFontWeight: number;
  textColor: string;
  planeBaseHeight: number;
  enableWaves: boolean;
  enableMouseMotion: boolean;
  enableColorShifting: boolean;
};

class CanvAscii {
  textString: string;
  asciiFontSize: number;
  textFontSize: number;
  textFontFamily: string;
  textFontWeight: number;
  textColor: string;
  planeBaseHeight: number;
  container: HTMLElement;
  width: number;
  height: number;
  enableWaves: boolean;
  enableMouseMotion: boolean;
  enableColorShifting: boolean;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  mouse: { x: number; y: number };
  center = { x: 0, y: 0 };
  animationFrameId = 0;
  textCanvas!: CanvasTxt;
  texture!: THREE.CanvasTexture;
  geometry?: THREE.PlaneGeometry;
  material?: THREE.ShaderMaterial;
  mesh!: THREE.Mesh;
  renderer!: THREE.WebGLRenderer;
  filter!: AsciiFilter;
  planeWidth = 0;
  planeHeight = 0;

  constructor(
    {
      text,
      asciiFontSize,
      textFontSize,
      textFontFamily,
      textFontWeight,
      textColor,
      planeBaseHeight,
      enableWaves,
      enableMouseMotion,
      enableColorShifting,
    }: CanvAsciiOptions,
    containerElem: HTMLElement,
    width: number,
    height: number,
  ) {
    this.textString = text;
    this.asciiFontSize = asciiFontSize;
    this.textFontSize = textFontSize;
    this.textFontFamily = textFontFamily;
    this.textFontWeight = textFontWeight;
    this.textColor = textColor;
    this.planeBaseHeight = planeBaseHeight;
    this.container = containerElem;
    this.width = width;
    this.height = height;
    this.enableWaves = enableWaves;
    this.enableMouseMotion = enableMouseMotion;
    this.enableColorShifting = enableColorShifting;

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);

    this.scene = new THREE.Scene();
    this.mouse = { x: window.innerWidth / 2, y: this.height / 2 };
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  async init() {
    try {
      await document.fonts.load(
        `${this.textFontWeight} ${this.textFontSize}px ${this.textFontFamily}`,
      );
      await document.fonts.ready;
    } catch {
      // Keep the hero rendering if a web font request fails in dev or offline builds.
    }

    this.setMesh();
    this.setRenderer();
  }

  setMesh() {
    this.textCanvas = new CanvasTxt(this.textString, {
      fontSize: this.textFontSize,
      fontFamily: this.textFontFamily,
      fontWeight: this.textFontWeight,
      color: this.textColor,
    });
    this.textCanvas.resize();
    this.textCanvas.render();

    this.texture = new THREE.CanvasTexture(this.textCanvas.texture);
    this.texture.minFilter = THREE.NearestFilter;

    const textAspect = this.textCanvas.width / this.textCanvas.height;
    const planeH = this.planeBaseHeight;
    const planeW = planeH * textAspect;
    this.planeWidth = planeW;
    this.planeHeight = planeH;

    this.geometry = new THREE.PlaneGeometry(planeW, planeH, 36, 36);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: this.texture },
        uEnableWaves: { value: this.enableWaves ? 1.0 : 0.0 },
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.fitCameraToPlane();
  }

  fitCameraToPlane() {
    if (this.width <= 0 || this.height <= 0 || this.planeWidth <= 0 || this.planeHeight <= 0) {
      return;
    }

    const viewportAspect = this.width / this.height;
    const verticalFov = THREE.MathUtils.degToRad(this.camera.fov);
    const fitPadding = 1.42;
    const distanceForHeight = (this.planeHeight * fitPadding) / (2 * Math.tan(verticalFov / 2));
    const distanceForWidth =
      (this.planeWidth * fitPadding) / (2 * Math.tan(verticalFov / 2) * viewportAspect);

    this.camera.position.z = Math.max(distanceForHeight, distanceForWidth, 5);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);

    this.filter = new AsciiFilter(this.renderer, {
      fontSize: this.asciiFontSize,
      invert: true,
      enableColorShifting: this.enableMouseMotion && this.enableColorShifting,
    });

    this.container.appendChild(this.filter.domElement);
    this.setSize(this.width, this.height);

    if (this.enableMouseMotion) {
      this.container.addEventListener("mousemove", this.onMouseMove);
      this.container.addEventListener("touchmove", this.onMouseMove);
    }
  }

  setSize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.camera.aspect = w / h;
    this.fitCameraToPlane();
    this.camera.updateProjectionMatrix();
    this.filter.setSize(w, h);
    this.center = { x: w / 2, y: h / 2 };
  }

  load() {
    this.animate();
  }

  onMouseMove(evt: MouseEvent | TouchEvent) {
    const e = "touches" in evt ? evt.touches[0] : evt;
    if (!e) return;

    this.mouse = {
      x: e.clientX,
      y: e.clientY,
    };
  }

  animate() {
    const animateFrame = () => {
      this.animationFrameId = requestAnimationFrame(animateFrame);
      this.render();
    };

    animateFrame();
  }

  render() {
    const time = new Date().getTime() * 0.001;

    this.textCanvas.render();
    this.texture.needsUpdate = true;
    this.material!.uniforms.uTime.value = Math.sin(time);
    this.updateRotation();
    this.filter.render(this.scene, this.camera);
  }

  updateRotation() {
    if (!this.enableMouseMotion) return;

    const targetRotationX = mapRange(this.mouse.y, 0, window.innerHeight, 0.5, -0.5);
    const targetRotationY = mapRange(this.mouse.x, 0, window.innerWidth, -0.5, 0.5);

    this.mesh.rotation.x += (targetRotationX - this.mesh.rotation.x) * 0.05;
    this.mesh.rotation.y += (targetRotationY - this.mesh.rotation.y) * 0.05;
  }

  clear() {
    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;

      mesh.geometry.dispose();
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => material.dispose());
    });
    this.scene.clear();
    this.texture?.dispose();
  }

  dispose() {
    cancelAnimationFrame(this.animationFrameId);
    this.filter?.dispose();

    if (this.filter?.domElement.parentNode) {
      this.container.removeChild(this.filter.domElement);
    }

    if (this.enableMouseMotion) {
      this.container.removeEventListener("mousemove", this.onMouseMove);
      this.container.removeEventListener("touchmove", this.onMouseMove);
    }
    this.clear();
    this.renderer?.dispose();
    this.renderer?.forceContextLoss();
  }
}

type ASCIITextProps = {
  text?: string;
  asciiFontSize?: number;
  textFontSize?: number;
  textFontFamily?: string;
  textFontWeight?: number;
  textColor?: string;
  planeBaseHeight?: number;
  enableWaves?: boolean;
  enableMouseMotion?: boolean;
  enableColorShifting?: boolean;
};

export default function ASCIIText({
  text = "Blog",
  asciiFontSize = 8,
  textFontSize = 200,
  textFontFamily = "'Ubuntu Mono', 'SFMono-Regular', Consolas, monospace",
  textFontWeight = 700,
  textColor = "var(--site-text-strong)",
  planeBaseHeight = 8,
  enableWaves = true,
  enableMouseMotion = true,
  enableColorShifting = true,
}: ASCIITextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const asciiRef = useRef<CanvAscii | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;
    let isInitializing = false;
    let firstFrameId = 0;
    let secondFrameId = 0;

    const readContainerSize = (element: HTMLDivElement) => ({
      width: element.clientWidth,
      height: element.clientHeight,
    });

    const syncSize = (element: HTMLDivElement, instance = asciiRef.current) => {
      if (!instance) return;

      const { width, height } = readContainerSize(element);
      if (width > 0 && height > 0) {
        instance.setSize(width, height);
      }
    };

    const queueSettledSizeSync = (element: HTMLDivElement, instance: CanvAscii) => {
      firstFrameId = requestAnimationFrame(() => {
        syncSize(element, instance);
        secondFrameId = requestAnimationFrame(() => syncSize(element, instance));
      });
    };

    const handleWindowLoad = () => {
      if (!containerRef.current) return;

      syncSize(containerRef.current);
    };

    const createAndStart = async (element: HTMLDivElement) => {
      if (asciiRef.current || isInitializing) return;

      const { width, height } = readContainerSize(element);
      if (width <= 0 || height <= 0) return;

      isInitializing = true;
      const instance = new CanvAscii(
        {
          text,
          asciiFontSize,
          textFontSize,
          textFontFamily,
          textFontWeight,
          textColor: resolveCssColor(textColor),
          planeBaseHeight,
          enableWaves,
          enableMouseMotion,
          enableColorShifting,
        },
        element,
        width,
        height,
      );

      await instance.init();
      isInitializing = false;

      if (cancelled) {
        instance.dispose();
        return;
      }

      syncSize(element, instance);
      asciiRef.current = instance;
      asciiRef.current.load();
      queueSettledSizeSync(element, instance);

      if (document.readyState === "complete") {
        syncSize(element, instance);
      } else {
        window.addEventListener("load", handleWindowLoad, { once: true });
      }
    };

    resizeObserver = new ResizeObserver(() => {
      if (cancelled || !containerRef.current) return;

      if (asciiRef.current) {
        syncSize(containerRef.current);
        return;
      }

      void createAndStart(containerRef.current);
    });
    resizeObserver.observe(container);
    void createAndStart(container);

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      cancelAnimationFrame(firstFrameId);
      cancelAnimationFrame(secondFrameId);
      window.removeEventListener("load", handleWindowLoad);
      asciiRef.current?.dispose();
      asciiRef.current = null;
    };
  }, [
    text,
    asciiFontSize,
    textFontSize,
    textFontFamily,
    textFontWeight,
    textColor,
    planeBaseHeight,
    enableWaves,
    enableMouseMotion,
    enableColorShifting,
  ]);

  return <div ref={containerRef} className="ascii-text-container" aria-hidden="true" />;
}
