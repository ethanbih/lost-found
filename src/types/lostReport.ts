import type { AssetCategory } from "./asset";

export type ReporterRole =
  | "patient"
  | "relative"
  | "staff"
  | "visitor"
  | "other";

export type LostReportStatus =
  | "searching"
  | "matched"
  | "contacted"
  | "resolved"
  | "cancelled";

export type LostReport = {
  id: string;
  reportCode: string;
  reporterName: string;
  reporterPhone: string;
  reporterRole: ReporterRole;
  itemName: string;
  category: AssetCategory;
  description: string;
  suspectedLocation: string;
  suspectedLostAt?: string;
  identifyingMarks?: string;
  note?: string;
  status: LostReportStatus;
  createdAt: string;
  updatedAt: string;
};

export type LostReportFormValues = Omit<
  LostReport,
  "id" | "reportCode" | "status" | "createdAt" | "updatedAt"
>;

export const REPORTER_ROLE_LABELS: Record<ReporterRole, string> = {
  patient: "Người bệnh",
  relative: "Người nhà",
  staff: "Nhân viên",
  visitor: "Khách",
  other: "Khác",
};

export const LOST_REPORT_STATUS_LABELS: Record<LostReportStatus, string> = {
  searching: "Đang tìm",
  matched: "Có gợi ý trùng",
  contacted: "Đã liên hệ",
  resolved: "Đã xử lý",
  cancelled: "Đã hủy",
};
