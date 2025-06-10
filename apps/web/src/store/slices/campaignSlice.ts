import {
  type Campaign,
  type CampaignStats,
  type DetailedCampaign,
  type RecentDonation,
} from "../../../types";

interface CampaignState {
  campaigns: Campaign[];
  currentCampaign: DetailedCampaign | null;
  campaignStats: CampaignStats | null;
  recentDonations: RecentDonation[];
  totalCampaigns: number;
  activeCampaigns: number;
  isLoading: boolean;
  error: string | null;
  createCampaignLoading: boolean;
}

const initialState: CampaignState = {
  campaigns: [],
  currentCampaign: null,
  campaignStats: null,
  recentDonations: [],
  totalCampaigns: 0,
  activeCampaigns: 0,
  isLoading: false,
  error: null,
  createCampaignLoading: false,
};
