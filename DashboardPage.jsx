import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const StatCard = ({ icon, label, value, sub, color = 'blue' }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    amber: 'from-amber-400 to-amber-500',
  };
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card card-lift">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-2xl font-display font-bold text-slate-800">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon, label, to, bg }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(to)}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${bg} card-lift text-sm font-semibold text-slate-700 w-full`}>
      <span className="text-2xl">{icon}</span>
      {label}
    </button>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [quote, setQuote] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/study/stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/mental/quote').then(r => setQuote(r.data.quote)).catch(() => {});
    api.get('/study/tasks?status=todo').then(r => setTasks(r.data.tasks?.slice(0, 4) || [])).catch(() => {});
  }, []);

  const weeklyData = stats?.weeklyData
    ? Object.entries(stats.weeklyData).map(([day, min]) => ({ day, minutes: min }))
    : [
      { day: 'Mon', minutes: 45 }, { day: 'Tue', minutes: 90 }, { day: 'Wed', minutes: 60 },
      { day: 'Thu', minutes: 120 }, { day: 'Fri', minutes: 75 }, { day: 'Sat', minutes: 50 }, { day: 'Sun', minutes: 30 },
    ];

  const moodData = [
    { day: 'Mon', mood: 3 }, { day: 'Tue', mood: 4 }, { day: 'Wed', mood: 3 },
    { day: 'Thu', mood: 5 }, { day: 'Fri', mood: 4 }, { day: 'Sat', mood: 4 }, { day: 'Sun', mood: 3 },
  ];

  const priorityColors = { urgent: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', medium: 'bg-blue-100 text-blue-700', low: 'bg-slate-100 text-slate-600' };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Welcome banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 rounded-2xl p-6 overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full"><circle cx="150" cy="50" r="80" fill="white"/><circle cx="50" cy="150" r="60" fill="white"/></svg>
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Welcome back, {user?.name?.split(' ')[0]}! 🎯
          </h1>
          <p className="text-blue-100 text-sm mb-4">
            {user?.course && `${user.course} · `}{user?.college || 'Your productivity hub awaits'}
          </p>
          {quote && (
            <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-3 max-w-lg">
              <p className="text-white text-sm font-medium italic">"{quote.text}"</p>
              <p className="text-blue-200 text-xs mt-1">— {quote.author}</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🔥" label="Study Streak" value={`${stats?.studyStreak || user?.studyStreak || 0} days`} sub="Keep it up!" color="amber" />
        <StatCard icon="⏱️" label="Total Study Time" value={`${Math.floor((stats?.totalStudyMinutes || user?.totalStudyMinutes || 0) / 60)}h ${(stats?.totalStudyMinutes || 0) % 60}m`} sub="All time" color="blue" />
        <StatCard icon="✅" label="Tasks Done" value={stats?.completedTasks || 0} sub="Completed tasks" color="green" />
        <StatCard icon="⚡" label="XP Points" value={stats?.xp || user?.xp || 0} sub="Keep studying!" color="purple" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Study chart */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-slate-800">Weekly Study Time</h3>
              <p className="text-xs text-slate-400">Minutes per day this week</p>
            </div>
            <button onClick={() => navigate('/study')} className="text-xs text-blue-600 font-semibold hover:underline">View all →</button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData} barSize={28}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis hide />
              <Tooltip formatter={(v) => [`${v} min`, 'Study Time']} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="minutes" fill="url(#blueGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mood chart */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-slate-800">Mood Trend</h3>
              <p className="text-xs text-slate-400">Your wellbeing this week</p>
            </div>
            <button onClick={() => navigate('/mental')} className="text-xs text-blue-600 font-semibold hover:underline">Track mood →</button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis domain={[1, 5]} hide />
              <Tooltip formatter={(v) => [['😞','😕','😐','😊','😄'][v-1], 'Mood']} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="mood" stroke="#16a34a" strokeWidth={3} dot={{ fill: '#16a34a', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick actions + Tasks row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick actions */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="font-display font-bold text-slate-800 mb-4">Quick Start</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction icon="⏱️" label="Pomodoro" to="/study" bg="bg-blue-50 hover:bg-blue-100" />
            <QuickAction icon="😊" label="Log Mood" to="/mental" bg="bg-green-50 hover:bg-green-100" />
            <QuickAction icon="📝" label="New Task" to="/study" bg="bg-purple-50 hover:bg-purple-100" />
            <QuickAction icon="📖" label="Journal" to="/mental" bg="bg-amber-50 hover:bg-amber-100" />
          </div>
        </div>

        {/* Upcoming tasks */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-slate-800">Upcoming Tasks</h3>
            <button onClick={() => navigate('/study')} className="text-xs text-blue-600 font-semibold hover:underline">Manage all →</button>
          </div>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-sm">No tasks yet — add your first task!</p>
              <button onClick={() => navigate('/study')} className="btn-primary mt-3 text-xs py-2">Add Task</button>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map(t => (
                <div key={t._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{t.title}</p>
                    {t.subject && <p className="text-xs text-slate-400">{t.subject}</p>}
                  </div>
                  <span className={`badge ${priorityColors[t.priority]}`}>{t.priority}</span>
                  {t.dueDate && <span className="text-xs text-slate-400 hidden sm:block">{new Date(t.dueDate).toLocaleDateString('en-IN')}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Module shortcuts */}
      <div className="bg-white rounded-2xl p-5 shadow-card">
        <h3 className="font-display font-bold text-slate-800 mb-4">Explore Modules</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: '🎓', label: 'Academic', to: '/academic', bg: 'bg-blue-50 text-blue-700' },
            { icon: '💰', label: 'Finance', to: '/finance', bg: 'bg-green-50 text-green-700' },
            { icon: '🤝', label: 'Social', to: '/social', bg: 'bg-purple-50 text-purple-700' },
            { icon: '⚡', label: 'Skills', to: '/skills', bg: 'bg-amber-50 text-amber-700' },
            { icon: '🚀', label: 'Career', to: '/career', bg: 'bg-rose-50 text-rose-700' },
            { icon: '👤', label: 'Profile', to: '/profile', bg: 'bg-slate-50 text-slate-700' },
          ].map(m => (
            <button key={m.to} onClick={() => navigate(m.to)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl ${m.bg} hover:opacity-80 card-lift text-sm font-semibold transition-all`}>
              <span className="text-2xl">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
