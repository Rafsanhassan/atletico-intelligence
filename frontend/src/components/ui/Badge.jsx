const styles = {
  Active: "bg-[#3fb950]/20 text-[#3fb950]",
  Draft: "bg-[#ffa657]/20 text-[#ffa657]",
  Archived: "bg-[#8b949e]/20 text-[#8b949e]",
  Onside: "bg-[#00d4b4]/20 text-[#00d4b4]",
  Offside: "bg-[#ff7b72]/20 text-[#ff7b72]",
  Goal: "bg-[#00d4b4]/20 text-[#00d4b4]",
  Review: "bg-[#ffa657]/20 text-[#ffa657]",
  Confirmed: "bg-[#3fb950]/20 text-[#3fb950]",
  Pending: "bg-[#ffa657]/20 text-[#ffa657]",
};

const Badge = ({ tone, children, className = "" }) => {
  const resolved = styles[tone] || "bg-[#30363d] text-white";
  return (
    <span className={`rounded-full px-3 py-1 text-xs ${resolved} ${className}`}>
      {children || tone}
    </span>
  );
};

export default Badge;
