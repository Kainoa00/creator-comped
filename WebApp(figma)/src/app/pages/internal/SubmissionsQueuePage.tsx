import { useState } from "react";
import { Search, Check, X, Instagram, Music2, Eye, ExternalLink, AlertCircle } from "lucide-react";

type SubmissionStatus = "pending" | "approved" | "rejected";

interface Submission {
  id: string;
  creator: string;
  creatorHandle: string;
  restaurant: string;
  submittedAt: string;
  status: SubmissionStatus;
  instagramUrl?: string;
  tiktokUrl?: string;
  instagramViews?: number;
  tiktokViews?: number;
  deliverables: {
    requiredHashtags: string[];
    tagRestaurant: boolean;
    instagramPost: boolean;
    tiktokPost: boolean;
  };
  compliance: {
    hasHashtags: boolean;
    hasTag: boolean;
    postedOnTime: boolean;
  };
}

const mockSubmissions: Submission[] = [
  {
    id: "1",
    creator: "Sarah Johnson",
    creatorHandle: "@foodie_sarah",
    restaurant: "Italian Place",
    submittedAt: "2026-02-28 3:45 PM",
    status: "pending",
    instagramUrl: "https://instagram.com/p/abc123",
    tiktokUrl: "https://tiktok.com/@foodie_sarah/video/123",
    instagramViews: 12400,
    tiktokViews: 45600,
    deliverables: {
      requiredHashtags: ["#CreatorComped", "#ItalianPlace"],
      tagRestaurant: true,
      instagramPost: true,
      tiktokPost: true
    },
    compliance: {
      hasHashtags: true,
      hasTag: true,
      postedOnTime: true
    }
  },
  {
    id: "2",
    creator: "Mike Thompson",
    creatorHandle: "@tastemaker_mike",
    restaurant: "Sushi Spot",
    submittedAt: "2026-02-28 1:20 PM",
    status: "pending",
    instagramUrl: "https://instagram.com/p/def456",
    instagramViews: 8200,
    deliverables: {
      requiredHashtags: ["#CreatorComped", "#SushiSpot"],
      tagRestaurant: true,
      instagramPost: true,
      tiktokPost: false
    },
    compliance: {
      hasHashtags: false,
      hasTag: true,
      postedOnTime: true
    }
  },
  {
    id: "3",
    creator: "Emma Davis",
    creatorHandle: "@eats_with_emma",
    restaurant: "Burger Bar",
    submittedAt: "2026-02-27 5:30 PM",
    status: "approved",
    instagramUrl: "https://instagram.com/p/ghi789",
    tiktokUrl: "https://tiktok.com/@eats_with_emma/video/456",
    instagramViews: 15600,
    tiktokViews: 32100,
    deliverables: {
      requiredHashtags: ["#CreatorComped", "#BurgerBar"],
      tagRestaurant: true,
      instagramPost: true,
      tiktokPost: true
    },
    compliance: {
      hasHashtags: true,
      hasTag: true,
      postedOnTime: true
    }
  },
];

export function SubmissionsQueuePage() {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(submissions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | "all">("all");

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.creatorHandle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.restaurant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setSubmissions(submissions.map((sub) =>
      sub.id === id ? { ...sub, status: "approved" as SubmissionStatus } : sub
    ));
  };

  const handleReject = (id: string) => {
    setSubmissions(submissions.map((sub) =>
      sub.id === id ? { ...sub, status: "rejected" as SubmissionStatus } : sub
    ));
  };

  const pendingCount = submissions.filter((sub) => sub.status === "pending").length;

  return (
    <div className="flex h-screen">
      {/* List Panel */}
      <div className="w-[500px] border-r border-white/5 flex flex-col bg-white/5">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Submissions Review</h1>
            <div className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-semibold">
              {pendingCount} pending
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search submissions..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Submissions List */}
        <div className="flex-1 overflow-y-auto">
          {filteredSubmissions.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubmission(sub)}
              className={`w-full p-4 border-b border-white/5 text-left hover:bg-white/5 transition ${
                selectedSubmission?.id === sub.id ? "bg-white/10" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold">{sub.creator}</div>
                  <div className="text-sm text-white/70">{sub.creatorHandle}</div>
                </div>
                {sub.status === "pending" && (
                  <div className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 text-xs">
                    Pending
                  </div>
                )}
                {sub.status === "approved" && (
                  <div className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 text-xs">
                    Approved
                  </div>
                )}
                {sub.status === "rejected" && (
                  <div className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 text-xs">
                    Rejected
                  </div>
                )}
              </div>
              <div className="text-sm text-white/70 mb-1">
                Restaurant: {sub.restaurant}
              </div>
              <div className="flex items-center gap-3 text-xs text-white/50">
                <div>{sub.submittedAt}</div>
                {!sub.compliance.hasHashtags && (
                  <div className="flex items-center gap-1 text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    Missing hashtags
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 overflow-y-auto">
        {selectedSubmission ? (
          <div className="p-8">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedSubmission.creator}</h2>
                  <p className="text-white/70">{selectedSubmission.creatorHandle}</p>
                  <p className="text-sm text-white/50 mt-1">
                    Restaurant: {selectedSubmission.restaurant}
                  </p>
                </div>
                {selectedSubmission.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReject(selectedSubmission.id)}
                      className="px-6 py-2 rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500/30 transition flex items-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(selectedSubmission.id)}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 hover:opacity-90 transition flex items-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Approve
                    </button>
                  </div>
                )}
              </div>

              {/* Post Links */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 mb-6">
                <h3 className="font-semibold mb-4">Submitted Posts</h3>
                <div className="space-y-3">
                  {selectedSubmission.instagramUrl && (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Instagram className="w-5 h-5 text-orange-500" />
                        <div>
                          <div className="font-medium">Instagram Post</div>
                          <div className="text-sm text-white/70 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {selectedSubmission.instagramViews?.toLocaleString()} views
                          </div>
                        </div>
                      </div>
                      <a
                        href={selectedSubmission.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-2"
                      >
                        View <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                  {selectedSubmission.tiktokUrl && (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Music2 className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="font-medium">TikTok Post</div>
                          <div className="text-sm text-white/70 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {selectedSubmission.tiktokViews?.toLocaleString()} views
                          </div>
                        </div>
                      </div>
                      <a
                        href={selectedSubmission.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-2"
                      >
                        View <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Deliverables Check */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5 mb-6">
                <h3 className="font-semibold mb-4">Deliverables Compliance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedSubmission.compliance.hasHashtags ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <div className="font-medium">Required Hashtags</div>
                        <div className="text-sm text-white/70">
                          {selectedSubmission.deliverables.requiredHashtags.join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedSubmission.compliance.hasTag ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    <div className="font-medium">Restaurant Tagged</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedSubmission.compliance.postedOnTime ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    <div className="font-medium">Posted Within 48 Hours</div>
                  </div>
                </div>
              </div>

              {/* Submission Info */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/5">
                <h3 className="font-semibold mb-4">Submission Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Submitted</span>
                    <span>{selectedSubmission.submittedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Status</span>
                    <span className="capitalize font-semibold">{selectedSubmission.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-white/50">
            Select a submission to review
          </div>
        )}
      </div>
    </div>
  );
}
