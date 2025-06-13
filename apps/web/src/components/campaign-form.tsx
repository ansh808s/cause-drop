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

import {
  useCreateCampaign,
  useGetSignedUrl,
  useUploadToS3,
} from "@/hooks/useCampaignQueries";
import { useAppSelector } from "@/store";
import { useWallet } from "@solana/wallet-adapter-react";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { toast } from "sonner";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

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
  imageUrl: z.string(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
  onSuccess?: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onSuccess }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { publicKey } = useWallet();

  const createCampaignMutation = useCreateCampaign();
  const getSignedUrlMutation = useGetSignedUrl();
  const uploadToS3Mutation = useUploadToS3();

  const { createCampaignLoading, error } = useAppSelector(
    (state) => state.campaign
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
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
    },
  });

  const watchedFields = watch();

  const calculateProgress = (): number => {
    const requiredFields = ["title", "description", "goal"];
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
      if (file.size > MAX_FILE_SIZE) {
        alert("File size must be less than 10MB");
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

  const uploadImageToS3 = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const signedUrlResponse = await getSignedUrlMutation.mutateAsync(
        file.type.split("/")[1]
      );
      setUploadProgress(25);
      await uploadToS3Mutation.mutateAsync({
        signedUrl: signedUrlResponse.url,
        file: file,
      });
      setUploadProgress(75);

      const uploadedUrl = `${CDN_URL}/${signedUrlResponse.fileName}`;
      setUploadProgress(100);

      return uploadedUrl;
    } catch (error) {
      toast.error("Failed to upload image");
      throw new Error("Failed to upload image");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const onSubmit = async (data: CampaignFormData) => {
    try {
      let imageUrl = data.imageUrl;

      if (imageFile) {
        imageUrl = await uploadImageToS3(imageFile);
        setValue("imageUrl", imageUrl);
      }

      const campaignData = {
        title: data.title,
        description: data.description,
        goal: data.goal,
        imageUrl,
        recipient: publicKey!.toString(),
      };

      await createCampaignMutation.mutateAsync(campaignData);

      reset();
      setImagePreview(null);
      setImageFile(null);

      onSuccess?.();
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  const isFormLoading = createCampaignLoading || isUploading;

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
              {isUploading && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              {imagePreview && !isUploading && (
                <div className="mt-4 flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Campaign preview"
                    className="w-[35%] h-auto object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {error && <div className="text-sm text-red-500 mt-2">{error}</div>}

          <Button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
            disabled={isFormLoading || calculateProgress() < 100 || !imageFile}
          >
            {isFormLoading ? (
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
