
import {
  ArcRotateCamera,
  Color3,
  Color4,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  PointerEventTypes,
  Scene,
  StandardMaterial,
  Vector3
} from "@babylonjs/core";

import type {
  CampusData,
  CampusSceneCallbacks
} from "../types";

function createMaterial(
  scene: Scene,
  name: string,
  hexColor: string
): StandardMaterial {
  const material = new StandardMaterial(name, scene);
  material.diffuseColor = Color3.FromHexString(hexColor);
  material.specularColor = new Color3(0.15, 0.15, 0.15);
  return material;
}

function createBox(
  scene: Scene,
  name: string,
  position: Vector3,
  size: Vector3,
  color: string
): Mesh {
  const mesh = MeshBuilder.CreateBox(
    name,
    {
      width: size.x,
      height: size.y,
      depth: size.z
    },
    scene
  );

  mesh.position = position;
  mesh.material = createMaterial(scene, `${name}-material`, color);

  return mesh;
}

export function createCampusScene(
  canvas: HTMLCanvasElement,
  campus: CampusData,
  callbacks: CampusSceneCallbacks
): {
  engine: Engine;
  scene: Scene;
  dispose: () => void;
} {
  const engine = new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    antialias: true
  });

  const scene = new Scene(engine);

  scene.clearColor = new Color4(0.82, 0.87, 0.84, 1);

  // الكاميرا الرئيسية
  const camera = new ArcRotateCamera(
    "campus-camera",
    -Math.PI / 2,
    Math.PI / 3,
    65,
    new Vector3(0, 0, 8),
    scene
  );

  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 15;
  camera.upperRadiusLimit = 120;
  camera.wheelPrecision = 35;
  camera.panningSensibility = 80;

  // الإضاءة
  const light = new HemisphericLight(
    "campus-light",
    new Vector3(0, 1, 0),
    scene
  );

  light.intensity = 0.9;

  // الأرض الرئيسية
  const ground = MeshBuilder.CreateGround(
    "campus-ground",
    {
      width: 100,
      height: 100
    },
    scene
  );

  ground.position.y = -0.15;
  ground.material = createMaterial(
    scene,
    "campus-ground-material",
    "#a8b99b"
  );

  // الساحة المركزية
  const plaza = MeshBuilder.CreateGround(
    "central-plaza",
    {
      width: 24,
      height: 18
    },
    scene
  );

  plaza.position.set(0, -0.05, 0);
  plaza.material = createMaterial(
    scene,
    "plaza-material",
    "#d8d2c3"
  );

  // الطرق الرئيسية
  const roadX = MeshBuilder.CreateGround(
    "main-road-x",
    {
      width: 100,
      height: 5
    },
    scene
  );

  roadX.position.set(0, -0.08, -14);
  roadX.material = createMaterial(
    scene,
    "road-x-material",
    "#777d7a"
  );

  const roadZ = MeshBuilder.CreateGround(
    "main-road-z",
    {
      width: 5,
      height: 100
    },
    scene
  );

  roadZ.position.set(0, -0.07, 0);
  roadZ.material = createMaterial(
    scene,
    "road-z-material",
    "#777d7a"
  );

  // مباني الحرم
  const buildingMeshes = new Map<string, Mesh>();

  for (const building of campus.buildings) {
    const buildingMesh = createBox(
      scene,
      building.id,
      new Vector3(
        building.position.x,
        building.size.y / 2,
        building.position.z
      ),
      new Vector3(
        building.size.x,
        building.size.y,
        building.size.z
      ),
      building.color
    );

    buildingMesh.metadata = {
      entityType: "building",
      entityId: building.id
    };

    buildingMeshes.set(building.id, buildingMesh);

    // سقف المبنى
    const roof = createBox(
      scene,
      `${building.id}-roof`,
      new Vector3(
        building.position.x,
        building.size.y + 0.25,
        building.position.z
      ),
      new Vector3(
        building.size.x + 0.4,
        0.5,
        building.size.z + 0.4
      ),
      "#8b8175"
    );

    roof.isPickable = false;
  }

  // الوكلاء الافتراضيون
  const agentMeshes = new Map<string, Mesh>();

  for (const agent of campus.agents) {
    const agentMesh = MeshBuilder.CreateSphere(
      agent.id,
      {
        diameter: 1.5,
        segments: 16
      },
      scene
    );

    agentMesh.position = new Vector3(
      agent.position.x,
      0.8,
      agent.position.z
    );

    agentMesh.material = createMaterial(
      scene,
      `${agent.id}-material`,
      agent.color
    );

    agentMesh.metadata = {
      entityType: "agent",
      entityId: agent.id
    };

    agentMeshes.set(agent.id, agentMesh);
  }

  // التعامل مع اختيار المباني والوكلاء
  scene.onPointerObservable.add((pointerInfo) => {
    if (
      pointerInfo.type !== PointerEventTypes.POINTERPICK
    ) {
      return;
    }

    const pickedMesh = pointerInfo.pickInfo?.pickedMesh;

    if (!pickedMesh) {
      return;
    }

    const metadata = pickedMesh.metadata;

    if (
      metadata?.entityType === "building" &&
      typeof metadata.entityId === "string"
    ) {
      callbacks.onBuildingSelected(metadata.entityId);
      return;
    }

    if (
      metadata?.entityType === "agent" &&
      typeof metadata.entityId === "string"
    ) {
      callbacks.onAgentSelected(metadata.entityId);
      return;
    }

    callbacks.onGroundSelected();
  });

  // تشغيل المحرك
  engine.runRenderLoop(() => {
    scene.render();
  });

  // معالجة تغيير حجم الشاشة
  const handleResize = () => {
    engine.resize();
  };

  window.addEventListener("resize", handleResize);

  return {
    engine,
    scene,

    dispose: () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      engine.dispose();
    }
  };
}
