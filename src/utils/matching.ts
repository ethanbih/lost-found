import type { LostAsset } from "@/types/asset";
import type { LostReport } from "@/types/lostReport";

export type MatchLevel = "high" | "medium" | "low";

export type MatchSuggestion = {
  id: string;
  asset: LostAsset;
  report: LostReport;
  level: MatchLevel;
  reasons: string[];
  score: number;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ");

const words = (value: string) =>
  normalize(value)
    .split(/\s+/)
    .filter((word) => word.length >= 3);

const hasSharedWord = (left: string, right: string) => {
  const rightWords = new Set(words(right));
  return words(left).some((word) => rightWords.has(word));
};

export function buildMatchSuggestions(
  assets: LostAsset[],
  reports: LostReport[],
): MatchSuggestion[] {
  const openAssets = assets.filter((asset) => asset.status !== "returned");
  const openReports = reports.filter(
    (report) => !["resolved", "cancelled"].includes(report.status),
  );

  return openAssets
    .flatMap((asset) =>
      openReports.map((report) => {
        const reasons: string[] = [];
        let score = 0;

        if (asset.category === report.category) {
          score += 3;
          reasons.push("Cùng loại");
        }

        if (hasSharedWord(asset.name, report.itemName)) {
          score += 2;
          reasons.push("Tên gần giống");
        }

        if (
          hasSharedWord(asset.description, report.description) ||
          hasSharedWord(asset.description, report.identifyingMarks ?? "")
        ) {
          score += 2;
          reasons.push("Mô tả có từ khóa giống nhau");
        }

        if (hasSharedWord(asset.foundLocation, report.suspectedLocation)) {
          score += 2;
          reasons.push("Khu vực gần giống");
        }

        const level: MatchLevel =
          score >= 7 ? "high" : score >= 5 ? "medium" : "low";

        return {
          id: `${asset.id}-${report.id}`,
          asset,
          report,
          level,
          reasons,
          score,
        };
      }),
    )
    .filter((suggestion) => suggestion.score >= 5)
    .sort((left, right) => right.score - left.score);
}
