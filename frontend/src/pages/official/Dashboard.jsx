import { useNavigate } from 'react-router-dom'
import { Trophy, Clock, Video, Monitor, List, Headphones, ChevronRight, Bell, Mic, Cloud } from 'lucide-react'

export default function OfficialDashboard() {
  const navigate = useNavigate()
  
  return (
    <div className="p-6" style={{backgroundColor: '#0d1117', minHeight: '100vh'}}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, Sam Rivera</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 bg-green-900 text-green-400 
                           border border-green-700 rounded-full px-3 py-1 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            On Duty
          </span>
          <div className="relative">
            <Bell size={20} className="text-gray-400" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white 
                             text-xs w-4 h-4 rounded-full flex items-center justify-center">2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center 
                            justify-center text-white text-xs font-bold">SR</div>
            <div>
              <p className="text-white text-sm font-medium">Sam Rivera</p>
              <p className="text-gray-400 text-xs">Video Ref</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="flex gap-6">
        
        {/* LEFT column */}
        <div className="flex-1">
          
          {/* Live Match Card */}
          <div className="rounded-xl p-6 mb-6" 
               style={{backgroundColor: '#161b22', border: '1px solid #30363d'}}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-sm font-medium">Live Now</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Riverside FC vs North End
            </h2>
            <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
              <span className="flex items-center gap-1">
                <Trophy size={14} className="text-teal-400" />
                Metro Amateur League
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                Kickoff 18:00
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-lg p-3 flex items-center gap-2" 
                   style={{backgroundColor: '#0d1117'}}>
                <Video size={16} className="text-teal-400" />
                <div>
                  <p className="text-gray-400 text-xs">Feed Status</p>
                  <p className="text-white text-sm font-medium">● Receiving 1080p</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/official/console')}
                className="font-bold px-8 py-3 rounded-lg text-black"
                style={{backgroundColor: '#00d4b4'}}>
                Open Console →
              </button>
            </div>
          </div>

          {/* Today's Overview */}
          <div className="rounded-xl p-6" 
               style={{backgroundColor: '#161b22', border: '1px solid #30363d'}}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Today's Overview</h3>
              <span className="text-sm cursor-pointer" style={{color: '#00d4b4'}}>
                View Schedule
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { num: '3', label: 'Assigned', color: 'white' },
                { num: '1', label: 'Completed', color: 'white' },
                { num: '2', label: 'Pending Rev.', color: '#f97316', badge: true },
              ].map((s, i) => (
                <div key={i} className="rounded-lg p-4 text-center relative" 
                     style={{backgroundColor: '#0d1117'}}>
                  {s.badge && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white 
                                     text-xs w-4 h-4 rounded-full flex items-center justify-center">!</span>
                  )}
                  <p className="text-3xl font-bold" style={{color: s.color}}>{s.num}</p>
                  <p className="text-gray-400 text-sm">{s.label}</p>
                </div>
              ))}
            </div>

            <p className="text-gray-400 text-xs uppercase mb-2">Upcoming</p>
            {[
              { time: '15:30', day: 'Sat', match: 'Harbor SC vs Valley United', comp: 'Coastal Cup' },
              { time: '14:00', day: 'Sun', match: 'North End vs Riverside FC', comp: 'Metro Amateur' },
            ].map((m, i) => (
              <div key={i} className="rounded-lg p-3 flex justify-between items-center mb-2"
                   style={{backgroundColor: '#0d1117'}}>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-white font-bold text-sm">{m.time}</p>
                    <p className="text-gray-500 text-xs">{m.day}</p>
                  </div>
                  <div>
                    <p className="text-white text-sm">{m.match}</p>
                    <p className="text-gray-400 text-xs">{m.comp}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-xs border border-gray-600 
                                 rounded px-2 py-1">Scheduled</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT column */}
        <div style={{width: '300px'}}>
          
          {/* Quick Actions */}
          <div className="rounded-xl p-6 mb-6" 
               style={{backgroundColor: '#161b22', border: '1px solid #30363d'}}>
            <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
            {[
              { icon: <Monitor size={18} />, label: 'Live Match Console', path: '/official/console' },
              { icon: <List size={18} />, label: 'View Incidents Log', path: '/official/incidents' },
              { icon: <Headphones size={18} />, label: 'Contact Ref Team', path: null },
            ].map((action, i) => (
              <button key={i} onClick={() => action.path && navigate(action.path)}
                className="w-full rounded-lg p-4 flex items-center justify-between mb-2
                           hover:border-teal-500 transition-colors text-left"
                style={{backgroundColor: '#0d1117', border: '1px solid #30363d'}}>
                <span className="flex items-center gap-3 text-gray-300">
                  <span className="text-teal-400">{action.icon}</span>
                  {action.label}
                </span>
                <ChevronRight size={16} className="text-gray-500" />
              </button>
            ))}
          </div>

          {/* System Health */}
          <div className="rounded-xl p-6" 
               style={{backgroundColor: '#161b22', border: '1px solid #30363d'}}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">System Health</h3>
              <span className="text-green-400 text-xs bg-green-900 
                               border border-green-700 rounded-full px-2 py-1">✓ All Systems Go</span>
            </div>
            
            {[
              { label: 'Video Feed Latency', value: '0.8s delay', pct: 75 },
              { label: 'AI Sync Buffer', value: '100% optimal', pct: 100 },
            ].map((m, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">{m.label}</span>
                  <span style={{color: '#00d4b4'}}>{m.value}</span>
                </div>
                <div className="w-full rounded-full h-1.5" style={{backgroundColor: '#30363d'}}>
                  <div className="h-1.5 rounded-full" 
                       style={{backgroundColor: '#00d4b4', width: `${m.pct}%`}}></div>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                { icon: <Mic size={14} />, label: 'Mic Comms', status: 'Connected' },
                { icon: <Cloud size={14} />, label: 'Cloud Storage', status: 'Online' },
              ].map((s, i) => (
                <div key={i} className="rounded-lg p-3" style={{backgroundColor: '#0d1117'}}>
                  <span className="text-teal-400">{s.icon}</span>
                  <p className="text-gray-400 text-xs mt-1">{s.label}</p>
                  <p className="text-white text-sm">● {s.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
