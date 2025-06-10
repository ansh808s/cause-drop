import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type Campaign,
  type CampaignStats,
  type DetailedCampaign,
  type RecentDonation,
} from "../../types/campaign";

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

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCreateCampaignLoading: (state, action: PayloadAction<boolean>) => {
      state.createCampaignLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCampaigns: (
      state,
      action: PayloadAction<{
        campaigns: Campaign[];
        totalCampaigns: number;
        activeCampaigns: number;
      }>
    ) => {
      state.campaigns = action.payload.campaigns;
      state.totalCampaigns = action.payload.totalCampaigns;
      state.activeCampaigns = action.payload.activeCampaigns;
      state.isLoading = false;
      state.error = null;
    },
    setCampaignDetails: (
      state,
      action: PayloadAction<{
        campaign: DetailedCampaign;
        stats: CampaignStats;
        recentDonations: RecentDonation[];
      }>
    ) => {
      state.currentCampaign = action.payload.campaign;
      state.campaignStats = action.payload.stats;
      state.recentDonations = action.payload.recentDonations;
      state.isLoading = false;
      state.error = null;
    },
    addCampaign: (state, action: PayloadAction<Campaign>) => {
      state.campaigns.unshift(action.payload);
      state.totalCampaigns += 1;
      if (action.payload.active) {
        state.activeCampaigns += 1;
      }
      state.createCampaignLoading = false;
      state.error = null;
    },
    updateCampaignStats: (
      state,
      action: PayloadAction<{
        stats: CampaignStats;
        recentDonations: RecentDonation[];
      }>
    ) => {
      state.campaignStats = action.payload.stats;
      state.recentDonations = action.payload.recentDonations;
    },
    clearCurrentCampaign: (state) => {
      state.currentCampaign = null;
      state.campaignStats = null;
      state.recentDonations = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setCreateCampaignLoading,
  setError,
  setCampaigns,
  setCampaignDetails,
  addCampaign,
  updateCampaignStats,
  clearCurrentCampaign,
  clearError,
} = campaignSlice.actions;

export default campaignSlice.reducer;
