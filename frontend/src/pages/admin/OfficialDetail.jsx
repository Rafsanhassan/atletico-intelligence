import { CheckSquare, FileText, ShieldCheck, User } from "lucide-react";

const OfficialDetail = () => {
  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">Michael Johnson</h1>
          <span className="rounded-full bg-[#3fb950]/20 px-3 py-1 text-xs text-[#3fb950]">
            Verified
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-lg border border-[#ff7b72] px-4 py-2 text-sm text-[#ff7b72]">
            Deactivate
          </button>
          <button className="rounded-lg border border-[#30363d] px-4 py-2 text-sm">
            Reset Password
          </button>
          <button className="rounded-lg border border-[#30363d] px-4 py-2 text-sm text-[#8b949e]">
            Cancel
          </button>
          <button className="rounded-lg bg-[#00d4b4] px-4 py-2 text-sm font-semibold text-black">
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
            <div className="flex items-center gap-3">
              <User size={18} className="text-[#00d4b4]" />
              <h2 className="text-lg font-semibold">Profile & Contact</h2>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                "First Name",
                "Last Name",
                "Preferred Name",
                "Email",
                "Phone",
                "Emergency Contact",
                "Address",
              ].map((field) => (
                <div key={field} className="md:col-span-1">
                  <label className="text-xs uppercase text-[#8b949e]">
                    {field}
                  </label>
                  <input
                    type="text"
                    className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-[#00d4b4]" />
              <h2 className="text-lg font-semibold">Official Details</h2>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase text-[#8b949e]">
                  Role/Level
                </label>
                <select className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white">
                  <option>FIFA Referee</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase text-[#8b949e]">
                  Years Experience
                </label>
                <input
                  type="number"
                  defaultValue="8"
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs uppercase text-[#8b949e]">
                  Regions
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    "North West",
                    "Yorkshire",
                    "North East",
                    "Midlands",
                  ].map((region) => (
                    <span
                      key={region}
                      className="rounded-full bg-[#30363d] px-3 py-1 text-xs text-white"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs uppercase text-[#8b949e]">
                  Languages
                </label>
                <input
                  type="text"
                  defaultValue="English"
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs uppercase text-[#8b949e]">
                  Notes
                </label>
                <textarea
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs uppercase text-[#8b949e]">
                  Add League Assignment
                </label>
                <select className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white">
                  <option>Premier League</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-[#00d4b4]" />
              <h2 className="text-lg font-semibold">Certifications</h2>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase text-[#8b949e]">Type</label>
                <input
                  type="text"
                  defaultValue="FIFA Referee"
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-[#8b949e]">
                  Issuing Body
                </label>
                <input
                  type="text"
                  defaultValue="The Football Association"
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-[#8b949e]">
                  Certificate ID
                </label>
                <input
                  type="text"
                  defaultValue="FA-REF-2023-001234"
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-[#8b949e]">
                  Issue Date
                </label>
                <input
                  type="date"
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-[#8b949e]">
                  Expiry Date
                </label>
                <input
                  type="date"
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-[#8b949e]">
                <input type="checkbox" defaultChecked /> Verified
              </label>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-[#8b949e]">
                  <span>Certification PDF</span>
                  <button className="text-[#00d4b4]">Attach</button>
                </div>
              </div>
            </div>
            <button className="mt-4 rounded-lg border border-[#30363d] px-4 py-2 text-sm">
              + Add Certification
            </button>
          </section>

          <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
            <div className="flex items-center gap-3">
              <CheckSquare size={18} className="text-[#00d4b4]" />
              <h2 className="text-lg font-semibold">Compliance</h2>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase text-[#8b949e]">
                  Background Check Status
                </label>
                <select className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white">
                  <option>Cleared</option>
                  <option>Pending</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase text-[#8b949e]">Date</label>
                <input
                  type="date"
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-[#8b949e]">
                  Safeguarding Training
                </label>
                <select className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white">
                  <option>Completed</option>
                  <option>Pending</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase text-[#8b949e]">
                  Training Completion Date
                </label>
                <input
                  type="date"
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
            <h2 className="text-lg font-semibold">League Assignments</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Premier League",
                "Championship",
              ].map((league) => (
                <span
                  key={league}
                  className="rounded-full bg-[#30363d] px-3 py-1 text-xs text-white"
                >
                  {league} x
                </span>
              ))}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase text-[#8b949e]">
                  Assignment Start
                </label>
                <input
                  type="date"
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-[#8b949e]">
                  Assignment End
                </label>
                <input
                  type="date"
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
            <h2 className="text-lg font-semibold">Availability</h2>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-[#8b949e]">
              {[
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
              ].map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2"
                >
                  <input type="checkbox" defaultChecked={day !== "Wed"} />
                  {day}
                </label>
              ))}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase text-[#8b949e]">
                  Blackout Start
                </label>
                <input
                  type="date"
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-[#8b949e]">
                  Blackout End
                </label>
                <input
                  type="date"
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
            <h2 className="text-lg font-semibold">Audit & History</h2>
            <div className="mt-4 space-y-3 text-sm text-[#8b949e]">
              <div>
                <p className="text-xs uppercase text-[#8b949e]">Created By</p>
                <p className="text-white">Sarah Mitchell, Aug 15 2023</p>
              </div>
              <div>
                <p className="text-xs uppercase text-[#8b949e]">Last Updated By</p>
                <p className="text-white">Admin User, Jan 10 2024</p>
              </div>
            </div>
            <div className="mt-6 space-y-4 text-xs text-[#8b949e]">
              {[
                "Certification updated",
                "League assignment added",
                "Contact info updated",
                "Background check completed",
                "Profile created",
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      index === 0
                        ? "bg-[#00d4b4]"
                        : index === 1
                        ? "bg-[#58a6ff]"
                        : index === 2
                        ? "bg-[#ffa657]"
                        : index === 3
                        ? "bg-[#3fb950]"
                        : "bg-[#8b949e]"
                    }`}
                  ></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OfficialDetail;
