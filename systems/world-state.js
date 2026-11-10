
// ==========================================
// KHAYRNA UNIVERSE
// WORLD STATE SYSTEM - V0.1
// ==========================================

(function () {

  const STORAGE_KEY = "khayrna_universe_v01";

  const DEFAULT_STATE = {
    version: "0.1",

    worldName: "كون خيرنا",

    cityName: "المدينة الأولى",

    day: 1,

    running: true,

    resources: {
      points: 30,
      materials: 12,
      knowledge: 8
    },

    events: [
      {
        message: "تم إنشاء العالم لأول مرة.",
        time: new Date().toISOString()
      }
    ],

    createdAt: new Date().toISOString()
  };

  function createDefaultState() {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  function loadState() {

    try {

      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return createDefaultState();
      }

      const parsed = JSON.parse(saved);

      return {
        ...createDefaultState(),
        ...parsed,

        resources: {
          ...DEFAULT_STATE.resources,
          ...(parsed.resources || {})
        },

        events: Array.isArray(parsed.events)
          ? parsed.events
          : []
      };

    } catch (error) {

      console.error("World loading error:", error);

      return createDefaultState();
    }
  }

  let state = loadState();

  function saveState() {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );

      return true;

    } catch (error) {

      console.error("World saving error:", error);

      return false;
    }
  }

  function addEvent(message) {

    if (typeof message !== "string" || !message.trim()) {
      return false;
    }

    state.events.unshift({
      message: message.trim(),
      time: new Date().toISOString()
    });

    state.events = state.events.slice(0, 50);

    saveState();

    return true;
  }

  function updateResource(resource, amount) {

    if (!Object.prototype.hasOwnProperty.call(
      state.resources,
      resource
    )) {
      return false;
    }

    if (!Number.isFinite(amount)) {
      return false;
    }

    const newValue = state.resources[resource] + amount;

    if (newValue < 0) {
      return false;
    }

    state.resources[resource] = newValue;

    saveState();

    return true;
  }

  function setRunning(value) {

    state.running = Boolean(value);

    saveState();

    return state.running;
  }

  function getState() {

    return JSON.parse(JSON.stringify(state));
  }

  function resetWorld() {

    state = createDefaultState();

    saveState();

    return getState();
  }

  window.KHAYRNA_WORLD = {

    getState,

    saveState,

    addEvent,

    updateResource,

    setRunning,

    resetWorld

  };

  console.log("Khayrna World State initialized.");

})();

// ==========================================
// END OF WORLD STATE SYSTEM
// ==========================================
