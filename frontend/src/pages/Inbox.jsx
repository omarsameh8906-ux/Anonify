
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { messageApi, userApi } from "../api/services";
import MessageCard from "../components/MessageCard";

const TABS = [["0", "Received"], ["1", "Sent"], ["2", "All"]];

export default function Inbox() {
  const [type, setType] = useState("0");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [receiverId, setReceiverId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
  const getMyLink = async () => {
    try {
      const response = await userApi.me();

      console.log("USER RESPONSE:", response);

      const user = response?.data?.user ?? response?.user ?? response?.data ?? response;

      const userId = user?._id || user?.id;

      if (!userId) {
        throw new Error("User ID not found in profile response");
      }

      const personalLink =
        `${window.location.origin}${window.location.pathname}#/u/${userId}`;

      setLink(personalLink);
    } catch (err) {
      console.error("Failed to generate personal link:", err);
      setError(err.message);
    }
  };

  getMyLink();
}, []);

  const load = useCallback(async () => {
    setData(null);
    setError("");

    try {
      setData(await messageApi.list({ type, page }));
    } catch (e) {
      setError(e.message);
    }
  }, [type, page]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id) => {
    if (!confirm("Delete this message?")) return;
    await messageApi.remove(id);
    load();
  };

  const copy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openSendMessage = (e) => {
    e.preventDefault();

    const id = receiverId.trim();
    if (!id) return;

    navigate(`/u/${encodeURIComponent(id)}`);
  };

  return (
    <>
      <div className="card">
        <h2>Your link 🔗</h2>
        <p className="sub">
          Share it anywhere — people can message you without revealing who they are.
        </p>

        <div className="share">
          <input readOnly value={link} />
          <button className="btn ghost" onClick={copy}>
            {copied ? "Copied ✔" : "Copy"}
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Send a message to an account</h2>
        <p className="sub">
          Enter the recipient's User ID to open the message page.
        </p>

        <form onSubmit={openSendMessage}>
          <label>Recipient User ID</label>
          <input
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            placeholder="Paste the other account's ID"
            required
          />
          <button className="btn" type="submit">
            Continue
          </button>
        </form>
      </div>

      <div className="tabs">
        {TABS.map(([v, label]) => (
          <button
            key={v}
            className={type === v ? "on" : ""}
            onClick={() => {
              setType(v);
              setPage(1);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <div className="msg err">{error}</div>}
      {!data && !error && <div className="empty">Loading…</div>}
      {data && !data.docs.length && (
        <div className="empty">No messages here yet 🕊️</div>
      )}

      {data?.docs.map((m) => (
        <MessageCard
          key={m._id}
          message={m}
          canDelete={type === "0"}
          onDelete={remove}
        />
      ))}

      {data?.docs.length > 0 && (
        <div className="pager">
          <button
            className="btn ghost"
            disabled={data.currentPage <= 1}
            onClick={() => setPage(page - 1)}
          >
            ←
          </button>
          <span>
            Page {data.currentPage} / {data.pages}
          </span>
          <button
            className="btn ghost"
            disabled={data.currentPage >= data.pages}
            onClick={() => setPage(page + 1)}
          >
            →
          </button>
        </div>
      )}
    </>
  );
}
