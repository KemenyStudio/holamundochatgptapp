// src/component.tsx
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { jsx, jsxs } from "react/jsx-runtime";
function CounterNotesApp() {
  const [noteText, setNoteText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toolOutput = window.openai?.toolOutput || { counter: 0, notes: [], visitors: 0 };
  const theme = window.openai?.theme || "light";
  const isDark = theme === "dark";
  const handleIncrement = async () => {
    setIsLoading(true);
    try {
      await window.openai?.callTool?.("personal_data", { command: "increment counter" });
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddNote = async () => {
    if (!noteText.trim())
      return;
    setIsLoading(true);
    try {
      await window.openai?.callTool?.("personal_data", { command: `save note ${noteText}` });
      setNoteText("");
    } finally {
      setIsLoading(false);
    }
  };
  const handleReset = async () => {
    if (!confirm("Reset all data?"))
      return;
    setIsLoading(true);
    try {
      await window.openai?.callTool?.("personal_data", { command: "reset" });
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    background: isDark ? "#1a1a1a" : "#ffffff",
    color: isDark ? "#ffffff" : "#000000",
    borderRadius: "12px"
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: { marginBottom: "24px" }, children: [
      /* @__PURE__ */ jsx("h1", { style: { margin: "0 0 8px 0", fontSize: "24px" }, children: "\u{1F3AF} Personal Counter & Notes" }),
      /* @__PURE__ */ jsx("p", { style: { margin: 0, color: isDark ? "#aaa" : "#666", fontSize: "14px" }, children: "Interactive app with live data" })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      background: isDark ? "#2a2a2a" : "#f5f5f5",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "20px"
    }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { style: { fontSize: "14px", color: isDark ? "#aaa" : "#666", marginBottom: "4px" }, children: "Global Counter" }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: "48px", fontWeight: "bold", color: isDark ? "#4ade80" : "#22c55e" }, children: toolOutput.counter })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleIncrement,
          disabled: isLoading,
          style: {
            background: isDark ? "#4ade80" : "#22c55e",
            color: "#000",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: isLoading ? "wait" : "pointer",
            opacity: isLoading ? 0.6 : 1,
            transition: "transform 0.1s"
          },
          onMouseDown: (e) => e.currentTarget.style.transform = "scale(0.95)",
          onMouseUp: (e) => e.currentTarget.style.transform = "scale(1)",
          onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)",
          children: "\u2795 Increment"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: isDark ? "#2a2a2a" : "#f5f5f5",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "20px"
    }, children: [
      /* @__PURE__ */ jsx("div", { style: { fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }, children: "\u{1F4DD} Add New Note" }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px" }, children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: noteText,
            onChange: (e) => setNoteText(e.target.value),
            onKeyPress: (e) => e.key === "Enter" && handleAddNote(),
            placeholder: "Type your note here...",
            disabled: isLoading,
            style: {
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: isDark ? "1px solid #444" : "1px solid #ddd",
              background: isDark ? "#1a1a1a" : "#fff",
              color: isDark ? "#fff" : "#000",
              fontSize: "14px"
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleAddNote,
            disabled: isLoading || !noteText.trim(),
            style: {
              background: isDark ? "#3b82f6" : "#2563eb",
              color: "#fff",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: isLoading || !noteText.trim() ? "not-allowed" : "pointer",
              opacity: isLoading || !noteText.trim() ? 0.5 : 1
            },
            children: "Add"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      background: isDark ? "#2a2a2a" : "#f5f5f5",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "20px"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: { fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }, children: [
        "\u{1F4DA} Saved Notes (",
        toolOutput.notes.length,
        ")"
      ] }),
      toolOutput.notes.length === 0 ? /* @__PURE__ */ jsx("div", { style: { color: isDark ? "#666" : "#999", fontSize: "14px", textAlign: "center", padding: "20px" }, children: "No notes yet. Add one above!" }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: toolOutput.notes.map((note) => /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            background: isDark ? "#1a1a1a" : "#fff",
            padding: "12px",
            borderRadius: "6px",
            border: isDark ? "1px solid #444" : "1px solid #e5e5e5"
          },
          children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "14px", marginBottom: "4px" }, children: note.text }),
            /* @__PURE__ */ jsx("div", { style: { fontSize: "12px", color: isDark ? "#666" : "#999" }, children: note.timestamp })
          ]
        },
        note.id
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px", alignItems: "center", justifyContent: "space-between" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { fontSize: "14px", color: isDark ? "#aaa" : "#666" }, children: [
        "\u{1F465} Total requests: ",
        toolOutput.visitors
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleReset,
          disabled: isLoading,
          style: {
            background: isDark ? "#ef4444" : "#dc2626",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: isLoading ? "wait" : "pointer",
            opacity: isLoading ? 0.6 : 1
          },
          children: "\u{1F504} Reset All"
        }
      )
    ] })
  ] });
}
var root = document.getElementById("root");
if (root) {
  createRoot(root).render(/* @__PURE__ */ jsx(CounterNotesApp, {}));
}
