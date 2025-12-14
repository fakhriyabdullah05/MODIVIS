
export enum AppView {
  LANDING = 'LANDING',
  MARKETPLACE = 'MARKETPLACE',
  ASSET_DETAIL = 'ASSET_DETAIL',
  EDITOR = 'EDITOR',
  USER_DASHBOARD = 'USER_DASHBOARD',
  CREATOR_DASHBOARD = 'CREATOR_DASHBOARD',
  PRICING = 'PRICING',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  FEATURES = 'FEATURES',
  UPLOAD_ASSET = 'UPLOAD_ASSET'
}

export enum UserTier {
  FREE = 'FREE',
  PRO_CREATOR = 'PRO_CREATOR',
  ULTRA_BUSINESS = 'ULTRA_BUSINESS'
}

export interface Asset {
  id: string;
  title: string;
  creator: string;
  imageUrl: string;
  downloads: number;
  views: number;
  price: number;
  uploadDate: string;
  category?: string;
  format?: string;
  orientation?: string;
  color?: string;
  license?: string;
}

export interface UserStats {
  tokens: number;
  quota: number;
  quotaMax: number;
}
