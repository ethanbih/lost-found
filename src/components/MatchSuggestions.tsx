import type { LostAsset } from "@/types/asset";
import type { LostReport } from "@/types/lostReport";
import type { MatchSuggestion } from "@/utils/matching";

type MatchSuggestionsProps = {
  suggestions: MatchSuggestion[];
  onViewAsset: (asset: LostAsset) => void;
  onViewReport: (report: LostReport) => void;
  onContacted: (report: LostReport) => void;
  onReturnAsset: (asset: LostAsset) => void;
};

const LEVEL_LABELS: Record<MatchSuggestion["level"], string> = {
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
};

export default function MatchSuggestions({
  suggestions,
  onViewAsset,
  onViewReport,
  onContacted,
  onReturnAsset,
}: MatchSuggestionsProps) {
  if (suggestions.length === 0) {
    return (
      <div className="empty-state">
        <h3>Chưa có gợi ý trùng khớp</h3>
        <p>Hệ thống sẽ gợi ý khi đồ vật nhặt được gần giống báo mất.</p>
      </div>
    );
  }

  return (
    <div className="match-list">
      {suggestions.map((suggestion) => (
        <article className="match-card" key={suggestion.id}>
          <div className="match-card__header">
            <div>
              <span className="eyebrow">Đồ vật nhặt được</span>
              <h3>
                {suggestion.asset.ticketCode} - {suggestion.asset.name}
              </h3>
            </div>
            <span className={`match-level match-level--${suggestion.level}`}>
              {LEVEL_LABELS[suggestion.level]}
            </span>
          </div>
          <div className="match-report">
            <span>Báo mất</span>
            <strong>
              {suggestion.report.reportCode} - {suggestion.report.itemName}
            </strong>
            <p>SĐT người báo mất: {suggestion.report.reporterPhone}</p>
          </div>
          <p className="match-reason">
            Lý do gợi ý: {suggestion.reasons.join(", ")}
          </p>
          <div className="table-actions">
            <button type="button" onClick={() => onViewAsset(suggestion.asset)}>
              Xem đồ vật nhặt được
            </button>
            <button
              type="button"
              onClick={() => onViewReport(suggestion.report)}
            >
              Xem báo mất
            </button>
            <button type="button" onClick={() => onContacted(suggestion.report)}>
              Đánh dấu đã liên hệ
            </button>
            <button type="button" onClick={() => onReturnAsset(suggestion.asset)}>
              Xác nhận bàn giao đồ vật
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
