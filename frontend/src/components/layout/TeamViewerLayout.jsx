import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { to: "/viewer/dashboard", label: "Dashboard" },
  { to: "/viewer/history", label: "Match History" },
  { to: "/viewer/clips", label: "Clips & Incidents" },
];

const linkBase =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition";

const TeamViewerLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="flex">
        <aside className="min-h-screen w-64 border-r border-[#30363d] bg-[#0d1117] px-6 py-8">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8b949e]">
              Atletico Intelligence
            </p>
            <h1 className="mt-2 text-xl font-semibold text-white">Team Viewer</h1>
            <span className="mt-2 block h-1 w-10 rounded-full bg-[#00d4b4]"></span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? "bg-[#161b22] text-[#00d4b4]"
                      : "text-[#8b949e] hover:bg-[#161b22] hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="mt-10 w-full rounded-lg border border-[#30363d] px-4 py-2 text-sm text-[#8b949e] transition hover:border-[#00d4b4] hover:text-white"
          >
            Sign Out
          </button>
        </aside>

        <main className="min-h-screen flex-1 bg-[#161b22] p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeamViewerLayout;
