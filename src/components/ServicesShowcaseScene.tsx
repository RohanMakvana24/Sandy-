import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {
  createServiceCollection3D,
  ServiceCollection3D,
} from './ServiceObjects3D';
import { createServiceLightingRig } from './ServiceLighting';
import {
  GroomingServiceItem,
  Service3DObjectType,
  computeServiceObjectPose,
} from '../utils/servicesKinematics';
import { dampValue } from '../utils/heroKinematics';

export interface ServicesShowcaseSceneProps {
  activeService: GroomingServiceItem;
  activeIndex: number;
  pointerX: number;
  pointerY: number;
  scrollProgress: number;
  isMobile: boolean;
  glbModelOverrides?: Partial<Record<Service3DObjectType, string>>;
}

const _sceneCenter = new THREE.Vector3(0, 0.02, 0);

/**
 * Generates a soft studio radial contact shadow pool underneath the active 3D instrument
 * that fades cleanly to 0 alpha before the canvas edge.
 */
function createServiceContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const cx = size / 2;
    const cy = size / 2;
    const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, cx * 0.9);
    grad.addColorStop(0.0, 'rgba(0, 0, 0, 0.76)');
    grad.addColorStop(0.45, 'rgba(12, 13, 14, 0.42)');
    grad.addColorStop(0.75, 'rgba(119, 121, 91, 0.09)');
    grad.addColorStop(1.0, 'rgba(23, 24, 25, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const ServicesShowcaseScene: React.FC<ServicesShowcaseSceneProps> = ({
  activeService,
  activeIndex,
  pointerX,
  pointerY,
  scrollProgress,
  isMobile,
  glbModelOverrides,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  const liveParamsRef = useRef({
    activeObjectType: activeService.objectType,
    activeIndex,
    pointerX,
    pointerY,
    scrollProgress,
    isMobile,
    transitionProgress: 1.0,
  });

  const collectionRef = useRef<ServiceCollection3D | null>(null);

  // Update live parameters and trigger smooth 3D object transition when service changes
  useEffect(() => {
    const prevType = liveParamsRef.current.activeObjectType;
    liveParamsRef.current.activeObjectType = activeService.objectType;
    liveParamsRef.current.activeIndex = activeIndex;
    liveParamsRef.current.pointerX = pointerX;
    liveParamsRef.current.pointerY = pointerY;
    liveParamsRef.current.scrollProgress = scrollProgress;
    liveParamsRef.current.isMobile = isMobile;

    if (prevType !== activeService.objectType) {
      liveParamsRef.current.transitionProgress = 0.0;
      const collection = collectionRef.current;
      if (collection) {
        (Object.keys(collection.objectGroups) as Service3DObjectType[]).forEach(
          (key) => {
            collection.objectGroups[key].visible =
              key === activeService.objectType;
          }
        );
      }
    }
  }, [
    activeService.objectType,
    activeIndex,
    pointerX,
    pointerY,
    scrollProgress,
    isMobile,
  ]);

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
      isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(
        gpu
      );
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
    renderer.toneMappingExposure = 1.24;
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
    camera.position.set(0, 0.18, 3.65);
    camera.lookAt(_sceneCenter);

    // 3. Luxury Studio Product Lighting Rig (Warm Key + Olive Rim + Metallic PMREM Reflections)
    const lightingRig = createServiceLightingRig(renderer, scene, _sceneCenter);

    // Soft Studio Contact Shadow Pool beneath the floating 3D service instrument
    const shadowTex = createServiceContactShadowTexture();
    const shadowPlaneGeo = new THREE.PlaneGeometry(3.2, 1.8);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -0.78, 0);
    scene.add(shadowPlane);

    // 4. Build & Cache All 6 Grooming Service 3D Instruments
    const collection = createServiceCollection3D(renderer, isSoftwareGl);
    collectionRef.current = collection;

    const initialType = liveParamsRef.current.activeObjectType;
    (Object.keys(collection.objectGroups) as Service3DObjectType[]).forEach(
      (key) => {
        collection.objectGroups[key].visible = key === initialType;
      }
    );
    scene.add(collection.rootGroup);

    // Optional GLB override support for production 3D assets
    if (glbModelOverrides) {
      const loader = new GLTFLoader();
      (Object.keys(glbModelOverrides) as Service3DObjectType[]).forEach(
        (type) => {
          const url = glbModelOverrides[type];
          if (!url) return;
          loader.load(
            url,
            (gltf) => {
              const targetGroup = collection.objectGroups[type];
              targetGroup.clear();
              targetGroup.add(gltf.scene);
              renderer.render(scene, camera);
            },
            undefined,
            () => {
              // Keep procedural luxury 3D instrument on error
            }
          );
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
      objectRotX: 0.16,
      objectRotY: -0.26,
      objectRotZ: 0.0,
      objectScale: 1.0,
      objectOffsetY: 0.0,
      cameraX: 0.0,
      cameraY: 0.18,
      cameraZ: 3.65,
      oliveLightIntensity: 30,
      keyLightIntensity: 38,
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

      // Advance transition progress smoothly (0 -> 1 in ~0.65s)
      if (params.transitionProgress < 1.0) {
        params.transitionProgress = Math.min(
          1.0,
          params.transitionProgress + (prefersReducedMotion ? 1.0 : dt * 1.85)
        );
      }

      const target = computeServiceObjectPose({
        pointerX: params.pointerX,
        pointerY: params.pointerY,
        scrollProgress: params.scrollProgress,
        transitionProgress: params.transitionProgress,
        activeIndex: params.activeIndex,
        isMobile: params.isMobile,
      });

      const dampLambda = prefersReducedMotion ? 24 : 6.5;

      currentPose.objectRotX = dampValue(
        currentPose.objectRotX,
        target.objectRotX,
        dampLambda,
        dt
      );
      currentPose.objectRotY = dampValue(
        currentPose.objectRotY,
        target.objectRotY,
        dampLambda,
        dt
      );
      currentPose.objectRotZ = dampValue(
        currentPose.objectRotZ,
        target.objectRotZ,
        dampLambda,
        dt
      );
      currentPose.objectScale = dampValue(
        currentPose.objectScale,
        target.objectScale,
        dampLambda * 1.2,
        dt
      );
      currentPose.objectOffsetY = dampValue(
        currentPose.objectOffsetY,
        target.objectOffsetY,
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
      currentPose.oliveLightIntensity = dampValue(
        currentPose.oliveLightIntensity,
        target.oliveLightIntensity,
        dampLambda,
        dt
      );
      currentPose.keyLightIntensity = dampValue(
        currentPose.keyLightIntensity,
        target.keyLightIntensity,
        dampLambda,
        dt
      );

      const floatBob = prefersReducedMotion
        ? 0
        : Math.sin(elapsed * 1.45) * 0.032;

      collection.stageGroup.position.y = currentPose.objectOffsetY + floatBob;
      collection.stageGroup.rotation.set(
        currentPose.objectRotX,
        currentPose.objectRotY,
        currentPose.objectRotZ
      );
      collection.stageGroup.scale.setScalar(currentPose.objectScale);

      if (!prefersReducedMotion) {
        collection.animateActiveObject(
          params.activeObjectType,
          elapsed,
          params.scrollProgress
        );
        collection.backdropHaloGroup.rotation.z = elapsed * 0.055;
        collection.backdropHaloGroup.rotation.y = currentPose.objectRotY * 0.18;
      }

      lightingRig.updateLighting(
        currentPose.keyLightIntensity,
        currentPose.oliveLightIntensity,
        currentPose.cameraX
      );

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
      collectionRef.current = null;
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
      lightingRig.dispose();
      collection.dispose();
      renderer.dispose();
    };
  }, [glbModelOverrides]);

  if (!webglSupported) {
    return (
      <div
        data-testid="services-webgl-fallback"
        className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#171819]"
      >
        <p className="text-xs uppercase tracking-[0.22em] text-[#989B74] mb-2">
          {activeService.fullHeading}
        </p>
        <p className="text-lg font-semibold text-[#E8DDC8] text-center">
          {activeService.instrumentLabel}
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full select-none">
      <div
        ref={mountRef}
        data-testid="services-showcase-canvas"
        aria-label={`Interactive 3D ${activeService.instrumentLabel} for ${activeService.title}`}
        role="img"
        className="w-full h-full"
      />
    </div>
  );
};
