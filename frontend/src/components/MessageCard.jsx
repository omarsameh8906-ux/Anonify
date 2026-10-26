
import { useState } from "react";
import { imgUrl } from "../api/client";
import { messageApi } from "../api/services";

export default function MessageCard({ message, canDelete, onDelete }) {
  const [showSender, setShowSender] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const sender = message.senderId;

  const senderName =
    sender && typeof sender === "object"
      ? [sender.firstName, sender.lastName].filter(Boolean).join(" ")
      : "";

  const viewDetails = async () => {
    if (showDetails) {
      setShowDetails(false);
      return;
    }

    setShowDetails(true);

    if (details) return;

    setLoadingDetails(true);
    setDetailsError("");

    try {
      const result = await messageApi.getById(message._id);
      setDetails(result);
    } catch (e) {
      setDetailsError(e.message || "Failed to load message details");
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="card">
      <div
  className="m"
  onClick={() => setShowSender((prev) => !prev)}
  style={{ cursor: "pointer" }}
  title="View sender"
>
  {message.content || "Attachment"}
  <span style={{ marginLeft: "8px", fontSize: "12px", opacity: 0.6 }}>
    {showSender ? "▲" : "ⓘ"}
  </span>
</div>

      {message.attachments?.length > 0 && (
        <div className="imgs">
          {message.attachments.map((a) => {
            const url = imgUrl(a);
            const fileName = a.split(/[\\/]/).pop();

            return (
              <a key={a} href={url} target="_blank" rel="noreferrer">
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
            background: "#f5f5f5",
            color: "#222",
            position: "relative",
            zIndex: 1,
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
            <p>
              Sender information is unavailable. This may be an anonymous
              message.
            </p>
          )}
        </div>
      )}

      <div className="meta">
        <span>{new Date(message.createdAt).toLocaleString()}</span>

        <button className="btn ghost" onClick={viewDetails}>
          {showDetails ? "Hide Details" : "View Details"}
        </button>

        {canDelete && (
          <button
            className="btn ghost"
            onClick={() => onDelete(message._id)}
          >
            Delete
          </button>
        )}
      </div>

      {showDetails && (
        <div
          className="sender-details"
          style={{
            marginTop: "12px",
            padding: "14px",
            borderRadius: "12px",
            background: "#f5f5f5",
            color: "#222",
            overflowWrap: "anywhere",
          }}
        >
          {loadingDetails && <p>Loading message details...</p>}

          {detailsError && (
            <p style={{ color: "#b91c1c" }}>{detailsError}</p>
          )}

          {details && (
            <>
              <h3>Message Details</h3>

              <p>
                <strong>Message ID:</strong> {details._id}
              </p>

              <p>
                <strong>Content:</strong> {details.content || "No text"}
              </p>

              <p>
                <strong>Created At:</strong>{" "}
                {details.createdAt
                  ? new Date(details.createdAt).toLocaleString()
                  : "Not available"}
              </p>

              <p>
                <strong>Sender ID:</strong>{" "}
                {details.senderId?._id ||
                  details.senderId ||
                  "Anonymous"}
              </p>

              <p>
                <strong>Receiver ID:</strong>{" "}
                {details.receiverId?._id || details.receiverId || "Not available"}
              </p>

              {details.attachments?.length > 0 && (
                <div>
                  <strong>Attachments:</strong>
                  {details.attachments.map((a) => (
                    <div key={a}>
                      <a href={imgUrl(a)} target="_blank" rel="noreferrer">
                        📎 {a.split(/[\\/]/).pop()}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
