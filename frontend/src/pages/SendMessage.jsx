import { Link, useParams } from "react-router-dom";
import { messageApi } from "../api/services";
import { tokens } from "../api/client";
import { useSubmit } from "../hooks/useSubmit";
import Alert from "../components/Alert";

export default function SendMessage() {
  const { userId } = useParams();
  const { submit, loading, error, success } = useSubmit(async (e, setSuccess) => {
    e.preventDefault();
    const f = e.target;
    const files = [...f.attachments.files];
    if (files.length > 3) throw new Error("Max 3 images");
    await messageApi.send({ receiverId: userId, content: f.content.value, files }, !!tokens.access);
    f.reset(); setSuccess("Sent! 🎉");
  });
  return (
    <>
      <form className="card" onSubmit={submit}>
        <h2>Send an anonymous message 🤫</h2>
        <p className="sub">{tokens.access ? "You're logged in — your account is attached to this message on the server." : "Nobody will know it's you."}</p>
        <Alert error={error} success={success} />
        <label>Message</label>
        <textarea name="content" required minLength={2} maxLength={50000} placeholder="Say something nice…" />
        <label>Images (up to 3, jpg/png)</label>
        <input type="file" name="attachments" accept="image/png,image/jpeg" multiple />
        <button className="btn" disabled={loading}>{loading ? "..." : "Send"}</button>
      </form>
      <p className="sub" style={{ textAlign: "center" }}>Want your own link? <Link to="/signup">Create one</Link></p>
    </>
  );
}
