"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  Copy,
  Calendar,
  Award,
  ArrowLeft,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useGetCampaign } from "@/hooks/useCampaignQueries";
import { useAppSelector } from "@/store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CampaignTracker() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [copySuccess, setCopySuccess] = useState(false);

  const { currentCampaign, campaignStats, recentDonations, isLoading, error } =
    useAppSelector((state) => state.campaign);

  const {
    data,
    isLoading: queryLoading,
    error: queryError,
  } = useGetCampaign(campaignId);

  const loading = isLoading && queryLoading;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-emerald-50 via-green-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center">
            <div className="text-center -mt-[20%]">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-emerald-600" />
              <p className="text-gray-600 dark:text-gray-300">
                Loading campaign...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || queryError || !currentCampaign) {
    return (
      <div className=" bg-gradient-to-br h-screen flex items-center justify-center from-emerald-50 via-green-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center -mt-[50%]">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <ExternalLink className="w-12 h-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Campaign Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {error ||
                  "The campaign you're looking for doesn't exist or has been removed."}
              </p>
              <Button onClick={() => router.push("/")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage =
    currentCampaign.goal > 0
      ? Math.min(
          (currentCampaign.totalRaised / currentCampaign.goal) * 100,
          100
        )
      : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className=" bg-gradient-to-br from-emerald-50 via-green-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentCampaign.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Created {formatDate(currentCampaign.createdAt)}
                  </span>
                  {/* {currentCampaign.creator && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {currentCampaign.creator.}
                    </span>
                  )} */}
                </div>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={`${
                currentCampaign.active
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  currentCampaign.active
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-gray-400"
                }`}
              ></div>
              {currentCampaign.active ? "Live" : "Inactive"}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {currentCampaign.imageUrl && (
              <Card className="overflow-hidden dark:bg-gray-800 flex justify-center items-center">
                <img
                  src={currentCampaign.imageUrl}
                  alt={currentCampaign.title}
                  className="w-[30%] max-w-[50%] h-auto object-cover"
                />
              </Card>
            )}

            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">
                  Campaign Story
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentCampaign.description}
                </p>
              </CardContent>
            </Card>

            {campaignStats && (
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">
                    Campaign Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {campaignStats.donationCount || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Total Donations
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {campaignStats.averageDonation?.toFixed(2) || "0.00"}{" "}
                        SOL
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Average Donation
                      </div>
                    </div>
                    <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {campaignStats.largestDonation?.toFixed(2) || "0.00"}{" "}
                        SOL
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Largest Donation
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {currentCampaign.totalRaised.toFixed(2)} SOL
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 mb-4">
                    raised of {currentCampaign.goal.toFixed(2)} SOL goal
                  </div>
                  <Progress value={progressPercentage} className="h-3 mb-2" />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {progressPercentage.toFixed(1)}% complete
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          `${API_BASE_URL}/api/actions/donation/${campaignId}`
                        )
                      }
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copySuccess ? "Copied!" : "Copy Blink"}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 "
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">
                  Campaign Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentCampaign.creator.address && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      Recipient Wallet
                    </div>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex-1 dark:text-gray-200">
                        {`${currentCampaign.creator.address.slice(
                          0,
                          6
                        )}...${currentCampaign.creator.address.slice(-4)}`}
                      </code>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(currentCampaign.creator.address!)
                        }
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {recentDonations.length > 0 && (
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 dark:text-white">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>Recent Donors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentDonations.map((donation, index) => (
                      <div
                        key={donation.id || index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-sm font-medium dark:text-white">
                              {donation.donor}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {donation.timestamp}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {donation.amount.toFixed(2)} SOL
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
