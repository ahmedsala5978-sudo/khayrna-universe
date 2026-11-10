(function () {
  const STORAGE_KEY = "khayrna_universe_v01";

  const defaultState = {
    worldName: "كون خيرنا",
    cityName: "المدينة الأولى",
    resources: {
      points: 30,
      materials: 12,
      knowledge: 8
    },
    events: ["تم إنشاء العالم لأول مرة."],
    running: true
  };

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return structuredClone(defaultState);
      }

      const parsed = JSON.parse(saved);

      return {
        ...defaultState,
        ...parsed,
        resources: {
          ...defaultState.resources,
          ...(parsed.resources || {})
        },
        events: Array.isArray(parsed.events)
          ? parsed.events
          : [...defaultState.events]
      };
    } catch (error) {
      console.error("خطأ في استعادة العالم:", error);
      return structuredClone(defaultState);
    }
  }

  let worldState = loadState();

  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(worldState)
      );
      return true;
    } catch (error) {
      console.error("تعذر حفظ العالم:", error);
      return false;
    }
  }

  window.KHAYRNA_WORLD = {
    getState() {
      return worldState;
    },

    saveState() {
      return saveState();
    },

    addEvent(message) {
      worldState.events.unshift(message);
      worldState.events = worldState.events.slice(0, 100);
      saveState();
    },

    updateResource(name, amount) {
      if (!(name in worldState.resources)) return false;

      worldState.resources[name] += amount;
      saveState();
      return true;
    },

    setRunning(value) {
      worldState.running = Boolean(value);
      saveState();
    },

    resetWorld() {
      worldState = structuredClone(defaultState);
      saveState();
      return worldState;
    }
  };

  // حفظ تلقائي دوري
  setInterval(saveState, 10000);

  // حفظ عند مغادرة الصفحة
  window.addEventListener("beforeunload", saveState);

  console.log("Khayrna World State Ready");
})();