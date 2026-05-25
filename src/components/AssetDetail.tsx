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
  const assetRows = [
    ["Mã phiếu", asset.ticketCode],
    ["Tên đồ vật", asset.name],
    ["Loại đồ vật", CATEGORY_LABELS[asset.category]],
    ["Mô tả chi tiết", asset.description],
    ["Ghi chú", asset.note || "Không có ghi chú"],
  ];

  const intakeRows = [
    ["Vị trí nhặt được", asset.foundLocation],
    ["Thời gian nhặt được", formatDateTime(asset.foundAt)],
    ["Người nhặt được", asset.finderName],
    ["Số điện thoại người nhặt được", asset.finderPhone],
    ["Người tiếp nhận", asset.receivedBy],
    ["Nơi lưu giữ", asset.storageLocation],
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

      <DetailSection title="Thông tin đồ vật" rows={assetRows} />
      <DetailSection title="Thông tin tiếp nhận" rows={intakeRows} />

      {asset.handover ? (
        <section className="handover-box">
          <h3>Thông tin người nhận đồ</h3>
          <dl className="detail-list">
            <div>
              <dt>Người nhận đồ</dt>
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
              <dt>Thời gian bàn giao</dt>
              <dd>{formatDateTime(asset.handover.returnedAt)}</dd>
            </div>
            <div>
              <dt>Ghi chú</dt>
              <dd>{asset.handover.handoverNote || "Không có ghi chú"}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      <section className="handover-box">
        <h3>Lịch sử xử lý</h3>
        <ol className="history-list">
          {asset.history.map((item) => (
            <li key={`${item.time}-${item.action}`}>
              <time>{formatDateTime(item.time)}</time>
              <strong>{item.action}</strong>
              <span>{item.actor}</span>
              {item.note ? <p>{item.note}</p> : null}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function DetailSection({
  title,
  rows,
}: {
  title: string;
  rows: string[][];
}) {
  return (
    <section className="detail-section">
      <h3>{title}</h3>
      <dl className="detail-list">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
