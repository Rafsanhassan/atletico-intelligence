import { useState } from "react";
import { ChevronDown, ShieldCheck, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const roleOptions = [
  { value: "match_official", label: "Match Official" },
  { value: "league_admin", label: "League Admin" },
  { value: "team_viewer", label: "Team Viewer" },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(roleOptions[0].value);
  const [showError, setShowError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setShowError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", {
        full_name: formData.get("fullName"),
        email: formData.get("email"),
        password,
        role,
        is_active: true,
      });

      navigate("/login");
    } catch (submitError) {
      setShowError("Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="px-6 py-6">
        <Link className="text-sm text-[#8b949e] hover:text-white" to="/">
          ← Back to Website
        </Link>
      </div>

      <div className="flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-lg rounded-xl border border-[#30363d] bg-[#161b22] p-8">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0d1117] text-[#00d4b4]">
              <UserPlus size={22} />
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#8b949e]">
              Choose a role...
            </p>
            <h1 className="mt-2 text-2xl font-semibold">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-[#8b949e]">
              Join Atlético Intelligence platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">
                Role
              </label>
              <div className="relative mt-2">
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="w-full appearance-none rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e]"
                  size={16}
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                required
                className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
              />
              <div className="mt-2 text-xs text-[#8b949e]">
                Min 8 characters, include a number + special character.
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
              />
            </div>

            <label className="flex items-start gap-3 text-xs text-[#8b949e]">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-[#30363d] bg-[#0d1117]"
              />
              <span>
                I agree to the{" "}
                <Link className="text-[#00d4b4] hover:text-white" to="/">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link className="text-[#00d4b4] hover:text-white" to="/">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {showError ? (
              <div className="rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-xs text-[#ff7b72]">
                {showError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#00d4b4] px-4 py-3 text-sm font-semibold text-black disabled:opacity-70"
            >
              {loading ? <LoadingSpinner text="Creating" /> : "Create account"}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-[#30363d] bg-[#0d1117] p-4 text-xs text-[#8b949e]">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#00d4b4]" />
              <span>
                Role-based permissions are enforced after verification or invite
                approval.
              </span>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-[#8b949e]">
            Already have an account?{" "}
            <Link className="text-[#00d4b4] hover:text-white" to="/login">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
