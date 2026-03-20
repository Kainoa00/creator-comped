import { Link } from "react-router";
import {
  Receipt,
  DollarSign,
  BarChart3,
  Menu as MenuIcon,
  FileText,
  User,
  Calendar,
  Clock,
  ListOrdered,
} from "lucide-react";

export function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-white/70">Overview of your restaurant analytics</p>
      </div>

      {/* Main Tiles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Comps Tile */}
        <Link
          to="/admin/comps"
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">156</div>
              <div className="text-sm text-white/70">Total Comps</div>
            </div>
          </div>
          <div className="text-lg font-semibold mb-1">Comps</div>
          <p className="text-white/70 text-sm">
            View all comps, redemption status, and top items
          </p>
        </Link>

        {/* Spend Tile */}
        <Link
          to="/admin/spend"
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">$4,892</div>
              <div className="text-sm text-white/70">Total Spend</div>
            </div>
          </div>
          <div className="text-lg font-semibold mb-1">Spend</div>
          <p className="text-white/70 text-sm">
            Track spending, top creators, and budget usage
          </p>
        </Link>

        {/* Analytics Tile */}
        <Link
          to="/admin/analytics"
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">2.4M</div>
              <div className="text-sm text-white/70">Total Reach</div>
            </div>
          </div>
          <div className="text-lg font-semibold mb-1">Analytics</div>
          <p className="text-white/70 text-sm">
            View engagement metrics and creator performance
          </p>
        </Link>

        {/* Edit Menu Tile */}
        <Link
          to="/admin/menu"
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <MenuIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="text-lg font-semibold mb-1">Edit Menu</div>
          <p className="text-white/70 text-sm">
            Manage categories, items, prices, and limits
          </p>
        </Link>

        {/* Edit Deliverables Tile */}
        <Link
          to="/admin/deliverables"
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <div className="text-lg font-semibold mb-1">Edit Deliverables</div>
          <p className="text-white/70 text-sm">
            Set content requirements and guidelines
          </p>
        </Link>

        {/* Edit Profile Tile */}
        <Link
          to="/admin/profile"
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
          </div>
          <div className="text-lg font-semibold mb-1">Edit Profile</div>
          <p className="text-white/70 text-sm">
            Update restaurant info, logo, and location
          </p>
        </Link>
      </div>

      {/* Controls Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Settings & Controls</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Monthly Budget */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="font-semibold">Monthly Budget</div>
            </div>
            <div className="mb-3">
              <div className="text-2xl font-bold mb-1">$5,000</div>
              <div className="text-sm text-white/70">
                $108 remaining this month
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-blue-600 h-2 rounded-full"
                style={{ width: "98%" }}
              />
            </div>
          </div>

          {/* Creator Cooldown */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div className="font-semibold">Creator Cooldown</div>
            </div>
            <div className="mb-3">
              <div className="text-2xl font-bold mb-1">30 days</div>
              <div className="text-sm text-white/70">
                Chain-wide setting
              </div>
            </div>
            <button className="text-sm text-orange-500 hover:text-orange-400 transition">
              Adjust cooldown period →
            </button>
          </div>

          {/* Total Item Limit */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <ListOrdered className="w-5 h-5" />
              </div>
              <div className="font-semibold">Total Item Limit</div>
            </div>
            <div className="mb-3">
              <div className="text-2xl font-bold mb-1">4 items</div>
              <div className="text-sm text-white/70">
                Maximum per comp
              </div>
            </div>
            <button className="text-sm text-orange-500 hover:text-orange-400 transition">
              Adjust item limit →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
