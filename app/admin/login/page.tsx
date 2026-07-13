"use client";

import { useFormState } from "react-dom";
import { login } from "../actions";

export default function LoginPage() {
  const [state, formAction] = useFormState(login, {});

  return (
    <div className="admin-login-card">
      <div style={{ fontFamily: "var(--font-display)", fontSize: "26px", color: "var(--text)", marginBottom: "4px" }}>
        Yongolailan
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "28px" }}>
        Admin Access
      </div>

      <form action={formAction}>
        <div className="admin-field">
          <label className="admin-label" htmlFor="password">
            Password
          </label>
          <input className="admin-input" id="password" type="password" name="password" autoFocus required autoComplete="current-password" />
        </div>
        <button type="submit" className="admin-btn admin-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          Sign in
        </button>
        {state?.error && <div className="admin-error">{state.error}</div>}
      </form>
    </div>
  );
}
