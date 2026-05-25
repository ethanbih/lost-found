import type { LostAsset } from "@/types/asset";
import type { LostReport } from "@/types/lostReport";

type AssetStatsProps = {
  assets: LostAsset[];
  reports: LostReport[];
  matchCount: number;
};

export default function AssetStats({
  assets,
  reports,
  matchCount,
}: AssetStatsProps) {
  const stats = [
    {
      label: "Đồ vật đang lưu giữ",
      value: assets.filter((asset) => asset.status === "stored").length,
      tone: "stored",
    },
    {
      label: "Báo mất đang tìm",
      value: reports.filter((report) => report.status === "searching").length,
      tone: "total",
    },
    { label: "Gợi ý trùng khớp", value: matchCount, tone: "matched" },
    {
      label: "Đã bàn giao",
      value: assets.filter((asset) => asset.status === "returned").length,
      tone: "returned",
    },
    {
      label: "Chờ xử lý",
      value: assets.filter((asset) => asset.status === "pending_disposal")
        .length,
      tone: "pending",
    },
  ];

  return (
    <section className="stats-grid" aria-label="Thống kê đồ vật">
      {stats.map((item) => (
        <article className={`stat-card stat-card--${item.tone}`} key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  );
}
