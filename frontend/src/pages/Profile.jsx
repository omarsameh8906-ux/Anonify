
import { useEffect, useState } from "react";
import { userApi } from "../api/services";
import { imgUrl } from "../api/client";
import { useSubmit } from "../hooks/useSubmit";
import Alert from "../components/Alert";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [imgErr, setImgErr] = useState("");
  const [imgSuccess, setImgSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  // Get profile data
  const load = async () => {
    const response = await userApi.me();

    console.log("PROFILE RESPONSE:", response);

    const profile =
      response?.data?.user ??
      response?.user ??
      response?.data ??
      response;

    if (
      !profile ||
      typeof profile !== "object" ||
      Array.isArray(profile)
    ) {
      throw new Error("Invalid profile response");
    }

    setUser(profile);
    return profile;
  };

  // Load profile when page opens
  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setProfileError("");

        const response = await userApi.me();

        const profile =
          response?.data?.user ??
          response?.user ??
          response?.data ??
          response;

        if (
          !profile ||
          typeof profile !== "object" ||
          Array.isArray(profile)
        ) {
          throw new Error("Invalid profile response");
        }

        if (active) {
          setUser(profile);
        }
      } catch (error) {
        if (active) {
          setProfileError(
            error.message || "Failed to load profile"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      active = false;
    };
  }, []);

  // Clean up image preview
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Save profile changes
  const save = useSubmit(async (e, setSuccess) => {
    e.preventDefault();

    const formData = Object.fromEntries(
      new FormData(e.target)
    );

    formData.gender = Number(formData.gender);

    if (!formData.phone) {
      delete formData.phone;
    }

    if (!formData.DOB) {
      delete formData.DOB;
    }

    await userApi.update(formData);
    await load();

    setSuccess("Saved ✔");
    setIsEditing(false);
  });

  // Upload profile image
  const upload = async () => {
    if (!file) {
      setImgErr("Choose an image first");
      return;
    }

    try {
      setUploading(true);
      setImgErr("");
      setImgSuccess("");

      await userApi.uploadImage(file);
      await load();

      setImgSuccess("Profile image updated ✔");
      setFile(null);
      setPreview("");
    } catch (error) {
      setImgErr(
        error.message || "Image upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="empty">
        Loading profile...
      </div>
    );
  }

  // Error state
  if (profileError) {
    return (
      <div className="msg err">
        {profileError}
      </div>
    );
  }

  // No user data
  if (!user) {
    return (
      <div className="empty">
        Profile not found
      </div>
    );
  }

  const currentImage = preview || imgUrl(user.image);

  return (
    <>
      {/* Profile card */}
      <div className="card">
        {currentImage ? (
          <img
            className="avatar"
            src={currentImage}
            alt="Profile"
          />
        ) : (
          <div className="avatar" />
        )}

        <h2>
          {[user.firstName, user.lastName]
            .filter(Boolean)
            .join(" ") ||
            user.username ||
            "My Profile"}
        </h2>

        <p className="sub">{user.email}</p>

        <Alert
          error={imgErr}
          success={imgSuccess}
        />

        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => {
            const selectedFile =
              e.target.files?.[0];

            setFile(selectedFile || null);
            setImgErr("");
            setImgSuccess("");

            setPreview(
              selectedFile
                ? URL.createObjectURL(selectedFile)
                : ""
            );
          }}
        />

        <button
          type="button"
          className="btn"
          onClick={upload}
          disabled={uploading || !file}
        >
          {uploading
            ? "Uploading..."
            : "Upload profile image"}
        </button>
      </div>

      {/* Profile details */}
      {!isEditing ? (
        <div className="card">
          <h2>Profile details</h2>

          <Alert success={save.success} />

          <p>
            <strong>First name:</strong>{" "}
            {user.firstName || "Not provided"}
          </p>

          <p>
            <strong>Last name:</strong>{" "}
            {user.lastName || "Not provided"}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {user.phone || "Not provided"}
          </p>

          <p>
            <strong>Date of birth:</strong>{" "}
            {user.DOB
              ? new Date(
                  user.DOB
                ).toLocaleDateString()
              : "Not provided"}
          </p>

          <p>
            <strong>Gender:</strong>{" "}
            {user.gender == null
              ? "Not provided"
              : Number(user.gender) === 0
              ? "Male"
              : "Female"}
          </p>

          <button
            type="button"
            className="btn"
            onClick={() =>
              setIsEditing(true)
            }
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form
          className="card"
          onSubmit={save.submit}
        >
          <h2>Edit profile</h2>

          <Alert
            error={save.error}
            success={save.success}
          />

          <label>First name</label>
          <input
            name="firstName"
            defaultValue={
              user.firstName || ""
            }
            minLength={2}
            maxLength={25}
            required
          />

          <label>Last name</label>
          <input
            name="lastName"
            defaultValue={
              user.lastName || ""
            }
            minLength={2}
            maxLength={25}
            required
          />

          <label>Phone</label>
          <input
            name="phone"
            type="tel"
            defaultValue={
              user.phone || ""
            }
            placeholder="+201234567890"
          />

          <label>Date of birth</label>
          <input
            name="DOB"
            type="date"
            defaultValue={
              user.DOB
                ? new Date(
                    user.DOB
                  )
                    .toISOString()
                    .slice(0, 10)
                : ""
            }
          />

          <label>Gender</label>
          <select
            name="gender"
            defaultValue={String(
              user.gender ?? 0
            )}
          >
            <option
              value="0"
              style={{
                color: "#000",
                backgroundColor: "#fff"
              }}
            >
              Male
            </option>

            <option
              value="1"
              style={{
                color: "#000",
                backgroundColor: "#fff"
              }}
            >
              Female
            </option>
          </select>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px"
            }}
          >
            <button
              type="submit"
              className="btn"
              disabled={save.loading}
            >
              {save.loading
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              type="button"
              className="btn"
              onClick={() =>
                setIsEditing(false)
              }
              disabled={save.loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
}
