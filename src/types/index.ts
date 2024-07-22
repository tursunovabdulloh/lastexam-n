export interface Recipe {
  id: string;
  title: string;
  cookingTime: number;
  nation: string;
  ingredients: string[];
  imageURLs: string[];
  method: string;
  price?: number;
  productId: string;
  count: number;
  imageUrl: string;
}
export interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  apiKey: string;
  appName: string;
  createdAt: string;
  isAnonymous: boolean;
  lastLoginAt: string;
  providerData: any;
  stsTokenManager: any;
}
export interface SignupData {
  username: string;
  photoUrl: string;
  email: string;
  password: string;
}
