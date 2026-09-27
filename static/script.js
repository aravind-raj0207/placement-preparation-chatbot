const chatScroll = document.getElementById("chat-scroll");
const form = document.getElementById("composer");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const resetBtn = document.getElementById("reset-btn");

function addBubble(text, role, extraClass = "") {
  const row = document.createElement("div");
  row.className = `msg msg-${role}`;

  const bubble = document.createElement("div");
  bubble.className = `bubble ${extraClass}`.trim();
  bubble.textContent = text;

  row.appendChild(bubble);
  chatScroll.appendChild(row);
  chatScroll.scrollTop = chatScroll.scrollHeight;
  return bubble;
}

async function sendMessage(message) {
  addBubble(message, "user");
  input.value = "";
  sendBtn.disabled = true;

  const pending = addBubble("Thinking…", "bot", "pending");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();

    if (!res.ok) {
      pending.textContent = data.error || "Something went wrong. Try again.";
      pending.classList.add("error");
      pending.classList.remove("pending");
      return;
    }

    pending.textContent = data.reply;
    pending.classList.remove("pending");
  } catch (err) {
    pending.textContent = "Couldn't reach the server. Check your connection and try again.";
    pending.classList.add("error");
    pending.classList.remove("pending");
  } finally {
    sendBtn.disabled = false;
    chatScroll.scrollTop = chatScroll.scrollHeight;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  sendMessage(message);
});

resetBtn.addEventListener("click", () => {
  chatScroll.innerHTML = "";
  addBubble(
    "New session started. Tell me the company you're targeting, or ask where your prep is weakest.",
    "bot"
  );
});
