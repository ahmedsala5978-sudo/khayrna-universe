
(() => {
  const BRAIN_URL =
    "https://khayrna-brain.salahahmed245663467.workers.dev";

  function createAssistant() {
    if (document.getElementById("khayrna-assistant")) return;

    const panel = document.createElement("section");
    panel.id = "khayrna-assistant";

    panel.style.cssText = `
      position: fixed;
      bottom: 15px;
      left: 15px;
      width: min(360px, calc(100vw - 30px));
      height: 430px;
      background: #ffffff;
      border: 1px solid #d8e5dc;
      border-radius: 14px;
      box-shadow: 0 5px 25px rgba(0,0,0,0.15);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      direction: rtl;
      font-family: Arial, Tahoma, sans-serif;
    `;

    panel.innerHTML = `
      <div style="
        background:#246b45;
        color:white;
        padding:14px;
        font-weight:bold;
        display:flex;
        justify-content:space-between;
        align-items:center;
      ">
        <span>🤖 مساعد خيرنا الذكي</span>
        <span id="assistant-status" style="font-size:12px">
          متصل بالموقع
        </span>
      </div>

      <div id="assistant-messages" style="
        flex:1;
        overflow-y:auto;
        padding:12px;
        background:#f5f8f5;
        direction:rtl;
        text-align:right;
      ">
        <div style="
          background:white;
          padding:10px;
          border-radius:10px;
          margin-bottom:10px;
          line-height:1.8;
          direction:rtl;
          text-align:right;
        ">
          أهلاً بك! أنا مساعد خيرنا الذكي.
          كيف يمكنني مساعدتك في تطوير الكون؟
        </div>
      </div>

      <form id="assistant-form" style="
        display:flex;
        gap:6px;
        padding:10px;
        border-top:1px solid #ddd;
        direction:rtl;
        background:white;
      ">
        <textarea
          id="assistant-input"
          rows="2"
          maxlength="2000"
          placeholder="اكتب رسالتك هنا..."
          dir="rtl"
          lang="ar"
          enterkeyhint="send"
          autocomplete="off"
          autocorrect="on"
          spellcheck="true"
          style="
            flex:1;
            min-width:0;
            resize:none;
            padding:12px;
            border:1px solid #aaa;
            border-radius:8px;
            font-family:Arial,Tahoma,sans-serif;
            font-size:16px;
            line-height:1.7;
            direction:rtl;
            text-align:right;
            unicode-bidi:normal;
            outline:none;
            background:#fff;
            color:#222;
          "
        ></textarea>

        <button
          id="assistant-send"
          type="submit"
          style="
            background:#246b45;
            color:white;
            border:0;
            border-radius:8px;
            padding:10px 14px;
            cursor:pointer;
            font-size:14px;
          "
        >إرسال</button>
      </form>
    `;

    document.body.appendChild(panel);

    const form = panel.querySelector("#assistant-form");
    const input = panel.querySelector("#assistant-input");
    const messages = panel.querySelector("#assistant-messages");
    const status = panel.querySelector("#assistant-status");
    const sendButton = panel.querySelector("#assistant-send");

    function addMessage(text, sender) {
      const bubble = document.createElement("div");

      bubble.style.cssText = `
        background:${sender === "user" ? "#dcefe2" : "#ffffff"};
        padding:10px;
        border-radius:10px;
        margin-bottom:10px;
        white-space:pre-wrap;
        overflow-wrap:anywhere;
        line-height:1.8;
        direction:rtl;
        text-align:right;
        unicode-bidi:normal;
      `;

      bubble.textContent = text;
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const message = input.value.trim();

      if (!message) return;

      addMessage(message, "user");

      input.value = "";
      input.disabled = true;
      sendButton.disabled = true;
      status.textContent = "جاري التفكير...";

      try {
        const response = await fetch(BRAIN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "حدث خطأ في الاتصال");
        }

        addMessage(data.reply, "assistant");
        status.textContent = "متصل";

      } catch (error) {
        addMessage(
          "تعذر الحصول على رد من عقل خيرنا.\n" +
          error.message,
          "assistant"
        );

        status.textContent = "تعذر الاتصال";

      } finally {
        input.disabled = false;
        sendButton.disabled = false;
        input.focus();
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createAssistant);
  } else {
    createAssistant();
  }
})();
