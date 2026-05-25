# lost-found

Module quản lý đồ vật thất lạc cho tổ bảo vệ trong bệnh viện/trung tâm.

## Công nghệ

- Next.js App Router
- TypeScript
- CSS thuần trong `src/app/globals.css`
- Mock data và local state phía frontend
- Không dùng Tailwind
- Chưa dùng backend

## Mục tiêu

`lost-found` hỗ trợ tổ bảo vệ tiếp nhận đồ vật nhặt được, ghi nhận báo mất đồ vật, đối chiếu gợi ý trùng khớp và bàn giao đồ vật cho đúng người nhận sau khi xác minh.

## Flow nghiệp vụ

1. Khách mất đồ tìm bảo vệ để được hỗ trợ.
2. Bảo vệ kiểm tra danh sách đồ vật nhặt được trong app nội bộ.
3. Nếu có đồ vật phù hợp, bảo vệ xác minh thông tin và bàn giao đồ vật.
4. Nếu chưa có, bảo vệ hướng dẫn khách dùng link public `/report-lost-item` để báo mất đồ vật.
5. Khi có đồ vật nhặt được mới, hệ thống gợi ý trùng với các báo mất đang mở.
6. Bảo vệ liên hệ người báo mất và bàn giao nếu xác minh đúng.

## Chức năng hiện có

- Dashboard thống kê.
- Tab `Đồ vật nhặt được`.
- Tab `Báo mất đồ vật`.
- Tab `Gợi ý trùng khớp`.
- Tiếp nhận đồ vật nhặt được bằng view nhập liệu riêng.
- Báo mất đồ vật công khai tại `/report-lost-item`.
- Chỉnh sửa thông tin đồ vật.
- Xem chi tiết đồ vật và báo mất.
- Xác nhận bàn giao đồ vật.
- Chuyển trạng thái báo mất: đang tìm, có gợi ý trùng, đã liên hệ, đã xử lý, đã hủy.
- Trạng thái đồ vật có `pending_disposal` để phục vụ luồng chờ xử lý.
- Lịch sử xử lý cho đồ vật.
- Mobile responsive cho dashboard, tab, bảng và form.

## Cấu trúc thư mục chính

```text
src/
  app/
    globals.css                 # CSS toàn cục
    layout.tsx                  # Root layout
    page.tsx                    # App quản lý nội bộ
    report-lost-item/
      page.tsx                  # Trang public báo mất đồ vật
  components/
    AssetDetail.tsx             # Chi tiết đồ vật nhặt được
    AssetForm.tsx               # Form tiếp nhận/chỉnh sửa đồ vật
    AssetStats.tsx              # Card thống kê dashboard
    AssetTable.tsx              # Bảng đồ vật nhặt được
    LostReportForm.tsx          # Form báo mất đồ vật
    LostReportTable.tsx         # Bảng báo mất đồ vật
    MatchSuggestions.tsx        # Gợi ý trùng khớp
    StatusBadge.tsx             # Badge trạng thái đồ vật
  mock/
    assets.ts                   # Mock đồ vật nhặt được
    lostReports.ts              # Mock báo mất đồ vật
  types/
    asset.ts                    # Types/labels cho đồ vật
    lostReport.ts               # Types/labels cho báo mất
  utils/
    matching.ts                 # Logic matching MVP
```

## Cách chạy local

```bash
npm install
npm run dev
npm run lint
npm run build
```

App nội bộ chạy tại:

```text
http://localhost:3000
```

Trang public báo mất chạy tại:

```text
http://localhost:3000/report-lost-item
```

## Ghi chú hiện tại

- Chưa có backend.
- Dữ liệu đang dùng mock/local state.
- Dữ liệu đồ vật nhặt được nằm trong `src/mock/assets.ts`.
- Dữ liệu báo mất mẫu nằm trong `src/mock/lostReports.ts`.
- Trang `/report-lost-item` hiện là public route mô phỏng, chưa có lưu DB thật.
- Báo mất public chỉ hiển thị mã báo mất vừa tạo, không hiển thị danh sách đồ vật nhặt được.
- Khi reload app nội bộ, state quay về mock ban đầu.

## API contract đề xuất cho dev backend

### Đồ vật nhặt được

#### `GET /api/lost-items`

Lấy danh sách đồ vật nhặt được.

Query đề xuất:

- `search`: tìm theo mã phiếu, tên đồ vật, mô tả
- `status`: `stored | returned | pending_disposal | disposed`
- `category`: `documents | money | phone | electronics | keys | bag | clothing | other`
- `page`, `limit`: phân trang

#### `GET /api/lost-items/:id`

Lấy chi tiết một đồ vật, bao gồm thông tin bàn giao và lịch sử xử lý.

#### `POST /api/lost-items`

Tạo phiếu tiếp nhận đồ vật nhặt được.

```json
{
  "ticketCode": "TS-2026-001",
  "name": "Ví da màu nâu",
  "category": "documents",
  "description": "Có CCCD và thẻ bảo hiểm y tế",
  "foundLocation": "Khu khám bệnh",
  "foundAt": "2026-05-24T09:20",
  "finderName": "Trần Thị Hoa",
  "finderPhone": "0901234567",
  "receivedBy": "Nguyễn Văn Minh",
  "storageLocation": "Tủ A - Ngăn 02",
  "note": "Đã niêm phong"
}
```

#### `PUT /api/lost-items/:id`

Cập nhật thông tin đồ vật.

#### `POST /api/lost-items/:id/return`

Xác nhận bàn giao đồ vật và chuyển trạng thái sang `returned`.

```json
{
  "receiverName": "Lê Ngọc Lan",
  "receiverPhone": "0918888999",
  "receiverId": "079198765432",
  "handedOverBy": "Phạm Quốc Bảo",
  "handoverNote": "Người nhận mở khóa máy và đối chiếu CCCD khớp thông tin"
}
```

#### `PATCH /api/lost-items/:id/status`

Cập nhật trạng thái đồ vật.

```json
{
  "status": "pending_disposal",
  "actor": "Nguyễn Văn Minh",
  "note": "Chưa xác minh được chủ sở hữu"
}
```

#### `GET /api/lost-items/:id/logs`

Lấy lịch sử xử lý của một đồ vật.

### Báo mất đồ vật

#### `GET /api/lost-reports`

Lấy danh sách báo mất đồ vật cho app nội bộ.

Query đề xuất:

- `search`: tìm theo mã báo mất, tên đồ vật, mô tả, người báo mất, số điện thoại
- `status`: `searching | matched | contacted | resolved | cancelled`
- `category`: loại đồ vật
- `page`, `limit`: phân trang

#### `GET /api/lost-reports/:id`

Lấy chi tiết một báo mất.

#### `POST /api/lost-reports`

Tạo báo mất từ trang public `/report-lost-item`.

```json
{
  "reporterName": "Phạm Minh Khang",
  "reporterPhone": "0977000111",
  "reporterRole": "relative",
  "itemName": "Balo xanh có sổ khám bệnh",
  "category": "bag",
  "description": "Balo xanh đậm, bên trong có sổ khám bệnh và áo khoác",
  "suspectedLocation": "Nhà thuốc bệnh viện",
  "suspectedLostAt": "2026-05-22T11:30",
  "identifyingMarks": "Ngăn ngoài có bình nước màu xám",
  "note": "Cần hỗ trợ tìm lại"
}
```

#### `PATCH /api/lost-reports/:id/status`

Cập nhật trạng thái báo mất.

```json
{
  "status": "contacted",
  "actor": "Đỗ Anh Tuấn",
  "note": "Đã gọi người báo mất để xác minh"
}
```

### Gợi ý trùng khớp

#### `GET /api/match-suggestions`

Lấy danh sách gợi ý trùng khớp giữa đồ vật nhặt được và báo mất.

Backend có thể bắt đầu bằng logic MVP hiện tại:

- Cùng loại đồ vật.
- Tên hoặc mô tả có từ khóa giống nhau.
- Vị trí nhặt được gần giống khu vực nghi mất.

Response đề xuất:

```json
{
  "items": [
    {
      "id": "asset-004-report-002",
      "lostItemId": "asset-004",
      "lostReportId": "report-002",
      "level": "high",
      "reasons": ["Cùng loại", "Tên gần giống", "Khu vực gần giống"],
      "score": 7
    }
  ]
}
```

## Checklist tích hợp vào hệ thống tổng

- [ ] Xác nhận enum `status`, `category`, `reporterRole`, `lostReportStatus` với backend.
- [ ] Tạo service layer thay mock/local state.
- [ ] Tích hợp API cho đồ vật nhặt được.
- [ ] Tích hợp API cho báo mất đồ vật public.
- [ ] Tích hợp API cho gợi ý trùng khớp hoặc chuyển logic matching sang backend.
- [ ] Thêm loading, empty, error state cho các request.
- [ ] Thêm phân trang khi danh sách lớn.
- [ ] Đồng bộ route public `/report-lost-item` với chính sách public access của hệ thống tổng.
- [ ] Tích hợp xác thực/phân quyền cho app nội bộ.
- [ ] Đảm bảo thao tác bàn giao ghi đủ thông tin người nhận đồ.
- [ ] Đảm bảo mọi cập nhật quan trọng tạo audit log.
- [ ] Kiểm tra responsive trên desktop, tablet, mobile.
- [ ] Chạy `npm run lint`.
- [ ] Chạy `npm run build`.

## Checklist test nghiệp vụ

- [ ] Bảo vệ xem dashboard và các số liệu hiển thị đúng từ mock/state.
- [ ] Bảo vệ lọc/tìm đồ vật nhặt được theo mã, tên, mô tả, trạng thái, loại.
- [ ] Bảo vệ bấm `+ Tiếp nhận đồ vật nhặt được`, nhập form, lưu và thấy chi tiết đồ vật mới.
- [ ] Bảo vệ hủy nhập liệu thì không tạo bản ghi mới.
- [ ] Bảo vệ chỉnh sửa đồ vật, lưu và thấy lịch sử xử lý được thêm.
- [ ] Bảo vệ hủy chỉnh sửa thì dữ liệu không đổi.
- [ ] Bảo vệ xác nhận bàn giao đồ vật, trạng thái chuyển sang `Đã bàn giao`.
- [ ] Khi bàn giao, thông tin người nhận đồ được lưu đầy đủ.
- [ ] Lịch sử xử lý ghi `Đã bàn giao đồ vật cho [tên người nhận]`.
- [ ] Người dùng public mở `/report-lost-item`, gửi báo mất và thấy mã báo mất.
- [ ] Trang public không hiển thị danh sách đồ vật nhặt được.
- [ ] Báo mất hiển thị trong tab nội bộ theo mock/state hiện có.
- [ ] Bảo vệ đánh dấu báo mất là đã liên hệ, đã xử lý hoặc đã hủy.
- [ ] Gợi ý trùng khớp hiển thị khi đồ vật nhặt được và báo mất có cùng loại/từ khóa/khu vực.
- [ ] Từ gợi ý, bảo vệ xem được đồ vật nhặt được và báo mất.
- [ ] Giao diện mobile không vỡ layout, card dashboard gọn, tab cuộn ngang, nút dễ bấm.
