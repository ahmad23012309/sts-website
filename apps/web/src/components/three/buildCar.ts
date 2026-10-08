import type * as THREE from "three";

export interface CarParts {
  group: THREE.Group;
  body: THREE.Mesh;
  bodyMaterial: THREE.MeshPhysicalMaterial;
  dispose: () => void;
}

/**
 * Builds a stylised saloon from an extruded side profile.
 *
 * A downloaded model was the obvious alternative, but the freely licensed car
 * models available run to twelve megabytes or carry attribution and trademark
 * conditions, either of which would be the wrong trade for a homepage. This
 * geometry is a few kilobytes of code, loads instantly, repaints to any colour
 * on demand, and is ours to use without conditions.
 */
export function buildCar(three: typeof THREE): CarParts {
  const {
    BoxGeometry,
    CylinderGeometry,
    ExtrudeGeometry,
    Group,
    Mesh,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    Shape,
  } = three;

  const group = new Group();
  const disposables: { dispose: () => void }[] = [];

  const WIDTH = 1.85;
  const WHEEL_RADIUS = 0.43;
  const FRONT_AXLE = 1.42;
  const REAR_AXLE = -1.38;

  // Side profile, drawn nose-right. The two arcs are the wheel arches.
  const profile = new Shape();
  profile.moveTo(-2.26, 0.56);
  profile.lineTo(-2.3, 0.34);
  profile.lineTo(REAR_AXLE - 0.52, 0.3);
  profile.absarc(REAR_AXLE, 0.3, 0.52, Math.PI, 0, true);
  profile.lineTo(FRONT_AXLE - 0.52, 0.3);
  profile.absarc(FRONT_AXLE, 0.3, 0.52, Math.PI, 0, true);
  profile.lineTo(2.28, 0.34);
  profile.lineTo(2.36, 0.72);
  profile.lineTo(2.18, 0.94);
  profile.lineTo(1.52, 1.0);
  profile.lineTo(0.74, 1.44);
  profile.lineTo(-0.64, 1.5);
  profile.lineTo(-1.46, 1.08);
  profile.lineTo(-2.16, 0.98);
  profile.closePath();

  const bodyGeometry = new ExtrudeGeometry(profile, {
    depth: WIDTH,
    bevelEnabled: true,
    bevelSegments: 6,
    bevelSize: 0.11,
    bevelThickness: 0.09,
    curveSegments: 24,
  });
  // Shift the extrusion so the car straddles the centre line; the profile is
  // already in world orientation, so nothing is rotated.
  bodyGeometry.translate(0, 0, -WIDTH / 2);
  disposables.push(bodyGeometry);

  const bodyMaterial = new MeshPhysicalMaterial({
    color: 0xce1d17,
    metalness: 0.38,
    roughness: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  });
  disposables.push(bodyMaterial);

  const body = new Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  group.add(body);

  // The glazing is a second, slightly wider extrusion pushed through the body,
  // which reads as windows on both sides without any boolean geometry.
  const glass = new Shape();
  glass.moveTo(0.64, 1.35);
  glass.lineTo(-0.6, 1.41);
  glass.lineTo(-1.34, 1.04);
  glass.lineTo(1.4, 0.99);
  glass.closePath();

  const GLASS_WIDTH = WIDTH + 0.34;
  const glassGeometry = new ExtrudeGeometry(glass, {
    depth: GLASS_WIDTH,
    bevelEnabled: false,
    curveSegments: 8,
  });
  glassGeometry.translate(0, 0, -GLASS_WIDTH / 2);
  disposables.push(glassGeometry);

  const glassMaterial = new MeshPhysicalMaterial({
    color: 0x0c1322,
    metalness: 0.2,
    roughness: 0.08,
    transmission: 0.35,
    thickness: 0.4,
    clearcoat: 1,
  });
  disposables.push(glassMaterial);

  const glazing = new Mesh(glassGeometry, glassMaterial);
  group.add(glazing);

  // Wheels.
  const tyreGeometry = new CylinderGeometry(WHEEL_RADIUS, WHEEL_RADIUS, 0.3, 36);
  const rimGeometry = new CylinderGeometry(0.26, 0.26, 0.32, 24);
  const hubGeometry = new CylinderGeometry(0.09, 0.09, 0.34, 16);
  disposables.push(tyreGeometry, rimGeometry, hubGeometry);

  const tyreMaterial = new MeshStandardMaterial({ color: 0x17181c, roughness: 0.85 });
  const rimMaterial = new MeshStandardMaterial({
    color: 0xd7dbe2,
    metalness: 0.95,
    roughness: 0.22,
  });
  const hubMaterial = new MeshStandardMaterial({
    color: 0x123785,
    metalness: 0.6,
    roughness: 0.3,
  });
  disposables.push(tyreMaterial, rimMaterial, hubMaterial);

  for (const x of [FRONT_AXLE, REAR_AXLE]) {
    for (const z of [WIDTH / 2 - 0.02, -(WIDTH / 2 - 0.02)]) {
      const wheel = new Group();

      const tyre = new Mesh(tyreGeometry, tyreMaterial);
      tyre.castShadow = true;
      wheel.add(tyre);

      const rim = new Mesh(rimGeometry, rimMaterial);
      wheel.add(rim);

      const hub = new Mesh(hubGeometry, hubMaterial);
      wheel.add(hub);

      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, WHEEL_RADIUS, z);
      group.add(wheel);
    }
  }

  // Lamps.
  const lampGeometry = new BoxGeometry(0.1, 0.17, 0.44);
  disposables.push(lampGeometry);

  const headlampMaterial = new MeshStandardMaterial({
    color: 0xfff6dd,
    emissive: 0xffe9a8,
    emissiveIntensity: 0.9,
    roughness: 0.2,
  });
  const taillampMaterial = new MeshStandardMaterial({
    color: 0xff4d44,
    emissive: 0xd81f16,
    emissiveIntensity: 0.8,
    roughness: 0.25,
  });
  disposables.push(headlampMaterial, taillampMaterial);

  for (const z of [0.62, -0.62]) {
    const headlamp = new Mesh(lampGeometry, headlampMaterial);
    headlamp.position.set(2.26, 0.86, z);
    group.add(headlamp);

    const taillamp = new Mesh(lampGeometry, taillampMaterial);
    taillamp.position.set(-2.12, 0.92, z);
    group.add(taillamp);
  }

  return {
    group,
    body,
    bodyMaterial,
    dispose: () => {
      for (const item of disposables) item.dispose();
    },
  };
}
