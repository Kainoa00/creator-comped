import { useState } from "react";
import { FilterSelector } from "../../components/admin/FilterSelector";
import { TrendingUp, DollarSign, Users, Instagram, Music2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type FilterType = "Month" | "Year" | "All time";

const spendData = [
  { month: "Sep", amount: 3200 },
  { month: "Oct", amount: 3800 },
  { month: "Nov", amount: 4200 },
  { month: "Dec", amount: 3600 },
  { month: "Jan", amount: 4500 },
  { month: "Feb", amount: 4892 },
];

const topCreators = [
  {
    rank: 1,
    name: "@foodie_sarah",
    spend: 842,
    comps: 18,
    instagram: "instagram.com/foodie_sarah",
    tiktok: "tiktok.com/@foodie_sarah"
  },
  {
    rank: 2,
    name: "@tastemaker_mike",
    spend: 756,
    comps: 16,
    instagram: "instagram.com/tastemaker_mike",
    tiktok: "tiktok.com/@tastemaker_mike"
  },
  {
    rank: 3,
    name: "@eats_with_emma",
    spend: 698,
    comps: 15,
    instagram: "instagram.com/eats_with_emma",
    tiktok: "tiktok.com/@eats_with_emma"
  },
  {
    rank: 4,
    name: "@chef_chronicles",
    spend: 624,
    comps: 14,
    instagram: "instagram.com/chef_chronicles",
    tiktok: "tiktok.com/@chef_chronicles"
  },
  {
    rank: 5,
    name: "@downtown_diner",
    spend: 582,
    comps: 13,
    instagram: "instagram.com/downtown_diner",
    tiktok: "tiktok.com/@downtown_diner"
  },
];

export function SpendPage() {
  const [filter, setFilter] = useState<FilterType>("Month");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Spend</h1>
          <p className="text-white/70">Track your comp spending and budget</p>
        </div>
        <FilterSelector value={filter} onChange={setFilter} />
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="text-white/70">Total Spend</div>
          </div>
          <div className="text-3xl font-bold mb-1">$4,892</div>
          <div className="flex items-center gap-2 text-sm text-green-500">
            <TrendingUp className="w-4 h-4" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-white/70">Active Creators</div>
          </div>
          <div className="text-3xl font-bold mb-1">48</div>
          <div className="flex items-center gap-2 text-sm text-green-500">
            <TrendingUp className="w-4 h-4" />
            <span>+8 from last month</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="text-white/70">Avg Comp Value</div>
          </div>
          <div className="text-3xl font-bold mb-1">$31.36</div>
          <div className="flex items-center gap-2 text-sm text-white/50">
            <span>Per redemption</span>
          </div>
        </div>
      </div>

      {/* Spend Chart */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 mb-8">
        <h3 className="text-lg font-semibold mb-6">Spend Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="month"
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="amount"
                stroke="url(#colorSpend)"
                strokeWidth={3}
                dot={{ fill: "#f97316", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 Creators */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
        <h3 className="text-lg font-semibold mb-6">Top 5 Creators by Spend</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Creator</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Total Spend</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Comps</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topCreators.map((creator) => (
                <tr key={creator.rank} className="hover:bg-white/5 transition">
                  <td className="py-4 px-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center font-semibold">
                      {creator.rank}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium">{creator.name}</td>
                  <td className="py-4 px-4 font-semibold text-lg">
                    ${creator.spend.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-white/70">{creator.comps} comps</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-3">
                      <a
                        href={`https://${creator.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-400 transition"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a
                        href={`https://${creator.tiktok}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-400 transition"
                      >
                        <Music2 className="w-5 h-5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
