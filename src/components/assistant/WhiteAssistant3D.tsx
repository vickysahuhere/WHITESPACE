import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface WhiteAssistant3DProps {
  geometryMode?: 'sphere' | 'monogram';
  isAudioActive?: boolean;
  audioLevel?: number; // 0.0 - 1.0
  rotationSpeed?: number;
  wireframeDensity?: number;
  interactive?: boolean;
  className?: string;
}

export const WhiteAssistant3D: React.FC<WhiteAssistant3DProps> = ({
  geometryMode = 'sphere',
  isAudioActive = false,
  audioLevel = 0,
  rotationSpeed = 1.0,
  interactive = true,
  className = 'w-full h-full'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Group references for animation
  const sphereGroupRef = useRef<THREE.Group | null>(null);
  const monogramGroupRef = useRef<THREE.Group | null>(null);
  const ringsGroupRef = useRef<THREE.Group | null>(null);

  // Audio & interaction values stored in refs for 60fps loop
  const audioLevelRef = useRef(audioLevel);
  const isAudioActiveRef = useRef(isAudioActive);
  const rotSpeedRef = useRef(rotationSpeed);

  useEffect(() => {
    audioLevelRef.current = audioLevel;
  }, [audioLevel]);

  useEffect(() => {
    isAudioActiveRef.current = isAudioActive;
  }, [isAudioActive]);

  useEffect(() => {
    rotSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 2. Lighting (Monochrome)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // 3. Geometry Mode 1: Geometric Wireframe Sphere + Core
    const sphereGroup = new THREE.Group();
    sphereGroupRef.current = sphereGroup;

    // Outer Geodesic Sphere
    const outerGeo = new THREE.IcosahedronGeometry(2.0, 2);
    const outerWireframe = new THREE.WireframeGeometry(outerGeo);
    const outerMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
    const outerLine = new THREE.LineSegments(outerWireframe, outerMat);
    sphereGroup.add(outerLine);

    // Inner Core Octahedron
    const innerGeo = new THREE.OctahedronGeometry(1.1, 1);
    const innerMat = new THREE.MeshBasicMaterial({ 
      color: 0x171717, 
      wireframe: true, 
      wireframeLinewidth: 1 
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    sphereGroup.add(innerMesh);

    scene.add(sphereGroup);

    // 4. Geometry Mode 2: Sculpted Geometric "W" Monogram
    const monogramGroup = new THREE.Group();
    monogramGroupRef.current = monogramGroup;

    // Create 4 distinct angled prisms forming "W"
    const barGeo = new THREE.BoxGeometry(0.35, 2.5, 0.35);
    const barWireMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    const barFillMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

    const createWBar = (posX: number, angleZ: number) => {
      const barGroup = new THREE.Group();
      const mesh = new THREE.Mesh(barGeo, barFillMat);
      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(barGeo), barWireMat);
      barGroup.add(mesh);
      barGroup.add(wire);
      barGroup.position.x = posX;
      barGroup.rotation.z = angleZ;
      return barGroup;
    };

    monogramGroup.add(createWBar(-1.3, -0.22));
    monogramGroup.add(createWBar(-0.45, 0.22));
    monogramGroup.add(createWBar(0.45, -0.22));
    monogramGroup.add(createWBar(1.3, 0.22));

    // Outer framing box for the W
    const frameGeo = new THREE.BoxGeometry(3.6, 3.2, 1.2);
    const frameWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(frameGeo),
      new THREE.LineBasicMaterial({ color: 0x333333 })
    );
    monogramGroup.add(frameWire);

    scene.add(monogramGroup);

    // 5. Concentric Acoustic Pulse Rings
    const ringsGroup = new THREE.Group();
    ringsGroupRef.current = ringsGroup;
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.RingGeometry(2.3 + r * 0.4, 2.32 + r * 0.4, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x404040,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringsGroup.add(ringMesh);
    }
    scene.add(ringsGroup);

    // Initial visibility based on mode
    sphereGroup.visible = geometryMode === 'sphere';
    monogramGroup.visible = geometryMode === 'monogram';

    // 6. Interactive Mouse Orbiting
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // 8. 60 FPS Render & Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const effectiveAudio = isAudioActiveRef.current 
        ? Math.max(0.4, audioLevelRef.current) 
        : audioLevelRef.current;

      const audioPulse = Math.sin(elapsedTime * 8) * effectiveAudio * 0.15;
      const baseScale = 1 + audioPulse;

      // Rotate Sphere Mode
      if (sphereGroup.visible) {
        sphereGroup.rotation.y += 0.006 * rotSpeedRef.current;
        sphereGroup.rotation.x += 0.003 * rotSpeedRef.current;
        sphereGroup.rotation.y += (targetRotationY - sphereGroup.rotation.y) * 0.1;
        sphereGroup.rotation.x += (targetRotationX - sphereGroup.rotation.x) * 0.1;
        sphereGroup.scale.set(baseScale, baseScale, baseScale);

        innerMesh.rotation.y -= 0.012;
        innerMesh.rotation.z += 0.008;
      }

      // Rotate Monogram Mode
      if (monogramGroup.visible) {
        monogramGroup.rotation.y += 0.008 * rotSpeedRef.current;
        monogramGroup.rotation.y += (targetRotationY - monogramGroup.rotation.y) * 0.1;
        monogramGroup.rotation.x += (targetRotationX - monogramGroup.rotation.x) * 0.1;
        monogramGroup.scale.set(baseScale, baseScale, baseScale);
      }

      // Pulse Rings
      if (ringsGroup) {
        ringsGroup.rotation.z += 0.004;
        ringsGroup.children.forEach((child, idx) => {
          const mesh = child as THREE.Mesh;
          const ringPulse = Math.sin(elapsedTime * 4 + idx) * 0.05 + baseScale;
          mesh.scale.set(ringPulse, ringPulse, ringPulse);
        });
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // 9. Cleanup
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      resizeObserver.disconnect();

      // Dispose Geometries and Materials
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      barGeo.dispose();
      barWireMat.dispose();
      barFillMat.dispose();
      frameGeo.dispose();

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update geometry visibility when prop changes
  useEffect(() => {
    if (sphereGroupRef.current) {
      sphereGroupRef.current.visible = geometryMode === 'sphere';
    }
    if (monogramGroupRef.current) {
      monogramGroupRef.current.visible = geometryMode === 'monogram';
    }
  }, [geometryMode]);

  return (
    <div 
      ref={mountRef} 
      className={`relative overflow-hidden cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Three.js Reactive 3D Assistant (WHITE) // Click & Drag to Rotate"
    />
  );
};
