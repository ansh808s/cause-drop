export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  recipient: string;
  imageUrl?: string;
  goal: number;
  slug: string;
  totalRaised: number;
  active: boolean;
  createdAt: string;
}

export interface CampaignWithStats extends Campaign {
  donationCount: number;
  progressPercentage: number;
}

export interface DetailedCampaign extends Campaign {
  creator: {
    id: string;
    address: string;
  };
}

export interface CampaignStats {
  totalRaised: number;
  donationCount: number;
  averageDonation: number;
  largestDonation: number;
  progressPercentage: number;
}

export interface RecentDonation {
  id: string;
  amount: number;
  donor: string;
  timestamp: string;
  signature: string;
}

export interface CreateCampaignRequest {
  title: string;
  description: string;
  recipient: string;
  imageUrl?: string;
  goal: number;
}

export interface CreateCampaignResponse {
  campaign: Campaign;
}

export interface GetCampaignResponse {
  campaign: DetailedCampaign;
  stats: CampaignStats;
  recentDonations: RecentDonation[];
}

export interface GetCampaignsResponse {
  campaigns: CampaignWithStats[];
  totalCampaigns: number;
  activeCampaigns: number;
}

export interface GetSignedUrlResponse {
  url: string;
  fileName: string;
}
