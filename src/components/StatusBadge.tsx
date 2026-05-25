import { STATUS_LABELS, type AssetStatus } from "@/types/asset";

type StatusBadgeProps = {
  status: AssetStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
