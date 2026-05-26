import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { broadcast, update } from "../sim.utils";
import { useSimulationContext } from "./simulation-provider";
import { useAuthStore } from "~/features/auth/auth.store";

const WIDTH = 12;
const HEIGHT = 8;
const CONTAINER = { x: WIDTH, y: HEIGHT };
const RADIUS = 0.1;

export default function Scene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshesRef = useRef<Map<string, THREE.Mesh>>(new Map());

  const { socket, simState, colors, isJoined, currentRoom } = useSimulationContext();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const aspect = window.innerWidth / window.innerHeight;
    const viewHeight = Math.max(HEIGHT, WIDTH / aspect);

    const camera = new THREE.OrthographicCamera(
      (-viewHeight * aspect) / 2, (viewHeight * aspect) / 2,
      viewHeight / 2, -viewHeight / 2,
      0.1, 1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false;
    controls.screenSpacePanning = true;
    controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };

    const rectGeo = new THREE.PlaneGeometry(WIDTH, HEIGHT);
    const rect = new THREE.LineSegments(
      new THREE.EdgesGeometry(rectGeo),
      new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    scene.add(rect);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current || !simState) return;

    const scene = sceneRef.current;
    const meshes = meshesRef.current;
    const currentIds = new Set<string>();

    for (const [id, body] of simState.bodies.entries()) {
      currentIds.add(id);
      let mesh = meshes.get(id);

      if (!mesh) {
        const geo = new THREE.CircleGeometry(body.radius || RADIUS, 32);
        const color = colors.get(body.owner) || '#00ff00';
        const mat = new THREE.MeshBasicMaterial({ color });
        mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);
        meshes.set(id, mesh);
      } else {
        // Update color if it changed (e.g., if it was unknown and then received)
        const expectedColor = colors.get(body.owner) || '#00ff00';
        const material = mesh.material as THREE.MeshBasicMaterial;
        if ('#' + material.color.getHexString() !== expectedColor.toLowerCase()) {
          material.color.set(expectedColor);
        }
      }
      mesh.position.set(body.position.x, body.position.y, 0);
    }

    for (const [id, mesh] of meshes.entries()) {
      if (!currentIds.has(id)) {
        scene.remove(mesh);
        meshes.delete(id);
      }
    }

    if (socket.current && isJoined) {
      const all = [...simState.bodies.values()];
      const userId = useAuthStore.getState().user?.id;
      const mine = all.filter(b => b.owner === userId);
      const updated = update(simState.deltatime, CONTAINER, mine, all);
      broadcast(socket.current, currentRoom, updated);
    }
  }, [simState]);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <div ref={mountRef} style={{ position: "fixed", inset: 0 }} />
    </div>
  );
}