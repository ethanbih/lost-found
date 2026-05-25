import {
  CATEGORY_LABELS,
  type AssetCategory,
  type AssetStatus,
  type LostAsset,
} from "@/types/asset";
import StatusBadge from "./StatusBadge";

type AssetTableProps = {
  assets: LostAsset[];
  onView: (asset: LostAsset) => void;
  onEdit: (asset: LostAsset) => void;
  onReturn: (asset: LostAsset) => void;
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export default function AssetTable({
  assets,
  onView,
  onEdit,
  onReturn,
}: AssetTableProps) {
  if (assets.length === 0) {
    return (
      <div className="empty-state">
        <h3>Không tìm thấy đồ vật phù hợp</h3>
        <p>Thử bỏ bớt bộ lọc hoặc kiểm tra lại từ khóa tìm kiếm.</p>
      </div>
    );
  }

  return (
    <div className="table-shell">
      <table className="asset-table">
        <thead>
          <tr>
            <th>Mã phiếu</th>
            <th>Tên đồ vật</th>
            <th>Loại</th>
            <th>Vị trí nhặt được</th>
            <th>Thời gian</th>
            <th>Người tiếp nhận</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td data-label="Mã phiếu">
                <strong>{asset.ticketCode}</strong>
              </td>
              <td data-label="Tên đồ vật">{asset.name}</td>
              <td data-label="Loại">
                {CATEGORY_LABELS[asset.category as AssetCategory]}
              </td>
              <td data-label="Vị trí nhặt được">{asset.foundLocation}</td>
              <td data-label="Thời gian">{formatDateTime(asset.foundAt)}</td>
              <td data-label="Người tiếp nhận">{asset.receivedBy}</td>
              <td data-label="Trạng thái">
                <StatusBadge status={asset.status as AssetStatus} />
              </td>
              <td data-label="Thao tác">
                <div className="table-actions">
                  <button type="button" onClick={() => onView(asset)}>
                    Xem
                  </button>
                  <button type="button" onClick={() => onEdit(asset)}>
                    Sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => onReturn(asset)}
                    disabled={asset.status === "returned"}
                  >
                    Bàn giao
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
