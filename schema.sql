-- datlab.os · ตาราง hooks สำหรับคลัง HOOK
-- วิธีใช้: เปิด Supabase project -> เมนู SQL Editor -> วางทั้งหมดนี้ -> กด Run

create table if not exists public.hooks (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  category text default 'OTHER',
  used_count integer default 0,
  created_at timestamptz default now()
);

-- เปิด Row Level Security
alter table public.hooks enable row level security;

-- เวอร์ชันแรก (ยังไม่มีระบบ login) เปิดให้อ่าน/เพิ่ม/แก้/ลบ ได้
-- หมายเหตุ: เหมาะกับการใช้ส่วนตัว/เดโม — เมื่อเพิ่มระบบ login ค่อยปรับ policy ให้ผูกกับ user
drop policy if exists "public read" on public.hooks;
drop policy if exists "public insert" on public.hooks;
drop policy if exists "public update" on public.hooks;
drop policy if exists "public delete" on public.hooks;

create policy "public read"   on public.hooks for select using (true);
create policy "public insert" on public.hooks for insert with check (true);
create policy "public update" on public.hooks for update using (true);
create policy "public delete" on public.hooks for delete using (true);

-- ข้อมูลตั้งต้น (seed) — ลบออกได้ถ้าไม่ต้องการ
insert into public.hooks (text, category, used_count) values
  ('เลิกทำ [X] แล้วเริ่มทำ [Y]', 'SWAP', 38),
  ('สร้าง [PRODUCT] เสร็จใน [TIMEFRAME]', 'BUILD', 24),
  ('คุณต้องมี [TOOL] นี่คือเหตุผล', 'CLAIM', 19),
  ('[NUMBER] เรื่องที่อยากรู้ก่อน [X]', 'LIST', 15),
  ('ยังไม่มีใครพูดถึง [TREND]', 'CONTRARIAN', 12),
  ('playbook ของวงการ [INDUSTRY] ที่ไม่มีใครยอมบอก', 'BUILD', 9);
