import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  type AssetCategory,
  type AssetFormValues,
  type AssetStatus,
  type LostAsset,
} from "@/types/asset";

type AssetFormProps = {
  initialAsset?: LostAsset;
  onSubmit: (values: AssetFormValues) => void;
  onCancel: () => void;
};

const categoryOptions = Object.entries(CATEGORY_LABELS) as [
  AssetCategory,
  string,
][];

const statusOptions = Object.entries(STATUS_LABELS) as [AssetStatus, string][];

const emptyValues: AssetFormValues = {
  ticketCode: "",
  name: "",
  category: "other",
  foundLocation: "",
  foundAt: "",
  receivedBy: "",
  status: "stored",
  description: "",
  storageLocation: "",
  reporterName: "",
  reporterPhone: "",
};

const toFormValues = (asset?: LostAsset): AssetFormValues =>
  asset
    ? {
        ticketCode: asset.ticketCode,
        name: asset.name,
        category: asset.category,
        foundLocation: asset.foundLocation,
        foundAt: asset.foundAt,
        receivedBy: asset.receivedBy,
        status: asset.status,
        description: asset.description,
        storageLocation: asset.storageLocation,
        reporterName: asset.reporterName ?? "",
        reporterPhone: asset.reporterPhone ?? "",
      }
    : emptyValues;

export default function AssetForm({
  initialAsset,
  onSubmit,
  onCancel,
}: AssetFormProps) {
  const values = toFormValues(initialAsset);

  return (
    <form
      className="asset-form"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        onSubmit({
          ticketCode: String(formData.get("ticketCode") ?? "").trim(),
          name: String(formData.get("name") ?? "").trim(),
          category: String(formData.get("category")) as AssetCategory,
          foundLocation: String(formData.get("foundLocation") ?? "").trim(),
          foundAt: String(formData.get("foundAt") ?? ""),
          receivedBy: String(formData.get("receivedBy") ?? "").trim(),
          status: String(formData.get("status")) as AssetStatus,
          description: String(formData.get("description") ?? "").trim(),
          storageLocation: String(formData.get("storageLocation") ?? "").trim(),
          reporterName: String(formData.get("reporterName") ?? "").trim(),
          reporterPhone: String(formData.get("reporterPhone") ?? "").trim(),
        });
      }}
    >
      <div className="form-grid">
        <label>
          <span>Mã phiếu</span>
          <input
            name="ticketCode"
            defaultValue={values.ticketCode}
            placeholder="VD: TS-2026-007"
            required
          />
        </label>
        <label>
          <span>Tên tài sản</span>
          <input
            name="name"
            defaultValue={values.name}
            placeholder="VD: Ví, điện thoại, balo"
            required
          />
        </label>
        <label>
          <span>Loại tài sản</span>
          <select name="category" defaultValue={values.category}>
            {categoryOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Trạng thái</span>
          <select name="status" defaultValue={values.status}>
            {statusOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Vị trí nhặt được</span>
          <input
            name="foundLocation"
            defaultValue={values.foundLocation}
            placeholder="VD: Sảnh chờ khoa khám bệnh"
            required
          />
        </label>
        <label>
          <span>Thời gian nhặt được</span>
          <input
            name="foundAt"
            type="datetime-local"
            defaultValue={values.foundAt}
            required
          />
        </label>
        <label>
          <span>Người tiếp nhận</span>
          <input
            name="receivedBy"
            defaultValue={values.receivedBy}
            placeholder="Họ tên nhân viên bảo vệ"
            required
          />
        </label>
        <label>
          <span>Nơi lưu giữ</span>
          <input
            name="storageLocation"
            defaultValue={values.storageLocation}
            placeholder="VD: Tủ A - Ngăn 02"
            required
          />
        </label>
        <label>
          <span>Người báo nhặt được</span>
          <input name="reporterName" defaultValue={values.reporterName} />
        </label>
        <label>
          <span>Số điện thoại người báo</span>
          <input name="reporterPhone" defaultValue={values.reporterPhone} />
        </label>
        <label className="field-wide">
          <span>Mô tả tài sản</span>
          <textarea
            name="description"
            defaultValue={values.description}
            rows={4}
            placeholder="Ghi đặc điểm nhận dạng, giấy tờ đi kèm, tình trạng..."
            required
          />
        </label>
      </div>
      <div className="form-actions">
        <button className="button button--ghost" type="button" onClick={onCancel}>
          Hủy
        </button>
        <button className="button button--primary" type="submit">
          {initialAsset ? "Lưu thay đổi" : "Thêm tài sản"}
        </button>
      </div>
    </form>
  );
}
