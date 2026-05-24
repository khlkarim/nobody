import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function Scene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const aspect = window.innerWidth / window.innerHeight;

    const camera = new THREE.OrthographicCamera(
      -aspect,
      aspect,
      1,
      -1,
      0.1,
      1000
    );

    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableRotate = false;
    controls.enablePan = false;
    controls.enableDamping = true;

    controls.minZoom = 1;
    controls.maxZoom = 4;

    const points = [
      new THREE.Vector3(0, -0.5, 0),
      new THREE.Vector3(0, 0.5, 0),
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const materialRed = new THREE.LineBasicMaterial({
      color: 0xff0000,
    });

    const materialBlue = new THREE.LineBasicMaterial({
      color: 0x0000ff,
    });

    const line1 = new THREE.Line(geometry, materialRed);
    const line2 = new THREE.Line(geometry, materialBlue);
    scene.add(line1);
    scene.add(line2);

    const ballRadius = 0.05;
    const ballGeometry = new THREE.CircleGeometry(ballRadius, 32);

    const ballMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    });

    const ball = new THREE.Mesh(ballGeometry, ballMaterial);

    scene.add(ball);
    
    const handleResize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      
      camera.left = -aspect;
      camera.right = aspect;
      camera.updateProjectionMatrix();
      
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener("resize", handleResize);
    
    let dir = 1;
    
    let velocityY = 0;
    const gravity = -0.001;
    const bounceStrength = 0.03;
    const floorY = -1 + 0.02;

    const animate = () => {
      requestAnimationFrame(animate);

      line1.position.x += 0.02 * dir;
      line2.position.x += 0.02 * -dir;
      if (Math.abs(line1.position.x) > 1) {
        dir *= -1;
      }
      
      velocityY += gravity;
      ball.position.y += velocityY;

      if (ball.position.y <= floorY + ballRadius) {
        ball.position.y = floorY + ballRadius;
        velocityY *= -0.8;
      }

      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,

        border: "4px solid white",
      }}
    />
  );
}