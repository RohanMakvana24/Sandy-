import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createStudioLighting } from './StudioLighting';
import { createBarberChairAssembly } from './BarberChairModel';
import {
  ChairViewPreset,
  computeTargetChairPose,
  dampValue,
  BASE_CHAIR_ROT_Y,
} from '../utils/heroKinematics';

export interface BarberChairSceneProps {
  pointerX: number;
  pointerY: number;
  scrollProgress: number;
  entranceProgress: number;
  activePreset: ChairViewPreset;
  isMobile: boolean;
  glbModelUrl?: string;
}

const _lookTarget = new THREE.Vector3(0, 0.92, 0);

export const BarberChairScene: React.FC<BarberChairSceneProps> = ({
  pointerX,
  pointerY,
  scrollProgress,
  entranceProgress,
  activePreset,
  isMobile,
  glbModelUrl,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // Store live interactive parameters in a ref so React updates never tear down the WebGL context
  const liveParamsRef = useRef({
    pointerX,
    pointerY,
    scrollProgress,
    entranceProgress,
    activePreset,
    isMobile,
  });

  useEffect(() => {
    liveParamsRef.current.pointerX = pointerX;
    liveParamsRef.current.pointerY = pointerY;
    liveParamsRef.current.scrollProgress = scrollProgress;
    liveParamsRef.current.entranceProgress = entranceProgress;
    liveParamsRef.current.activePreset = activePreset;
    liveParamsRef.current.isMobile = isMobile;
  }, [pointerX, pointerY, scrollProgress, entranceProgress, activePreset, isMobile]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // 1. Software-WebGL detection & WebGL2 capability probe
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

    // 2. Initialize Renderer, Scene, and Camera
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
    renderer.toneMappingExposure = 1.16;
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 1024;
    const targetDpr = isSoftwareGl
      ? 1
      : isMobileDevice
      ? Math.min(window.devicePixelRatio || 1, 1.25)
      : Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(targetDpr);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const initialWidth = Math.max(1, container.clientWidth);
    const initialHeight = Math.max(1, container.clientHeight);
    renderer.setSize(initialWidth, initialHeight);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      34,
      initialWidth / initialHeight,
      0.1,
      35
    );
    camera.position.set(0, 1.48, 4.45);
    camera.lookAt(_lookTarget);

    // 3. Build Studio Lighting & Procedural Luxury Barber Chair Assembly
    const studioLighting = createStudioLighting(scene, renderer, isSoftwareGl);
    const chairAssembly = createBarberChairAssembly(
      renderer,
      isSoftwareGl,
      () => {
        if (!isDisposed) {
          renderer.render(scene, camera);
        }
      }
    );
    scene.add(chairAssembly.rootGroup);

    // Optional production .glb override if a valid URL is provided
    if (glbModelUrl) {
      const loader = new GLTFLoader();
      loader.load(
        glbModelUrl,
        (gltf) => {
          chairAssembly.chairGroup.clear();
          chairAssembly.chairGroup.add(gltf.scene);
        },
        undefined,
        () => {
          // Keep procedural luxury barber chair if external GLB fails
        }
      );
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 4. WebGL Context Loss Recovery
    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    // 5. Responsive Resize Handler
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

    // 6. Damped Kinematic State & Lossless Animation Loop
    const currentPose = {
      chairRotY: BASE_CHAIR_ROT_Y - 0.35,
      chairRotX: 0,
      cameraX: 0,
      cameraY: 1.62,
      cameraZ: 4.95,
      spotlightX: 2.2,
      spotlightY: 4.6,
      reclineAngle: 0.18,
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

      const target = computeTargetChairPose({
        pointerX: params.pointerX,
        pointerY: params.pointerY,
        scrollProgress: params.scrollProgress,
        isMobile: params.isMobile,
        preset: params.activePreset,
      });

      const dampLambda = prefersReducedMotion ? 25 : 6.5;

      currentPose.chairRotY = dampValue(
        currentPose.chairRotY,
        target.chairRotY,
        dampLambda,
        dt
      );
      currentPose.chairRotX = dampValue(
        currentPose.chairRotX,
        target.chairRotX,
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
      currentPose.spotlightX = dampValue(
        currentPose.spotlightX,
        target.spotlightX,
        dampLambda,
        dt
      );
      currentPose.spotlightY = dampValue(
        currentPose.spotlightY,
        target.spotlightY,
        dampLambda,
        dt
      );
      currentPose.reclineAngle = dampValue(
        currentPose.reclineAngle,
        target.reclineAngle,
        dampLambda,
        dt
      );

      // Apply smooth chair orientation & backrest recline
      chairAssembly.chairGroup.rotation.y = currentPose.chairRotY;
      chairAssembly.chairGroup.rotation.x = currentPose.chairRotX;
      chairAssembly.reclinePivot.rotation.x = -currentPose.reclineAngle;

      // Subtle lifelike breathing & head gaze tracking for the seated gentleman
      if (!prefersReducedMotion) {
        const breathWave = Math.sin(elapsed * 2.1);
        chairAssembly.clientRig.chestBreathGroup.scale.set(
          1 + breathWave * 0.008,
          1 + breathWave * 0.006,
          1 + breathWave * 0.018
        );
        chairAssembly.clientRig.headGroup.rotation.y =
          params.pointerX * 0.14 + Math.sin(elapsed * 0.85) * 0.025;
        chairAssembly.clientRig.headGroup.rotation.x =
          0.02 -
          (currentPose.reclineAngle - 0.18) * 0.35 -
          params.pointerY * 0.06;
      }

      // Subtle backdrop architectural halo ring parallax
      if (!prefersReducedMotion) {
        chairAssembly.floatingAccentsGroup.rotation.z = elapsed * 0.08;
        chairAssembly.floatingAccentsGroup.rotation.y =
          currentPose.chairRotY * 0.18;
        chairAssembly.floatingAccentsGroup.position.x =
          -currentPose.cameraX * 0.45;
      }

      // Entrance illumination & camera emergence
      const entrance = Math.max(0.15, Math.min(1, params.entranceProgress));
      studioLighting.keySpotLight.intensity = 32 * entrance;
      studioLighting.oliveRimLight.intensity = 24 * entrance;
      studioLighting.keySpotLight.position.x = currentPose.spotlightX;
      studioLighting.keySpotLight.position.y = currentPose.spotlightY;

      camera.position.set(
        currentPose.cameraX,
        currentPose.cameraY,
        currentPose.cameraZ + (1 - entrance) * 0.55
      );
      camera.lookAt(_lookTarget);

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
      studioLighting.dispose();
      chairAssembly.dispose();
      renderer.dispose();
    };
  }, [glbModelUrl]);

  if (!webglSupported) {
    return (
      <div
        data-testid="chair-webgl-fallback"
        className="w-full h-full flex flex-col items-center justify-center p-8 rounded-2xl border border-[#77795B]/30 bg-[#171819]"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-[#989B74] mb-2">
          Sandy Men&apos;s Salon Studio
        </p>
        <p className="text-lg font-semibold text-[#E8DDC8] text-center">
          3D Bespoke Hydraulic Grooming Chair
        </p>
        <p className="text-xs text-[#E8DDC8]/60 mt-1 text-center max-w-xs">
          Hand-stitched quilted onyx leather with brushed chrome and anodized olive hardware.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full select-none">
      {/* Isolated WebGL Canvas Mount Container */}
      <div
        ref={canvasMountRef}
        data-testid="barber-chair-canvas"
        aria-label="Interactive 3D Luxury Barber Chair Studio"
        role="img"
        className="w-full h-full"
      />
    </div>
  );
};
