"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Upload, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CampaignForm from "@/components/campaign-form";

export default function CreateCampaign() {
  const router = useRouter();

  return (
    <div className=" bg-gradient-to-br from-emerald-50 via-green-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Confetti Animation
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 animate-pulse">
            <div className="flex items-center justify-center h-full">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl text-center">
                <Sparkles className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-spin" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Campaign Created! 🎉
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Redirecting to your campaign page...
                </p>
              </div>
            </div>
          </div>
        </div>
      )} */}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Campaign
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Tell your story and start raising funds on Solana
          </p>
        </div>

        {/* Single Column Form */}
        <div className="space-y-6">
          <CampaignForm />
          {/* Tips Card */}
          <Card className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-6">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3">
                💡 Tips for Success
              </h4>
              <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-200">
                <li>• Use a compelling, high-quality image</li>
                <li>• Tell your story authentically</li>
                <li>• Set a realistic funding goal</li>
                <li>• Share your campaign widely</li>
                <li>• Keep supporters updated</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
