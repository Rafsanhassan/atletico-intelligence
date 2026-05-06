import {
  Bell,
  ChevronDown,
  ClipboardList,
  Download,
  Eye,
  Shield,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";

const OfficialsList = () => {
  return (
    <div className="grid gap-6 xl:grid-cols-[260px_1fr] text-white">
      <aside className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
        <div>
          <p className="text-xs uppercase text-[#8b949e]">League Management</p>
          <ul className="mt-4 space-y-2 text-sm text-[#8b949e]">
            {[
              "Teams",
              "Matches",
              "Match Officials",
              "Competitions",
              "Analytics",
            ].map((item) => (
              <li
                key={item}
                className={`rounded-lg px-3 py-2 ${
                  item === "Match Officials"
                    ? "bg-[#0d1117] text-white"
                    : "hover:text-white"
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <p className="text-xs uppercase text-[#8b949e]">System</p>
          <ul className="mt-4 space-y-2 text-sm text-[#8b949e]">
            {[
              "Settings",
              "Security",
            ].map((item) => (
              <li key={item} className="rounded-lg px-3 py-2 hover:text-white">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Match Officials</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select className="rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-white">
              <option>All Status</option>
              <option>Available</option>
              <option>Unavailable</option>
            </select>
            <select className="rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-white">
              <option>All Leagues</option>
              <option>Premier League</option>
            </select>
            <Link
              to="/admin/officials/new"
              className="rounded-lg bg-[#00d4b4] px-4 py-2 text-sm font-semibold text-black"
            >
              + Add New Official
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#30363d] bg-[#161b22] p-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search officials"
              className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-white"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-[#30363d] px-4 py-2 text-sm">
            <ClipboardList size={14} /> Columns
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-[#30363d] px-4 py-2 text-sm">
            <Download size={14} /> Export
          </button>
        </div>

        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
          <div className="overflow-hidden rounded-xl border border-[#30363d]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0d1117] text-xs uppercase text-[#8b949e]">
                <tr>
                  <th className="px-4 py-3">
                    <input type="checkbox" />
                  </th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Role/Level</th>
                  <th className="px-4 py-3">Certification</th>
                  <th className="px-4 py-3">Background Check</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3">Assigned Leagues</th>
                  <th className="px-4 py-3">Matches</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Michael Johnson",
                    email: "m.johnson@league.com",
                    role: "Level 4 Referee",
                    certification: "Verified",
                    certTone: "text-[#3fb950]",
                    background: "Cleared",
                    backgroundTone: "text-[#3fb950]",
                    availability: "Available",
                    availabilityTone: "text-[#3fb950]",
                    leagues: ["Premier", "Championship"],
                    matches: 23,
                    lastActive: "2h ago",
                  },
                  {
                    name: "Sarah Williams",
                    email: "s.williams@league.com",
                    role: "Level 3 Assistant",
                    certification: "Pending",
                    certTone: "text-[#ffa657]",
                    background: "Cleared",
                    backgroundTone: "text-[#3fb950]",
                    availability: "Unavailable",
                    availabilityTone: "text-[#ff7b72]",
                    leagues: ["League One"],
                    matches: 15,
                    lastActive: "1 day",
                  },
                  {
                    name: "David Brown",
                    email: "d.brown@league.com",
                    role: "Level 5 Referee",
                    certification: "Expired",
                    certTone: "text-[#ff7b72]",
                    background: "Pending",
                    backgroundTone: "text-[#ffa657]",
                    availability: "Available",
                    availabilityTone: "text-[#3fb950]",
                    leagues: ["Championship", "League One"],
                    matches: 31,
                    lastActive: "3 days",
                  },
                ].map((row) => (
                  <tr key={row.email} className="border-t border-[#30363d]">
                    <td className="px-4 py-4">
                      <input type="checkbox" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d1117] text-xs font-semibold">
                          {row.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{row.name}</p>
                          <p className="text-xs text-[#8b949e]">{row.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#8b949e]">{row.role}</td>
                    <td className={`px-4 py-4 ${row.certTone}`}>
                      <span className="rounded-full bg-[#0d1117] px-3 py-1 text-xs">
                        {row.certification}
                      </span>
                    </td>
                    <td className={`px-4 py-4 ${row.backgroundTone}`}>
                      {row.background}
                    </td>
                    <td className={`px-4 py-4 ${row.availabilityTone}`}>
                      {row.availability}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {row.leagues.map((league) => (
                          <span
                            key={league}
                            className="rounded-full bg-[#30363d] px-2 py-1 text-xs text-white"
                          >
                            {league}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#8b949e]">
                      {row.matches}
                    </td>
                    <td className="px-4 py-4 text-[#8b949e]">
                      {row.lastActive}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-[#8b949e]">
                        <button className="rounded-lg border border-[#30363d] p-2">
                          <Eye size={14} />
                        </button>
                        <button className="rounded-lg border border-[#30363d] p-2">
                          <ShieldCheck size={14} />
                        </button>
                        <button className="rounded-lg border border-[#30363d] p-2">
                          <Shield size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-[#8b949e]">
            Showing 1 to 10 of 47 officials
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfficialsList;
