"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
  getDay,
} from "date-fns";

// ─── DarkCalendar Component ──────────────────────────────────────────────────
interface DarkCalendarProps {
  selectedDates: Date[];
  onToggleDate: (date: Date) => void;
  onClearSelection: () => void;
  minDate: Date;
  label: string;
  disabled?: boolean;
  blockedDateStrings?: string[];
}

function DarkCalendar({
  selectedDates,
  onToggleDate,
  onClearSelection,
  minDate,
  label,
  disabled,
  blockedDateStrings = [],
}: DarkCalendarProps) {
  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState(
    selectedDates[0] || minDate || today
  );

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  const isBlocked = (d: Date) => {
    const dStr = format(d, "yyyy-MM-dd");
    return blockedDateStrings.some((b) => b.split("T")[0] === dStr);
  };
  const isPast = (d: Date) => isBefore(startOfDay(d), startOfDay(minDate));
  const isSelected = (d: Date) => selectedDates.some((sd) => isSameDay(sd, d));

  const prevMonth = () =>
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)
    );

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div style={{ opacity: disabled ? 0.4 : 1, pointerEvents: disabled ? "none" : "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "12px", fontFamily: "Inter,sans-serif", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </span>
        {selectedDates.length > 0 && (
          <button
            type="button"
            onClick={onClearSelection}
            style={{ background: "none", border: "none", color: "#CC0000", fontSize: "11px", fontFamily: "Inter,sans-serif", cursor: "pointer", textDecoration: "underline" }}
          >
            Clear ({selectedDates.length})
          </button>
        )}
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(204,0,0,0.3)", borderRadius: "14px", padding: "16px", backdropFilter: "blur(12px)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button onClick={prevMonth} type="button" style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "20px", cursor: "pointer", padding: "4px 10px", lineHeight: 1 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#CC0000")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>‹</button>
          <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", fontWeight: 700, color: "white", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {format(viewMonth, "MMMM yyyy")}
          </span>
          <button onClick={nextMonth} type="button" style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "20px", cursor: "pointer", padding: "4px 10px", lineHeight: 1 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#CC0000")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}>›</button>
        </div>

        {/* Day names */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: "6px" }}>
          {dayNames.map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.05em", padding: "6px 0" }}>{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px" }}>
          {Array.from({ length: startPadding }).map((_, i) => <div key={`pad-${i}`} />)}
          {days.map((day) => {
            const blocked = isBlocked(day);
            const past = isPast(day);
            const selected = isSelected(day);
            const todayDay = isToday(day);
            const isDisabledDay = past || blocked;

            let bg = "transparent";
            let color = "rgba(255,255,255,0.75)";
            let border = "none";
            let boxShadow = "none";
            let cursor = "pointer";
            let fontWeight: number | string = 400;

            if (selected) {
              bg = "#CC0000"; color = "white"; fontWeight = 700;
              boxShadow = "0 0 14px rgba(204,0,0,0.5)";
            } else if (blocked) {
              bg = "rgba(204,0,0,0.08)"; color = "rgba(255,255,255,0.2)";
              border = "1px dashed rgba(204,0,0,0.2)"; cursor = "not-allowed";
            } else if (past) {
              color = "rgba(255,255,255,0.15)"; cursor = "not-allowed";
            } else if (todayDay) {
              color = "#FF3333"; fontWeight = 700; border = "1px solid rgba(204,0,0,0.5)";
            }

            return (
              <div
                key={day.toISOString()}
                onClick={() => !isDisabledDay && onToggleDate(day)}
                style={{ width: "36px", height: "36px", borderRadius: "8px", fontSize: "13px", cursor, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", transition: "all 0.15s", background: bg, color, border, boxShadow, fontWeight, position: "relative" }}
                onMouseEnter={(e) => {
                  if (!isDisabledDay && !selected) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(204,0,0,0.2)";
                    (e.currentTarget as HTMLElement).style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDisabledDay && !selected) {
                    (e.currentTarget as HTMLElement).style.background = bg;
                    (e.currentTarget as HTMLElement).style.color = color;
                  }
                }}
              >
                {format(day, "d")}
                {blocked && (
                  <span style={{ position: "absolute", bottom: "2px", left: "50%", transform: "translateX(-50%)", width: "4px", height: "4px", borderRadius: "50%", background: "rgba(204,0,0,0.6)", display: "block" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Selected dates display */}
        <div style={{ marginTop: "12px", padding: "8px 12px", borderRadius: "8px", textAlign: "center", background: selectedDates.length > 0 ? "rgba(204,0,0,0.12)" : "transparent", border: selectedDates.length > 0 ? "1px solid rgba(204,0,0,0.25)" : "1px solid transparent" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: selectedDates.length > 0 ? "white" : "rgba(255,255,255,0.3)" }}>
            {selectedDates.length === 0
              ? "Select date(s) to block (click date to select/unselect)"
              : selectedDates.length === 1
              ? `📅 ${format(selectedDates[0], "EEE, dd MMM yyyy")}`
              : `📅 ${selectedDates.length} dates selected: ${selectedDates.map((d) => format(d, "dd MMM")).join(", ")}`}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── PieChart Component ──────────────────────────────────────────────────────
function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0)
    return (
      <div style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", padding: 40 }}>
        No bookings yet
      </div>
    );

  let cumulative = 0;
  const size = 200;
  const cx = size / 2, cy = size / 2;
  const r = 80, innerR = 45;

  const slices = data
    .filter((d) => d.value > 0)
    .map((d) => {
      const start = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
      cumulative += d.value;
      const end = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
      const x1 = cx + r * Math.cos(start);
      const y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end);
      const y2 = cy + r * Math.sin(end);
      const ix1 = cx + innerR * Math.cos(start);
      const iy1 = cy + innerR * Math.sin(start);
      const ix2 = cx + innerR * Math.cos(end);
      const iy2 = cy + innerR * Math.sin(end);
      const large = end - start > Math.PI ? 1 : 0;
      return {
        ...d,
        path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${large} 0 ${ix1} ${iy1} Z`,
        percent: Math.round((d.value / total) * 100),
      };
    });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: 200, height: 200 }}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="#0F0F0F" strokeWidth={2}>
            <title>{s.label}: {s.value} ({s.percent}%)</title>
          </path>
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize={22} fontFamily="Rajdhani, sans-serif" fontWeight={700}>{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={11} fontFamily="Inter, sans-serif">TOTAL</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <div>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "Inter,sans-serif" }}>{s.label}</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginLeft: 8 }}>{s.value} ({s.percent}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BarChart Component ──────────────────────────────────────────────────────
function BarChart({ data }: { data: { month: string; revenue: number; bookings: number }[] }) {
  if (data.length === 0) return null;
  const maxRev = Math.max(...data.map((d) => d.revenue), 1);
  const W = 520, H = 180, padL = 50, padB = 30;
  const barW = Math.min(36, (W - padL) / data.length - 8);

  return (
    <div style={{ overflowX: "auto" }}>
      <svg viewBox={`0 0 ${W} ${H + padB}`} style={{ width: "100%", minWidth: 320, maxWidth: W }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CC0000" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#880000" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const y = H - f * H;
          const val = Math.round(f * maxRev);
          return (
            <g key={f}>
              <line x1={padL} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              <text x={padL - 6} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace">
                ₹{val >= 1000 ? (val / 1000).toFixed(0) + "k" : val}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const x = padL + i * ((W - padL) / data.length) + ((W - padL) / data.length - barW) / 2;
          const barH = (d.revenue / maxRev) * H;
          const y = H - barH;
          return (
            <g key={i}>
              <rect x={x} y={0} width={barW} height={H} fill="rgba(255,255,255,0.02)" rx={4} />
              <rect x={x} y={y} width={barW} height={barH} fill="url(#barGrad)" rx={4}>
                <title>{d.month}: ₹{d.revenue.toLocaleString("en-IN")} · {d.bookings} bookings</title>
              </rect>
              <text x={x + barW / 2} y={H + padB - 6} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={10} fontFamily="Inter,sans-serif">{d.month}</text>
              {d.revenue > 0 && (
                <text x={x + barW / 2} y={y - 5} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={9} fontFamily="monospace">
                  ₹{d.revenue >= 1000 ? (d.revenue / 1000).toFixed(1) + "k" : d.revenue}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Main Admin Dashboard ────────────────────────────────────────────────────
type TabType = "analytics" | "bookings" | "contacts" | "block" | "overview";

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState<TabType>("analytics");

  // Bookings
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingFilter, setBookingFilter] = useState("ALL");
  const [bookingSearch, setBookingSearch] = useState("");

  // Contacts
  const [contacts, setContacts] = useState<any[]>([]);
  const [expandedContact, setExpandedContact] = useState<string | null>(null);

  // Blocked dates — records from API
  const [blockedList, setBlockedList] = useState<{ id: string; date: string; reason: string | null }[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [blockReason, setBlockReason] = useState("");
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockError, setBlockError] = useState("");
  const [blockSuccess, setBlockSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editReason, setEditReason] = useState("");

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getAuthHeaders = (t: string) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${t}`,
    "x-admin-secret": "Admin@SSDrive",
  });

  useEffect(() => {
    const t = sessionStorage.getItem("ss_admin_token");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
    fetchBookingsAndContacts(t);
    fetchBlockedDates();
  }, []);

  useEffect(() => {
    if (tab === "block") fetchBlockedDates();
  }, [tab]);

  const fetchBookingsAndContacts = async (t: string) => {
    const headers = getAuthHeaders(t);
    try {
      const [bRes, cRes] = await Promise.all([
        fetch("/api/bookings", { headers }),
        fetch("/api/contact", { headers }),
      ]);
      if (bRes.ok) setBookings(await bRes.json());
      if (cRes.ok) setContacts(await cRes.json());
    } catch (e) { console.error(e); }
  };

  const fetchBlockedDates = async () => {
    try {
      const res = await fetch("/api/admin/blocked-dates");
      const data = await res.json();
      setBlockedList(data.records || []);
    } catch { setBlockedList([]); }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    if (!token) return;
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ status }),
    });
    if (res.ok) setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    else showToast("Failed to update status", "error");
  };

  const toggleDateSelection = (day: Date) => {
    setBlockError("");
    setBlockSuccess("");
    setSelectedDates((prev) => {
      const exists = prev.some((d) => isSameDay(d, day));
      if (exists) {
        return prev.filter((d) => !isSameDay(d, day));
      } else {
        return [...prev, day].sort((a, b) => a.getTime() - b.getTime());
      }
    });
  };

  const handleBlockDate = async () => {
    if (selectedDates.length === 0) {
      setBlockError("Please select at least one date first.");
      return;
    }
    if (!token) return;

    // Check duplicate prevention
    const existingDateSet = new Set(blockedList.map((b) => b.date.split("T")[0]));
    const formattedSelection = selectedDates.map((d) => format(d, "yyyy-MM-dd"));
    const newDates = formattedSelection.filter((s) => !existingDateSet.has(s));

    if (newDates.length === 0) {
      setBlockError("All selected date(s) are already blocked.");
      return;
    }

    setBlockLoading(true);
    setBlockError("");
    setBlockSuccess("");

    try {
      const res = await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          dates: newDates,
          reason: blockReason || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const msg =
          newDates.length === 1
            ? `✓ ${newDates[0]} blocked successfully`
            : `✓ ${newDates.length} dates blocked successfully`;
        setBlockSuccess(msg);
        setSelectedDates([]);
        setBlockReason("");
        fetchBlockedDates();
      } else {
        setBlockError(data.error || "Failed to block date(s)");
      }
    } catch {
      setBlockError("Network error. Please try again.");
    } finally {
      setBlockLoading(false);
    }
  };

  const handleUnblock = async (dateStr: string) => {
    if (!token) return;
    const cleanStr = dateStr.split("T")[0];
    const encoded = encodeURIComponent(cleanStr);
    try {
      const res = await fetch(`/api/admin/blocked-dates/${encoded}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "x-admin-secret": "Admin@SSDrive" },
      });
      if (res.ok) {
        setBlockedList((prev) => prev.filter((b) => b.date.split("T")[0] !== cleanStr));
        setBlockSuccess(`✓ ${cleanStr} unblocked successfully`);
        fetchBlockedDates();
      } else {
        const d = await res.json();
        setBlockError(d.error || "Failed to unblock");
      }
    } catch {
      setBlockError("Network error");
    }
  };

  const handleEditReason = async (dateStr: string) => {
    if (!token) return;
    const cleanStr = dateStr.split("T")[0];
    const encoded = encodeURIComponent(cleanStr);
    try {
      const res = await fetch(`/api/admin/blocked-dates/${encoded}`, {
        method: "PATCH",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ reason: editReason }),
      });
      if (res.ok) {
        setEditingId(null);
        setEditReason("");
        fetchBlockedDates();
        setBlockSuccess("✓ Reason updated");
      }
    } catch {
      setBlockError("Failed to update");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("ss_admin_token");
    router.push("/admin/login");
  };

  // ── Derived stats ──────────────────────────────────────────────────────────
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const revenue = bookings
    .filter((b) => ["CONFIRMED", "COMPLETED"].includes(b.status))
    .reduce((s, b) => s + (b.finalAmount || 0), 0);

  const filteredBookings = bookings.filter((b) => {
    const statusMatch = bookingFilter === "ALL" || b.status === bookingFilter;
    const searchLower = bookingSearch.toLowerCase();
    const searchMatch = !bookingSearch || b.customerName?.toLowerCase().includes(searchLower) || b.phone?.includes(bookingSearch);
    return statusMatch && searchMatch;
  });

  const recentActivity = [
    ...bookings.slice(0, 5).map((b) => ({ type: "booking", ...b })),
    ...contacts.slice(0, 5).map((c) => ({ type: "contact", ...c })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  // ── Analytics data ─────────────────────────────────────────────────────────
  const pieData = [
    { label: "Confirmed", value: bookings.filter((b) => b.status === "CONFIRMED").length, color: "#22c55e" },
    { label: "Pending", value: bookings.filter((b) => b.status === "PENDING").length, color: "#f59e0b" },
    { label: "Cancelled", value: bookings.filter((b) => b.status === "CANCELLED").length, color: "#6b7280" },
    { label: "Completed", value: bookings.filter((b) => b.status === "COMPLETED").length, color: "#3b82f6" },
  ];

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyData = MONTHS.map((month, mi) => {
    const mb = bookings.filter((b) => {
      const d = new Date(b.startDate);
      return d.getMonth() === mi && d.getFullYear() === new Date().getFullYear() && b.status !== "CANCELLED";
    });
    return { month, bookings: mb.length, revenue: mb.reduce((s, b) => s + (b.finalAmount || 0), 0) };
  });

  const avgDays = bookings.length > 0
    ? Math.round(bookings.reduce((s, b) => s + (b.totalDays || 0), 0) / bookings.length)
    : 0;

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      PENDING:   { bg: "rgba(245,158,11,0.2)",  color: "#fbbf24" },
      CONFIRMED: { bg: "rgba(34,197,94,0.2)",   color: "#4ade80" },
      CANCELLED: { bg: "rgba(107,114,128,0.2)", color: "#9ca3af" },
      COMPLETED: { bg: "rgba(59,130,246,0.2)",  color: "#60a5fa" },
    };
    const s = map[status] || { bg: "rgba(255,255,255,0.1)", color: "#fff" };
    return (
      <span style={{ padding: "2px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, background: s.bg, color: s.color, fontFamily: "Rajdhani,sans-serif", letterSpacing: "0.04em" }}>
        {status}
      </span>
    );
  };

  const TAB_BTN = (id: TabType, label: string) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      style={{ padding: "10px 22px", borderRadius: "10px", cursor: "pointer", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "0.04em", border: "1px solid rgba(255,255,255,0.12)", background: tab === id ? "#CC0000" : "rgba(255,255,255,0.06)", color: "white", transition: "all 0.2s" }}
    >
      {label}
    </button>
  );

  const today = startOfDay(new Date());

  return (
    <main className="min-h-screen pt-20 pb-12 bg-[#080808] text-white">
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: "80px", right: "24px", zIndex: 1000, padding: "12px 20px", borderRadius: "10px", backdropFilter: "blur(12px)", fontFamily: "Inter,sans-serif", fontSize: "14px", background: toast.type === "success" ? "rgba(34,197,94,0.2)" : "rgba(204,0,0,0.2)", border: `1px solid ${toast.type === "success" ? "rgba(34,197,94,0.4)" : "rgba(204,0,0,0.4)"}`, color: "white" }}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="font-rajdhani font-bold text-[#CC0000] text-2xl">SS</span>
            <span className="font-rajdhani font-bold text-white text-2xl">SELF DRIVE</span>
            <span className="text-gray-500 font-inter text-sm ml-2">— Admin Dashboard</span>
          </div>
          <button onClick={logout} className="btn-glass px-4 py-2 text-sm">Logout</button>
        </div>

        {/* Tab Nav */}
        <div className="flex flex-wrap gap-3 mb-8">
          {TAB_BTN("analytics", "📊 Analytics")}
          {TAB_BTN("bookings", "📋 Bookings")}
          {TAB_BTN("contacts", "📬 Contacts")}
          {TAB_BTN("block", "🚫 Block Dates")}
          {TAB_BTN("overview", "👁 Overview")}
        </div>

        {/* ── TAB: ANALYTICS ── */}
        {tab === "analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* KPI Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
              {[
                { label: "Total Bookings", value: bookings.length, icon: "📋" },
                { label: "Revenue Earned", value: `₹${revenue.toLocaleString("en-IN")}`, icon: "💰" },
                { label: "Avg Duration", value: avgDays ? `${avgDays} days` : "—", icon: "📅" },
                { label: "Blocked Dates", value: blockedList.length, icon: "🚫" },
              ].map((kpi) => (
                <div key={kpi.label} className="glass-card" style={{ padding: "20px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{kpi.icon}</div>
                  <div style={{ color: "#CC0000", fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: 28, lineHeight: 1 }}>{kpi.value}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 4, fontFamily: "Inter,sans-serif" }}>{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 16 }}>
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: "Rajdhani,sans-serif", color: "#fff", fontSize: 17, fontWeight: 700, margin: "0 0 20px" }}>Booking Status</h3>
                <PieChart data={pieData} />
              </div>
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: "Rajdhani,sans-serif", color: "#fff", fontSize: 17, fontWeight: 700, margin: "0 0 20px" }}>Monthly Revenue {new Date().getFullYear()}</h3>
                <BarChart data={monthlyData} />
              </div>
            </div>

            {/* Recent bookings table */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: "Rajdhani,sans-serif", color: "#fff", fontSize: 17, fontWeight: 700, margin: "0 0 16px" }}>Recent Bookings</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter,sans-serif", fontSize: 13 }}>
                  <thead>
                    <tr>
                      {["Customer","Phone","Pickup","Return","Days","Amount","Status"].map((h) => (
                        <th key={h} style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", padding: "8px 12px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...bookings]
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 8)
                      .map((b, i) => (
                        <tr key={b.id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                          <td style={{ padding: "10px 12px", color: "#fff", fontWeight: 500 }}>{b.customerName}</td>
                          <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.6)" }}>{b.phone}</td>
                          <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.6)" }}>{new Date(b.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                          <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.6)" }}>{new Date(b.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                          <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.6)", textAlign: "center" }}>{b.totalDays}</td>
                          <td style={{ padding: "10px 12px", color: "#4ade80", fontWeight: 600 }}>₹{(b.finalAmount || 0).toLocaleString("en-IN")}</td>
                          <td style={{ padding: "10px 12px" }}>{statusBadge(b.status)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {bookings.length === 0 && (
                  <p style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "32px 0", fontSize: 14 }}>
                    No bookings yet. Analytics will appear here once customers start booking.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: BOOKINGS ── */}
        {tab === "bookings" && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <select className="glass-input" style={{ width: "auto", minWidth: "160px" }} value={bookingFilter} onChange={(e) => setBookingFilter(e.target.value)}>
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <input className="glass-input" style={{ width: "auto", flex: 1, minWidth: "200px" }} placeholder="Search by name or phone..." value={bookingSearch} onChange={(e) => setBookingSearch(e.target.value)} />
            </div>
            <div className="glass-card p-4 overflow-x-auto">
              <table className="w-full text-left font-inter text-sm min-w-[900px]">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    {["Name","Phone","Email","Pickup","Return","Days","Amount","Status","Actions"].map((h) => (
                      <th key={h} className="pb-3 pr-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                      <td className="py-3 pr-3 text-white font-medium">{b.customerName}</td>
                      <td className="py-3 pr-3 text-gray-300">{b.phone}</td>
                      <td className="py-3 pr-3 text-gray-400 text-xs">{b.email}</td>
                      <td className="py-3 pr-3 text-gray-300">{new Date(b.startDate).toLocaleDateString()}</td>
                      <td className="py-3 pr-3 text-gray-300">{new Date(b.endDate).toLocaleDateString()}</td>
                      <td className="py-3 pr-3 text-center text-gray-300">{b.totalDays}</td>
                      <td className="py-3 pr-3 font-bold text-white">₹{b.finalAmount}</td>
                      <td className="py-3 pr-3">{statusBadge(b.status)}</td>
                      <td className="py-3 pl-0">
                        <div className="flex gap-1 flex-wrap">
                          <button onClick={() => updateBookingStatus(b.id, "CONFIRMED")} disabled={b.status === "CONFIRMED"} className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 disabled:opacity-30 hover:bg-green-500/40">✓</button>
                          <button onClick={() => updateBookingStatus(b.id, "COMPLETED")} disabled={b.status === "COMPLETED"} className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 disabled:opacity-30 hover:bg-blue-500/40">✔</button>
                          <button onClick={() => updateBookingStatus(b.id, "CANCELLED")} disabled={b.status === "CANCELLED"} className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 disabled:opacity-30 hover:bg-red-500/40">✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr><td colSpan={9} className="py-8 text-center text-gray-500">No bookings found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: CONTACTS ── */}
        {tab === "contacts" && (
          <div className="space-y-4">
            {contacts.map((c) => (
              <div key={c.id} className="glass-card p-5 cursor-pointer" onClick={() => setExpandedContact(expandedContact === c.id ? null : c.id)}>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="font-rajdhani font-bold text-white text-lg">{c.name}</span>
                    <span className="ml-3 text-gray-400 font-inter text-sm">{c.phone}</span>
                    <span className="ml-3 text-gray-500 font-inter text-xs">{c.email}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-inter">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                {expandedContact === c.id && (
                  <div className="mt-4 p-4 bg-white/5 rounded-lg">
                    <p className="font-inter text-gray-300 text-sm leading-relaxed">{c.message}</p>
                    {c.preferredDate && <p className="mt-2 text-xs text-gray-500">Preferred date: {new Date(c.preferredDate).toLocaleDateString()}</p>}
                  </div>
                )}
              </div>
            ))}
            {contacts.length === 0 && <p className="text-center text-gray-500 font-inter py-8">No contact submissions yet.</p>}
          </div>
        )}

        {/* ── TAB: BLOCK DATES ── */}
        {tab === "block" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
            {/* LEFT — Block new date */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: "Rajdhani,sans-serif", color: "#CC0000", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                🚫 Block a Date
              </h3>
              <DarkCalendar
                label="SELECT DATE(S) TO BLOCK"
                selectedDates={selectedDates}
                onToggleDate={toggleDateSelection}
                onClearSelection={() => setSelectedDates([])}
                minDate={today}
                blockedDateStrings={blockedList.map((b) => b.date)}
              />
              <div style={{ marginTop: 16 }}>
                <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Reason (optional)</label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g. Maintenance, Personal Use"
                  className="glass-input"
                />
              </div>

              {blockError && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(204,0,0,0.12)", border: "1px solid rgba(204,0,0,0.3)", borderRadius: 8, color: "#ff6666", fontSize: 13 }}>{blockError}</div>
              )}
              {blockSuccess && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(0,204,80,0.10)", border: "1px solid rgba(0,204,80,0.3)", borderRadius: 8, color: "#4ade80", fontSize: 13 }}>{blockSuccess}</div>
              )}

              <button
                onClick={handleBlockDate}
                disabled={selectedDates.length === 0 || blockLoading}
                className="btn-red"
                style={{ width: "100%", marginTop: 16, fontSize: 14, opacity: selectedDates.length === 0 || blockLoading ? 0.6 : 1, cursor: selectedDates.length === 0 || blockLoading ? "not-allowed" : "pointer" }}
              >
                {blockLoading
                  ? "BLOCKING..."
                  : selectedDates.length > 1
                  ? `BLOCK ${selectedDates.length} DATES`
                  : "BLOCK THIS DATE"}
              </button>
            </div>

            {/* RIGHT — Blocked dates list */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontFamily: "Rajdhani,sans-serif", color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>
                  📅 Blocked Dates
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 400, marginLeft: 8 }}>({blockedList.length})</span>
                </h3>
                <button
                  onClick={fetchBlockedDates}
                  style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}
                >
                  ↻ Refresh
                </button>
              </div>

              {blockedList.length === 0 ? (
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center", padding: "32px 0" }}>
                  No dates blocked. Car is available for all future dates.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "520px", overflowY: "auto" }}>
                  {blockedList.map((item) => {
                    const cleanDateStr = item.date.split("T")[0];
                    const [y, m, d] = cleanDateStr.split("-").map(Number);
                    const localDateObj = new Date(y, m - 1, d);
                    const formatted = localDateObj.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
                    const isEditing = editingId === item.id;
                    return (
                      <div key={item.id} style={{ background: "rgba(204,0,0,0.08)", border: "1px solid rgba(204,0,0,0.22)", borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                          <div>
                            <div style={{ color: "#fff", fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: 15 }}>📅 {formatted}</div>
                            {item.reason && !isEditing && (
                              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>{item.reason}</div>
                            )}
                          </div>
                          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                            <button
                              onClick={() => { setEditingId(isEditing ? null : item.id); setEditReason(item.reason || ""); }}
                              title="Edit reason"
                              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
                            >✏️</button>
                            <button
                              onClick={() => handleUnblock(item.date)}
                              title="Unblock this date"
                              style={{ background: "rgba(204,0,0,0.15)", border: "1px solid rgba(204,0,0,0.35)", color: "#ff6666", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "Rajdhani,sans-serif", fontWeight: 600 }}
                            >🗑 Unblock</button>
                          </div>
                        </div>
                        {isEditing && (
                          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                            <input
                              type="text"
                              value={editReason}
                              onChange={(e) => setEditReason(e.target.value)}
                              placeholder="Update reason..."
                              className="glass-input"
                              style={{ fontSize: 13, padding: "8px 12px" }}
                              onKeyDown={(e) => { if (e.key === "Enter") handleEditReason(item.date); if (e.key === "Escape") setEditingId(null); }}
                            />
                            <button onClick={() => handleEditReason(item.date)} style={{ background: "#CC0000", border: "none", color: "#fff", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "Rajdhani,sans-serif", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap" }}>Save</button>
                            <button onClick={() => setEditingId(null)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)", padding: "8px 10px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>✕</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Bookings", val: bookings.length, color: "white" },
                { label: "Confirmed", val: confirmedCount, color: "#4ade80" },
                { label: "Pending", val: pendingCount, color: "#fbbf24" },
                { label: "Revenue", val: `₹${revenue.toLocaleString()}`, color: "#CC0000" },
              ].map((s) => (
                <div key={s.label} className="glass-card p-6">
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontFamily: "Inter,sans-serif", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                  <div style={{ fontFamily: "Rajdhani,sans-serif", fontSize: "32px", fontWeight: 700, color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
            <div className="glass-card p-6">
              <h3 className="font-rajdhani text-xl font-bold mb-6 text-white">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="glass-card p-4" style={{ borderRadius: "10px" }}>
                    {item.type === "booking" ? (
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-inter text-sm text-gray-300">📋 <strong className="text-white">{item.customerName}</strong> booked for {new Date(item.startDate).toLocaleDateString()} → {new Date(item.endDate).toLocaleDateString()}</span>
                        {statusBadge(item.status)}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-inter text-sm text-gray-300">📬 <strong className="text-white">{item.name}</strong> sent a message</span>
                        <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                ))}
                {recentActivity.length === 0 && <p className="text-gray-500 font-inter text-sm text-center py-4">No recent activity.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
