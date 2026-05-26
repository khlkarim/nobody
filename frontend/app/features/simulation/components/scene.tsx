import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { broadcast, update } from "../sim.utils";
import { useSimulationContext } from "./simulation-provider";

const svgLoader = new SVGLoader();

function loadSvgGroup(url: string, size: number, color: string): THREE.Group {
  const group = new THREE.Group();

  svgLoader.load(url, (data) => {
    const box = new THREE.Box3();
    const tempGroup = new THREE.Group();

    for (const path of data.paths) {
      const shapes = SVGLoader.createShapes(path);
      for (const shape of shapes) {
        const geo = new THREE.ShapeGeometry(shape);
        const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, depthWrite: false, transparent: true });
        tempGroup.add(new THREE.Mesh(geo, mat));
      }
    }

    box.setFromObject(tempGroup);
    const svgSize = new THREE.Vector3();
    box.getSize(svgSize);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const scale = size / Math.max(svgSize.x, svgSize.y);
    tempGroup.scale.set(scale, -scale, scale);
    tempGroup.position.set(-center.x * scale, center.y * scale, 0);

    group.add(tempGroup);
  });

  return group;
}

const WIDTH = 12;
const HEIGHT = 8;
const CONTAINER = { x: WIDTH, y: HEIGHT };
const RADIUS = 0.1;

export default function Scene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const groupsRef = useRef<Map<string, THREE.Group>>(new Map());

  const { socket, simState, colors, icons, isJoined, currentRoom } = useSimulationContext();

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
        const radius = body.radius || RADIUS;
        const color = colors.get(body.owner) || '#00ff00';
        const icon = icons.get(body.owner);

        mesh = new THREE.Group();

        const resolvedIcon = icon || 'circle';
        const iconGroup = loadSvgGroup(`/icons/${resolvedIcon}.svg`, radius * 2, color);
        iconGroup.userData.icon = resolvedIcon;
        iconGroup.userData.color = color;
        mesh.add(iconGroup);

        scene.add(mesh);
        meshes.set(id, mesh);
        groupsRef.current.set(id, iconGroup);
      } else {
        const expectedColor = colors.get(body.owner) || '#00ff00';
        const expectedIcon = icons.get(body.owner) || 'circle';
        const radius = body.radius || RADIUS;

        const prevGroup = groupsRef.current.get(id);
        const prevIcon = prevGroup?.userData.icon as string | undefined;
        const prevColor = prevGroup?.userData.color as string | undefined;

        if (!prevGroup || prevIcon !== expectedIcon) {
          if (prevGroup) mesh.remove(prevGroup);
          const newGroup = loadSvgGroup(`/icons/${expectedIcon}.svg`, radius * 2, expectedColor);
          newGroup.userData.icon = expectedIcon;
          newGroup.userData.color = expectedColor;
          mesh.add(newGroup);
          groupsRef.current.set(id, newGroup);
        } else if (prevColor !== expectedColor) {
          prevGroup.userData.color = expectedColor;
          prevGroup.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              (child.material as THREE.MeshBasicMaterial).color.set(expectedColor);
            }
          });
        }
      }
      mesh.position.set(body.position.x, body.position.y, 0);
    }

    for (const [id, mesh] of meshes.entries()) {
      if (!currentIds.has(id)) {
        scene.remove(mesh);
        meshes.delete(id);
        groupsRef.current.delete(id);
      }
    }

    if (socket.current && isJoined) {
      const all = [...simState.bodies.values()];
      const mine = all.filter(b => b.owner === socket.current?.id);
      const updated = update(simState.deltatime, CONTAINER, mine, all);
      broadcast(socket.current, currentRoom, updated);
    }
  }, [simState, icons, colors]);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <div ref={mountRef} style={{ position: "fixed", inset: 0 }} />
    </div>
  );
}
