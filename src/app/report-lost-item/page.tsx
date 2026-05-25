"use client";

import { useState } from "react";
import LostReportForm from "@/components/LostReportForm";
import type { LostReportFormValues } from "@/types/lostReport";

const nowForInput = () => new Date().toISOString().slice(0, 16);

const makeReportCode = (count: number) =>
  `BM-2026-${String(count).padStart(4, "0")}`;

export default function ReportLostItemPage() {
  const [submittedCodes, setSubmittedCodes] = useState<string[]>([]);
  const latestCode = submittedCodes.at(-1);

  const handleSubmit = (values: LostReportFormValues) => {
    const timestamp = nowForInput();

    try {
      const storedReports = JSON.parse(
        window.localStorage.getItem("publicLostReports") ?? "[]",
      ) as unknown[];
      const code = makeReportCode(storedReports.length + 1);
      window.localStorage.setItem(
        "publicLostReports",
        JSON.stringify([
          ...storedReports,
          {
            ...values,
            code,
            createdAt: timestamp,
          },
        ]),
      );
      setSubmittedCodes((current) => [...current, code]);
    } catch {
      const code = makeReportCode(submittedCodes.length + 1);
      setSubmittedCodes((current) => [...current, code]);
      // Local storage is optional for this frontend-only MVP.
    }
  };

  return (
    <main className="public-shell">
      <section className="public-card">
        <div className="public-heading">
          <span className="eyebrow">Lost Found</span>
          <h1>Báo mất đồ vật</h1>
          <p>
            Vui lòng cung cấp thông tin để tổ bảo vệ hỗ trợ kiểm tra và liên hệ
            khi tìm thấy đồ vật phù hợp.
          </p>
        </div>

        {latestCode ? (
          <div className="success-box" role="status">
            <h2>Đã ghi nhận báo mất đồ vật</h2>
            <p>
              Mã báo mất của bạn là: <strong>{latestCode}</strong>
            </p>
            <p>
              Tổ bảo vệ sẽ kiểm tra và liên hệ theo số điện thoại đã cung cấp
              nếu tìm thấy đồ vật phù hợp.
            </p>
            <button
              className="button button--ghost"
              type="button"
              onClick={() => setSubmittedCodes([])}
            >
              Gửi báo mất khác
            </button>
          </div>
        ) : (
          <LostReportForm onSubmit={handleSubmit} compact />
        )}
      </section>
    </main>
  );
}
