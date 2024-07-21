export interface Recipe {
  id?: string;
  title: string;
  cookingtime: number;
  nation: string;
  ingredients: string[];
  imageurl: string[];
  methods: string;
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
