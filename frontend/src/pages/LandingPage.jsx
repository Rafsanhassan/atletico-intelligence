import { Cloud, Video, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <header className="border-b border-[#30363d]">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="text-lg font-semibold">Atlético Intelligence™</div>
          <div className="hidden items-center gap-8 text-sm text-[#8b949e] md:flex">
            <a className="transition hover:text-white" href="#features">
              Features
            </a>
            <a className="transition hover:text-white" href="#pricing">
              Pricing
            </a>
            <a className="transition hover:text-white" href="#about">
              About
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link className="text-[#8b949e] hover:text-white" to="/login">
              Sign In
            </Link>
            <Link
              className="rounded-full bg-[#00d4b4] px-4 py-2 font-semibold text-black"
              to="/login"
            >
              Open console
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#8b949e]">
            Single-Camera VAR Alternative
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Instant AI review for offside and{" "}
            <span className="text-[#00d4b4]">goal-line</span> decisions.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-[#8b949e]">
            Atlético Intelligence analyzes a single broadcast camera feed in real
            time, giving referees and clubs a trusted second opinion without
            expensive VAR infrastructure.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              className="rounded-full bg-[#00d4b4] px-6 py-3 text-sm font-semibold text-black"
              to="/login"
            >
              Get Started
            </Link>
            <button
              className="rounded-full border border-[#30363d] px-6 py-3 text-sm text-white"
              type="button"
            >
              ▶ Watch Demo
            </button>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto max-w-6xl px-6 pb-16 pt-4"
        >
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#0d1117] text-[#00d4b4]">
                <Video size={20} />
              </div>
              <h3 className="text-lg font-semibold">Single Camera Feed</h3>
              <p className="mt-2 text-sm text-[#8b949e]">
                AI inference on a single broadcast angle lowers deployment cost.
              </p>
            </div>
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#0d1117] text-[#00d4b4]">
                <Zap size={20} />
              </div>
              <h3 className="text-lg font-semibold">Real-time Processing</h3>
              <p className="mt-2 text-sm text-[#8b949e]">
                Detects incidents in seconds with confidence scoring.
              </p>
            </div>
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#0d1117] text-[#00d4b4]">
                <Cloud size={20} />
              </div>
              <h3 className="text-lg font-semibold">Cloud Incident Archive</h3>
              <p className="mt-2 text-sm text-[#8b949e]">
                Store incidents, clips, and referee notes for every fixture.
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8b949e]">
              MVP Focus
            </p>
            <h2 className="mt-4 text-2xl font-semibold">
              The two calls that change matches.
            </h2>
            <p className="mt-3 text-sm text-[#8b949e]">
              We concentrate on offside and goal-line decisions to deliver
              reliable AI verdicts during live play.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-5">
                <span className="rounded-full bg-[#00d4b4]/20 px-3 py-1 text-xs font-semibold text-[#00d4b4]">
                  OS
                </span>
                <h3 className="mt-3 text-lg font-semibold">
                  Offside Analysis
                </h3>
                <p className="mt-2 text-sm text-[#8b949e]">
                  Automated frame syncing pinpoints offside positions.
                </p>
              </div>
              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-5">
                <span className="rounded-full bg-[#00d4b4]/20 px-3 py-1 text-xs font-semibold text-[#00d4b4]">
                  GL
                </span>
                <h3 className="mt-3 text-lg font-semibold">
                  Goal-Line Technology
                </h3>
                <p className="mt-2 text-sm text-[#8b949e]">
                  Immediate verdicts when the ball crosses the line.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-8">
            <h2 className="text-2xl font-semibold">
              Built for referees and teams
            </h2>
            <p className="mt-3 text-sm text-[#8b949e]">
              Launch your incident review workflow in days, not months.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                className="rounded-full bg-[#00d4b4] px-6 py-3 text-sm font-semibold text-black"
                to="/login"
              >
                Get started
              </Link>
              <button
                className="rounded-full border border-[#30363d] px-6 py-3 text-sm text-white"
                type="button"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#30363d]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-6 text-sm text-[#8b949e] md:flex-row md:items-center">
          <div className="flex gap-6">
            <a className="hover:text-white" href="#privacy">
              Privacy
            </a>
            <a className="hover:text-white" href="#terms">
              Terms
            </a>
            <a className="hover:text-white" href="#support">
              Support
            </a>
          </div>
          <p>© 2026 Atlético Intelligence. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
