"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import AssetDetail from "@/components/AssetDetail";
import AssetForm from "@/components/AssetForm";
import AssetStats from "@/components/AssetStats";
import AssetTable from "@/components/AssetTable";
import LostReportTable from "@/components/LostReportTable";
import MatchSuggestions from "@/components/MatchSuggestions";
import { mockAssets } from "@/mock/assets";
import { mockLostReports } from "@/mock/lostReports";
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  type AssetCategory,
  type AssetFormValues,
  type AssetStatus,
  type HandoverInfo,
  type LostAsset,
} from "@/types/asset";
import {
  LOST_REPORT_STATUS_LABELS,
  REPORTER_ROLE_LABELS,
  type LostReport,
  type LostReportStatus,
} from "@/types/lostReport";
import { buildMatchSuggestions } from "@/utils/matching";

type PanelMode = "list" | "add" | "edit" | "detail" | "return" | "report";
type ActiveTab = "found" | "reports" | "matches";

const categoryOptions = Object.entries(CATEGORY_LABELS) as [
  AssetCategory,
  string,
][];

const statusOptions = Object.entries(STATUS_LABELS) as [AssetStatus, string][];

const makeId = () =>
  `asset-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const nowForInput = () => new Date().toISOString().slice(0, 16);

const formatDateTime = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value))
    : "Chưa ghi nhận";

export default function Home() {
  const [assets, setAssets] = useState<LostAsset[]>(mockAssets);
  const [lostReports, setLostReports] = useState<LostReport[]>(mockLostReports);
  const [activeTab, setActiveTab] = useState<ActiveTab>("found");
  const [mode, setMode] = useState<PanelMode>("list");
  const [selectedAsset, setSelectedAsset] = useState<LostAsset | undefined>();
  const [selectedReport, setSelectedReport] = useState<LostReport | undefined>();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | "all">(
    "all",
  );

  const matchSuggestions = useMemo(
    () => buildMatchSuggestions(assets, lostReports),
    [assets, lostReports],
  );

  const filteredAssets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return assets.filter((asset) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [asset.ticketCode, asset.name, asset.description, asset.note]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesStatus =
        statusFilter === "all" || asset.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || asset.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [assets, categoryFilter, search, statusFilter]);

  const closePanel = () => {
    setMode("list");
    setSelectedAsset(undefined);
    setSelectedReport(undefined);
  };

  const cancelAssetForm = () => {
    if (mode === "edit" && selectedAsset) {
      setMode("detail");
      return;
    }

    setActiveTab("found");
    closePanel();
  };

  const handleAdd = (values: AssetFormValues) => {
    const timestamp = nowForInput();
    const newAsset: LostAsset = {
      ...values,
      id: makeId(),
      createdAt: timestamp,
      updatedAt: timestamp,
      history: [
        {
          time: timestamp,
          actor: values.receivedBy,
          action: "Tiếp nhận đồ vật nhặt được",
          note: values.note || "Tạo phiếu đồ vật thất lạc.",
        },
      ],
    };

    setAssets((current) => [newAsset, ...current]);
    setActiveTab("found");
    setSelectedAsset(newAsset);
    setSelectedReport(undefined);
    setMode("detail");
  };

  const handleEdit = (values: AssetFormValues) => {
    if (!selectedAsset) {
      return;
    }

    const timestamp = nowForInput();
    const updatedAsset: LostAsset = {
      ...selectedAsset,
      ...values,
      updatedAt: timestamp,
      history: [
        ...selectedAsset.history,
        {
          time: timestamp,
          actor: values.receivedBy,
          action: "Cập nhật thông tin đồ vật",
          note: values.note || "Nhân viên đã chỉnh sửa phiếu.",
        },
      ],
    };

    setAssets((current) =>
      current.map((asset) =>
        asset.id === selectedAsset.id ? updatedAsset : asset,
      ),
    );
    setSelectedAsset(updatedAsset);
    setSelectedReport(undefined);
    setMode("detail");
  };

  const handleReturn = (handover: HandoverInfo) => {
    if (!selectedAsset) {
      return;
    }

    setAssets((current) =>
      current.map((asset) =>
        asset.id === selectedAsset.id
          ? {
              ...asset,
              status: "returned",
              handover,
              updatedAt: handover.returnedAt,
              history: [
                ...asset.history,
                {
                  time: handover.returnedAt,
                  actor: handover.handedOverBy,
                  action: `Đã bàn giao đồ vật cho ${handover.receiverName}`,
                  note: handover.handoverNote || "Đã xác nhận bàn giao đồ vật.",
                },
              ],
            }
          : asset,
      ),
    );
    closePanel();
  };

  const handleReportStatusChange = (
    report: LostReport,
    status: LostReportStatus,
  ) => {
    const timestamp = nowForInput();
    setLostReports((current) =>
      current.map((item) =>
        item.id === report.id ? { ...item, status, updatedAt: timestamp } : item,
      ),
    );
    if (selectedReport?.id === report.id) {
      setSelectedReport({ ...report, status, updatedAt: timestamp });
    }
  };

  const openAssetPanel = (nextMode: PanelMode, asset?: LostAsset) => {
    setSelectedAsset(asset);
    setSelectedReport(undefined);
    if (nextMode === "add" || nextMode === "edit") {
      setActiveTab("found");
    }
    setMode(nextMode);
  };

  const openReportPanel = (report: LostReport) => {
    setSelectedReport(report);
    setSelectedAsset(undefined);
    setMode("report");
  };

  if (mode === "add" || mode === "edit") {
    return (
      <main className="app-shell form-workspace">
        <header className="top-header">
          <strong>Lost Found</strong>
          <span>Module trực ban bảo vệ</span>
        </header>

        <section className="form-view">
          <div className="form-view__header">
            <div>
              <button
                className="back-button"
                type="button"
                onClick={cancelAssetForm}
              >
                ← Quay lại
              </button>
              <span className="eyebrow">Đồ vật nhặt được</span>
              <h1>
                {mode === "add"
                  ? "Tiếp nhận đồ vật nhặt được"
                  : "Chỉnh sửa thông tin đồ vật"}
              </h1>
            </div>
            <p>
              Nhập thông tin rõ ràng để tổ bảo vệ dễ đối chiếu, lưu giữ và bàn
              giao đúng người nhận đồ.
            </p>
          </div>

          <AssetForm
            initialAsset={mode === "edit" ? selectedAsset : undefined}
            onSubmit={mode === "add" ? handleAdd : handleEdit}
            onCancel={cancelAssetForm}
            submitLabel={
              mode === "add" ? "Lưu phiếu tiếp nhận" : "Lưu thay đổi"
            }
            cancelLabel={mode === "add" ? "Hủy nhập liệu" : "Hủy"}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="top-header">
        <strong>Lost Found</strong>
        <span>Module trực ban bảo vệ</span>
      </header>

      <section className="hero-section">
        <div>
          <span className="eyebrow">Tổ bảo vệ</span>
          <h1>Quản lý đồ vật thất lạc</h1>
          <p>
            Theo dõi đồ vật nhặt được, báo mất và bàn giao cho người nhận đồ.
          </p>
        </div>
        <button
          className="button button--primary"
          type="button"
          onClick={() => openAssetPanel("add")}
        >
          + Tiếp nhận đồ vật nhặt được
        </button>
      </section>

      <AssetStats
        assets={assets}
        reports={lostReports}
        matchCount={matchSuggestions.length}
      />

      <div className="tab-list" role="tablist" aria-label="Khu vực quản lý">
        <button
          className={activeTab === "found" ? "tab-button active" : "tab-button"}
          type="button"
          onClick={() => setActiveTab("found")}
        >
          Đồ vật nhặt được
        </button>
        <button
          className={
            activeTab === "reports" ? "tab-button active" : "tab-button"
          }
          type="button"
          onClick={() => setActiveTab("reports")}
        >
          Báo mất đồ vật
        </button>
        <button
          className={
            activeTab === "matches" ? "tab-button active" : "tab-button"
          }
          type="button"
          onClick={() => setActiveTab("matches")}
        >
          Gợi ý trùng khớp
        </button>
      </div>

      <section className="content-grid">
        <div className="main-panel">
          {activeTab === "found" ? (
            <>
              <div className="panel-header">
                <div>
                  <span className="eyebrow">Danh sách</span>
                  <h2>Đồ vật thất lạc</h2>
                </div>
                <span className="result-count">
                  {filteredAssets.length} kết quả
                </span>
              </div>

              <div className="filter-bar">
                <label className="search-field">
                  <span>Tìm kiếm</span>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Nhập mã phiếu, tên đồ vật hoặc mô tả"
                  />
                </label>
                <label>
                  <span>Trạng thái</span>
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value as AssetStatus | "all")
                    }
                  >
                    <option value="all">Tất cả trạng thái</option>
                    {statusOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Loại đồ vật</span>
                  <select
                    value={categoryFilter}
                    onChange={(event) =>
                      setCategoryFilter(
                        event.target.value as AssetCategory | "all",
                      )
                    }
                  >
                    <option value="all">Tất cả loại</option>
                    {categoryOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <AssetTable
                assets={filteredAssets}
                onView={(asset) => openAssetPanel("detail", asset)}
                onEdit={(asset) => openAssetPanel("edit", asset)}
                onReturn={(asset) => openAssetPanel("return", asset)}
              />
            </>
          ) : null}

          {activeTab === "reports" ? (
            <>
              <div className="panel-header">
                <div>
                  <span className="eyebrow">Công khai</span>
                  <h2>Báo mất đồ vật</h2>
                </div>
                <span className="result-count">
                  {lostReports.length} báo mất
                </span>
              </div>
              <LostReportTable
                reports={lostReports}
                onView={openReportPanel}
                onStatusChange={handleReportStatusChange}
              />
            </>
          ) : null}

          {activeTab === "matches" ? (
            <>
              <div className="panel-header">
                <div>
                  <span className="eyebrow">Đối soát MVP</span>
                  <h2>Gợi ý trùng khớp</h2>
                </div>
                <span className="result-count">
                  {matchSuggestions.length} gợi ý
                </span>
              </div>
              <MatchSuggestions
                suggestions={matchSuggestions}
                onViewAsset={(asset) => openAssetPanel("detail", asset)}
                onViewReport={openReportPanel}
                onContacted={(report) =>
                  handleReportStatusChange(report, "contacted")
                }
                onReturnAsset={(asset) => openAssetPanel("return", asset)}
              />
            </>
          ) : null}
        </div>

        <aside className="side-panel" aria-live="polite">
          {mode === "list" ? (
            <div className="helper-panel">
              <span className="eyebrow">Hướng dẫn nhanh</span>
              <h2>Chọn một dòng để xem chi tiết</h2>
              <p>
                Nhân viên có thể xem đồ vật nhặt được, theo dõi báo mất, gọi
                người báo mất và xác nhận bàn giao khi đúng chủ sở hữu.
              </p>
            </div>
          ) : null}

          {mode === "detail" && selectedAsset ? (
            <Panel title="Chi tiết đồ vật" onClose={closePanel}>
              <AssetDetail asset={selectedAsset} />
            </Panel>
          ) : null}

          {mode === "return" && selectedAsset ? (
            <Panel title="Xác nhận bàn giao đồ vật" onClose={closePanel}>
              <ReturnForm
                asset={selectedAsset}
                onCancel={closePanel}
                onSubmit={handleReturn}
              />
            </Panel>
          ) : null}

          {mode === "report" && selectedReport ? (
            <Panel title="Chi tiết báo mất" onClose={closePanel}>
              <LostReportDetail
                report={selectedReport}
                onStatusChange={handleReportStatusChange}
              />
            </Panel>
          ) : null}
        </aside>
      </section>
    </main>
  );
}

function Panel({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="panel-card">
      <div className="panel-card__header">
        <h2>{title}</h2>
        <button type="button" onClick={onClose} aria-label="Đóng">
          Đóng
        </button>
      </div>
      {children}
    </div>
  );
}

function ReturnForm({
  asset,
  onSubmit,
  onCancel,
}: {
  asset: LostAsset;
  onSubmit: (handover: HandoverInfo) => void;
  onCancel: () => void;
}) {
  return (
    <form
      className="asset-form"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onSubmit({
          receiverName: String(formData.get("receiverName") ?? "").trim(),
          receiverPhone: String(formData.get("receiverPhone") ?? "").trim(),
          receiverId: String(formData.get("receiverId") ?? "").trim(),
          handedOverBy: String(formData.get("handedOverBy") ?? "").trim(),
          handoverNote: String(formData.get("handoverNote") ?? "").trim(),
          returnedAt: nowForInput(),
        });
      }}
    >
      <div className="return-summary">
        <span>{asset.ticketCode}</span>
        <strong>{asset.name}</strong>
      </div>
      <div className="form-grid">
        <label>
          <span>Họ tên người nhận đồ</span>
          <input name="receiverName" required placeholder="Nhập họ tên đầy đủ" />
        </label>
        <label>
          <span>Số điện thoại người nhận đồ</span>
          <input name="receiverPhone" required placeholder="Nhập số điện thoại" />
        </label>
        <label>
          <span>CCCD/CMND nếu có</span>
          <input name="receiverId" placeholder="Có thể bỏ trống" />
        </label>
        <label>
          <span>Người bàn giao</span>
          <input
            name="handedOverBy"
            required
            defaultValue={asset.receivedBy}
            placeholder="Họ tên người bàn giao"
          />
        </label>
        <label className="field-wide">
          <span>Ghi chú bàn giao</span>
          <textarea
            name="handoverNote"
            rows={4}
            placeholder="Ghi cách xác minh chủ sở hữu, tình trạng đồ vật khi bàn giao..."
          />
        </label>
      </div>
      <div className="form-actions">
        <button className="button button--ghost" type="button" onClick={onCancel}>
          Hủy
        </button>
        <button className="button button--primary" type="submit">
          Xác nhận bàn giao đồ vật
        </button>
      </div>
    </form>
  );
}

function LostReportDetail({
  report,
  onStatusChange,
}: {
  report: LostReport;
  onStatusChange: (report: LostReport, status: LostReportStatus) => void;
}) {
  const rows = [
    ["Mã báo mất", report.reportCode],
    ["Đồ vật", report.itemName],
    ["Loại", CATEGORY_LABELS[report.category]],
    ["Mô tả", report.description],
    ["Khu vực nghi mất", report.suspectedLocation],
    ["Thời gian nghi mất", formatDateTime(report.suspectedLostAt)],
    ["Người báo mất", report.reporterName],
    ["Số điện thoại", report.reporterPhone],
    ["Vai trò", REPORTER_ROLE_LABELS[report.reporterRole]],
    ["Trạng thái", LOST_REPORT_STATUS_LABELS[report.status]],
    ["Dấu hiệu nhận biết", report.identifyingMarks || "Không có"],
    ["Ghi chú thêm", report.note || "Không có"],
  ];

  return (
    <div className="detail-panel">
      <dl className="detail-list">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="table-actions">
        <button type="button" onClick={() => onStatusChange(report, "contacted")}>
          Đánh dấu đã liên hệ
        </button>
        <button type="button" onClick={() => onStatusChange(report, "resolved")}>
          Đánh dấu đã xử lý
        </button>
        <button type="button" onClick={() => onStatusChange(report, "cancelled")}>
          Hủy báo mất
        </button>
      </div>
    </div>
  );
}
