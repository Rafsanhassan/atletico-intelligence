import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import OfficialLayout from "./components/layout/OfficialLayout";
import TeamViewerLayout from "./components/layout/TeamViewerLayout";
import { useAuth } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminDashboard from "./pages/admin/Dashboard";
import LeagueForm from "./pages/admin/LeagueForm";
import LeaguesList from "./pages/admin/LeaguesList";
import MatchList from "./pages/admin/MatchList";
import TeamsList from "./pages/admin/TeamsList";
import OfficialsList from "./pages/admin/OfficialsList";
import OfficialDetail from "./pages/admin/OfficialDetail";
import OfficialDashboard from "./pages/official/Dashboard";
import MyAssignments from "./pages/official/MyAssignments";
import LiveConsole from "./pages/official/LiveConsole";
import IncidentsLog from "./pages/official/IncidentsLog";
import IncidentDetail from "./pages/official/IncidentDetail";

const cardClass =
  "rounded-2xl border border-[#30363d] bg-[#161b22] p-8 text-white";

const PlaceholderPage = ({ title, description }) => (
  <div className="space-y-6">
    <div className={cardClass}>
      <p className="text-xs uppercase tracking-[0.3em] text-[#8b949e]">
        Atletico Intelligence
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-white">{title}</h1>
      <p className="mt-3 text-[#8b949e]">{description}</p>
      <div className="mt-6 h-1 w-14 rounded-full bg-[#00d4b4]"></div>
    </div>
  </div>
);


const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] p-10 text-white">
        <div className={cardClass}>Loading session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const NotFound = () => (
  <div className="min-h-screen bg-[#0d1117] p-10 text-white">
    <div className={cardClass}>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-[#8b949e]">
        The route you requested does not exist.
      </p>
      <div className="mt-6">
        <a
          href="/"
          className="rounded-lg bg-[#00d4b4] px-4 py-2 text-sm font-semibold text-black"
        >
          Go Home
        </a>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["league_admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="leagues" element={<LeaguesList />} />
        <Route path="leagues/new" element={<LeagueForm />} />
        <Route path="leagues/:id" element={<LeagueForm />} />
        <Route path="matches" element={<MatchList />} />
        <Route path="teams" element={<TeamsList />} />
        <Route path="officials" element={<OfficialsList />} />
        <Route path="officials/:id" element={<OfficialDetail />} />
      </Route>

      <Route
        path="/official"
        element={
          <ProtectedRoute allowedRoles={["match_official"]}>
            <OfficialLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/official/dashboard" replace />} />
        <Route path="dashboard" element={<OfficialDashboard />} />
        <Route path="assignments" element={<MyAssignments />} />
        <Route path="console" element={<LiveConsole />} />
        <Route path="incidents" element={<IncidentsLog />} />
        <Route path="incidents/:id" element={<IncidentDetail />} />
      </Route>

      <Route
        path="/viewer"
        element={
          <ProtectedRoute allowedRoles={["team_viewer"]}>
            <TeamViewerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/viewer/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <PlaceholderPage
              title="Team Dashboard"
              description="Quick glance at recent results and incident metrics."
            />
          }
        />
        <Route
          path="history"
          element={
            <PlaceholderPage
              title="Match History"
              description="Browse completed fixtures and review breakdowns."
            />
          }
        />
        <Route
          path="clips"
          element={
            <PlaceholderPage
              title="Clips & Incidents"
              description="Watch review clips and export incident reports."
            />
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
