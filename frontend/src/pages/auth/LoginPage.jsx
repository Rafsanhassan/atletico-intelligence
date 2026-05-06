import { useMemo, useState } from "react";
import { ChevronDown, Eye, EyeOff, Info, ShieldCheck, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const roleOptions = [
  {
    value: "match_official",
    label: "Match Official (Video Ref)",
    description: "Access live console, incident reviews, and match assignments.",
  },
  {
    value: "league_admin",
    label: "League Admin",
    description: "Manage leagues, officials, teams, and league-wide settings.",
  },
  {
    value: "team_viewer",
    label: "Team Viewer",
    description: "Review match history, incidents, and team insights.",
  },
];

const LoginPage = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(roleOptions[0].value);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roleDescription = useMemo(
    () => roleOptions.find((option) => option.value === role)?.description,
    [role]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    try {
      await login(formData.get("email"), formData.get("password"));
    } catch (submitError) {
      setError("Unable to sign in. Check your credentials.");
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
              <Video size={22} />
            </div>
            <h1 className="mt-4 text-2xl font-semibold">
              Atlético Intelligence
            </h1>
            <div className="relative mt-2 w-full">
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="w-full appearance-none rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-white"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ▼
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e]"
                size={16}
              />
            </div>
            <p className="mt-3 text-sm text-[#8b949e]">
              Sign in to your match review console
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                defaultValue="official@league.com"
                className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 pr-12 text-sm text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

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
              <div className="mt-3 flex items-start gap-2 text-xs text-[#8b949e]">
                <Info size={14} className="mt-0.5 text-[#00d4b4]" />
                <span>{roleDescription}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-[#8b949e]"></span>
              <a className="text-[#00d4b4] hover:text-white" href="#forgot">
                Forgot password?
              </a>
            </div>

            {error ? (
              <div className="rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-xs text-[#ff7b72]">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#00d4b4] px-4 py-3 text-sm font-semibold text-black disabled:opacity-70"
            >
              {loading ? <LoadingSpinner text="Signing in" /> : "Sign In to Console"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3 text-sm text-[#8b949e]">
            <div className="h-px flex-1 bg-[#30363d]"></div>
            <span>Don&apos;t have an account?</span>
            <div className="h-px flex-1 bg-[#30363d]"></div>
          </div>
          <div className="mt-3 text-center text-sm text-[#8b949e]">
            <Link className="text-[#00d4b4] hover:text-white" to="/register">
              Create team account
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-[#8b949e]">
            <ShieldCheck size={14} className="text-[#00d4b4]" />
            <span>Contact league admin for support</span>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-[#8b949e]">
            <ShieldCheck size={14} className="text-[#00d4b4]" />
            <span>Secure connection. Server-side RBAC enforced.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
