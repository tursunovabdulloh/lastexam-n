export interface Recipe {
  id: string;
  title: string;
  cookingTime: number;
  ingredients: string[];
  imageURLs: string[];
  method: string;
  nation: string;
  price: number;
  count: number;
}

export interface CartItem {
  id: string;
  count: number;
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
