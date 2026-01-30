import type { Timestamp } from "firebase/firestore";

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  points: number;
  referralCode: string;
  hasUsedReferral: boolean;
  referredBy: string | null;
  withdrawalInfo: {
    name: string;
    mobile: string;
  };
  dailySpins: number;
  lastSpinDate: string; // YYYY-MM-DD
};

export type WithdrawalTier = {
  id: number;
  rs: number;
  points: number;
};

export type SpinResult = {
  id: string;
  userId: string;
  spinTime: Timestamp;
  pointsEarned: number;
};

export type WithdrawalRequest = {
  id: string;
  userId: string;
  amount: number;
  points: number;
  method: "Google Play" | "UPI";
  status: "Pending" | "Completed" | "Failed";
  requestTime: Timestamp;
  userName: string;
  userEmail: string;
  userMobile: string;
};

export type SpinWheelSlice = {
  value: number;
  color: string;
};
