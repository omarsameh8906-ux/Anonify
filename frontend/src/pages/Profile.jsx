import { useEffect, useState } from "react";
import { userApi } from "../api/services";
import { imgUrl } from "../api/client";
import { useSubmit } from "../hooks/useSubmit";
import Alert from "../components/Alert";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [imgErr, setImgErr] = useState("");
  const load = () => userApi.me().then(setUser);
  useEffect(() => { load(); }, []);

  const save = useSubmit(async (e, setSuccess) => {
    e.preventDefault();
    await userApi.update(Object.fromEntries(new FormData(e.target)));
    setSuccess("Saved ✔"); load();
  });
  const upload = async () => {
    if (!file) return setImgErr("Choose an image first");
    try { setImgErr(""); await userApi.uploadImage(file); load(); } catch (e) { setImgErr(e.message); }
  };

  if (!user) return <div className="empty">Loading…</div>;
  return (
    <>
      <div className="card">
        {imgUrl(user.image) ? <img className="avatar" src={imgUrl(user.image)} alt="" /> : <div className="avatar" />}
        <h2>{user.username}</h2>
        <p className="sub">{user.email}</p>
        <Alert error={imgErr} />
        <input type="file" accept="image/png,image/jpeg" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn" onClick={upload}>Upload profile image</button>
      </div>
      <form className="card" onSubmit={save.submit}>
        <h2>Edit profile</h2>
        <Alert error={save.error} success={save.success} />
        <label>First name</label><input name="firstName" defaultValue={user.firstName} minLength={2} maxLength={25} />
        <label>Last name</label><input name="lastName" defaultValue={user.lastName} minLength={2} maxLength={25} />
        <button className="btn" disabled={save.loading}>Save</button>
      </form>
    </>
  );
}
