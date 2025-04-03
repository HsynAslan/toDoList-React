import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

const ThreeCanvas = () => {
  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    // Set up the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, -400, 600);
    cameraRef.current = camera;

    // Load font
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {

      const color = 0x006699;
      const matDark = new THREE.LineBasicMaterial({
        color: color,
        side: THREE.DoubleSide
      });

      const matLite = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });

      const message = 'To Do List';

      const shapes = font.generateShapes(message, 100);
      const geometry = new THREE.ShapeGeometry(shapes);

      geometry.computeBoundingBox();

      const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

      geometry.translate(xMid, 0, 0);

      // Create mesh for text (edge view not visible)
      const text = new THREE.Mesh(geometry, matLite);
      text.position.z = -150;
      scene.add(text);

      // Create line shape (edge view remains visible)
      const holeShapes = [];

      for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];

        if (shape.holes && shape.holes.length > 0) {
          for (let j = 0; j < shape.holes.length; j++) {
            const hole = shape.holes[j];
            holeShapes.push(hole);
          }
        }
      }

      shapes.push(...holeShapes);

      const lineText = new THREE.Object3D();

      for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];

        const points = shape.getPoints();
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        geometry.translate(xMid, 0, 0);

        const lineMesh = new THREE.Line(geometry, matDark);
        lineText.add(lineMesh);
      }

      scene.add(lineText);
    });

    // Set up the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    // Resize handler
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      animate(); // Ensure animate is called on window resize
    };

    window.addEventListener('resize', onWindowResize);

    // Animation loop
    const animate = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(animate); // Continuously call animate
    };

    // Start animation loop
    requestAnimationFrame(animate);

    // Cleanup function to remove event listeners and renderer when component unmounts
    return () => {
      window.removeEventListener('resize', onWindowResize);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} />;
};

export default ThreeCanvas;
