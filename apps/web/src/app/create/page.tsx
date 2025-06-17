"use client";

import { Card, CardContent } from "@/components/ui/card";
import CampaignForm from "@/components/campaign-form";
import { withAuth } from "@/components/with-auth";

const CreateCampaign = () => {
  return (
    <div className=" bg-gradient-to-br from-emerald-50 via-green-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Campaign
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Tell your story and start raising funds on Solana
          </p>
        </div>
        <div className="space-y-6">
          <CampaignForm />
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
};

export default withAuth(CreateCampaign);
