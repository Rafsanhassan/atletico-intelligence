const StatCard = ({ icon, value, label, badge, accent = "#00d4b4" }) => {
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-[#8b949e]">{label}</p>
          <div className="mt-3 text-3xl font-semibold">{value}</div>
          {badge ? (
            <p className="mt-3 text-xs text-[#8b949e]">{badge}</p>
          ) : null}
        </div>
        {icon ? (
          <div
            className="rounded-xl bg-[#0d1117] p-3"
            style={{ color: accent }}
          >
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StatCard;
