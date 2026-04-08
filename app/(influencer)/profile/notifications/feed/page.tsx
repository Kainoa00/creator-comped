'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2, AlertTriangle, Trophy, Bell } from 'lucide-react'

type NotifType = 'approval' | 'warning' | 'leaderboard' | 'comp'

const DEMO_NOTIFICATIONS: { id: string; type: NotifType; title: string; body: string; time: string; read: boolean }[] = [
  { id: '1', type: 'approval', title: 'Proof Approved!', body: 'Your TikTok post for Cubby\'s Chicago Dogs has been approved. Great work!', time: '2h ago', read: false },
  { id: '2', type: 'warning', title: 'Proof Deadline Soon', body: 'You have 6 hours left to submit your proof for Station 22.', time: '4h ago', read: false },
  { id: '3', type: 'leaderboard', title: 'You\'re #1 This Month!', body: 'Congrats Mia — you\'re leading the TikTok leaderboard for February.', time: '1d ago', read: true },
  { id: '4', type: 'comp', title: 'New Comp Available', body: 'Brick Oven Restaurant has opened 2 new comp slots for today.', time: '2d ago', read: true },
]

const iconForType = (type: NotifType) => {
  if (type === 'approval') return <CheckCircle2 className="h-5 w-5 text-green-400" />
  if (type === 'warning') return <AlertTriangle className="h-5 w-5 text-yellow-400" />
  if (type === 'leaderboard') return <Trophy className="h-5 w-5 text-[#FF6B35]" />
  return <Bell className="h-5 w-5 text-[#4A90E2]" />
}

export default function NotificationFeedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white max-w-[430px] mx-auto">
      <header className="px-4 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#1a1a1a] active:bg-[#252525] transition-colors">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
      </header>

      <div className="px-4 pb-28 space-y-2">
        {DEMO_NOTIFICATIONS.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Bell className="h-10 w-10 text-gray-700" />
            <p className="text-white font-semibold">All caught up!</p>
            <p className="text-sm text-gray-500">No new notifications</p>
          </div>
        ) : (
          DEMO_NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className={`bg-[#1a1a1a] rounded-2xl px-4 py-4 flex items-start gap-3 border transition-colors ${n.read ? 'border-[#2a2a2a]' : 'border-white/20'}`}
            >
              <div className="w-9 h-9 rounded-full bg-[#252525] flex items-center justify-center shrink-0">
                {iconForType(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${n.read ? 'text-gray-300' : 'text-white'}`}>{n.title}</p>
                  <span className="text-[10px] text-gray-600 shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-[#FF6B35] shrink-0 mt-1.5" />}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
