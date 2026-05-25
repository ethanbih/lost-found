import { STATUS_LABELS, type LostAsset } from "@/types/asset";

type AssetStatsProps = {
  assets: LostAsset[];
};

export default function AssetStats({ assets }: AssetStatsProps) {
  const stats = [
    { label: "Tổng tài sản", value: assets.length, tone: "total" },
    {
      label: STATUS_LABELS.stored,
      value: assets.filter((asset) => asset.status === "stored").length,
      tone: "stored",
    },
    {
      label: STATUS_LABELS.returned,
      value: assets.filter((asset) => asset.status === "returned").length,
      tone: "returned",
    },
    {
      label: STATUS_LABELS.pending_disposal,
      value: assets.filter((asset) => asset.status === "pending_disposal")
        .length,
      tone: "pending",
    },
    {
      label: STATUS_LABELS.disposed,
      value: assets.filter((asset) => asset.status === "disposed").length,
      tone: "disposed",
    },
  ];

  return (
    <section className="stats-grid" aria-label="Thống kê tài sản">
      {stats.map((item) => (
        <article className={`stat-card stat-card--${item.tone}`} key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  );
}
