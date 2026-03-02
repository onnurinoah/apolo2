export type RelationshipType = "family" | "friend" | "colleague" | "acquaintance";

export interface InvitationInput {
  personName: string; // 전도 대상자 이름
  relationship: RelationshipType; // 관계
  eventType: string; // 모임 종류
  date: string; // 날짜 (드롭다운)
  location: string; // 장소
}

export interface InvitationResult {
  message: string;
}
