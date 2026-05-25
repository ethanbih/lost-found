export type AssetStatus =
  | "stored"
  | "returned"
  | "pending_disposal"
  | "disposed";

export type AssetCategory =
  | "documents"
  | "money"
  | "phone"
  | "electronics"
  | "keys"
  | "bag"
  | "clothing"
  | "other";

export type HandoverInfo = {
  receiverName: string;
  receiverPhone: string;
  receiverId?: string;
  handedOverBy: string;
  handoverNote?: string;
  returnedAt: string;
};

export type LostAsset = {
  id: string;
  ticketCode: string;
  name: string;
  category: AssetCategory;
  foundLocation: string;
  foundAt: string;
  receivedBy: string;
  status: AssetStatus;
  description: string;
  storageLocation: string;
  reporterName?: string;
  reporterPhone?: string;
  createdAt: string;
  updatedAt: string;
  handover?: HandoverInfo;
};

export type AssetFormValues = Omit<
  LostAsset,
  "id" | "createdAt" | "updatedAt" | "handover"
>;

export const STATUS_LABELS: Record<AssetStatus, string> = {
  stored: "Đang lưu giữ",
  returned: "Đã trả",
  pending_disposal: "Chờ xử lý",
  disposed: "Đã xử lý",
};

export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  documents: "Giấy tờ",
  money: "Tiền",
  phone: "Điện thoại",
  electronics: "Thiết bị điện tử",
  keys: "Chìa khóa",
  bag: "Túi xách/Balo",
  clothing: "Quần áo",
  other: "Khác",
};
