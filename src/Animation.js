// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// const Animation = () => {
//   const containerRef = useRef();

//   useEffect(() => {
//     const container = containerRef.current;

//     const scene = new THREE.Scene();

//     const camera = new THREE.PerspectiveCamera(
//       70,
//       container.clientWidth / container.clientHeight,
//       0.3,
//       100
//     );

//     camera.position.z = 5.5;

//     const geometry = new THREE.BufferGeometry();
//     const vertices = [];
//     const colors = [];

//     for (let i = 0; i < 1000; i++) {
//       const x = Math.random() * 3 - 1.5;
//       const y = Math.random() * 3 - 1.5;
//       const z = Math.random() * 3 - 1.5;
//       vertices.push(x, y, z);

//       // Each point will be a different color on a spectrum between red and blue
//       const color = new THREE.Color();
//       color.setHSL(Math.random(), 1.0, 0.5);
//       colors.push(color.r, color.g, color.b);
//     }

//     geometry.setAttribute(
//       "position",
//       new THREE.Float32BufferAttribute(vertices, 4)
//     );
//     geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 4));

//     const material = new THREE.PointsMaterial({
//       size: 0.04,
//       vertexColors: true,
//     });

//     const points = new THREE.Points(geometry, material);
//     scene.add(points);

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(container.clientWidth, container.clientHeight);
//     container.appendChild(renderer.domElement);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableZoom = false;
//     controls.autoRotate = true;

//     const onWindowResize = () => {
//       camera.aspect = container.clientWidth / container.clientHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(container.clientWidth, container.clientHeight);
//     };
//     window.addEventListener("resize", onWindowResize);

//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     return () => {
//       window.removeEventListener("resize", onWindowResize);
//       renderer.dispose();
//       geometry.dispose();
//       material.dispose();
//       if (container) container.removeChild(renderer.domElement);
//     };
//   }, []);

//   return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
// };

// export default Animation;

//* this is with the animation

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Animation = () => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.3,
      100
    );

    camera.position.z = 5.5;

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    const velocity = [];

    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 3 - 1.5;
      const y = Math.random() * 3 - 1.5;
      const z = Math.random() * 3 - 1.5;
      vertices.push(x, y, z);

      // Each point will have its own velocity
      const vx = (Math.random() - 0.5) / 100;
      const vy = (Math.random() - 0.5) / 100;
      const vz = (Math.random() - 0.5) / 100;
      velocity.push(vx, vy, vz);

      // Each point will be a different color on a spectrum between red and blue
      const color = new THREE.Color();
      color.setHSL(Math.random(), 1.0, 0.5);
      colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.autoRotate = true;

    const onWindowResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onWindowResize);

    const animate = () => {
      requestAnimationFrame(animate);

      // Update each point's position based on its velocity
      const positions = points.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocity[i];
        positions[i + 1] += velocity[i + 1];
        positions[i + 2] += velocity[i + 2];

        // Check boundaries and reverse direction if out of bounds
        if (Math.abs(positions[i]) > 1.5) velocity[i] *= -1;
        if (Math.abs(positions[i + 1]) > 1.5) velocity[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 1.5) velocity[i + 2] *= -1;
      }
      points.geometry.attributes.position.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default Animation;
