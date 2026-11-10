
(function () {
  "use strict";

  const state = window.KHAYRNA_WORLD;
  const agents = window.KHAYRNA_AGENTS;

  if (!state || !agents) {
    console.error("تعذر تحميل نظام الوكلاء.");
    return;
  }

  const tasks = {
    manager: [
      {
        id: "organize",
        name: "تنظيم أعمال المدينة",
        description: "تنظيم الأعمال وتنسيق احتياجات المجتمع.",
        cost: {},
        reward: { points: 2 }
      },
      {
        id: "planning",
        name: "إعداد خطة تطوير",
        description: "إعداد خطة لتطوير المدينة.",
        cost: {},
        reward: { knowledge: 1, points: 1 }
      }
    ],

    builder: [
      {
        id: "collect",
        name: "جمع مواد البناء",
        description: "جمع مواد جديدة لاستخدامها في البناء.",
        cost: { points: 1 },
        reward: { materials: 3 }
      },
      {
        id: "maintenance",
        name: "صيانة الورشة",
        description: "تنفيذ أعمال صيانة للورشة.",
        cost: { materials: 1 },
        reward: { points: 2 }
      }
    ],

    researcher: [
      {
        id: "study",
        name: "دراسة المعرفة",
        description: "إجراء دراسة معرفية جديدة.",
        cost: { points: 1 },
        reward: { knowledge: 2 }
      },
      {
        id: "analysis",
        name: "تحليل الموارد",
        description: "تحليل موارد المجتمع وتقديم نتائج.",
        cost: { points: 1 },
        reward: { knowledge: 1, materials: 1 }
      }
    ]
  };

  function getAgent(agentId) {
    return agents.find(agent => agent.id === agentId) || null;
  }

  function getTasks(agentId) {
    return tasks[agentId] || [];
  }

  function assignTask(agentId, taskId) {
    const agent = getAgent(agentId);
    if (!agent) {
      return { success: false, message: "الوكيل غير موجود." };
    }

    const task = getTasks(agentId).find(item => item.id === taskId);

    if (!task) {
      return { success: false, message: "المهمة غير متاحة لهذا الوكيل." };
    }

    agent.task = task.name;
    agent.status = "active";

    state.addEvent(
      agent.name + " استلم مهمة: " + task.name
    );

    return {
      success: true,
      message: "تم تعيين المهمة بنجاح.",
      agent,
      task
    };
  }

  function executeTask(agentId, taskId) {
    const agent = getAgent(agentId);

    if (!agent) {
      return { success: false, message: "الوكيل غير موجود." };
    }

    const task = getTasks(agentId).find(item => item.id === taskId);

    if (!task) {
      return { success: false, message: "المهمة غير متاحة." };
    }

    const resources = state.getState().resources;

    // التحقق من كفاية الموارد
    for (const [name, amount] of Object.entries(task.cost)) {
      if (
        !Number.isFinite(resources[name]) ||
        resources[name] < amount
      ) {
        return {
          success: false,
          message: "الموارد غير كافية لتنفيذ المهمة."
        };
      }
    }

    // خصم تكلفة المهمة
    for (const [name, amount] of Object.entries(task.cost)) {
      state.updateResource(name, -amount);
    }

    // إضافة مكافأة المهمة
    for (const [name, amount] of Object.entries(task.reward)) {
      state.updateResource(name, amount);
    }

    agent.task = task.name;
    agent.status = "active";

    const message =
      agent.name + " أكمل مهمة: " + task.name;

    state.addEvent(message);

    return {
      success: true,
      message,
      agent,
      task,
      resources: state.getState().resources
    };
  }

  window.KHAYRNA_AGENT_ACTIONS = {
    getTasks,
    assignTask,
    executeTask,
    getAgent
  };

  console.log("Khayrna Agent Actions Ready");
})();
