import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import TextField from "../components/auth/TextField";
import { useAuth } from "../context/AuthContext";
import { isValidEmail } from "../services/auth";
import { isOnboardingComplete } from "../services/dataLayer";

interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!email.trim()) next.email = "Please enter your email address.";
    else if (!isValidEmail(email)) {
      next.email = "That email address doesn't look right — please double-check it.";
    }
    if (!password) next.password = "Please enter your password.";
    return next;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setSubmitting(true);
    const result = signIn({ email, password });
    setSubmitting(false);

    if (!result.ok) {
      setErrors({ form: result.error });
      return;
    }

    // Session restored — continue onboarding if needed, otherwise dashboard.
    const destination = isOnboardingComplete(result.userId) ? "/dashboard" : "/onboarding";
    navigate(destination, { replace: true });
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in and pick up right where you left off."
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
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4.5 w-4.5" aria-hidden="true" />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
          }}
          error={errors.email}
          autoFocus
        />

        <TextField
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Your password"
          icon={<Lock className="h-4.5 w-4.5" aria-hidden="true" />}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
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

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full cursor-pointer rounded-xl bg-gradient-to-br from-primary to-accent px-6 py-3.5 font-semibold text-white shadow-soft transition-all duration-150 ease-out hover:brightness-105 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to StudyPilot?{" "}
        <Link
          to="/auth/signup"
          className="cursor-pointer font-semibold text-primary transition-colors duration-150 hover:text-primary-hover hover:underline"
        >
          Create Account
        </Link>
      </p>
    </AuthShell>
  );
}
