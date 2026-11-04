import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createGroomingToolsAssembly } from './BarberScissorsModel';
import {
  ExperienceFocusMode,
  computeTargetScissorsPose,
} from '../utils/experienceKinematics';
import { dampValue } from '../utils/heroKinematics';

export interface GroomingToolsSceneProps {
  pointerX: number;
  pointerY: number;
  scrollProgress: number;
  focusMode: ExperienceFocusMode;
  isMobile: boolean;
  glbModelUrl?: string;
}

const _sceneCenter = new THREE.Vector3(0, 0.04, 0);

/**
 * Generates a radial soft studio contact shadow pool underneath the floating 3D shears
 * that fades cleanly to 0 alpha before the canvas boundary.
 */
function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const cx = size / 2;
    const cy = size / 2;
    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, cx * 0.9);
    grad.addColorStop(0.0, 'rgba(0, 0, 0, 0.72)');
    grad.addColorStop(0.45, 'rgba(12, 13, 14, 0.38)');
    grad.addColorStop(0.75, 'rgba(119, 121, 91, 0.08)');
    grad.addColorStop(1.0, 'rgba(23, 24, 25, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const GroomingToolsScene: React.FC<GroomingToolsSceneProps> = ({
  pointerX,
  pointerY,
  scrollProgress,
  focusMode,
  isMobile,
  glbModelUrl,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  const liveParamsRef = useRef({
    pointerX,
    pointerY,
    scrollProgress,
    focusMode,
    isMobile,
  });

  useEffect(() => {
    liveParamsRef.current.pointerX = pointerX;
    liveParamsRef.current.pointerY = pointerY;
    liveParamsRef.current.scrollProgress = scrollProgress;
    liveParamsRef.current.focusMode = focusMode;
    liveParamsRef.current.isMobile = isMobile;
  }, [pointerX, pointerY, scrollProgress, focusMode, isMobile]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software-WebGL probe
    let isSoftwareGl = false;
    try {
      const probeCanvas = document.createElement('canvas');
      const gl =
        probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      setWebglSupported(false);
      return;
    }

    // 2. Renderer, Scene & Camera
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 1024;
    const targetDpr = isSoftwareGl
      ? 1
      : isMobileDevice
      ? Math.min(window.devicePixelRatio || 1, 1.25)
      : Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(targetDpr);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const initialW = Math.max(1, container.clientWidth);
    const initialH = Math.max(1, container.clientHeight);
    renderer.setSize(initialW, initialH);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      32,
      initialW / initialH,
      0.1,
      25
    );
    camera.position.set(0, 0.22, 3.75);
    camera.lookAt(_sceneCenter);

    // 3. Product-Photography Studio Lighting (Soft Overhead Key + Muted Olive Rim + Ambient Fill)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;

    const hemiLight = new THREE.HemisphereLight(0xe8ddc8, 0x171819, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.SpotLight(
      0xe8ddc8,
      36,
      14,
      Math.PI / 4.2,
      0.68,
      1.4
    );
    keyLight.position.set(1.8, 3.2, 2.8);
    keyLight.target.position.copy(_sceneCenter);
    scene.add(keyLight);
    scene.add(keyLight.target);

    const oliveRimLight = new THREE.SpotLight(
      0x77795b,
      28,
      12,
      Math.PI / 3.5,
      0.75,
      1.3
    );
    oliveRimLight.position.set(-2.4, 1.6, -2.2);
    oliveRimLight.target.position.copy(_sceneCenter);
    scene.add(oliveRimLight);
    scene.add(oliveRimLight.target);

    const lowerSpecularFill = new THREE.DirectionalLight(0xe8ddc8, 1.35);
    lowerSpecularFill.position.set(0.8, -1.8, 2.2);
    scene.add(lowerSpecularFill);

    // Soft Contact Shadow Pool below the floating shears
    const shadowTex = createContactShadowTexture();
    const shadowPlaneGeo = new THREE.PlaneGeometry(3.4, 1.8);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -0.78, 0);
    scene.add(shadowPlane);

    // 4. Build 3D Grooming Tools Assembly (Japanese Barber Shears + Carbon/Olive Comb)
    const toolsAssembly = createGroomingToolsAssembly(renderer, isSoftwareGl);
    scene.add(toolsAssembly.rootGroup);

    if (glbModelUrl) {
      const loader = new GLTFLoader();
      loader.load(
        glbModelUrl,
        (gltf) => {
          toolsAssembly.scissorsGroup.clear();
          toolsAssembly.scissorsGroup.add(gltf.scene);
          renderer.render(scene, camera);
        },
        undefined,
        () => {
          // Keep procedural surgical-steel barber shears if external GLB fails
        }
      );
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    const handleResize = () => {
      if (!container) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    // 5. Damped Kinematic State & Animation Loop
    const currentPose = {
      scissorsRotX: 0.18,
      scissorsRotY: -0.28,
      scissorsRotZ: -0.34,
      bladeOpenAngle: 0.22,
      combOffsetY: 0,
      combRotY: 0.35,
      cameraX: 0,
      cameraY: 0.22,
      cameraZ: 3.75,
      keyLightFactor: 0.85,
    };

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let frameId = 0;
    let isDisposed = false;
    let lastTimeSec = performance.now() * 0.001;
    const startTimeSec = lastTimeSec;

    function afterDraw(cb: () => void) {
      if (isDisposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    let isVisible = true;
    let isTabVisible = typeof document !== 'undefined' ? !document.hidden : true;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && isVisible && !isDisposed) {
        lastTimeSec = performance.now() * 0.001;
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const prevVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !prevVisible && isTabVisible && !isDisposed) {
          lastTimeSec = performance.now() * 0.001;
          cancelAnimationFrame(frameId);
          frameId = requestAnimationFrame(tick);
        }
      },
      { rootMargin: '120px 0px 120px 0px', threshold: 0 }
    );
    intersectionObserver.observe(container);

    function tick() {
      if (isDisposed || !isVisible || !isTabVisible) return;
      const nowSec = performance.now() * 0.001;
      const dt = Math.min(Math.max(0.001, nowSec - lastTimeSec), 0.1);
      lastTimeSec = nowSec;
      const elapsed = nowSec - startTimeSec;
      const params = liveParamsRef.current;

      const target = computeTargetScissorsPose({
        pointerX: params.pointerX,
        pointerY: params.pointerY,
        scrollProgress: params.scrollProgress,
        isMobile: params.isMobile,
        focusMode: params.focusMode,
      });

      const dampLambda = prefersReducedMotion ? 24 : 6.0;

      currentPose.scissorsRotX = dampValue(
        currentPose.scissorsRotX,
        target.scissorsRotX,
        dampLambda,
        dt
      );
      currentPose.scissorsRotY = dampValue(
        currentPose.scissorsRotY,
        target.scissorsRotY,
        dampLambda,
        dt
      );
      currentPose.scissorsRotZ = dampValue(
        currentPose.scissorsRotZ,
        target.scissorsRotZ,
        dampLambda,
        dt
      );
      currentPose.bladeOpenAngle = dampValue(
        currentPose.bladeOpenAngle,
        target.bladeOpenAngle,
        dampLambda,
        dt
      );
      currentPose.combOffsetY = dampValue(
        currentPose.combOffsetY,
        target.combOffsetY,
        dampLambda,
        dt
      );
      currentPose.combRotY = dampValue(
        currentPose.combRotY,
        target.combRotY,
        dampLambda,
        dt
      );
      currentPose.cameraX = dampValue(
        currentPose.cameraX,
        target.cameraX,
        dampLambda,
        dt
      );
      currentPose.cameraY = dampValue(
        currentPose.cameraY,
        target.cameraY,
        dampLambda,
        dt
      );
      currentPose.cameraZ = dampValue(
        currentPose.cameraZ,
        target.cameraZ,
        dampLambda,
        dt
      );
      currentPose.keyLightFactor = dampValue(
        currentPose.keyLightFactor,
        target.keyLightIntensityFactor,
        dampLambda,
        dt
      );

      const floatBob = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.45) * 0.035;

      // Apply smooth 3D scissors orientation & precision blade articulation
      toolsAssembly.scissorsGroup.position.y = 0.12 + floatBob;
      toolsAssembly.scissorsGroup.rotation.set(
        currentPose.scissorsRotX,
        currentPose.scissorsRotY,
        currentPose.scissorsRotZ
      );

      const halfSpread = currentPose.bladeOpenAngle * 0.5;
      toolsAssembly.upperBladeGroup.rotation.z = halfSpread;
      toolsAssembly.lowerBladeGroup.rotation.z = -halfSpread;

      // Secondary grooming comb subtle counter-parallax
      toolsAssembly.combGroup.position.y =
        -0.34 + currentPose.combOffsetY - floatBob * 0.6;
      toolsAssembly.combGroup.rotation.y = currentPose.combRotY;

      // Backdrop calibration ring subtle rotation
      if (!prefersReducedMotion) {
        toolsAssembly.backdropRingGroup.rotation.z = -elapsed * 0.06;
        toolsAssembly.backdropRingGroup.rotation.y =
          currentPose.scissorsRotY * 0.22;
      }

      // Dynamic studio spotlight illumination & camera proximity
      keyLight.intensity = 36 * currentPose.keyLightFactor;
      oliveRimLight.intensity = 28 * currentPose.keyLightFactor;
      keyLight.position.x = 1.8 + currentPose.cameraX * 1.6;

      camera.position.set(
        currentPose.cameraX,
        currentPose.cameraY,
        currentPose.cameraZ
      );
      camera.lookAt(_sceneCenter);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener(
        'webglcontextlost',
        handleContextLost
      );
      shadowTex.dispose();
      shadowPlaneGeo.dispose();
      shadowPlaneMat.dispose();
      envTarget.dispose();
      pmremGenerator.dispose();
      toolsAssembly.dispose();
      renderer.dispose();
    };
  }, [glbModelUrl]);

  if (!webglSupported) {
    return (
      <div
        data-testid="scissors-webgl-fallback"
        className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#171819]"
      >
        <p className="text-xs uppercase tracking-[0.22em] text-[#989B74] mb-2">
          03 / The Sandy Experience
        </p>
        <p className="text-lg font-semibold text-[#E8DDC8] text-center">
          3D Japanese Surgical-Steel Barber Shears &amp; Precision Tapering Comb
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full select-none">
      <div
        ref={mountRef}
        data-testid="grooming-tools-canvas"
        aria-label="Interactive 3D Barber Scissors and Grooming Comb Composition"
        role="img"
        className="w-full h-full"
      />
    </div>
  );
};
