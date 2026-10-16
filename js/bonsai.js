import * as THREE from "../vendor/three.module.min.js";

const key = (x, y, z) => x + "," + y + "," + z;

function buildTree(seed) {
  let s = seed >>> 0;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const trunk = new Map();
  const pot = new Map();
  const put = (map, x, y, z, color) => {
    const k = key(x, y, z);
    if (!map.has(k)) map.set(k, [x, y, z, color]);
  };

  for (let x = -9; x <= 9; x++) {
    for (let z = -6; z <= 6; z++) {
      for (let y = -4; y <= 0; y++) {
        const edge = Math.abs(x) === 9 || Math.abs(z) === 6;
        if (y <= -3 && (Math.abs(x) > 8 || Math.abs(z) > 5)) continue;
        if (edge || y === -4) put(pot, x, y, z, y === 0 ? 0x2a2620 : 0x1f1c17);
        else if (y === 0) put(pot, x, y, z, rnd() < 0.2 ? 0x4b5a3a : 0x3a3226);
      }
    }
  }
  for (const [fx, fz] of [[-7, -4], [7, -4], [-7, 4], [7, 4]]) put(pot, fx, -5, fz, 0x1f1c17);

  const curve = (p0, p1, p2, p3, t) => {
    const u = 1 - t;
    return p0.map((_, i) => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i]);
  };
  const bark = (height) => (rnd() < 0.18 ? 0x6e2e22 : height > 14 ? 0xa84a33 : 0x8f3d2b);
  const tube = (p0, p1, p2, p3, r0, r1) => {
    for (let t = 0; t <= 1.0001; t += 0.02) {
      const [cx, cy, cz] = curve(p0, p1, p2, p3, t);
      const radius = r0 + (r1 - r0) * t;
      const reach = Math.ceil(radius);
      for (let x = -reach; x <= reach; x++) {
        for (let y = -reach; y <= reach; y++) {
          for (let z = -reach; z <= reach; z++) {
            if (x * x + y * y + z * z <= radius * radius) {
              put(trunk, Math.round(cx + x), Math.round(cy + y), Math.round(cz + z), bark(cy));
            }
          }
        }
      }
    }
  };

  const spine = [[-1, 0, 0], [8, 7, 2], [-9, 13, -2], [2, 24, 0]];
  tube(spine[0], spine[1], spine[2], spine[3], 2.7, 1);
  const at = (t) => curve(spine[0], spine[1], spine[2], spine[3], t).map(Math.round);
  const pads = [];
  const branch = (t, dx, dy, dz, radius, padRadius) => {
    const origin = at(t);
    const tip = [origin[0] + dx, origin[1] + dy, origin[2] + dz];
    tube(
      origin,
      [origin[0] + dx * 0.4, origin[1] + dy * 0.2, origin[2] + dz * 0.3],
      [origin[0] + dx * 0.8, origin[1] + dy * 0.7, origin[2] + dz * 0.8],
      tip,
      radius,
      0.9
    );
    pads.push({ c: [tip[0], tip[1] + 2, tip[2]], r: padRadius });
  };
  branch(0.34, 13, 6, 3, 1.5, 8.6);
  branch(0.48, -14, 6, 2, 1.4, 8);
  branch(0.62, 11, 5, -5, 1.1, 6.8);
  branch(0.74, -10, 6, -5, 1, 6.4);
  branch(0.86, 7, 6, 6, 0.9, 5.8);
  pads.push({ c: [2, 27, 0], r: 7.2 });

  const slots = new Map();
  for (const pad of pads) {
    const radius = pad.r * 1.45;
    const reach = Math.ceil(radius);
    for (let x = -reach; x <= reach; x++) {
      for (let z = -reach; z <= reach; z++) {
        for (let y = -2; y <= 3; y++) {
          const flat = (x * x + z * z) / (radius * radius);
          const lift = y > 0 ? (y * y) / 4.2 : (y * y) / 5;
          const distance = flat + lift;
          if (distance > 1 + (rnd() - 0.5) * 0.18) continue;
          const k = key(pad.c[0] + x, pad.c[1] + y, pad.c[2] + z);
          if (trunk.has(k) || slots.has(k)) continue;
          slots.set(k, { pos: [pad.c[0] + x, pad.c[1] + y, pad.c[2] + z], d: distance + rnd() * 0.02, top: y });
        }
      }
    }
  }
  const order = [...slots.values()].sort((a, b) => a.d - b.d);
  return { pot, trunk, order, rnd };
}

function mountBonsai(canvas, { seed = 7, onCount } = {}) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { pot, trunk, order, rnd } = buildTree(seed);
  const capacity = order.length;
  const greens = [0x2f6b4f, 0x3f8a67, 0x4f9a74, 0x5fae84, 0x27593f];

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 900);
  scene.add(new THREE.HemisphereLight(0xfff4e2, 0x6b5a45, 1.35));
  const sun = new THREE.DirectionalLight(0xffe7c4, 2.6);
  sun.position.set(40, 70, 30);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -40, right: 40, top: 50, bottom: -15, near: 10, far: 200 });
  sun.shadow.bias = -0.0006;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xcfe3ff, 0.45);
  fill.position.set(-50, 20, -30);
  scene.add(fill);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.ShadowMaterial({ opacity: 0.16 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -5.5;
  ground.receiveShadow = true;
  scene.add(ground);

  const group = new THREE.Group();
  scene.add(group);
  const box = new THREE.BoxGeometry(0.96, 0.96, 0.96);
  const material = new THREE.MeshStandardMaterial({ roughness: 0.82, metalness: 0 });
  const color = new THREE.Color();
  const matrix = new THREE.Matrix4();
  const solid = [...pot.values(), ...trunk.values()];
  const wood = new THREE.InstancedMesh(box, material, solid.length);
  solid.forEach(([x, y, z, hex], i) => {
    matrix.makeTranslation(x, y, z);
    wood.setMatrixAt(i, matrix);
    wood.setColorAt(i, color.setHex(hex));
  });
  const stone = { 0x2a2620: 0x6b6252, 0x1f1c17: 0x575045 };
  const potCount = pot.size;
  const tint = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    for (let i = 0; i < potCount; i++) {
      const hex = solid[i][3];
      wood.setColorAt(i, color.setHex(dark && stone[hex] ? stone[hex] : hex));
    }
    wood.instanceColor.needsUpdate = true;
    ground.material.opacity = dark ? 0.32 : 0.16;
  };
  tint();
  wood.castShadow = true;
  wood.receiveShadow = true;
  group.add(wood);

  const leaves = new THREE.InstancedMesh(box, material.clone(), capacity);
  order.forEach((leaf, i) => {
    const hex = leaf.top >= 2 && rnd() < 0.5 ? 0x6cbb8f : greens[(i * 7 + (leaf.top > 1 ? 3 : 0)) % greens.length];
    leaves.setColorAt(i, color.setHex(hex));
  });
  leaves.count = 0;
  leaves.castShadow = true;
  leaves.receiveShadow = true;
  group.add(leaves);

  const moteCount = reduce ? 0 : 36;
  const moteGeometry = new THREE.BufferGeometry();
  const motePositions = new Float32Array(moteCount * 3);
  const moteSeeds = [];
  for (let i = 0; i < moteCount; i++) {
    moteSeeds.push([rnd() * 36 - 18, 12 + rnd() * 22, rnd() * 30 - 15, rnd() * 6.28, 0.3 + rnd() * 0.5]);
  }
  moteGeometry.setAttribute("position", new THREE.BufferAttribute(motePositions, 3));
  group.add(new THREE.Points(moteGeometry, new THREE.PointsMaterial({
    color: 0xc9a85a, size: 0.55, transparent: true, opacity: 0.55, depthWrite: false
  })));

  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const point = new THREE.Vector3();
  const born = new Float32Array(capacity).fill(-1);
  let shown = 0;
  let target = 0;
  let animating = false;
  const placeLeaf = (i, amount) => {
    const [x, y, z] = order[i].pos;
    point.set(x, y, z);
    scale.setScalar(amount);
    matrix.compose(point, quaternion, scale);
    leaves.setMatrixAt(i, matrix);
  };
  function setLeaves(count) {
    const want = Math.min(Math.max(0, count | 0), capacity);
    if (want <= target) return;
    const now = performance.now();
    const first = target === 0;
    const span = first && !reduce ? 2600 : 0;
    for (let i = target; i < want; i++) {
      const step = span ? ((i - target) / (want - target)) * span * 0.8 : (i - target) * 120;
      born[i] = reduce ? now : now + step;
    }
    target = want;
    leaves.count = target;
    animating = true;
    if (onCount) onCount(target, count, capacity);
    wake();
  }

  let radius = 0;
  let low = Infinity;
  let high = -Infinity;
  for (const [x, y, z] of [...pot.values(), ...trunk.values(), ...order.map((leaf) => leaf.pos)]) {
    radius = Math.max(radius, Math.hypot(x, z));
    low = Math.min(low, y);
    high = Math.max(high, y);
  }
  radius += 1.2;
  low -= 1;
  high += 1.2;
  const aim = new THREE.Vector3(0, (low + high) / 2, 0);
  const direction = new THREE.Vector3(52, 38, 70).normalize();
  const hull = [];
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    hull.push(new THREE.Vector3(Math.cos(angle) * radius, low, Math.sin(angle) * radius));
    hull.push(new THREE.Vector3(Math.cos(angle) * radius, high, Math.sin(angle) * radius));
  }
  const fits = (distance) => {
    camera.position.copy(aim).addScaledVector(direction, distance);
    camera.lookAt(aim);
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();
    const projected = new THREE.Vector3();
    return hull.every((p) => {
      projected.copy(p).project(camera);
      return Math.abs(projected.x) <= 0.94 && Math.abs(projected.y) <= 0.94 && projected.z < 1;
    });
  };
  const fitCamera = () => {
    let near = 20;
    let far = 400;
    for (let i = 0; i < 24; i++) {
      const mid = (near + far) / 2;
      if (fits(mid)) far = mid;
      else near = mid;
    }
    fits(far);
  };
  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    fitCamera();
    wake();
  };
  new ResizeObserver(resize).observe(canvas);

  let drag = null;
  let spin = -0.35;
  let velocity = 0;
  let running = false;
  let visible = true;
  canvas.addEventListener("pointerdown", (e) => { drag = e.clientX; canvas.setPointerCapture(e.pointerId); wake(); });
  canvas.addEventListener("pointermove", (e) => {
    if (drag === null) return;
    velocity = (e.clientX - drag) * 0.006;
    spin += velocity;
    drag = e.clientX;
  });
  canvas.addEventListener("pointerup", () => { drag = null; });
  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; if (visible) wake(); }).observe(canvas);

  function frame(now) {
    const seconds = now / 1000;
    if (animating) {
      let busy = false;
      for (let i = shown; i < target; i++) {
        const age = now - born[i];
        const grow = age <= 0 ? 0 : Math.min(1, age / (reduce ? 1 : 300));
        const popped = grow >= 1 ? 1 : grow < 0.7 ? (grow / 0.7) * 1.18 : 1.18 - ((grow - 0.7) / 0.3) * 0.18;
        placeLeaf(i, popped);
        if (grow < 1) busy = true;
      }
      if (!busy) { shown = target; animating = false; }
      leaves.instanceMatrix.needsUpdate = true;
    }
    if (drag === null) {
      velocity *= 0.94;
      if (!reduce) spin += 0.0016 + velocity;
    }
    group.rotation.y = spin;
    if (!reduce) {
      group.rotation.z = Math.sin(seconds * 0.55) * 0.006;
      group.rotation.x = Math.sin(seconds * 0.41 + 1) * 0.004;
      for (let i = 0; i < moteCount; i++) {
        const [x, y, z, phase, speed] = moteSeeds[i];
        motePositions[i * 3] = x + Math.sin(seconds * speed + phase) * 2.2;
        motePositions[i * 3 + 1] = y + ((seconds * speed * 0.8 + phase) % 6) - 3;
        motePositions[i * 3 + 2] = z + Math.cos(seconds * speed * 0.7 + phase) * 2.2;
      }
      moteGeometry.attributes.position.needsUpdate = true;
    }
    renderer.render(scene, camera);
    if (visible && (!reduce || animating || drag !== null)) requestAnimationFrame(frame);
    else running = false;
  }
  function wake() {
    if (!running) { running = true; requestAnimationFrame(frame); }
  }
  resize();
  wake();
  addEventListener("priors:theme", () => { tint(); wake(); });
  return { setLeaves, capacity };
}

const canvas = document.getElementById("bonsai");
if (canvas) {
  const count = document.getElementById("leafcount");
  const note = document.getElementById("leafnote");
  try {
    const tree = mountBonsai(canvas, {
      onCount: (drawn, total, cap) => {
        if (count) count.textContent = total.toLocaleString("en-US") + " repayments";
        if (note) {
          note.textContent = drawn < total
            ? "One leaf for each loan repaid. The tree shows the first " + cap.toLocaleString("en-US") + "."
            : "One leaf for each loan repaid.";
        }
      }
    });
    tree.setLeaves(43467);
  } catch (error) {
    const figure = canvas.closest("figure");
    if (figure) figure.hidden = true;
  }
}
