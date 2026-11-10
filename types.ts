
export type CampusId = string;
export type InstitutionId = string;
export type BuildingId = string;
export type AgentId = string;

export interface Vector3Data {
  x: number;
  y: number;
  z: number;
}

export interface CampusInstitution {
  id: InstitutionId;
  name: string;
  nameEn: string;
  type: "academy" | "university" | "research" | "other";
  description: string;
  buildingIds: BuildingId[];
}

export interface CampusBuilding {
  id: BuildingId;
  name: string;
  nameEn: string;
  institutionIds: InstitutionId[];
  position: Vector3Data;
  size: Vector3Data;
  color: string;
  floors: number;
  description: string;
}

export interface CampusAgent {
  id: AgentId;
  name: string;
  role: string;
  institutionId: InstitutionId;
  position: Vector3Data;
  color: string;
  status: "idle" | "working" | "moving";
}

export interface CampusData {
  id: CampusId;
  name: string;
  nameEn: string;
  institutions: CampusInstitution[];
  buildings: CampusBuilding[];
  agents: CampusAgent[];
}

export interface CampusSelection {
  type: "institution" | "building" | "agent" | null;
  id: string | null;
}

export interface CampusSceneCallbacks {
  onBuildingSelected: (buildingId: BuildingId) => void;
  onAgentSelected: (agentId: AgentId) => void;
  onGroundSelected: () => void;
}
