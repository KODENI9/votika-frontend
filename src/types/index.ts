export type CreatorStatus = 'active' | 'paused' | 'inactive' | 'pending';

export interface Creator {
  id: string;
  displayName: string;
  tiktokHandle: string;
  bio: string;
  country: string;
  category: string;
  avatarUrl: string;
  totalVotes: number;
  status: CreatorStatus;
  createdAt?: any;
  updatedAt?: any;
}

export type TransactionStatus = 'pending' | 'success' | 'failed' | 'cancelled';
export type PaymentMethod = 'orange' | 'wave' | 'mtn' | 'flooz' | 'mix_by_yas';

export interface Transaction {
  id: string;
  voteId: string;
  provider: 'moneyfusion';
  paymentMethod: PaymentMethod;
  amount: number;
  currency: 'XOF';
  moneyFusionRef: string;
  status: TransactionStatus;
  createdAt: any;
  updatedAt: any;
}

export interface Settings {
  voteUnitPrice: number;
  campaignActive: boolean;
  campaignStartDate?: string;
  campaignEndDate?: string;
}

export interface VoteResponse {
  voteId: string;
  transactionId: string;
  paymentUrl: string;
  token: string;
}

export interface VoteStatusResponse {
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  votesAdded?: number;
}
