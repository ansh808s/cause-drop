import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAppDispatch } from "@/store";
import {
  setCampaigns,
  setCampaignDetails,
  addCampaign,
  setLoading,
  setCreateCampaignLoading,
  setError,
} from "@/store/slices/campaignSlice";
import {
  type ApiResponse,
  type CreateCampaignRequest,
  type CreateCampaignResponse,
  type GetCampaignResponse,
  type GetCampaignsResponse,
  type GetSignedUrlResponse,
} from "../types/campaign";

export const campaignKeys = {
  all: ["campaigns"] as const,
  lists: () => [...campaignKeys.all, "list"] as const,
  list: (filters?: any) => [...campaignKeys.lists(), filters] as const,
  details: () => [...campaignKeys.all, "detail"] as const,
  detail: (slug: string) => [...campaignKeys.details(), slug] as const,
  signedUrl: (mime: string) =>
    [...campaignKeys.all, "signedUrl", mime] as const,
};

export const useGetCampaigns = () => {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: campaignKeys.lists(),
    queryFn: async () => {
      dispatch(setLoading(true));
      try {
        const response = await apiClient.get<ApiResponse<GetCampaignsResponse>>(
          "/api/app/campaign"
        );

        dispatch(
          setCampaigns({
            campaigns: response.data.campaigns,
            totalCampaigns: response.data.totalCampaigns,
            activeCampaigns: response.data.activeCampaigns,
          })
        );

        return response.data;
      } catch (error: any) {
        dispatch(
          setError(error.response?.data?.message || "Failed to fetch campaigns")
        );
        throw error;
      }
    },
  });
};

export const useGetCampaign = (slug: string) => {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: campaignKeys.detail(slug),
    queryFn: async () => {
      dispatch(setLoading(true));
      try {
        const response = await apiClient.get<ApiResponse<GetCampaignResponse>>(
          `/api/app/campaign/${slug}`
        );

        dispatch(
          setCampaignDetails({
            campaign: response.data.campaign,
            stats: response.data.stats,
            recentDonations: response.data.recentDonations,
          })
        );

        return response.data;
      } catch (error: any) {
        dispatch(
          setError(error.response?.data?.message || "Failed to fetch campaign")
        );
        throw error;
      }
    },
    enabled: !!slug,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (data: CreateCampaignRequest) => {
      dispatch(setCreateCampaignLoading(true));
      const response = await apiClient.post<
        ApiResponse<CreateCampaignResponse>
      >("/api/app/campaign", data);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(addCampaign(data.campaign));
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
    onError: (error: any) => {
      dispatch(setCreateCampaignLoading(false));
      dispatch(
        setError(error.response?.data?.message || "Failed to create campaign")
      );
    },
  });
};

export const useGetSignedUrl = () => {
  return useMutation({
    mutationFn: async (mimeType: string) => {
      const response = await apiClient.get<ApiResponse<GetSignedUrlResponse>>(
        `/api/app/signedurl?mime=${mimeType}`
      );
      return response.data;
    },
    onError: (error: any) => {
      console.error("Failed to get signed URL:", error);
      throw error;
    },
  });
};

export const useUploadToS3 = () => {
  return useMutation({
    mutationFn: async ({
      signedUrl,
      file,
    }: {
      signedUrl: string;
      file: File;
    }) => {
      const response = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload file to S3");
      }

      return response;
    },
    onError: (error: any) => {
      console.error("Failed to upload to S3:", error);
      throw error;
    },
  });
};
