
import { useEffect, useRef } from "react";

import { createCampusScene } from "../engine/createCampusScene";

import type {
  CampusData,
  CampusSceneCallbacks
} from "../types";

interface CampusCanvasProps {
  campus: CampusData;
  callbacks: CampusSceneCallbacks;
}

export default function CampusCanvas({
  campus,
  callbacks
}: CampusCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const callbacksRef = useRef(callbacks);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const sceneController = createCampusScene(
      canvas,
      campus,
      {
        onBuildingSelected: (buildingId) => {
          callbacksRef.current.onBuildingSelected(buildingId);
        },

        onAgentSelected: (agentId) => {
          callbacksRef.current.onAgentSelected(agentId);
        },

        onGroundSelected: () => {
          callbacksRef.current.onGroundSelected();
        }
      }
    );

    return () => {
      sceneController.dispose();
    };
  }, [campus]);

  return (
    <div className="campus-canvas">
      <canvas
        ref={canvasRef}
        aria-label="الحرم الجامعي ثلاثي الأبعاد لخيرنا"
      />
    </div>
  );
}
