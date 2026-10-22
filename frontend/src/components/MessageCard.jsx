
import { useState } from "react";
import { imgUrl } from "../api/client";

export default function MessageCard({ message, canDelete, onDelete }) {
  const [showSender, setShowSender] = useState(false);
  const sender = message.senderId;

  const senderName =
    sender && typeof sender === "object"
      ? [sender.firstName, sender.lastName].filter(Boolean).join(" ")
      : "";

  return (
    <div className="card">
      <div
        className="m"
        onClick={() => setShowSender((prev) => !prev)}
        style={{ cursor: "pointer" }}
        title="Click to view sender details"
      >
        {message.content || "Attachment"}
      </div>

      {message.attachments?.length > 0 && (
        <div className="imgs">
          {message.attachments.map((a) => {
            const url = imgUrl(a);
            const fileName = a.split(/[\\/]/).pop();

            return (
              <a
                key={a}
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                📎 {fileName || "Open attachment"}
              </a>
            );
          })}
        </div>
      )}

      {showSender && (
        <div
          className="sender-details"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginTop: "16px",
            padding: "12px",
            borderRadius: "12px",
            background: "var(--card-bg, #f5f5f5)",
          }}
        >
          {sender && typeof sender === "object" ? (
            <>
              {sender.image ? (
                <img
                  src={imgUrl(sender.image)}
                  alt={senderName || "Sender"}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: "#ddd",
                    fontSize: "24px",
                  }}
                >
                  👤
                </div>
              )}

              <div>
                <strong>{senderName || "Name not available"}</strong>
                <p style={{ margin: "4px 0 0" }}>
                  {sender.email || "Email not available"}
                </p>
              </div>
            </>
          ) : (
            <p>Sender information is unavailable. This may be an anonymous message.</p>
          )}
        </div>
      )}

      <div className="meta">
        <span>{new Date(message.createdAt).toLocaleString()}</span>

        {canDelete && (
          <button
            className="btn ghost"
            onClick={() => onDelete(message._id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
