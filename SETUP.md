# datlab.os — Phase 2 · คลัง HOOK (Next.js + Supabase)

หน้าคลัง HOOK ที่ใช้งานได้จริง — เพิ่ม / ค้นหา / กรองตามหมวด / นับการใช้ / ลบ
ข้อมูลเก็บบนคลาวด์ Supabase · deploy บน Vercel

## ต้องเตรียม 3 ขั้น

### ขั้น 1 · สร้างฐานข้อมูล Supabase
1. เข้า supabase.com → New project (ตั้งชื่อ เช่น `datlab-os`, ตั้งรหัส database, เลือก region สิงคโปร์)
2. รอ ~2 นาทีให้สร้างเสร็จ
3. เมนูซ้าย → **SQL Editor** → New query → วางทั้งหมดจากไฟล์ `supabase/schema.sql` → กด **Run**
   - จะได้ตาราง `hooks` + ข้อมูลตั้งต้น 6 อัน
4. เมนูซ้าย → **Project Settings → API** → คัดลอก 2 ค่า:
   - **Project URL** (เช่น `https://abcd.supabase.co`)
   - **anon public key** (ขึ้นต้น `ey...`)

### ขั้น 2 · เอาโค้ดขึ้น GitHub
อัปโฟลเดอร์ `datlab-os-app/` ขึ้น repo ใหม่ (เช่น `datlab-os-app`)
- แบบเว็บ: New repository → uploading an existing file → ลากไฟล์ทั้งหมดในโฟลเดอร์นี้ (ยกเว้น `node_modules` ที่ไม่มีอยู่แล้ว)
- หรือแบบ git: `git init && git add . && git commit -m "phase 2 hook vault" && git push`

### ขั้น 3 · Deploy บน Vercel + ใส่ key
1. vercel.com → Add New → Project → Import repo `datlab-os-app`
2. Vercel จะรู้เองว่าเป็น **Next.js** (ไม่ต้องตั้ง build command)
3. ก่อนกด Deploy → เปิดหัวข้อ **Environment Variables** ใส่ 2 ตัว:
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL จากขั้น 1 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key จากขั้น 1 |
4. กด **Deploy** → ได้ลิงก์ → เปิดหน้าคลัง HOOK ที่เพิ่ม/ลบได้จริง 🎉

> ถ้าขึ้น banner "ยังไม่ได้เชื่อม Supabase" = ยังไม่ได้ใส่ env var (หรือใส่แล้วต้องกด Redeploy หนึ่งครั้ง)

## ทดสอบในเครื่องตัวเอง (ถ้าต้องการ)
```bash
cd datlab-os-app
cp .env.local.example .env.local   # แล้วแก้ใส่ค่าจริง 2 ตัว
npm install
npm run dev                        # เปิด http://localhost:3000
```

## hook มาจากไหน?
- **เวอร์ชันนี้ (Phase 2):** มาจาก 2 ทาง — (1) ชุดตั้งต้น 6 อันที่ใส่ไว้ใน seed + (2) ที่คุณพิมพ์เพิ่มเองในหน้าเว็บ
- **Phase 3 (อัตโนมัติ):** Claude จะดึง hook จาก reel คู่แข่ง/เทรนด์ มาถอดเสียง + ทำเป็นเทมเพลตเก็บเข้าคลังให้เอง

## ถัดไป
- เพิ่มระบบ login (Supabase Auth) แล้วผูก hook กับเจ้าของ
- ทำหน้า ปฏิทิน + กล่อง Claude แนะนำ ต่อจากนี้
