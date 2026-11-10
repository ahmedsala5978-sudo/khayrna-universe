
// ======================================
// KHAYRNA UNIVERSE
// AGENTS SYSTEM - V0.1
// ======================================

window.KHAYRNA_AGENTS = [

  {
    id: "manager",
    name: "المدير",
    englishName: "Khayrna Manager",

    role: "الإدارة والتنظيم",

    description:
      "مسؤول عن إدارة المجتمع وتنظيم الأعمال والموارد.",

    color: 0x3979c9,
    emoji: "🔵",

    x: 230,
    y: 180,

    task: "متابعة المدينة",

    status: "active",

    resources: {
      points: 10,
      materials: 0,
      knowledge: 0
    }
  },

  {
    id: "builder",
    name: "البنّاء",
    englishName: "Khayrna Builder",

    role: "البناء والإنتاج",

    description:
      "مسؤول عن تطوير المدينة وإنشاء المرافق وتنفيذ المشروعات.",

    color: 0xe58a36,
    emoji: "🟠",

    x: 420,
    y: 290,

    task: "فحص الورشة",

    status: "active",

    resources: {
      points: 10,
      materials: 0,
      knowledge: 0
    }
  },

  {
    id: "researcher",
    name: "الباحث",
    englishName: "Khayrna Researcher",

    role: "البحث والمعرفة",

    description:
      "مسؤول عن اكتساب المعرفة والبحث والتعلم وتطوير الأفكار.",

    color: 0x399b68,
    emoji: "🟢",

    x: 620,
    y: 180,

    task: "ترتيب المكتبة",

    status: "active",

    resources: {
      points: 10,
      materials: 0,
      knowledge: 0
    }
  }

];

// البحث عن وكيل باستخدام هويته
window.getKhayrnaAgent = function(id) {

  return window.KHAYRNA_AGENTS.find(
    agent => agent.id === id
  ) || null;

};

// الحصول على جميع الوكلاء
window.getAllKhayrnaAgents = function() {

  return window.KHAYRNA_AGENTS;

};

// تحديث مهمة وكيل
window.updateKhayrnaAgentTask = function(id, newTask) {

  const agent = window.getKhayrnaAgent(id);

  if (!agent) {
    return false;
  }

  agent.task = newTask;

  return true;

};
