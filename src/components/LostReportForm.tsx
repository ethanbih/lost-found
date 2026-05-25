import {
  CATEGORY_LABELS,
  type AssetCategory,
} from "@/types/asset";
import {
  REPORTER_ROLE_LABELS,
  type LostReportFormValues,
  type ReporterRole,
} from "@/types/lostReport";

type LostReportFormProps = {
  onSubmit: (values: LostReportFormValues) => void;
  compact?: boolean;
};

const categoryOptions = Object.entries(CATEGORY_LABELS) as [
  AssetCategory,
  string,
][];

const roleOptions = Object.entries(REPORTER_ROLE_LABELS) as [
  ReporterRole,
  string,
][];

export default function LostReportForm({
  onSubmit,
  compact = false,
}: LostReportFormProps) {
  return (
    <form
      className={`asset-form ${compact ? "asset-form--compact" : ""}`}
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onSubmit({
          reporterName: String(formData.get("reporterName") ?? "").trim(),
          reporterPhone: String(formData.get("reporterPhone") ?? "").trim(),
          reporterRole: String(formData.get("reporterRole")) as ReporterRole,
          itemName: String(formData.get("itemName") ?? "").trim(),
          category: String(formData.get("category")) as AssetCategory,
          description: String(formData.get("description") ?? "").trim(),
          suspectedLocation: String(
            formData.get("suspectedLocation") ?? "",
          ).trim(),
          suspectedLostAt: String(formData.get("suspectedLostAt") ?? ""),
          identifyingMarks: String(
            formData.get("identifyingMarks") ?? "",
          ).trim(),
          note: String(formData.get("note") ?? "").trim(),
        });
        event.currentTarget.reset();
      }}
    >
      <fieldset>
        <legend>Thông tin người báo mất</legend>
        <div className="form-grid">
          <label>
            <span>Họ tên *</span>
            <input name="reporterName" required placeholder="Nhập họ tên" />
          </label>
          <label>
            <span>Số điện thoại *</span>
            <input
              name="reporterPhone"
              required
              placeholder="Số điện thoại liên hệ"
            />
          </label>
          <label className="field-wide">
            <span>Vai trò</span>
            <select name="reporterRole" defaultValue="patient">
              {roleOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Thông tin đồ vật bị mất</legend>
        <div className="form-grid">
          <label>
            <span>Tên đồ vật *</span>
            <input name="itemName" required placeholder="VD: ví, điện thoại" />
          </label>
          <label>
            <span>Loại đồ vật *</span>
            <select name="category" defaultValue="other">
              {categoryOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="field-wide">
            <span>Mô tả chi tiết *</span>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Mô tả màu sắc, nhãn hiệu, giấy tờ hoặc vật đi kèm"
            />
          </label>
          <label>
            <span>Khu vực nghi bị mất *</span>
            <input
              name="suspectedLocation"
              required
              placeholder="VD: Sảnh khoa xét nghiệm"
            />
          </label>
          <label>
            <span>Thời gian nghi bị mất</span>
            <input name="suspectedLostAt" type="datetime-local" />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Thông tin bổ sung</legend>
        <div className="form-grid">
          <label className="field-wide">
            <span>Dấu hiệu nhận biết</span>
            <textarea
              name="identifyingMarks"
              rows={3}
              placeholder="Dấu hiệu riêng giúp xác minh đúng chủ sở hữu"
            />
          </label>
          <label className="field-wide">
            <span>Ghi chú thêm</span>
            <textarea name="note" rows={3} placeholder="Thông tin cần hỗ trợ" />
          </label>
        </div>
      </fieldset>

      <div className="form-actions">
        <button className="button button--primary" type="submit">
          Gửi báo mất đồ vật
        </button>
      </div>
    </form>
  );
}
