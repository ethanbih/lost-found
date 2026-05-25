# lost-found

Module quan ly tai san that lac cho to bao ve trong benh vien/trung tam.

## Muc tieu

`lost-found` ho tro nhan vien bao ve ghi nhan, theo doi, tim kiem, cap nhat va ban giao tai san that lac. Giao dien uu tien ro rang, de thao tac cho nguoi dung khong ranh cong nghe.

## Cong nghe su dung

- Next.js App Router
- TypeScript
- Mock data frontend
- CSS thuan trong `src/app/globals.css`
- Khong dung Tailwind

## Chuc nang hien co

- Dashboard thong ke:
  - Tong tai san
  - Dang luu giu
  - Da tra
  - Cho xu ly
  - Da xu ly
- Danh sach tai san that lac
- Tim kiem theo ma phieu, ten tai san, mo ta
- Loc theo trang thai va loai tai san
- Them tai san
- Sua tai san
- Xem chi tiet tai san
- Xac nhan da tra tai san
- Lich su xu ly

## Cau truc thu muc chinh

```text
src/
  app/
    globals.css        # CSS toan cuc
    layout.tsx         # Root layout
    page.tsx           # Trang chinh, Client Component
  components/
    AssetDetail.tsx    # Chi tiet tai san
    AssetForm.tsx      # Form them/sua tai san
    AssetStats.tsx     # Card thong ke
    AssetTable.tsx     # Bang danh sach tai san
    StatusBadge.tsx    # Badge trang thai
  mock/
    assets.ts          # Du lieu mock frontend
  types/
    asset.ts           # TypeScript types va labels
```

## Cach chay local

```bash
npm install
npm run dev
npm run lint
npm run build
```

Mac dinh app chay tai:

```text
http://localhost:3000
```

## Ghi chu hien tai

- Project chua co backend.
- Du lieu dang nam trong `src/mock/assets.ts`.
- Cac thao tac them, sua, xac nhan da tra chi cap nhat state tren frontend.
- Khi reload trang, du lieu quay ve mock ban dau.

## Huong tich hop API that trong tuong lai

Khi tich hop vao he thong tong, nen thay `mockAssets` bang service layer rieng, vi du:

```text
src/services/lostItems.ts
```

De xuat cach tach:

- Tao cac ham `fetchLostItems`, `fetchLostItemById`, `createLostItem`, `updateLostItem`, `returnLostItem`, `updateLostItemStatus`, `fetchLostItemLogs`.
- Giu UI components hien tai nhan props/callback, khong goi API truc tiep trong component bang/form.
- `src/app/page.tsx` hoac route/container moi se quan ly loading, error, submit va refresh data.
- Dong bo enum `status` va `category` voi backend de tranh lech du lieu.
- Khi backend co phan quyen, can an/hien thao tac theo role cua nguoi dung.

## API contract de xuat

### `GET /api/lost-items`

Lay danh sach tai san that lac.

Query de xuat:

- `search`: tim theo ma phieu, ten tai san, mo ta
- `status`: `stored | returned | pending_disposal | disposed`
- `category`: `documents | money | phone | electronics | keys | bag | clothing | other`
- `page`, `limit`: phan trang neu can

### `GET /api/lost-items/:id`

Lay chi tiet mot tai san, bao gom thong tin ban giao va lich su xu ly.

### `POST /api/lost-items`

Tao phieu tai san that lac moi.

Body de xuat:

```json
{
  "ticketCode": "TS-2026-001",
  "name": "Vi da mau nau",
  "category": "documents",
  "description": "Co CCCD va the bao hiem y te",
  "foundLocation": "Khu kham benh",
  "foundAt": "2026-05-24T09:20",
  "finderName": "Tran Thi Hoa",
  "finderPhone": "0901234567",
  "receivedBy": "Nguyen Van Minh",
  "storageLocation": "Tu A - Ngan 02",
  "note": "Da niem phong"
}
```

### `PUT /api/lost-items/:id`

Cap nhat thong tin tai san.

### `POST /api/lost-items/:id/return`

Xac nhan da tra tai san va chuyen trang thai sang `returned`.

Body de xuat:

```json
{
  "receiverName": "Le Ngoc Lan",
  "receiverPhone": "0918888999",
  "receiverId": "079198765432",
  "handedOverBy": "Pham Quoc Bao",
  "handoverNote": "Nguoi nhan mo khoa may va doi chieu CCCD khop thong tin"
}
```

### `PATCH /api/lost-items/:id/status`

Cap nhat trang thai tai san.

Body de xuat:

```json
{
  "status": "pending_disposal",
  "actor": "Nguyen Van Minh",
  "note": "Chua xac minh duoc chu so huu"
}
```

### `GET /api/lost-items/:id/logs`

Lay lich su xu ly cua mot tai san.

## Luu y nghiep vu

- Khong xoa du lieu tai san da tra.
- Khi tra tai san phai luu thong tin nguoi nhan:
  - Ho ten nguoi nhan
  - So dien thoai nguoi nhan
  - CCCD/CMND neu co
  - Nguoi ban giao
  - Ghi chu ban giao
- Can giu lich su xu ly cho moi thay doi quan trong:
  - Tiep nhan tai san
  - Sua thong tin
  - Doi trang thai
  - Ban giao tai san
- Can can nhac audit log phia backend khi tich hop he thong that.

## Checklist ban giao cho dev noi bo

- [ ] Xac nhan enum `status` va `category` voi backend.
- [ ] Thay mock data bang service goi API that.
- [ ] Bo sung loading state va error state khi goi API.
- [ ] Them phan trang neu danh sach lon.
- [ ] Kiem tra phan quyen thao tac xem/sua/tra/xu ly.
- [ ] Dam bao thao tac tra tai san ghi day du thong tin nguoi nhan.
- [ ] Dam bao moi cap nhat quan trong tao log xu ly.
- [ ] Kiem tra responsive tren desktop va mobile.
- [ ] Chay `npm run lint`.
- [ ] Chay `npm run build`.
