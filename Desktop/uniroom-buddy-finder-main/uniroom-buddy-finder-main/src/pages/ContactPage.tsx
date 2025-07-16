import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPaperclip, FaCamera } from "react-icons/fa";

export default function ContactPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};

  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<string[]>([]);
  const [modal, setModal] = React.useState<null | "fotos" | "camera">(null);

  if (!user) {
    React.useEffect(() => {
      navigate("/login", { replace: true });
    }, [navigate]);
    return null;
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage("");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", background: "#f7fafc", borderRadius: 8, padding: 24, boxShadow: "0 2px 8px #0001" }}>
      <h2 style={{ color: "#4f46e5", marginBottom: 16 }}>Conversa com {user.name}</h2>
      <div style={{ background: "#e5e7eb", borderRadius: 8, minHeight: 200, maxHeight: 320, overflowY: "auto", padding: 12, marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.length === 0 && (
          <span style={{ color: "#888" }}>Nenhuma mensagem enviada ainda.</span>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: "flex-end",
              background: "#4f46e5",
              color: "#fff",
              borderRadius: "16px 16px 0 16px",
              padding: "8px 14px",
              maxWidth: "80%",
              wordBreak: "break-word"
            }}
          >
            {msg}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={{
            flex: 1,
            borderRadius: 4,
            border: "1px solid #cbd5e1",
            padding: 8
          }}
        />
        <button
          type="submit"
          style={{
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "8px 16px",
            cursor: "pointer"
          }}
          disabled={!message.trim()}
        >
          Enviar
        </button>
      </form>
      {/* Ícones abaixo do botão enviar */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 12 }}>
        <button
          type="button"
          style={{
            background: "#e5e7eb",
            border: "none",
            borderRadius: "50%",
            padding: 10,
            cursor: "pointer"
          }}
          title="Anexar arquivo"
          onClick={() => setModal("fotos")}
        >
          <FaPaperclip size={20} color="#4f46e5" />
        </button>
        <button
          type="button"
          style={{
            background: "#e5e7eb",
            border: "none",
            borderRadius: "50%",
            padding: 10,
            cursor: "pointer"
          }}
          title="Abrir câmera"
          onClick={() => setModal("camera")}
        >
          <FaCamera size={20} color="#4f46e5" />
        </button>
      </div>
      {/* Modal de permissão */}
      {modal && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
        >
          <div style={{
            background: "#fff",
            borderRadius: 8,
            padding: 24,
            minWidth: 280,
            boxShadow: "0 2px 8px #0003",
            textAlign: "center"
          }}>
            <p style={{ marginBottom: 24, color: "#222" }}>
              {modal === "fotos"
                ? "UniRoom deseja acessar suas fotos, deseja permitir?"
                : "UniRoom deseja acessar sua câmera, deseja permitir?"}
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <button
                style={{
                  background: "#4f46e5",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 24px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
                onClick={() => setModal(null)}
              >
                Sim
              </button>
              <button
                style={{
                  background: "#e5e7eb",
                  color: "#4f46e5",
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 24px",
                  cursor: "pointer"
                }}
                onClick={() => setModal(null)}
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        style={{
          marginTop: 16,
          background: "#e5e7eb",
          color: "#4f46e5",
          border: "none",
          borderRadius: 4,
          padding: "8px 16px",
          cursor: "pointer"
        }}
        onClick={() => navigate(-1)}
      >
        Voltar
      </button>
    </div>
  );
}