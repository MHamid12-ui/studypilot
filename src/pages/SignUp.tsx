import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import TextField from "../components/auth/TextField";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, MIN_PASSWORD_LENGTH } from "../services/auth";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export default function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!fullName.trim()) next.fullName = "Please enter your full name.";
    if (!email.trim()) next.email = "Please enter your email address.";
    else if (!isValidEmail(email)) {
      next.email = "That email address doesn't look right — please double-check it.";
    }
    if (!password) next.password = "Please choose a password.";
    else if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Passwords need at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (!confirmPassword) next.confirmPassword = "Please re-enter your password.";
    else if (confirmPassword !== password) {
      next.confirmPassword = "Those passwords don't match — please try again.";
    }
    return next;
  };

  const clearFieldError = (field: keyof FormErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setSubmitting(true);
    const result = signUp({ fullName, email, password });
    setSubmitting(false);

    if (!result.ok) {
      setErrors({ form: result.error });
      return;
    }

    // Account created, session started, onboarding required.
    navigate("/onboarding", { replace: true });
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start studying smarter with a study copilot built around you."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {errors.form && (
          <div
            role="alert"
            className="rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {errors.form}
          </div>
        )}

        <TextField
          id="fullName"
          label="Full Name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Aisha Khan"
          icon={<User className="h-4.5 w-4.5" aria-hidden="true" />}
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            clearFieldError("fullName");
          }}
          error={errors.fullName}
          autoFocus
        />

        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4.5 w-4.5" aria-hidden="true" />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearFieldError("email");
          }}
          error={errors.email}
        />

        <TextField
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          icon={<Lock className="h-4.5 w-4.5" aria-hidden="true" />}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearFieldError("password");
          }}
          error={errors.password}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors duration-150 hover:text-foreground focus:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/15"
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
              ) : (
                <Eye className="h-4.5 w-4.5" aria-hidden="true" />
              )}
            </button>
          }
        />

        <TextField
          id="confirmPassword"
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          icon={<Lock className="h-4.5 w-4.5" aria-hidden="true" />}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            clearFieldError("confirmPassword");
          }}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full cursor-pointer rounded-xl bg-gradient-to-br from-primary to-accent px-6 py-3.5 font-semibold text-white shadow-soft transition-all duration-150 ease-out hover:brightness-105 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating your account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="cursor-pointer font-semibold text-primary transition-colors duration-150 hover:text-primary-hover hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
