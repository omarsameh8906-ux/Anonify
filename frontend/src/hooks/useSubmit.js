import { useState } from "react";

// wraps an async submit handler with loading / error / success state
export function useSubmit(fn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (...args) => {
    setLoading(true); setError(""); setSuccess("");
    try { return await fn(...args, setSuccess); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  return { submit, loading, error, success, setError, setSuccess };
}
