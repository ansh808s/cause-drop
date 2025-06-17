"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Eye, Share2, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/store";
import { useGetCampaigns } from "@/hooks/useCampaignQueries";
import { withAuth } from "@/components/with-auth";

const MyCampaigns = () => {
  const { campaigns, totalCampaigns, activeCampaigns, isLoading, error } =
    useAppSelector((state) => state.campaign);
  const {
    data,
    isLoading: queryLoading,
    error: queryError,
    refetch,
  } = useGetCampaigns();

  const loading = isLoading || queryLoading;

  useEffect(() => {
    if (queryError) {
      console.error("Failed to load campaigns:", queryError);
    }
  }, [queryError]);

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (campaign: any) => {
    const shareUrl = `${window.location.origin}/campaign/${campaign.slug}`;
    copyToClipboard(shareUrl);
  };

  if (loading && campaigns.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
              <p className="text-gray-600 dark:text-gray-300">
                Loading your campaigns...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Campaigns
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage and track your fundraising campaigns
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{totalCampaigns} total campaigns</span>
              <span>•</span>
              <span>{activeCampaigns} active</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Link href="/create">
              <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Create New Campaign
              </Button>
            </Link>
          </div>
        </div>

        {(error || queryError) && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Failed to load campaigns
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {error || "Something went wrong. Please try again."}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="group hover:shadow-lg transition-all duration-300 dark:bg-gray-800"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {campaign.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge
                          variant={campaign.active ? "default" : "secondary"}
                          className={
                            campaign.active
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          }
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              campaign.active
                                ? "bg-emerald-500 animate-pulse"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          {campaign.active ? "Active" : "Completed"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {truncateDescription(campaign.description)}
                  </p>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {campaign.totalRaised.toFixed(2)} SOL raised
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        of {campaign.goal.toFixed(2)} SOL
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <div className="flex items-center space-x-4"></div>
                    <div className="flex items-center text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(campaign.createdAt)}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/campaign/${campaign.slug}`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(campaign)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No campaigns yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Create your first campaign to start raising funds
            </p>
            <Link href="/create">
              <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Campaign
              </Button>
            </Link>
          </div>
        )}

        {loading && campaigns.length > 0 && (
          <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 border">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Refreshing...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default withAuth(MyCampaigns);
