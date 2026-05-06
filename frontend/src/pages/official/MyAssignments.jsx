import { Bell, Calendar, ChevronDown, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const MyAssignments = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Assignments</h1>
          <p className="mt-2 text-sm text-[#8b949e]">
            Matches where you are assigned as an official
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#3fb950]/20 px-3 py-1 text-xs font-semibold text-[#3fb950]">
            On Duty
          </span>
          <button className="relative rounded-lg border border-[#30363d] p-2">
            <Bell size={16} />
          </button>
          <div className="flex items-center gap-3 rounded-xl border border-[#30363d] bg-[#161b22] px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d1117] text-sm font-semibold text-white">
              SR
            </div>
            <div>
              <p className="text-sm font-semibold">Sam Rivera</p>
              <p className="text-xs text-[#8b949e]">Video Ref</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#30363d] bg-[#161b22] p-4">
        <div className="flex rounded-full border border-[#30363d] bg-[#0d1117] p-1 text-xs">
          {[
            "All",
            "Upcoming",
            "Live",
            "Completed",
          ].map((tab, index) => (
            <button
              key={tab}
              className={`rounded-full px-3 py-1 ${
                index === 0 ? "bg-[#00d4b4] text-black" : "text-[#8b949e]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative">
          <select className="appearance-none rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 pr-8 text-sm text-white">
            <option>All Competitions</option>
            <option>Metro Amateur League</option>
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8b949e]"
          />
        </div>

        <div className="relative">
          <select className="appearance-none rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 pr-8 text-sm text-white">
            <option>Any Role</option>
            <option>Video Ref</option>
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8b949e]"
          />
        </div>

        <div className="relative">
          <Calendar
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]"
          />
          <input
            type="date"
            className="rounded-lg border border-[#30363d] bg-[#0d1117] py-2 pl-9 pr-3 text-sm text-white"
          />
        </div>

        <div className="relative flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]"
          />
          <input
            type="text"
            placeholder="teams, venues..."
            className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] py-2 pl-9 pr-3 text-sm text-white"
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
        <div className="overflow-hidden rounded-xl border border-[#30363d]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0d1117] text-xs uppercase text-[#8b949e]">
              <tr>
                <th className="px-4 py-3">Kickoff Time</th>
                <th className="px-4 py-3">Match</th>
                <th className="px-4 py-3">Competition</th>
                <th className="px-4 py-3">Venue</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  time: "Today, 18:00 / Apr 6, 2026",
                  match: "Riverside FC vs North End",
                  matchId: "#48291",
                  competition: "Metro Amateur League",
                  venue: "Riverside Stadium",
                  role: "📹 Video Ref",
                  status: "Live",
                  action: "Console",
                  actionType: "console",
                },
                {
                  time: "Tomorrow, 15:30 / Apr 7, 2026",
                  match: "Harbor SC vs Valley United",
                  matchId: "#48295",
                  competition: "Coastal Cup",
                  venue: "Harbor Point Pitch",
                  role: "Video Ref",
                  status: "Scheduled",
                  action: "Pre-open",
                  actionType: "preopen",
                },
                {
                  time: "14:00 / Apr 12, 2026",
                  match: "North End vs Riverside FC",
                  matchId: "#48301",
                  competition: "Metro Amateur",
                  venue: "North End Arena",
                  role: "Video Ref",
                  status: "Scheduled",
                  action: "—",
                  actionType: "none",
                },
                {
                  time: "14:00 / Mar 28, 2026",
                  match: "Valley United vs Harbor SC",
                  matchId: "#48112",
                  competition: "Coastal Cup",
                  venue: "Valley Sports Complex",
                  role: "Video Ref",
                  status: "Completed",
                  action: "Incidents",
                  actionType: "incidents",
                },
              ].map((row) => (
                <tr key={row.matchId} className="border-t border-[#30363d]">
                  <td className="px-4 py-4 text-[#8b949e]">{row.time}</td>
                  <td className="px-4 py-4">
                    <p className="text-white">{row.match}</p>
                    <p className="text-xs text-[#8b949e]">
                      Match ID: {row.matchId}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-[#8b949e]">
                    {row.competition}
                  </td>
                  <td className="px-4 py-4 text-[#8b949e]">{row.venue}</td>
                  <td className={`px-4 py-4 ${row.role === "Video Ref" ? "text-[#8b949e]" : "text-white"}`}>
                    {row.role}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        row.status === "Live"
                          ? "bg-[#3fb950]/20 text-[#3fb950]"
                          : row.status === "Completed"
                          ? "bg-[#30363d] text-[#8b949e]"
                          : "bg-[#30363d] text-[#8b949e]"
                      }`}
                    >
                      {row.status === "Live" ? "● Live" : row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {row.actionType === "console" ? (
                      <button
                        onClick={() => navigate("/official/console")}
                        className="rounded-lg bg-[#00d4b4] px-3 py-1 text-xs font-semibold text-black"
                      >
                        Console
                      </button>
                    ) : row.actionType === "preopen" ? (
                      <button className="rounded-lg border border-[#30363d] px-3 py-1 text-xs text-white">
                        Pre-open
                      </button>
                    ) : row.actionType === "incidents" ? (
                      <Link to="/official/incidents" className="text-[#00d4b4]">
                        Incidents
                      </Link>
                    ) : (
                      <span className="text-[#8b949e]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-[#8b949e]">
          <span>Showing 1 to 4 of 24 assignments</span>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`rounded-lg border border-[#30363d] px-3 py-1 ${
                  page === 1 ? "text-white" : "text-[#8b949e]"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="rounded-lg border border-[#30363d] px-3 py-1 text-[#8b949e]">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAssignments;
