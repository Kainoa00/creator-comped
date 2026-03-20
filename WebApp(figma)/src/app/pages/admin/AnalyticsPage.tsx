import { useState } from "react";
import { FilterSelector } from "../../components/admin/FilterSelector";
import { Instagram, Music2, Eye, Heart, MessageCircle, Info } from "lucide-react";

type FilterType = "Month" | "Year" | "All time";
type Platform = "instagram" | "tiktok";

const topCreators = [
  {
    rank: 1,
    name: "@foodie_sarah",
    instagram: {
      views: 145000,
      likes: 12400,
      comments: 856,
      posts: 18
    },
    tiktok: {
      views: 892000,
      likes: 45600,
      comments: 2340,
      posts: 18
    },
    instagram_url: "instagram.com/foodie_sarah",
    tiktok_url: "tiktok.com/@foodie_sarah"
  },
  {
    rank: 2,
    name: "@tastemaker_mike",
    instagram: {
      views: 128000,
      likes: 10200,
      comments: 742,
      posts: 16
    },
    tiktok: {
      views: 756000,
      likes: 38900,
      comments: 1980,
      posts: 16
    },
    instagram_url: "instagram.com/tastemaker_mike",
    tiktok_url: "tiktok.com/@tastemaker_mike"
  },
  {
    rank: 3,
    name: "@eats_with_emma",
    instagram: {
      views: 112000,
      likes: 9300,
      comments: 654,
      posts: 15
    },
    tiktok: {
      views: 687000,
      likes: 34200,
      comments: 1750,
      posts: 15
    },
    instagram_url: "instagram.com/eats_with_emma",
    tiktok_url: "tiktok.com/@eats_with_emma"
  },
  {
    rank: 4,
    name: "@chef_chronicles",
    instagram: {
      views: 98000,
      likes: 8100,
      comments: 567,
      posts: 14
    },
    tiktok: {
      views: 623000,
      likes: 31200,
      comments: 1620,
      posts: 14
    },
    instagram_url: "instagram.com/chef_chronicles",
    tiktok_url: "tiktok.com/@chef_chronicles"
  },
  {
    rank: 5,
    name: "@downtown_diner",
    instagram: {
      views: 87000,
      likes: 7200,
      comments: 498,
      posts: 13
    },
    tiktok: {
      views: 542000,
      likes: 27800,
      comments: 1430,
      posts: 13
    },
    instagram_url: "instagram.com/downtown_diner",
    tiktok_url: "tiktok.com/@downtown_diner"
  },
];

export function AnalyticsPage() {
  const [filter, setFilter] = useState<FilterType>("Month");
  const [platform, setPlatform] = useState<Platform>("instagram");

  const totalMetrics = topCreators.reduce((acc, creator) => {
    const platformData = creator[platform];
    return {
      views: acc.views + platformData.views,
      likes: acc.likes + platformData.likes,
      comments: acc.comments + platformData.comments,
      posts: acc.posts + platformData.posts
    };
  }, { views: 0, likes: 0, comments: 0, posts: 0 });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-white/70">Track content performance and engagement</p>
        </div>
        <FilterSelector value={filter} onChange={setFilter} />
      </div>

      {/* Platform Toggle */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setPlatform("instagram")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
            platform === "instagram"
              ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <Instagram className="w-5 h-5" />
          Instagram
        </button>
        <button
          onClick={() => setPlatform("tiktok")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
            platform === "tiktok"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <Music2 className="w-5 h-5" />
          TikTok
        </button>
      </div>

      {/* Total Metrics Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div className="text-white/70">Total Views</div>
          </div>
          <div className="text-3xl font-bold">
            {(totalMetrics.views / 1000000).toFixed(1)}M
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div className="text-white/70">Total Likes</div>
          </div>
          <div className="text-3xl font-bold">
            {(totalMetrics.likes / 1000).toFixed(1)}K
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="text-white/70">Total Comments</div>
          </div>
          <div className="text-3xl font-bold">
            {(totalMetrics.comments / 1000).toFixed(1)}K
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center">
              {platform === "instagram" ? <Instagram className="w-5 h-5" /> : <Music2 className="w-5 h-5" />}
            </div>
            <div className="text-white/70">Total Posts</div>
          </div>
          <div className="text-3xl font-bold">{totalMetrics.posts}</div>
        </div>
      </div>

      {/* Anti-Bot Policy Note */}
      <div className="bg-blue-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/20 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-white/90">
          <strong>Anti-Bot Policy:</strong> Our analytics use advanced detection to filter out bot activity and fake engagement. 
          All metrics represent verified, authentic engagement from real users to ensure accurate performance tracking.
        </div>
      </div>

      {/* Top 5 Creators Table */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
        <h3 className="text-lg font-semibold mb-6">
          Top 5 Creators by Combined Performance ({platform === "instagram" ? "Instagram" : "TikTok"})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Creator</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Views</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Likes</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Comments</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Posts</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-white/70">Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topCreators.map((creator) => {
                const platformData = creator[platform];
                return (
                  <tr key={creator.rank} className="hover:bg-white/5 transition">
                    <td className="py-4 px-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center font-semibold">
                        {creator.rank}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium">{creator.name}</td>
                    <td className="py-4 px-4">
                      <div className="font-semibold">
                        {(platformData.views / 1000).toFixed(0)}K
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold">
                        {(platformData.likes / 1000).toFixed(1)}K
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold">{platformData.comments}</div>
                    </td>
                    <td className="py-4 px-4 text-white/70">{platformData.posts}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-3">
                        <a
                          href={`https://${creator.instagram_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-400 transition"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                        <a
                          href={`https://${creator.tiktok_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-400 transition"
                        >
                          <Music2 className="w-5 h-5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
