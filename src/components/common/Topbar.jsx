import React from 'react';
import { Bell, Menu } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  return (
    <header className="min-h-[4rem] py-2 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 sticky top-0 z-10 flex-wrap gap-y-2">

      {/* ── Left: Menu button + Title ─────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Title Portal */}
        <div
          id="topbar-title-portal"
          className="font-bold text-base lg:text-lg text-text-main whitespace-nowrap"
        />
      </div>

      {/* ── Divider ───────────────────────────────────────────── */}
      <div className="hidden md:block h-5 w-px bg-gray-200 mx-4 shrink-0" />

      {/* ── Center: Search (grows to fill space) ──────────────── */}
      <div
        id="topbar-search-portal"
        className="hidden md:flex items-center flex-1 min-w-[200px] max-w-sm mr-4"
      />

      {/* ── Spacer ────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0" />

      {/* ── Right: Actions (wrap) + Bell ────────────────── */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
        {/* Actions portal — wraps if too many buttons */}
        <div
          id="topbar-actions-portal"
          className="flex items-center gap-2 flex-wrap"
        />

        {/* Divider */}
        <div className="h-5 w-px bg-gray-200 shrink-0 mx-1" />

        {/* Notifications */}
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors shrink-0">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
