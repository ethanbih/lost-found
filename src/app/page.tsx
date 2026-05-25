"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import AssetDetail from "@/components/AssetDetail";
import AssetForm from "@/components/AssetForm";
import AssetStats from "@/components/AssetStats";
import AssetTable from "@/components/AssetTable";
import { mockAssets } from "@/mock/assets";
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  type AssetCategory,
  type AssetFormValues,
  type AssetStatus,
  type HandoverInfo,
  type LostAsset,
} from "@/types/asset";

type PanelMode = "list" | "add" | "edit" | "detail" | "return";

const categoryOptions = Object.entries(CATEGORY_LABELS) as [
  AssetCategory,
  string,
][];

const statusOptions = Object.entries(STATUS_LABELS) as [AssetStatus, string][];

const makeId = () =>
  `asset-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const nowForInput = () => new Date().toISOString().slice(0, 16);

export default function Home() {
  const [assets, setAssets] = useState<LostAsset[]>(mockAssets);
  const [mode, setMode] = useState<PanelMode>("list");
  const [selectedAsset, setSelectedAsset] = useState<LostAsset | undefined>();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | "all">(
    "all",
  );

  const filteredAssets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return assets.filter((asset) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [asset.ticketCode, asset.name, asset.description]
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
  };

  const handleAdd = (values: AssetFormValues) => {
    const timestamp = nowForInput();
    setAssets((current) => [
      {
        ...values,
        id: makeId(),
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      ...current,
    ]);
    closePanel();
  };

  const handleEdit = (values: AssetFormValues) => {
    if (!selectedAsset) {
      return;
    }

    setAssets((current) =>
      current.map((asset) =>
        asset.id === selectedAsset.id
          ? {
              ...asset,
              ...values,
              updatedAt: nowForInput(),
            }
          : asset,
      ),
    );
    closePanel();
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
            }
          : asset,
      ),
    );
    closePanel();
  };

  const openPanel = (nextMode: PanelMode, asset?: LostAsset) => {
    setSelectedAsset(asset);
    setMode(nextMode);
  };

  return (
    <main className="app-shell">
      <section className="hero-section">
        <div>
          <span className="eyebrow">Tổ bảo vệ</span>
          <h1>Quản lý tài sản thất lạc</h1>
          <p>
            Ghi nhận, theo dõi lưu giữ và bàn giao tài sản cho bệnh viện hoặc
            trung tâm với thao tác rõ ràng, dễ dùng.
          </p>
        </div>
        <button
          className="button button--primary"
          type="button"
          onClick={() => openPanel("add")}
        >
          Thêm tài sản
        </button>
      </section>

      <AssetStats assets={assets} />

      <section className="content-grid">
        <div className="main-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Danh sách</span>
              <h2>Tài sản thất lạc</h2>
            </div>
            <span className="result-count">{filteredAssets.length} kết quả</span>
          </div>

          <div className="filter-bar">
            <label className="search-field">
              <span>Tìm kiếm</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nhập mã phiếu, tên tài sản hoặc mô tả"
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
              <span>Loại tài sản</span>
              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value as AssetCategory | "all")
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
            onView={(asset) => openPanel("detail", asset)}
            onEdit={(asset) => openPanel("edit", asset)}
            onReturn={(asset) => openPanel("return", asset)}
          />
        </div>

        <aside className="side-panel" aria-live="polite">
          {mode === "list" ? (
            <div className="helper-panel">
              <span className="eyebrow">Hướng dẫn nhanh</span>
              <h2>Chọn một tài sản để xem chi tiết</h2>
              <p>
                Nhân viên có thể dùng các nút Xem, Sửa hoặc Trả trong bảng. Dữ
                liệu hiện là mock frontend và sẽ trở về mặc định khi tải lại
                trang.
              </p>
            </div>
          ) : null}

          {mode === "add" ? (
            <Panel title="Thêm tài sản mới" onClose={closePanel}>
              <AssetForm onSubmit={handleAdd} onCancel={closePanel} />
            </Panel>
          ) : null}

          {mode === "edit" && selectedAsset ? (
            <Panel title="Sửa thông tin tài sản" onClose={closePanel}>
              <AssetForm
                initialAsset={selectedAsset}
                onSubmit={handleEdit}
                onCancel={closePanel}
              />
            </Panel>
          ) : null}

          {mode === "detail" && selectedAsset ? (
            <Panel title="Chi tiết tài sản" onClose={closePanel}>
              <AssetDetail asset={selectedAsset} />
            </Panel>
          ) : null}

          {mode === "return" && selectedAsset ? (
            <Panel title="Xác nhận đã trả tài sản" onClose={closePanel}>
              <ReturnForm
                asset={selectedAsset}
                onCancel={closePanel}
                onSubmit={handleReturn}
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
          <span>Họ tên người nhận</span>
          <input name="receiverName" required placeholder="Nhập họ tên đầy đủ" />
        </label>
        <label>
          <span>Số điện thoại người nhận</span>
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
            placeholder="Ghi cách xác minh chủ sở hữu, tình trạng tài sản khi trả..."
          />
        </label>
      </div>
      <div className="form-actions">
        <button className="button button--ghost" type="button" onClick={onCancel}>
          Hủy
        </button>
        <button className="button button--primary" type="submit">
          Xác nhận đã trả
        </button>
      </div>
    </form>
  );
}
