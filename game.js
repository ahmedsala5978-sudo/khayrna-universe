
(() => {
  "use strict";

  const state = window.KHAYRNA_WORLD;
  const agents = window.KHAYRNA_AGENTS.map(a => ({...a}));

  let paused = !state.getState().running;
  let tick = 0;

  const $ = id => document.getElementById(id);

  function log(message) {
    state.addEvent(message);
    renderPanels();
  }

  function renderPanels() {
    const world = state.getState();

    $("agents-list").innerHTML = agents.map(agent => `
      <div class="agent">
        <div>
          <strong>${agent.emoji} ${agent.name}</strong>
          <small>${agent.role}</small>
        </div>
        <span>${agent.task}</span>
      </div>
    `).join("");

    $("points").textContent = world.resources.points;
    $("materials").textContent = world.resources.materials;
    $("knowledge").textContent = world.resources.knowledge;

    $("event-log").innerHTML = world.events.map(event =>
      `<li>${escapeHTML(typeof event === "string" ? event : event.message)}</li>`
    ).join("");

    $("world-status").textContent =
      paused ? "المحاكاة متوقفة" : "العالم يعمل";

    $("pause-btn").textContent =
      paused ? "استئناف المحاكاة" : "إيقاف المحاكاة";
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  class WorldScene extends Phaser.Scene {

    constructor() {
      super("World");
    }

    create() {
      const g = this.add.graphics();

      // الأرض
      g.fillStyle(0xb9d99e, 1);
      g.fillRect(0, 0, 800, 460);

      // الطرق
      g.fillStyle(0xe8dfbd, 1);
      g.fillRect(0, 205, 800, 48);
      g.fillRect(365, 0, 55, 460);

      // المباني
      this.createBuilding(95, 55, 150, 95, 0x7e9db0, "المنزل");
      this.createBuilding(325, 55, 150, 95, 0xd6a06b, "الورشة");
      this.createBuilding(555, 55, 150, 95, 0x8dba9b, "المكتبة");

      // الأشجار
      const trees = [
        [55, 300], [125, 390],
        [280, 350], [510, 370],
        [740, 320], [735, 90]
      ];

      trees.forEach(([x, y]) => {
        this.add.circle(x, y, 17, 0x347b4a);
        this.add.circle(x - 5, y - 5, 7, 0x5b9b5b);
      });

      this.add.text(
        400, 435,
        "ساحة كون خيرنا",
        {
          fontFamily: "Tahoma",
          fontSize: "16px",
          color: "#31523d"
        }
      ).setOrigin(0.5);

      // إنشاء الوكلاء
      agents.forEach(agent => {
        agent.sprite = this.add.circle(
          agent.x, agent.y, 17, agent.color
        ).setStrokeStyle(3, 0xffffff);

        agent.label = this.add.text(
          agent.x,
          agent.y + 25,
          agent.name,
          {
            fontFamily: "Tahoma",
            fontSize: "13px",
            color: "#20312b",
            backgroundColor: "#ffffffcc",
            padding: {x: 4, y: 2}
          }
        ).setOrigin(0.5);
      });

      // دورة حياة الوكلاء
      this.time.addEvent({
        delay: 1800,
        loop: true,
        callback: () => this.agentStep()
      });
    }

    createBuilding(x, y, width, height, color, name) {
      this.add.rectangle(
        x + width / 2,
        y + height / 2,
        width,
        height,
        color
      ).setStrokeStyle(3, 0xffffff);

      this.add.triangle(
        x + width / 2,
        y - 8,
        x - 8,
        y + 12,
        x + width + 8,
        y + 12,
        0x526d61
      );

      this.add.text(
        x + width / 2,
        y + height / 2 + 5,
        name,
        {
          fontFamily: "Tahoma",
          fontSize: "15px",
          color: "#ffffff"
        }
      ).setOrigin(0.5);
    }

    agentStep() {
      if (paused) return;

      tick++;

      agents.forEach((agent, index) => {
        const dx = [18, -15, 12][index];
        const dy = [-8, 10, 9][index];

        const direction = tick % 2 === 0 ? 1 : -1;

        agent.x = Phaser.Math.Clamp(
          agent.x + dx * direction, 35, 765
        );

        agent.y = Phaser.Math.Clamp(
          agent.y + dy * direction, 175, 405
        );

        agent.sprite.setPosition(agent.x, agent.y);
        agent.label.setPosition(agent.x, agent.y + 25);
      });

      if (tick % 5 === 0) {
        const index = Math.floor((tick / 5 - 1) % 3);
        const agent = agents[index];

        log(agent.name + " يتابع نشاطه: " + agent.task);
      }

      if (tick % 10 === 0) {
        state.updateResource("points", 1);
        renderPanels();
      }
    }
  }

  const config = {
    type: Phaser.AUTO,
    parent: "game-container",
    width: 800,
    height: 460,
    backgroundColor: "#b9d99e",
    scene: [WorldScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };

  new Phaser.Game(config);

  $("pause-btn").addEventListener("click", () => {
    paused = !paused;
    state.setRunning(!paused);
    renderPanels();
  });

  $("save-btn").addEventListener("click", () => {
    const success = state.saveState();

    $("save-status").textContent = success
      ? "تم حفظ العالم على هذا الجهاز."
      : "تعذر حفظ العالم.";
  });

  $("reset-btn").addEventListener("click", () => {
    if (!confirm("هل تريد إعادة ضبط العالم التجريبي؟")) {
      return;
    }

    state.resetWorld();
    paused = false;
    tick = 0;

    log("تمت إعادة ضبط العالم.");
    renderPanels();
  });

  // الحفظ التلقائي ومؤشر حالة الحفظ
  const saveStatus = $("save-status");

  if (saveStatus) {
    saveStatus.textContent = "الحفظ التلقائي يعمل...";
  }

  setInterval(() => {
    const saved = state.saveState();

    if (saveStatus) {
      saveStatus.textContent = saved
        ? "الحفظ التلقائي يعمل ✓"
        : "تعذر حفظ العالم!";
    }
  }, 10000);

  renderPanels();

})();
