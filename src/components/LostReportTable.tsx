import { CATEGORY_LABELS } from "@/types/asset";
import {
  LOST_REPORT_STATUS_LABELS,
  type LostReport,
  type LostReportStatus,
} from "@/types/lostReport";

type LostReportTableProps = {
  reports: LostReport[];
  onView: (report: LostReport) => void;
  onStatusChange: (report: LostReport, status: LostReportStatus) => void;
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export default function LostReportTable({
  reports,
  onView,
  onStatusChange,
}: LostReportTableProps) {
  if (reports.length === 0) {
    return (
      <div className="empty-state">
        <h3>Chưa có báo mất đồ vật</h3>
        <p>Các báo mất sẽ hiển thị tại đây để tổ bảo vệ theo dõi.</p>
      </div>
    );
  }

  return (
    <div className="table-shell">
      <table className="asset-table">
        <thead>
          <tr>
            <th>Mã báo mất</th>
            <th>Đồ vật</th>
            <th>Loại</th>
            <th>Khu vực nghi mất</th>
            <th>Người báo mất</th>
            <th>Số điện thoại</th>
            <th>Trạng thái</th>
            <th>Thời gian báo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td data-label="Mã báo mất">
                <strong>{report.reportCode}</strong>
              </td>
              <td data-label="Đồ vật">{report.itemName}</td>
              <td data-label="Loại">{CATEGORY_LABELS[report.category]}</td>
              <td data-label="Khu vực nghi mất">{report.suspectedLocation}</td>
              <td data-label="Người báo mất">{report.reporterName}</td>
              <td data-label="Số điện thoại">{report.reporterPhone}</td>
              <td data-label="Trạng thái">
                <span className={`status-badge report-status--${report.status}`}>
                  {LOST_REPORT_STATUS_LABELS[report.status]}
                </span>
              </td>
              <td data-label="Thời gian báo">
                {formatDateTime(report.createdAt)}
              </td>
              <td data-label="Thao tác">
                <div className="table-actions">
                  <button type="button" onClick={() => onView(report)}>
                    Xem
                  </button>
                  <button
                    type="button"
                    onClick={() => onStatusChange(report, "contacted")}
                  >
                    Đã liên hệ
                  </button>
                  <button
                    type="button"
                    onClick={() => onStatusChange(report, "resolved")}
                  >
                    Đã xử lý
                  </button>
                  <button
                    type="button"
                    onClick={() => onStatusChange(report, "cancelled")}
                  >
                    Hủy
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
