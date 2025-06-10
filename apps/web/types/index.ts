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
