'use client';

import { useEffect, useState } from 'react';
import { supabase, hasSupabase } from '../lib/supabaseClient';

const CATS = ['SWAP', 'BUILD', 'CLAIM', 'LIST', 'CONTRARIAN', 'OTHER'];

export default function Page() {
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('ALL');
  const [text, setText] = useState('');
  const [newCat, setNewCat] = useState('SWAP');
  const [err, setErr] = useState('');

  async function load() {
    if (!hasSupabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('hooks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setErr(error.message);
    else setHooks(data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function addHook(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t || !hasSupabase) return;
    const { data, error } = await supabase
      .from('hooks')
      .insert({ text: t, category: newCat })
      .select();
    if (error) {
      setErr(error.message);
      return;
    }
    setHooks([...(data || []), ...hooks]);
    setText('');
  }

  async function removeHook(id) {
    const { error } = await supabase.from('hooks').delete().eq('id', id);
    if (error) {
      setErr(error.message);
      return;
    }
    setHooks(hooks.filter((h) => h.id !== id));
  }

  async function useHook(h) {
    const next = (h.used_count || 0) + 1;
    const { error } = await supabase.from('hooks').update({ used_count: next }).eq('id', h.id);
    if (!error) {
      setHooks(hooks.map((x) => (x.id === h.id ? { ...x, used_count: next } : x)));
    }
  }

  const filtered = hooks.filter(
    (h) =>
      (cat === 'ALL' || h.category === cat) &&
      (h.text || '').toLowerCase().includes(q.toLowerCase())
  );
  const weekNew = hooks.length;

  return (
    <div className="wrap">
      <div className="top">
        <svg className="logo" viewBox="0 0 30 30" aria-hidden="true">
          <rect x="6" y="13" width="18" height="13" rx="5" fill="#f4b41a" />
          <path d="M10 13v-2a5 5 0 0 1 10 0v2" fill="none" stroke="#ec9a1f" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="15" cy="19" r="2.2" fill="#fff" />
        </svg>
        <div className="brand">datlab.os<small>คลัง HOOK</small></div>
        <span className="demo-pill">Phase 2 · ใช้งานจริง</span>
      </div>

      <div className="h1">คลัง HOOK</div>
      <div className="sub">เก็บ hook ของคุณไว้ที่เดียว ค้นหา/กรอง/เพิ่ม/ลบ ได้จริง — ข้อมูลเก็บบน Supabase</div>

      {!hasSupabase && (
        <div className="banner">
          <b>ยังไม่ได้เชื่อม Supabase</b> — ตั้งค่า <code>NEXT_PUBLIC_SUPABASE_URL</code> และ{' '}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ใน Vercel (หรือไฟล์ <code>.env.local</code>)
          แล้วรัน SQL ใน <code>supabase/schema.sql</code> ดูขั้นตอนในไฟล์ setup guide
        </div>
      )}

      <form className="card addform" onSubmit={addHook}>
        <input
          type="text"
          placeholder='เพิ่ม hook ใหม่ เช่น "เลิกทำ [X] แล้วเริ่มทำ [Y]"'
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!hasSupabase}
        />
        <select value={newCat} onChange={(e) => setNewCat(e.target.value)} disabled={!hasSupabase}>
          {CATS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button className="btn" type="submit" disabled={!hasSupabase || !text.trim()}>
          + เพิ่ม
        </button>
      </form>

      <div className="toolbar">
        <input
          className="search"
          type="text"
          placeholder="ค้นหา hook…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="chips">
        <span className={'chip' + (cat === 'ALL' ? ' on' : '')} onClick={() => setCat('ALL')}>ทั้งหมด</span>
        {CATS.map((c) => (
          <span key={c} className={'chip' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}>{c}</span>
        ))}
      </div>

      <div className="count">
        {loading ? 'กำลังโหลด…' : <><b>{filtered.length}</b> hooks {q || cat !== 'ALL' ? '(กรองแล้ว)' : `· ทั้งหมด ${weekNew}`}</>}
      </div>

      <div className="card">
        {!loading && filtered.length === 0 && (
          <div className="empty">ยังไม่มี hook ที่ตรงเงื่อนไข — ลองเพิ่มอันใหม่ด้านบนได้เลย</div>
        )}
        {filtered.map((h) => (
          <div className="row" key={h.id}>
            <div className="hk">
              <div className="t">{h.text}</div>
              <div className="m">ใช้ไปแล้ว {h.used_count || 0}×</div>
            </div>
            <span className="pill">{h.category || 'OTHER'}</span>
            <button className="mini" onClick={() => useHook(h)}>ใช้อันนี้</button>
            <button className="mini del" onClick={() => removeHook(h.id)}>ลบ</button>
          </div>
        ))}
      </div>

      {err && <div className="banner" style={{ color: 'var(--red)' }}>เกิดข้อผิดพลาด: {err}</div>}
    </div>
  );
}
