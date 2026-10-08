"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";

export interface PaintOption {
  name: string;
  hex: string;
}

/**
 * Renders the showroom car.
 *
 * Three.js is pulled in with a dynamic import and only once the section is
 * actually on screen, so the library never touches the initial payload and a
 * visitor who stops above it never downloads it at all.
 */
export function CarViewer({
  paint,
  className,
}: {
  paint: PaintOption;
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const setColourRef = useRef<((hex: string) => void) | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    const start = async () => {
      try {
        const THREE = await import("three");
        const { OrbitControls } = await import(
          "three/examples/jsm/controls/OrbitControls.js"
        );
        const { RoomEnvironment } = await import(
          "three/examples/jsm/environments/RoomEnvironment.js"
        );
        const { buildCar } = await import("./buildCar");

        if (disposed) return;

        const width = mount.clientWidth;
        const height = mount.clientHeight;

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();

        // A procedural environment gives the paint something to reflect
        // without shipping an HDR image.
        const pmrem = new THREE.PMREMGenerator(renderer);
        const environment = pmrem.fromScene(new RoomEnvironment(), 0.04);
        scene.environment = environment.texture;

        const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
        camera.position.set(5.2, 2.2, 5.7);

        const car = buildCar(THREE);
        scene.add(car.group);
        car.bodyMaterial.color.set(paint.hex);
        setColourRef.current = (hex) => car.bodyMaterial.color.set(hex);

        const hemisphere = new THREE.HemisphereLight(0xffffff, 0xc3cbd9, 0.8);
        scene.add(hemisphere);

        const key = new THREE.DirectionalLight(0xffffff, 2.3);
        key.position.set(5, 7.5, 4.5);
        key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024);
        key.shadow.camera.near = 1;
        key.shadow.camera.far = 24;
        key.shadow.camera.left = -6;
        key.shadow.camera.right = 6;
        key.shadow.camera.top = 6;
        key.shadow.camera.bottom = -6;
        key.shadow.bias = -0.0012;
        scene.add(key);

        // Navy rim light from behind, picking up the second brand colour
        // along the edges of the bodywork.
        const rim = new THREE.DirectionalLight(0x3a6fd8, 2.1);
        rim.position.set(-6, 3.4, -5);
        scene.add(rim);

        const ground = new THREE.Mesh(
          new THREE.CircleGeometry(9, 64),
          new THREE.ShadowMaterial({ opacity: 0.3 }),
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0.75, 0);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minPolarAngle = Math.PI * 0.22;
        controls.maxPolarAngle = Math.PI * 0.49;

        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        controls.autoRotate = !reducedMotion;
        controls.autoRotateSpeed = 0.9;
        controls.update();

        const resize = () => {
          const w = mount.clientWidth;
          const h = mount.clientHeight;
          if (w === 0 || h === 0) return;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);

        // Pause the loop whenever the canvas is off screen or the tab is
        // hidden, so an idle page is not spending a frame budget.
        let visible = true;
        const visibility = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) visible = entry.isIntersecting;
          },
          { threshold: 0.01 },
        );
        visibility.observe(mount);

        let frame = 0;
        const render = () => {
          frame = requestAnimationFrame(render);
          if (!visible || document.hidden) return;
          controls.update();
          renderer.render(scene, camera);
        };
        render();

        setReady(true);

        teardown = () => {
          cancelAnimationFrame(frame);
          resizeObserver.disconnect();
          visibility.disconnect();
          controls.dispose();
          car.dispose();
          environment.texture.dispose();
          pmrem.dispose();
          ground.geometry.dispose();
          (ground.material as THREE.Material).dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        if (!disposed) setFailed(true);
      }
    };

    // Only begin once the viewer is close to the viewport.
    const trigger = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            trigger.disconnect();
            void start();
          }
        }
      },
      { rootMargin: "300px" },
    );
    trigger.observe(mount);

    return () => {
      disposed = true;
      trigger.disconnect();
      teardown?.();
    };
    // The colour is applied through a ref so that changing it never rebuilds
    // the scene.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setColourRef.current?.(paint.hex);
  }, [paint]);

  return (
    <div className={className}>
      <div
        ref={mountRef}
        role="img"
        aria-label={`Rotating three-dimensional saloon car finished in ${paint.name}`}
        className="h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      />
      {!ready ? (
        <p className="pointer-events-none absolute inset-x-0 bottom-6 text-center font-ui text-xs text-fg-faint">
          {failed ? "3D preview unavailable on this device" : "Loading 3D preview"}
        </p>
      ) : null}
    </div>
  );
}
