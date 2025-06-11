import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Sparkles } from "lucide-react";

import { useCreateCampaign } from "@/hooks/useCampaignQueries";
import { useAppSelector } from "@/store";

const campaignSchema = z.object({
  title: z
    .string()
    .min(1, "Campaign title is required")
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be less than 1000 characters"),
  goal: z
    .number()
    .min(0.1, "Goal must be at least 0.1 SOL")
    .max(10000, "Goal must be less than 10,000 SOL"),
  imageUrl: z.string().optional(),
  recipient: z.string().min(1, "Recipient address is required"),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
  onSuccess?: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onSuccess }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const createCampaignMutation = useCreateCampaign();
  const { createCampaignLoading, error } = useAppSelector(
    (state) => state.campaign
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      goal: 0,
      imageUrl: "",
      recipient: "",
    },
  });

  const watchedFields = watch();

  const calculateProgress = (): number => {
    const requiredFields = ["title", "description", "goal", "recipient"];
    const filledFields = requiredFields.filter((field) => {
      const value = watchedFields[field as keyof CampaignFormData];
      return (
        value !== undefined && value !== null && value !== "" && value !== 0
      );
    });

    const imageProgress = imageFile ? 1 : 0;
    return Math.round(
      ((filledFields.length + imageProgress) / (requiredFields.length + 1)) *
        100
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("https://via.placeholder.com/400x200");
      }, 1000);
    });
  };

  const onSubmit = async (data: CampaignFormData) => {
    try {
      let imageUrl = data.imageUrl;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const campaignData = {
        title: data.title,
        description: data.description,
        goal: data.goal,
        recipient: data.recipient,
        imageUrl,
      };

      await createCampaignMutation.mutateAsync(campaignData);

      // Reset form on success
      reset();
      setImagePreview(null);
      setImageFile(null);

      onSuccess?.();
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 dark:text-white">
          <span>Campaign Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title" className="dark:text-gray-200">
              Campaign Title *
            </Label>
            <Input
              id="title"
              placeholder="Help fund my medical expenses"
              {...register("title")}
              className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="dark:text-gray-200">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Tell your story... What are you raising money for? Why is it important?"
              {...register("description")}
              className="mt-1 min-h-[120px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Goal Field */}
          <div>
            <Label htmlFor="goal" className="dark:text-gray-200">
              Fundraising Goal (SOL) *
            </Label>
            <Input
              id="goal"
              type="number"
              step="0.1"
              min="0.1"
              placeholder="10"
              {...register("goal", { valueAsNumber: true })}
              className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.goal && (
              <p className="text-sm text-red-500 mt-1">{errors.goal.message}</p>
            )}
          </div>

          {/* Recipient Field */}
          <div>
            <Label htmlFor="recipient" className="dark:text-gray-200">
              Recipient Address *
            </Label>
            <Input
              id="recipient"
              placeholder="Solana wallet address"
              {...register("recipient")}
              className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.recipient && (
              <p className="text-sm text-red-500 mt-1">
                {errors.recipient.message}
              </p>
            )}
          </div>

          {/* Image Upload Field */}
          <div>
            <Label htmlFor="image" className="dark:text-gray-200">
              Campaign Image *
            </Label>
            <div className="mt-1">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400 dark:text-gray-300" />
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-400">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                  <input
                    id="image"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Campaign preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              {!imageFile && (
                <p className="text-sm text-red-500 mt-1">
                  Campaign image is required
                </p>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && <div className="text-sm text-red-500 mt-2">{error}</div>}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
            disabled={
              createCampaignLoading || calculateProgress() < 100 || !imageFile
            }
          >
            {createCampaignLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Campaign...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Blink
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CampaignForm;
