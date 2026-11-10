
import type { CampusData } from "../types";

export const campusRegistry: CampusData = {
  id: "khayrna-main-campus",
  name: "الحرم الجامعي لخيرنا",
  nameEn: "Khayrna Main Campus",

  institutions: [
    {
      id: "architecture-academy",
      name: "أكاديمية خيرنا للعمارة والتخطيط الحضاري",
      nameEn: "Khayrna Academy of Architecture and Urban Planning",
      type: "academy",
      description:
        "مؤسسة أكاديمية متخصصة في تعليم وبحث وتطوير وكلاء الذكاء الاصطناعي في العمارة والتخطيط الحضاري.",
      buildingIds: [
        "architecture-main",
        "architecture-research",
        "architecture-labs"
      ]
    }
  ],

  buildings: [
    {
      id: "architecture-main",
      name: "المبنى الرئيسي للأكاديمية",
      nameEn: "Academy Main Building",
      institutionIds: ["architecture-academy"],
      position: { x: -12, y: 0, z: 0 },
      size: { x: 12, y: 8, z: 10 },
      color: "#d8c8a8",
      floors: 3,
      description: "المقر الإداري والتعليمي الرئيسي للأكاديمية."
    },
    {
      id: "architecture-research",
      name: "مركز الأبحاث المعمارية",
      nameEn: "Architecture Research Center",
      institutionIds: ["architecture-academy"],
      position: { x: 12, y: 0, z: 0 },
      size: { x: 10, y: 7, z: 9 },
      color: "#a9c6bd",
      floors: 2,
      description: "مركز الدراسات والبحوث المعمارية والحضرية."
    },
    {
      id: "architecture-labs",
      name: "مجمع المختبرات الرقمية",
      nameEn: "Digital Laboratories Complex",
      institutionIds: ["architecture-academy"],
      position: { x: 0, y: 0, z: 18 },
      size: { x: 14, y: 6, z: 10 },
      color: "#b5c5d9",
      floors: 2,
      description: "مجمع المختبرات والنمذجة والمحاكاة الرقمية."
    },
    {
      id: "campus-library",
      name: "المكتبة المركزية",
      nameEn: "Central Library",
      institutionIds: [],
      position: { x: -22, y: 0, z: 22 },
      size: { x: 10, y: 7, z: 8 },
      color: "#d5b8a3",
      floors: 2,
      description: "مرفق معرفي مشترك قابل لخدمة مؤسسات الحرم المختلفة."
    },
    {
      id: "campus-services",
      name: "مركز الخدمات المشتركة",
      nameEn: "Shared Services Center",
      institutionIds: [],
      position: { x: 22, y: 0, z: 22 },
      size: { x: 10, y: 6, z: 8 },
      color: "#c4c9a6",
      floors: 2,
      description: "مركز الخدمات والمرافق المشتركة للحرم."
    }
  ],

  agents: [
    {
      id: "agent-001",
      name: "وكيل التخطيط",
      role: "مساعد التخطيط الحضاري",
      institutionId: "architecture-academy",
      position: { x: -8, y: 0, z: 8 },
      color: "#e0a64b",
      status: "idle"
    },
    {
      id: "agent-002",
      name: "وكيل الأبحاث",
      role: "باحث معماري",
      institutionId: "architecture-academy",
      position: { x: 8, y: 0, z: 10 },
      color: "#65a8d1",
      status: "working"
    },
    {
      id: "agent-003",
      name: "وكيل النمذجة",
      role: "متخصص النمذجة الرقمية",
      institutionId: "architecture-academy",
      position: { x: 2, y: 0, z: 12 },
      color: "#79b58a",
      status: "idle"
    }
  ]
};
