export default function Alert({ error, success }) {
  if (error) return <div className="msg err">{error}</div>;
  if (success) return <div className="msg ok">{success}</div>;
  return null;
}
