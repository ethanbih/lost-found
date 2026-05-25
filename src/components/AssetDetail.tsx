import { CATEGORY_LABELS, type LostAsset } from "@/types/asset";
import StatusBadge from "./StatusBadge";

type AssetDetailProps = {
  asset: LostAsset;
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export default function AssetDetail({ asset }: AssetDetailProps) {
  const rows = [
    ["Mã phiếu", asset.ticketCode],
    ["Tên tài sản", asset.name],
    ["Loại tài sản", CATEGORY_LABELS[asset.category]],
    ["Vị trí nhặt được", asset.foundLocation],
    ["Thời gian nhặt được", formatDateTime(asset.foundAt)],
    ["Người tiếp nhận", asset.receivedBy],
    ["Nơi lưu giữ", asset.storageLocation],
    ["Người báo nhặt được", asset.reporterName || "Chưa ghi nhận"],
    ["Số điện thoại người báo", asset.reporterPhone || "Chưa ghi nhận"],
    ["Mô tả", asset.description],
  ];

  return (
    <div className="detail-panel">
      <div className="detail-heading">
        <div>
          <span className="eyebrow">{asset.ticketCode}</span>
          <h2>{asset.name}</h2>
        </div>
        <StatusBadge status={asset.status} />
      </div>

      <dl className="detail-list">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      {asset.handover ? (
        <section className="handover-box">
          <h3>Thông tin bàn giao</h3>
          <dl className="detail-list">
            <div>
              <dt>Người nhận</dt>
              <dd>{asset.handover.receiverName}</dd>
            </div>
            <div>
              <dt>Số điện thoại</dt>
              <dd>{asset.handover.receiverPhone}</dd>
            </div>
            <div>
              <dt>CCCD/CMND</dt>
              <dd>{asset.handover.receiverId || "Không có"}</dd>
            </div>
            <div>
              <dt>Người bàn giao</dt>
              <dd>{asset.handover.handedOverBy}</dd>
            </div>
            <div>
              <dt>Thời gian trả</dt>
              <dd>{formatDateTime(asset.handover.returnedAt)}</dd>
            </div>
            <div>
              <dt>Ghi chú</dt>
              <dd>{asset.handover.handoverNote || "Không có ghi chú"}</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </div>
  );
}
