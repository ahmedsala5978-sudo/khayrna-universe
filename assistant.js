(() => {
  const BRAIN_URL =
    "https://khayrna-brain.salahahmed245663467.workers.dev";

  const STORAGE_KEY = "khayrna_assistant_chat_v1";
  const MAX_SAVED = 40;

  const WELCOME =
    "أهلاً بك! أنا مساعد خيرنا الذكي 🤖\nكيف يمكنني مساعدتك في تطوير الكون؟";

  const SUGGESTIONS = [
    "ما حالة العالم الآن؟",
    "اقترح مهمة جديدة للوكلاء",
    "كيف أطور المدينة؟"
  ];

  const CSS = `
    #khayrna-assistant, #khayrna-assistant * {
      box-sizing: border-box;
      font-family: "Segoe UI", Tahoma, Arial, sans-serif;
    }

    /* الزر العائم */
    #khayrna-fab {
      position: fixed;
      bottom: 18px;
      left: 18px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      border: 0;
      background: linear-gradient(135deg, #2f8f5b, #1b5e3b);
      color: #fff;
      font-size: 28px;
      line-height: 1;
      cursor: pointer;
      z-index: 99998;
      box-shadow: 0 6px 20px rgba(27, 94, 59, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: transform .2s ease, opacity .2s ease;
    }
    #khayrna-fab:hover { transform: scale(1.07); }
    #khayrna-fab.hidden { opacity: 0; pointer-events: none; transform: scale(.6); }

    /* النافذة */
    #khayrna-assistant {
      position: fixed;
      bottom: 18px;
      left: 18px;
      width: min(380px, calc(100vw - 24px));
      height: min(560px, calc(100dvh - 36px));
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      direction: rtl;
      transform-origin: bottom left;
      transition: transform .22s ease, opacity .22s ease;
    }
    #khayrna-assistant.closed {
      opacity: 0;
      transform: scale(.85) translateY(20px);
      pointer-events: none;
      visibility: hidden;
    }

    /* الهيدر */
    #khayrna-assistant .ka-header {
      background: linear-gradient(135deg, #2f8f5b, #1b5e3b);
      color: #fff;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    #khayrna-assistant .ka-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255,255,255,.18);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex: 0 0 38px;
    }
    #khayrna-assistant .ka-title { flex: 1; min-width: 0; }
    #khayrna-assistant .ka-title strong { display: block; font-size: 15px; }
    #khayrna-assistant .ka-status {
      font-size: 12px;
      opacity: .9;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    #khayrna-assistant .ka-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #7CFFB0;
      display: inline-block;
    }
    #khayrna-assistant .ka-dot.busy { background: #ffd166; }
    #khayrna-assistant .ka-dot.error { background: #ff6b6b; }

    #khayrna-assistant .ka-icon-btn {
      width: 34px !important;
      height: 34px !important;
      min-width: 0 !important;
      flex: 0 0 34px !important;
      border: 0 !important;
      border-radius: 50% !important;
      background: rgba(255,255,255,.16) !important;
      color: #fff !important;
      font-size: 16px !important;
      cursor: pointer;
      display: flex !important;
      align-items: center;
      justify-content: center;
      padding: 0 !important;
      margin: 0 !important;
    }
    #khayrna-assistant .ka-icon-btn:hover { background: rgba(255,255,255,.3) !important; }

    /* الرسائل */
    #khayrna-assistant .ka-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px 12px;
      background: #f3f7f4;
      display: flex;
      flex-direction: column;
      gap: 10px;
      text-align: right;
      scroll-behavior: smooth;
    }
    #khayrna-assistant .ka-msg {
      max-width: 85%;
      padding: 10px 13px;
      border-radius: 16px;
      line-height: 1.85;
      font-size: 14.5px;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      animation: ka-pop .18s ease;
    }
    #khayrna-assistant .ka-msg.assistant {
      align-self: flex-start;
      background: #fff;
      color: #1f2d25;
      border-top-right-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,.08);
    }
    #khayrna-assistant .ka-msg.user {
      align-self: flex-end;
      background: #246b45;
      color: #fff;
      border-top-left-radius: 4px;
    }
    #khayrna-assistant .ka-msg.error {
      background: #fdecec;
      color: #9b2c2c;
    }
    @keyframes ka-pop {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: none; }
    }

    /* مؤشر الكتابة */
    #khayrna-assistant .ka-typing {
      align-self: flex-start;
      background: #fff;
      border-radius: 16px;
      border-top-right-radius: 4px;
      padding: 12px 16px;
      display: flex;
      gap: 5px;
      box-shadow: 0 1px 3px rgba(0,0,0,.08);
    }
    #khayrna-assistant .ka-typing span {
      width: 7px; height: 7px; border-radius: 50%;
      background: #9bb5a5;
      animation: ka-bounce 1s infinite ease-in-out;
    }
    #khayrna-assistant .ka-typing span:nth-child(2) { animation-delay: .15s; }
    #khayrna-assistant .ka-typing span:nth-child(3) { animation-delay: .3s; }
    @keyframes ka-bounce {
      0%, 80%, 100% { transform: translateY(0); opacity: .5; }
      40% { transform: translateY(-5px); opacity: 1; }
    }

    /* الاقتراحات */
    #khayrna-assistant .ka-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 12px 10px;
      background: #f3f7f4;
    }
    #khayrna-assistant .ka-chips:empty { display: none; }
    #khayrna-assistant .ka-chip {
      width: auto !important;
      border: 1px solid #b9d6c4 !important;
      background: #fff !important;
      color: #1b5e3b !important;
      border-radius: 999px !important;
      padding: 6px 12px !important;
      font-size: 13px !important;
      cursor: pointer;
      margin: 0 !important;
    }
    #khayrna-assistant .ka-chip:hover { background: #e6f3ea !important; }

    /* حقل الكتابة */
    #khayrna-assistant .ka-form {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      padding: 10px 12px;
      background: #fff;
      border-top: 1px solid #e3ebe5;
      margin: 0;
    }
    #khayrna-assistant .ka-input {
      flex: 1 1 auto !important;
      width: auto !important;
      min-width: 0 !important;
      height: 44px;
      max-height: 120px;
      resize: none;
      padding: 11px 14px !important;
      border: 1.5px solid #cfdcd3 !important;
      border-radius: 22px !important;
      font-size: 16px !important;
      line-height: 1.5;
      direction: rtl;
      text-align: right;
      outline: none;
      background: #f8fbf9 !important;
      color: #1f2d25 !important;
      margin: 0 !important;
      overflow-y: auto;
    }
    #khayrna-assistant .ka-input:focus {
      border-color: #2f8f5b !important;
      background: #fff !important;
    }
    #khayrna-assistant .ka-send {
      flex: 0 0 44px !important;
      width: 44px !important;
      height: 44px !important;
      min-width: 0 !important;
      border: 0 !important;
      border-radius: 50% !important;
      background: #246b45 !important;
      color: #fff !important;
      cursor: pointer;
      display: flex !important;
      align-items: center;
      justify-content: center;
      padding: 0 !important;
      margin: 0 !important;
    }
    #khayrna-assistant .ka-send svg {
      width: 20px; height: 20px;
      fill: currentColor;
      transform: scaleX(-1); /* السهم يتجه لليسار مع RTL */
    }
    #khayrna-assistant .ka-send:disabled { background: #a9c3b3 !important; cursor: not-allowed; }

    @media (max-width: 480px) {
      #khayrna-assistant {
        left: 12px;
        bottom: 12px;
        width: calc(100vw - 24px);
        height: min(75dvh, 560px);
      }
      #khayrna-fab { left: 14px; bottom: 14px; }
    }
  `;

  function createAssistant() {
    if (document.getElementById("khayrna-assistant")) return;

    // ---------- الأنماط ----------
    const style = document.createElement("style");
    style.id = "khayrna-assistant-style";
    style.textContent = CSS;
    document.head.appendChild(style);

    // ---------- الزر العائم ----------
    const fab = document.createElement("button");
    fab.id = "khayrna-fab";
    fab.type = "button";
    fab.setAttribute("aria-label", "فتح مساعد خيرنا الذكي");
    fab.textContent = "🤖";
    document.body.appendChild(fab);

    // ---------- النافذة (تبدأ مقفولة) ----------
    const panel = document.createElement("section");
    panel.id = "khayrna-assistant";
    panel.className = "closed";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "مساعد خيرنا الذكي");

    panel.innerHTML = `
      <div class="ka-header">
        <div class="ka-avatar">🤖</div>
        <div class="ka-title">
          <strong>مساعد خيرنا الذكي</strong>
          <span class="ka-status">
            <i class="ka-dot" id="ka-dot"></i>
            <span id="assistant-status">متصل بالموقع</span>
          </span>
        </div>
        <button type="button" class="ka-icon-btn" id="ka-clear" title="مسح المحادثة" aria-label="مسح المحادثة">🗑</button>
        <button type="button" class="ka-icon-btn" id="ka-close" title="إغلاق" aria-label="إغلاق">✕</button>
      </div>

      <div class="ka-messages" id="assistant-messages"></div>
      <div class="ka-chips" id="ka-chips"></div>

      <form class="ka-form" id="assistant-form">
        <textarea
          id="assistant-input"
          class="ka-input"
          rows="1"
          maxlength="2000"
          placeholder="اكتب رسالتك هنا..."
          dir="rtl"
          lang="ar"
          enterkeyhint="send"
          autocomplete="off"
          spellcheck="true"
        ></textarea>
        <button id="assistant-send" class="ka-send" type="submit" aria-label="إرسال">
          <svg viewBox="0 0 24 24"><path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </form>
    `;

    document.body.appendChild(panel);

    const form = panel.querySelector("#assistant-form");
    const input = panel.querySelector("#assistant-input");
    const messages = panel.querySelector("#assistant-messages");
    const status = panel.querySelector("#assistant-status");
    const dot = panel.querySelector("#ka-dot");
    const sendButton = panel.querySelector("#assistant-send");
    const closeBtn = panel.querySelector("#ka-close");
    const clearBtn = panel.querySelector("#ka-clear");
    const chips = panel.querySelector("#ka-chips");

    // ---------- فتح / إغلاق ----------
    function openPanel() {
      panel.classList.remove("closed");
      fab.classList.add("hidden");
      setTimeout(() => input.focus(), 250);
      scrollToBottom();
    }

    function closePanel() {
      panel.classList.add("closed");
      fab.classList.remove("hidden");
      input.blur();
    }

    fab.addEventListener("click", openPanel);
    closeBtn.addEventListener("click", closePanel);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !panel.classList.contains("closed")) {
        closePanel();
      }
    });

    // ---------- أدوات ----------
    function scrollToBottom() {
      messages.scrollTop = messages.scrollHeight;
    }

    function setStatus(text, state) {
      status.textContent = text;
      dot.className = "ka-dot" + (state ? " " + state : "");
    }

    function autoGrow() {
      input.style.height = "44px";
      input.style.height = Math.min(input.scrollHeight, 120) + "px";
    }

    // ---------- حفظ المحادثة ----------
    let history = [];

    function loadHistory() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        if (Array.isArray(saved)) history = saved.slice(-MAX_SAVED);
      } catch (_) {
        history = [];
      }
    }

    function saveHistory() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(history.slice(-MAX_SAVED))
        );
      } catch (_) {}
    }

    function addMessage(text, sender, opts = {}) {
      const bubble = document.createElement("div");
      bubble.className =
        "ka-msg " + sender + (opts.error ? " error" : "");
      bubble.textContent = text;
      messages.appendChild(bubble);
      scrollToBottom();

      if (!opts.skipSave) {
        history.push({ text, sender, error: !!opts.error });
        saveHistory();
      }
    }

    function showTyping() {
      const el = document.createElement("div");
      el.className = "ka-typing";
      el.innerHTML = "<span></span><span></span><span></span>";
      messages.appendChild(el);
      scrollToBottom();
      return el;
    }

    function renderSuggestions() {
      chips.innerHTML = "";
      SUGGESTIONS.forEach((text) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "ka-chip";
        b.textContent = text;
        b.addEventListener("click", () => {
          input.value = text;
          form.requestSubmit();
        });
        chips.appendChild(b);
      });
    }

    function renderAll() {
      messages.innerHTML = "";
      addMessage(WELCOME, "assistant", { skipSave: true });
      history.forEach((m) =>
        addMessage(m.text, m.sender, { error: m.error, skipSave: true })
      );
      if (history.length === 0) renderSuggestions();
      else chips.innerHTML = "";
    }

    clearBtn.addEventListener("click", () => {
      history = [];
      saveHistory();
      renderAll();
      setStatus("متصل بالموقع");
    });

    // ---------- الإرسال ----------
    let busy = false;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (busy) return;

      const message = input.value.trim();
      if (!message) return;

      busy = true;
      chips.innerHTML = "";
      addMessage(message, "user");

      input.value = "";
      autoGrow();
      input.disabled = true;
      sendButton.disabled = true;
      setStatus("جاري التفكير...", "busy");
      const typing = showTyping();

      try {
        const response = await fetch(BRAIN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "حدث خطأ في الاتصال");
        }

        typing.remove();
        addMessage(data.reply, "assistant");
        setStatus("متصل");
      } catch (error) {
        typing.remove();
        addMessage(
          "تعذر الحصول على رد من عقل خيرنا.\n" + error.message,
          "assistant",
          { error: true }
        );
        setStatus("تعذر الاتصال", "error");
      } finally {
        busy = false;
        input.disabled = false;
        sendButton.disabled = false;
        input.focus();
      }
    });

    input.addEventListener("input", autoGrow);

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });

    // ---------- بداية التشغيل ----------
    loadHistory();
    renderAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createAssistant);
  } else {
    createAssistant();
  }
})();
