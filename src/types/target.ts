import { EvangelismRelationship } from "@/types/evangelism";

export type TargetInterest =
  | "positive"
  | "curious"
  | "neutral"
  | "negative"
  | "hurt";

export type TargetStatus =
  | "praying"
  | "approaching"
  | "invited"
  | "attending"
  | "decided";

export interface EvangelismTarget {
  id: string;
  name: string;
  relationship: EvangelismRelationship;
  situation: string;
  interest: TargetInterest;
  notes?: string;
  status: TargetStatus;
  createdAt: string;
  updatedAt: string;
  prayerDates: string[];
}

export interface CreateTargetInput {
  name: string;
  relationship: EvangelismRelationship;
  situation: string;
  interest: TargetInterest;
  notes?: string;
}

export const TARGET_RELATIONSHIP_OPTIONS: Array<{
  value: EvangelismRelationship;
  label: string;
}> = [
  { value: "family", label: "가족" },
  { value: "friend", label: "친구" },
  { value: "colleague", label: "직장동료" },
  { value: "acquaintance", label: "지인" },
  { value: "neighbor", label: "이웃" },
];

export const TARGET_INTEREST_OPTIONS: Array<{
  value: TargetInterest;
  label: string;
}> = [
  { value: "positive", label: "긍정적" },
  { value: "curious", label: "호기심 있음" },
  { value: "neutral", label: "중립적" },
  { value: "negative", label: "부정적" },
  { value: "hurt", label: "교회에 상처" },
];

export const TARGET_STATUS_OPTIONS: Array<{
  value: TargetStatus;
  label: string;
}> = [
  { value: "praying", label: "기도 중" },
  { value: "approaching", label: "관계 형성" },
  { value: "invited", label: "초대함" },
  { value: "attending", label: "참석함" },
  { value: "decided", label: "결신" },
];

