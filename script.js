const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Global conversation history
const messages = [
  {
    role: "system",
    content: `
You are a strict product assistant who ONLY answers questions about L'Oréal products.
If the user's question is not clearly about a L'Oréal product, refuse to answer and ask them to rephrase.
Never provide information about other brands or off-topic subjects.
`
  }
];

// Initial greeting
appendMessage("ai", "👋 Hello! How can I help you today?");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  // Show user message
  appendMessage("user", message);
  messages.push({ role: "user", content: message });

  // Clear input
  userInput.value = "";

  try {
    const response = await fetch("https://314159265.nchlsschfr.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content?.trim() || "⚠️ No response from AI.";

    // Show AI message
    appendMessage("ai", aiMessage);
    messages.push({ role: "assistant", content: aiMessage });

  } catch (error) {
    appendMessage("ai", `⚠️ Error: ${error.message}`);
    console.error(error);
  }
});

function appendMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = `msg ${role}`;
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
