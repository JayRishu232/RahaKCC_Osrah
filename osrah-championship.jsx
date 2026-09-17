import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Trophy, Calendar, MapPin, Clock, ChevronRight, ChevronLeft, Lock, LogIn, LogOut,
  Plus, Minus, History as HistoryIcon, Filter, X, Check, TrendingUp, TrendingDown,
  Users, BarChart3, Settings, Edit2, Trash2, ArrowUp, ArrowDown, Info, Loader2,
  ClipboardList, ShieldCheck, RotateCcw
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */
const INK = "#12182B";
const INK_2 = "#1B2338";
const PAPER = "#ECEEEC";
const SURFACE = "#FFFFFF";
const BRASS = "#B8863A";
const TEXT = "#171A21";
const MUTED = "#6B7280";

const HOUSES_META = {
  sila:   { name: "Sila",   color: "#1F5FA8", on: "#FFFFFF" },
  liwa:   { name: "Liwa",   color: "#C0332E", on: "#FFFFFF" },
  faya:   { name: "Faya",   color: "#E3A62F", on: "#1B1F27" },
  quadra: { name: "Quadra", color: "#2F8F5B", on: "#FFFFFF" },
  wathba: { name: "Wathba", color: "#17181B", on: "#FFFFFF" },
  khazna: { name: "Khazna", color: "#F5F4EF", on: "#1B1F27", border: "#1B1F27" },
};
const HOUSE_ORDER = ["sila", "liwa", "faya", "quadra", "wathba", "khazna"];

const CATEGORIES = ["Sports", "Academic", "Arts", "Cultural", "Service", "Spirit", "Other"];
const STATUSES = ["Upcoming", "Registration Open", "Completed", "Cancelled"];

/* ------------------------------------------------------------------ */
/* Seed data                                                            */
/* ------------------------------------------------------------------ */
function seedData() {
  const osrahs = [
    { id: "sila",   points: 1240, wins: 3, rankChange: 0,  lastChange: { amount: 100, date: "2026-09-05" },
      timeline: [{ label: "Wk1", points: 820 }, { label: "Wk2", points: 900 }, { label: "Wk3", points: 980 }, { label: "Wk4", points: 1060 }, { label: "Wk5", points: 1140 }, { label: "Wk6", points: 1240 }] },
    { id: "liwa",   points: 1185, wins: 1, rankChange: 1,  lastChange: { amount: 50, date: "2026-09-05" },
      timeline: [{ label: "Wk1", points: 780 }, { label: "Wk2", points: 860 }, { label: "Wk3", points: 950 }, { label: "Wk4", points: 1020 }, { label: "Wk5", points: 1085 }, { label: "Wk6", points: 1185 }] },
    { id: "faya",   points: 1110, wins: 1, rankChange: -1, lastChange: { amount: 75, date: "2026-08-28" },
      timeline: [{ label: "Wk1", points: 800 }, { label: "Wk2", points: 850 }, { label: "Wk3", points: 910 }, { label: "Wk4", points: 970 }, { label: "Wk5", points: 1035 }, { label: "Wk6", points: 1110 }] },
    { id: "quadra", points: 980,  wins: 1, rankChange: 0,  lastChange: { amount: 75, date: "2026-09-05" },
      timeline: [{ label: "Wk1", points: 700 }, { label: "Wk2", points: 760 }, { label: "Wk3", points: 810 }, { label: "Wk4", points: 860 }, { label: "Wk5", points: 905 }, { label: "Wk6", points: 980 }] },
    { id: "wathba", points: 905,  wins: 1, rankChange: 1,  lastChange: { amount: 100, date: "2026-08-28" },
      timeline: [{ label: "Wk1", points: 650 }, { label: "Wk2", points: 690 }, { label: "Wk3", points: 740 }, { label: "Wk4", points: 780 }, { label: "Wk5", points: 805 }, { label: "Wk6", points: 905 }] },
    { id: "khazna", points: 860,  wins: 0, rankChange: -1, lastChange: { amount: 10, date: "2026-09-05" },
      timeline: [{ label: "Wk1", points: 640 }, { label: "Wk2", points: 680 }, { label: "Wk3", points: 720 }, { label: "Wk4", points: 770 }, { label: "Wk5", points: 810 }, { label: "Wk6", points: 860 }] },
  ];

  const competitions = [
    {
      id: "c1", name: "Inter-Osrah Football Tournament", category: "Sports",
      date: "2026-09-24", startTime: "15:30", endTime: "17:30", location: "School Sports Field",
      description: "Osrahs compete in a round-robin football tournament to earn championship points.",
      eligibleGroups: "Year 7 - Year 13", maxParticipants: "60", registrationDeadline: "2026-09-18",
      status: "Registration Open", results: null,
    },
    {
      id: "c2", name: "Osrah Quiz Bowl", category: "Academic",
      date: "2026-10-02", startTime: "12:15", endTime: "13:15", location: "Main Hall",
      description: "A fast-paced general knowledge quiz between all six Osrahs.",
      eligibleGroups: "Year 9 - Year 11", maxParticipants: "36", registrationDeadline: "2026-09-25",
      status: "Upcoming", results: null,
    },
    {
      id: "c3", name: "Cultural Day Showcase", category: "Cultural",
      date: "2026-10-10", startTime: "09:00", endTime: "14:00", location: "Courtyard & Main Hall",
      description: "Each Osrah presents a cultural performance and stall judged on creativity and participation.",
      eligibleGroups: "All Year Groups", maxParticipants: "", registrationDeadline: "2026-10-03",
      status: "Upcoming", results: null,
    },
    {
      id: "c4", name: "Inter-Osrah Debate", category: "Academic",
      date: "2026-09-05", startTime: "14:00", endTime: "15:30", location: "Lecture Theatre",
      description: "Osrahs argued both sides of this term's motion in front of a panel of judges.",
      eligibleGroups: "Year 10 - Year 13", maxParticipants: "24", registrationDeadline: "2026-08-29",
      status: "Completed",
      results: [
        { osrahId: "sila", points: 100 }, { osrahId: "quadra", points: 75 },
        { osrahId: "liwa", points: 50 }, { osrahId: "faya", points: 25 },
        { osrahId: "wathba", points: 10 }, { osrahId: "khazna", points: 10 },
      ],
    },
    {
      id: "c5", name: "Swimming Gala", category: "Sports",
      date: "2026-08-28", startTime: "10:00", endTime: "12:30", location: "Aquatics Centre",
      description: "Annual swimming gala across freestyle, backstroke and relay events.",
      eligibleGroups: "All Year Groups", maxParticipants: "", registrationDeadline: "2026-08-21",
      status: "Completed",
      results: [
        { osrahId: "wathba", points: 100 }, { osrahId: "faya", points: 75 },
        { osrahId: "sila", points: 50 }, { osrahId: "liwa", points: 25 },
        { osrahId: "quadra", points: 75 }, { osrahId: "khazna", points: 10 },
      ],
    },
    {
      id: "c6", name: "Spirit Week Challenge", category: "Spirit",
      date: "2026-08-20", startTime: "08:30", endTime: "15:30", location: "Whole School",
      description: "A week of themed dress-up days and spirit challenges scored on participation.",
      eligibleGroups: "All Year Groups", maxParticipants: "", registrationDeadline: "",
      status: "Completed",
      results: [
        { osrahId: "khazna", points: 60 }, { osrahId: "sila", points: 55 },
        { osrahId: "liwa", points: 45 }, { osrahId: "faya", points: 40 },
        { osrahId: "wathba", points: 35 }, { osrahId: "quadra", points: 30 },
      ],
    },
  ];

  const history = [
    { id: "h1", date: "2026-09-05T14:20", osrahId: "sila", change: 100, reason: "1st place - Inter-Osrah Debate", competitionId: "c4", teacher: "Ms. Karam", note: "" },
    { id: "h2", date: "2026-09-05T14:20", osrahId: "quadra", change: 75, reason: "2nd place - Inter-Osrah Debate", competitionId: "c4", teacher: "Ms. Karam", note: "" },
    { id: "h3", date: "2026-09-05T14:20", osrahId: "liwa", change: 50, reason: "3rd place - Inter-Osrah Debate", competitionId: "c4", teacher: "Ms. Karam", note: "" },
    { id: "h4", date: "2026-09-05T14:20", osrahId: "faya", change: 25, reason: "4th place - Inter-Osrah Debate", competitionId: "c4", teacher: "Ms. Karam", note: "" },
    { id: "h5", date: "2026-08-28T11:00", osrahId: "wathba", change: 100, reason: "1st place - Swimming Gala", competitionId: "c5", teacher: "Mr. Haddad", note: "" },
    { id: "h6", date: "2026-08-28T11:00", osrahId: "faya", change: 75, reason: "2nd place - Swimming Gala", competitionId: "c5", teacher: "Mr. Haddad", note: "" },
    { id: "h7", date: "2026-08-18T09:00", osrahId: "liwa", change: -15, reason: "Late setup at assembly", competitionId: null, teacher: "Mr. Haddad", note: "Deducted after discussion with Osrah captain." },
    { id: "h8", date: "2026-08-20T15:45", osrahId: "khazna", change: 60, reason: "1st place - Spirit Week Challenge", competitionId: "c6", teacher: "Ms. Karam", note: "" },
  ];

  return { osrahs, competitions, history };
}

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */
function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00");
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
function fmtDateShort(d) {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00");
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
function fmtTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}
function medalFor(rank) {
  return rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
}
function rankedList(osrahs) {
  return [...osrahs].sort((a, b) => b.points - a.points).map((o, i) => ({ ...o, rank: i + 1 }));
}
function statusPillStyle(status) {
  const map = {
    "Upcoming": { bg: "#E7E9F5", fg: "#33397A" },
    "Registration Open": { bg: "#E4F3E8", fg: "#1E6B37" },
    "Completed": { bg: "#EDEDED", fg: "#3A3A3A" },
    "Cancelled": { bg: "#F6E4E2", fg: "#8A2E23" },
  };
  return map[status] || map["Upcoming"];
}

const STORAGE_KEY = "osrah-league-v1";

/* ------------------------------------------------------------------ */
/* Small shared UI bits                                                 */
/* ------------------------------------------------------------------ */
function HouseChip({ id, size = "md" }) {
  const m = HOUSES_META[id];
  const dims = size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`${dims} rounded-full inline-block flex-shrink-0`}
        style={{ backgroundColor: m.color, border: m.border ? `1.5px solid ${m.border}` : "none" }}
      />
      <span className="font-medium" style={{ color: TEXT }}>{m.name}</span>
    </span>
  );
}

function RankChange({ value }) {
  if (!value) {
    return <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: MUTED }}>— no change</span>;
  }
  const up = value > 0;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded"
      style={{ color: up ? "#1E6B37" : "#8A2E23", backgroundColor: up ? "#E4F3E8" : "#F6E4E2" }}
    >
      {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
      {Math.abs(value)} {Math.abs(value) === 1 ? "place" : "places"}
    </span>
  );
}

function StatusPill({ status }) {
  const s = statusPillStyle(status);
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: s.bg, color: s.fg }}>
      {status}
    </span>
  );
}

function CategoryTag({ category }) {
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded border" style={{ borderColor: "#D8D9D4", color: MUTED }}>
      {category}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Header + Hero                                                        */
/* ------------------------------------------------------------------ */
function Header({ nav, setNav, teacher, onLoginClick, onLogout }) {
  const links = [
    { key: "home", label: "Standings" },
    { key: "competitions", label: "Competitions" },
    { key: "results", label: "Results" },
    { key: "about", label: "About" },
  ];
  return (
    <header className="sticky top-0 z-30" style={{ backgroundColor: INK }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <button
          onClick={() => setNav({ page: "home" })}
          className="flex items-center gap-2.5"
        >
          <Trophy size={22} style={{ color: BRASS }} />
          <span className="font-display text-xl tracking-tight" style={{ color: "#F5F4EF" }}>
            Osrah Championship
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <button
              key={l.key}
              onClick={() => setNav({ page: l.key })}
              className="text-sm font-medium transition-colors"
              style={{ color: nav.page === l.key ? BRASS : "#C7C9D6" }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {teacher.loggedIn ? (
            <>
              <button
                onClick={() => setNav({ page: "dashboard" })}
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold px-3.5 py-1.5 rounded-md"
                style={{ backgroundColor: BRASS, color: "#1B1200" }}
              >
                <ShieldCheck size={15} /> Teacher Dashboard
              </button>
              <button onClick={onLogout} title="Log out" className="p-2 rounded-md" style={{ color: "#C7C9D6" }}>
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border"
              style={{ borderColor: "#3A415B", color: "#C7C9D6" }}
            >
              <Lock size={14} /> <span className="hidden sm:inline">Teacher Login</span>
            </button>
          )}
        </div>
      </div>
      <div className="md:hidden flex items-center justify-around border-t px-2 py-1.5" style={{ borderColor: "#232B44" }}>
        {links.map((l) => (
          <button
            key={l.key}
            onClick={() => setNav({ page: l.key })}
            className="text-xs font-medium px-2 py-1"
            style={{ color: nav.page === l.key ? BRASS : "#9FA3B5" }}
          >
            {l.label}
          </button>
        ))}
      </div>
    </header>
  );
}

function Hero({ leader }) {
  return (
    <section style={{ backgroundColor: INK }} className="pb-14 pt-10 sm:pt-14">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: BRASS }}>
          2026 – 27 Season
        </p>
        <h1 className="font-display leading-[0.95] text-5xl sm:text-6xl md:text-7xl" style={{ color: "#F5F4EF" }}>
          Six Osrahs.<br />One Championship.
        </h1>
        <p className="mt-5 max-w-xl text-base sm:text-lg" style={{ color: "#AEB2C4" }}>
          Follow the latest Osrah standings, competitions and results throughout the school year.
        </p>
        {leader && (
          <div className="mt-8 inline-flex items-center gap-3 rounded-lg px-4 py-3" style={{ backgroundColor: INK_2 }}>
            <span className="text-2xl">🏆</span>
            <div>
              <div className="text-xs" style={{ color: "#9FA3B5" }}>Currently leading</div>
              <div className="flex items-center gap-2 font-display text-xl" style={{ color: "#F5F4EF" }}>
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: HOUSES_META[leader.id].color, border: HOUSES_META[leader.id].border ? `1.5px solid ${HOUSES_META[leader.id].border}` : "none" }} />
                {HOUSES_META[leader.id].name}
                <span className="text-sm font-sans font-normal" style={{ color: "#9FA3B5" }}>· {leader.points.toLocaleString()} pts</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Standings leaderboard (custom bar visualisation)                     */
/* ------------------------------------------------------------------ */
function StandingsSection({ ranked, onSelect }) {
  const max = Math.max(...ranked.map((o) => o.points));
  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 -mt-8 relative z-10">
      <div className="rounded-xl p-5 sm:p-7" style={{ backgroundColor: SURFACE, boxShadow: "0 8px 30px rgba(18,24,43,0.12)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl" style={{ color: TEXT }}>Current Standings</h2>
          <span className="text-xs" style={{ color: MUTED }}>Updated after every result</span>
        </div>
        <div className="space-y-3">
          {ranked.map((o) => {
            const meta = HOUSES_META[o.id];
            const widthPct = Math.max(8, (o.points / max) * 100);
            const medal = medalFor(o.rank);
            const gainedRecently = o.lastChange && o.lastChange.amount > 0;
            return (
              <button
                key={o.id}
                onClick={() => onSelect(o.id)}
                className="w-full text-left group"
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="w-7 text-sm font-display font-semibold" style={{ color: o.rank === 1 ? BRASS : MUTED }}>
                    {medal || `#${o.rank}`}
                  </span>
                  <span className="font-semibold text-sm" style={{ color: TEXT }}>{meta.name}</span>
                  <RankChange value={o.rankChange} />
                  {gainedRecently && (
                    <span className="text-xs font-semibold" style={{ color: "#1E6B37" }}>+{o.lastChange.amount} recently</span>
                  )}
                  <span className="ml-auto text-sm font-semibold tabular-nums" style={{ color: TEXT }}>
                    {o.points.toLocaleString()} pts
                  </span>
                </div>
                <div className="h-3.5 rounded-full w-full overflow-hidden" style={{ backgroundColor: "#EEEDE7" }}>
                  <div
                    className="h-full rounded-full transition-all group-hover:opacity-85"
                    style={{ width: `${widthPct}%`, backgroundColor: meta.color, border: meta.border ? `1.5px solid ${meta.border}` : "none" }}
                  />
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-5 text-xs" style={{ color: MUTED }}>
          {ranked[0].points - ranked[1].points} points separate 1st and 2nd place · {ranked[0].points - ranked[ranked.length - 1].points} points separate 1st and last
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Osrah cards grid                                                      */
/* ------------------------------------------------------------------ */
function OsrahCard({ o, onSelect }) {
  const meta = HOUSES_META[o.id];
  const medal = medalFor(o.rank);
  return (
    <button
      onClick={() => onSelect(o.id)}
      className="text-left rounded-xl p-5 transition-transform hover:-translate-y-0.5"
      style={{
        backgroundColor: SURFACE,
        border: `2px solid ${meta.border || "transparent"}`,
        boxShadow: "0 2px 10px rgba(18,24,43,0.07)",
        borderTop: `5px solid ${meta.color}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: "#F1F0EB", color: MUTED }}>
          {medal ? `${medal} Rank ${o.rank}` : `Rank ${o.rank}`}
        </span>
        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: meta.color, border: meta.border ? `1.5px solid ${meta.border}` : "none" }} />
      </div>
      <h3 className="font-display text-2xl mt-3" style={{ color: TEXT }}>{meta.name}</h3>
      <p className="text-2xl font-semibold mt-1 tabular-nums" style={{ color: TEXT }}>{o.points.toLocaleString()}<span className="text-sm font-normal ml-1" style={{ color: MUTED }}>points</span></p>
      <div className="flex items-center gap-3 mt-3 text-xs" style={{ color: MUTED }}>
        <span>{o.wins} competition {o.wins === 1 ? "win" : "wins"}</span>
        <RankChange value={o.rankChange} />
      </div>
    </button>
  );
}

function OsrahCardsGrid({ ranked, onSelect }) {
  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-14">
      <h2 className="font-display text-2xl mb-5" style={{ color: TEXT }}>The Six Osrahs</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {ranked.map((o) => <OsrahCard key={o.id} o={o} onSelect={onSelect} />)}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Competitions (upcoming) + results                                     */
/* ------------------------------------------------------------------ */
function CompetitionCard({ c, onSelect }) {
  return (
    <button
      onClick={() => onSelect(c.id)}
      className="text-left rounded-xl p-5 w-full flex flex-col gap-2"
      style={{ backgroundColor: SURFACE, boxShadow: "0 2px 10px rgba(18,24,43,0.07)" }}
    >
      <div className="flex items-center justify-between gap-2">
        <CategoryTag category={c.category} />
        <StatusPill status={c.status} />
      </div>
      <h3 className="font-display text-xl mt-1" style={{ color: TEXT }}>{c.name}</h3>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: MUTED }}>
        <span className="inline-flex items-center gap-1"><Calendar size={14} /> {fmtDate(c.date)}</span>
        {c.startTime && <span className="inline-flex items-center gap-1"><Clock size={14} /> {fmtTime(c.startTime)}</span>}
        <span className="inline-flex items-center gap-1"><MapPin size={14} /> {c.location}</span>
      </div>
      <p className="text-sm mt-1 line-clamp-2" style={{ color: "#3A3F4D" }}>{c.description}</p>
    </button>
  );
}

function UpcomingCompetitions({ competitions, onSelect, onSeeAll }) {
  const upcoming = competitions
    .filter((c) => c.status === "Upcoming" || c.status === "Registration Open")
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-14">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl" style={{ color: TEXT }}>Upcoming Competitions</h2>
        <button onClick={onSeeAll} className="text-sm font-medium inline-flex items-center gap-1" style={{ color: BRASS }}>
          See all <ChevronRight size={15} />
        </button>
      </div>
      {upcoming.length === 0 ? (
        <p className="text-sm" style={{ color: MUTED }}>Nothing scheduled right now — check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcoming.slice(0, 3).map((c) => <CompetitionCard key={c.id} c={c} onSelect={onSelect} />)}
        </div>
      )}
    </section>
  );
}

function ResultRow({ c, onSelect }) {
  const ranked = c.results ? [...c.results].sort((a, b) => b.points - a.points) : [];
  return (
    <button
      onClick={() => onSelect(c.id)}
      className="w-full text-left rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
      style={{ backgroundColor: SURFACE, boxShadow: "0 2px 10px rgba(18,24,43,0.07)" }}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <CategoryTag category={c.category} />
          <span className="text-xs" style={{ color: MUTED }}>{fmtDate(c.date)}</span>
        </div>
        <h3 className="font-display text-lg" style={{ color: TEXT }}>{c.name}</h3>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        {ranked.slice(0, 3).map((r, i) => (
          <span key={r.osrahId} className="inline-flex items-center gap-1.5 text-sm">
            <span>{medalFor(i + 1)}</span>
            <HouseChip id={r.osrahId} size="sm" />
          </span>
        ))}
      </div>
    </button>
  );
}

function RecentResults({ competitions, onSelect, onSeeAll }) {
  const completed = competitions
    .filter((c) => c.status === "Completed")
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-14 mb-16">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl" style={{ color: TEXT }}>Recent Results</h2>
        <button onClick={onSeeAll} className="text-sm font-medium inline-flex items-center gap-1" style={{ color: BRASS }}>
          See all <ChevronRight size={15} />
        </button>
      </div>
      <div className="space-y-3">
        {completed.slice(0, 3).map((c) => <ResultRow key={c.id} c={c} onSelect={onSelect} />)}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Osrah detail page                                                     */
/* ------------------------------------------------------------------ */
function OsrahDetailPage({ osrah, competitions, history, onBack, onSelectComp }) {
  const meta = HOUSES_META[osrah.id];
  const relatedHistory = history.filter((h) => h.osrahId === osrah.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const relatedComps = competitions
    .filter((c) => c.results && c.results.some((r) => r.osrahId === osrah.id))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm font-medium mb-6" style={{ color: MUTED }}>
        <ChevronLeft size={16} /> Back to standings
      </button>

      <div className="rounded-xl p-6 sm:p-8 mb-6" style={{ backgroundColor: SURFACE, borderTop: `6px solid ${meta.color}`, boxShadow: "0 2px 10px rgba(18,24,43,0.07)" }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-5 h-5 rounded-full" style={{ backgroundColor: meta.color, border: meta.border ? `1.5px solid ${meta.border}` : "none" }} />
          <h1 className="font-display text-4xl" style={{ color: TEXT }}>{meta.name}</h1>
        </div>
        <div className="flex flex-wrap gap-6 mt-5">
          <div>
            <div className="text-xs" style={{ color: MUTED }}>Current Rank</div>
            <div className="font-display text-2xl" style={{ color: TEXT }}>{medalFor(osrah.rank) || `#${osrah.rank}`} of 6</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: MUTED }}>Total Points</div>
            <div className="font-display text-2xl tabular-nums" style={{ color: TEXT }}>{osrah.points.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: MUTED }}>Competition Wins</div>
            <div className="font-display text-2xl" style={{ color: TEXT }}>{osrah.wins}</div>
          </div>
          <div>
            <div className="text-xs" style={{ color: MUTED }}>Since last update</div>
            <div className="mt-1"><RankChange value={osrah.rankChange} /></div>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: SURFACE, boxShadow: "0 2px 10px rgba(18,24,43,0.07)" }}>
        <h2 className="font-display text-xl mb-4" style={{ color: TEXT }}>Points over time</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={osrah.timeline} margin={{ left: -20, right: 10 }}>
            <CartesianGrid stroke="#EEEDE7" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: MUTED }} axisLine={{ stroke: "#DEDDD6" }} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: MUTED }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E4DE", fontSize: 13 }} />
            <Line type="monotone" dataKey="points" stroke={meta.color === "#F5F4EF" ? "#1B1F27" : meta.color} strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: SURFACE, boxShadow: "0 2px 10px rgba(18,24,43,0.07)" }}>
        <h2 className="font-display text-xl mb-4" style={{ color: TEXT }}>Competition history</h2>
        {relatedComps.length === 0 ? (
          <p className="text-sm" style={{ color: MUTED }}>No competitions recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {relatedComps.map((c) => {
              const mine = c.results.find((r) => r.osrahId === osrah.id);
              return (
                <button key={c.id} onClick={() => onSelectComp(c.id)} className="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg hover:bg-black/[0.02]">
                  <div>
                    <div className="text-sm font-medium" style={{ color: TEXT }}>{c.name}</div>
                    <div className="text-xs" style={{ color: MUTED }}>{fmtDate(c.date)}</div>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: mine.points > 0 ? "#1E6B37" : MUTED }}>+{mine.points} pts</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-xl p-6" style={{ backgroundColor: SURFACE, boxShadow: "0 2px 10px rgba(18,24,43,0.07)" }}>
        <h2 className="font-display text-xl mb-4" style={{ color: TEXT }}>Recent point changes</h2>
        {relatedHistory.length === 0 ? (
          <p className="text-sm" style={{ color: MUTED }}>No point changes recorded yet.</p>
        ) : (
          <div className="divide-y" style={{ borderColor: "#F0EFE9" }}>
            {relatedHistory.slice(0, 6).map((h) => (
              <div key={h.id} className="py-2.5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm" style={{ color: TEXT }}>{h.reason}</div>
                  <div className="text-xs" style={{ color: MUTED }}>{fmtDate(h.date.slice(0, 10))}</div>
                </div>
                <span className="text-sm font-semibold tabular-nums" style={{ color: h.change > 0 ? "#1E6B37" : "#8A2E23" }}>
                  {h.change > 0 ? "+" : ""}{h.change}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Competitions listing + detail                                         */
/* ------------------------------------------------------------------ */
function CompetitionsPage({ competitions, onSelect }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? competitions : competitions.filter((c) => c.category === filter);
  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
      <h1 className="font-display text-4xl mb-2" style={{ color: TEXT }}>Competitions</h1>
      <p className="text-sm mb-6" style={{ color: MUTED }}>Every Osrah competition, upcoming and completed.</p>
      <div className="flex gap-2 flex-wrap mb-6">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="text-sm px-3 py-1.5 rounded-full border font-medium"
            style={{
              borderColor: filter === cat ? BRASS : "#DEDDD6",
              backgroundColor: filter === cat ? "#F7EFDF" : "transparent",
              color: filter === cat ? "#7A5A1E" : MUTED,
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {sorted.map((c) => <CompetitionCard key={c.id} c={c} onSelect={onSelect} />)}
        {sorted.length === 0 && <p className="text-sm" style={{ color: MUTED }}>No competitions in this category yet.</p>}
      </div>
    </div>
  );
}

function CompetitionDetailPage({ comp, onBack }) {
  const ranked = comp.results ? [...comp.results].sort((a, b) => b.points - a.points) : [];
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm font-medium mb-6" style={{ color: MUTED }}>
        <ChevronLeft size={16} /> Back
      </button>
      <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: SURFACE, boxShadow: "0 2px 10px rgba(18,24,43,0.07)" }}>
        <div className="flex items-center gap-2 mb-3">
          <CategoryTag category={comp.category} />
          <StatusPill status={comp.status} />
        </div>
        <h1 className="font-display text-3xl mb-4" style={{ color: TEXT }}>{comp.name}</h1>
        <div className="grid sm:grid-cols-2 gap-3 text-sm mb-5" style={{ color: "#3A3F4D" }}>
          <span className="inline-flex items-center gap-2"><Calendar size={15} /> {fmtDate(comp.date)}</span>
          {comp.startTime && <span className="inline-flex items-center gap-2"><Clock size={15} /> {fmtTime(comp.startTime)}{comp.endTime ? ` – ${fmtTime(comp.endTime)}` : ""}</span>}
          <span className="inline-flex items-center gap-2"><MapPin size={15} /> {comp.location}</span>
          <span className="inline-flex items-center gap-2"><Users size={15} /> {comp.eligibleGroups || "All Year Groups"}</span>
        </div>
        <p className="text-sm mb-6" style={{ color: "#3A3F4D" }}>{comp.description}</p>

        {comp.registrationDeadline && comp.status !== "Completed" && (
          <p className="text-xs mb-6" style={{ color: MUTED }}>Registration closes {fmtDate(comp.registrationDeadline)}{comp.maxParticipants ? ` · Max ${comp.maxParticipants} participants` : ""}</p>
        )}

        {ranked.length > 0 && (
          <div>
            <h2 className="font-display text-xl mb-3" style={{ color: TEXT }}>Osrah Results</h2>
            <div className="space-y-2">
              {ranked.map((r, i) => (
                <div key={r.osrahId} className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{ backgroundColor: "#F7F6F1" }}>
                  <span className="inline-flex items-center gap-2 text-sm">
                    <span className="w-5 text-center">{medalFor(i + 1) || i + 1}</span>
                    <HouseChip id={r.osrahId} size="sm" />
                  </span>
                  <span className="text-sm font-semibold tabular-nums" style={{ color: TEXT }}>{r.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsPage({ competitions, onSelect }) {
  const completed = competitions.filter((c) => c.status === "Completed").sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <h1 className="font-display text-4xl mb-2" style={{ color: TEXT }}>Recent Results</h1>
      <p className="text-sm mb-6" style={{ color: MUTED }}>Every completed competition this season.</p>
      <div className="space-y-3">
        {completed.map((c) => <ResultRow key={c.id} c={c} onSelect={onSelect} />)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                                 */
/* ------------------------------------------------------------------ */
function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
      <h1 className="font-display text-4xl mb-4" style={{ color: TEXT }}>About the Osrah System</h1>
      <p className="text-sm mb-6 leading-relaxed" style={{ color: "#3A3F4D" }}>
        Every student belongs to one of six Osrahs. Throughout the year, Osrahs earn points across sporting,
        academic, cultural and spirit competitions. Points are awarded by teachers after each event and the
        running total decides the season's champion Osrah.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {HOUSE_ORDER.map((id) => {
          const m = HOUSES_META[id];
          return (
            <div key={id} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ backgroundColor: SURFACE, border: m.border ? `1.5px solid ${m.border}` : "1px solid #F0EFE9" }}>
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: m.color, border: m.border ? `1.5px solid ${m.border}` : "none" }} />
              <span className="font-medium text-sm" style={{ color: TEXT }}>{m.name}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-8 rounded-lg p-4 text-xs leading-relaxed" style={{ backgroundColor: "#F1F0EB", color: MUTED }}>
        <Info size={14} className="inline mr-1.5 -mt-0.5" />
        This site is a working prototype. In this demo, the teacher role is unlocked with a shared demo PIN and all
        Osrah data is stored in shared app storage — every visitor sees the same standings. A real deployment
        would replace the demo login with proper school authentication (e.g. single sign-on), and would enforce
        the student/teacher/admin permissions with server-side database rules so points can never be changed
        from the browser directly, no matter what the frontend allows.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Teacher login modal                                                   */
/* ------------------------------------------------------------------ */
const DEMO_PIN = "2026";

function TeacherLoginModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");

  function submit() {
    const cleanName = name.trim();
    const cleanPin = pin.trim();
    if (!cleanName) { setError("Enter your name."); return; }
    if (!cleanPin) { setError("Enter the PIN."); return; }
    if (cleanPin !== DEMO_PIN) { setError(`Incorrect PIN — this demo's PIN is ${DEMO_PIN}.`); return; }
    setError("");
    onSuccess(cleanName);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(18,24,43,0.55)" }}>
      <div className="w-full max-w-sm rounded-xl p-6" style={{ backgroundColor: SURFACE }}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-2xl" style={{ color: TEXT }}>Teacher Login</h2>
          <button type="button" onClick={onClose}><X size={18} style={{ color: MUTED }} /></button>
        </div>
        <p className="text-xs mb-5" style={{ color: MUTED }}>Demo access only — PIN is <span className="font-semibold">{DEMO_PIN}</span></p>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Your name</label>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }} placeholder="e.g. Ms. Karam" />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>PIN</label>
            <div className="flex gap-2">
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                className="w-full px-3 py-2 rounded-md border text-sm"
                style={{ borderColor: "#DEDDD6" }}
                placeholder={`Enter ${DEMO_PIN}`}
              />
              <button type="button" onClick={() => setShowPin((s) => !s)} className="text-xs font-medium px-2 rounded-md border flex-shrink-0" style={{ borderColor: "#DEDDD6", color: MUTED }}>
                {showPin ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-xs font-medium px-3 py-2 rounded-md" style={{ backgroundColor: "#F6E4E2", color: "#8A2E23" }}>{error}</p>
          )}
          <button type="button" onClick={submit} className="w-full py-2.5 rounded-md text-sm font-semibold mt-2" style={{ backgroundColor: BRASS, color: "#1B1200" }}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Teacher dashboard                                                     */
/* ------------------------------------------------------------------ */
function TeacherDashboard({ data, setData, persist, teacher }) {
  const [tab, setTab] = useState("overview");
  const ranked = rankedList(data.osrahs);
  const recentHistory = [...data.history].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const upcoming = data.competitions.filter((c) => c.status === "Upcoming" || c.status === "Registration Open");

  const tabs = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "points", label: "Update Points", icon: Plus },
    { key: "history", label: "Point History", icon: HistoryIcon },
    { key: "competitions", label: "Competitions", icon: ClipboardList },
  ];

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl" style={{ color: TEXT }}>Teacher Dashboard</h1>
          <p className="text-sm" style={{ color: MUTED }}>Logged in as {teacher.name}</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6 border-b" style={{ borderColor: "#E7E6DF" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="text-sm font-medium px-3 py-2.5 inline-flex items-center gap-1.5 -mb-px border-b-2"
            style={{ borderColor: tab === t.key ? BRASS : "transparent", color: tab === t.key ? TEXT : MUTED }}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-xl p-5" style={{ backgroundColor: SURFACE, boxShadow: "0 2px 10px rgba(18,24,43,0.07)" }}>
            <h2 className="font-display text-lg mb-3" style={{ color: TEXT }}>Standings</h2>
            <div className="space-y-2">
              {ranked.map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm">
                  <HouseChip id={o.id} size="sm" />
                  <span className="font-semibold tabular-nums" style={{ color: TEXT }}>{o.points.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl p-5" style={{ backgroundColor: SURFACE, boxShadow: "0 2px 10px rgba(18,24,43,0.07)" }}>
            <h2 className="font-display text-lg mb-3" style={{ color: TEXT }}>Recent Point Updates</h2>
            <div className="space-y-2">
              {recentHistory.map((h) => (
                <div key={h.id} className="flex items-center justify-between text-sm gap-2">
                  <span style={{ color: TEXT }}>{h.reason}</span>
                  <span className="font-semibold tabular-nums flex-shrink-0" style={{ color: h.change > 0 ? "#1E6B37" : "#8A2E23" }}>
                    {h.change > 0 ? "+" : ""}{h.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl p-5 md:col-span-2" style={{ backgroundColor: SURFACE, boxShadow: "0 2px 10px rgba(18,24,43,0.07)" }}>
            <h2 className="font-display text-lg mb-3" style={{ color: TEXT }}>Quick actions</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setTab("points")} className="inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-md" style={{ backgroundColor: BRASS, color: "#1B1200" }}>
                <Plus size={15} /> Add / Deduct Points
              </button>
              <button onClick={() => setTab("competitions")} className="inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-md border" style={{ borderColor: "#DEDDD6", color: TEXT }}>
                <ClipboardList size={15} /> Create Competition
              </button>
              <button onClick={() => setTab("history")} className="inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-md border" style={{ borderColor: "#DEDDD6", color: TEXT }}>
                <HistoryIcon size={15} /> View Point History
              </button>
            </div>
            <p className="text-xs mt-4" style={{ color: MUTED }}>{upcoming.length} upcoming competition{upcoming.length === 1 ? "" : "s"} on the calendar.</p>
          </div>
        </div>
      )}

      {tab === "points" && <PointForm data={data} setData={setData} persist={persist} teacher={teacher} />}
      {tab === "history" && <PointHistoryTable history={data.history} />}
      {tab === "competitions" && <CompetitionManager data={data} setData={setData} persist={persist} teacher={teacher} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Point submission form                                                  */
/* ------------------------------------------------------------------ */
function PointForm({ data, setData, persist, teacher }) {
  const [osrahId, setOsrahId] = useState("sila");
  const [action, setAction] = useState("add");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [competitionId, setCompetitionId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");

  function handleSubmit() {
    if (!amount || Number(amount) <= 0) { setFormError("Enter a points value greater than 0."); return; }
    if (!reason.trim()) { setFormError("Enter a reason for this change."); return; }
    setFormError("");
    setConfirming(true);
  }

  function confirmSubmit() {
    const delta = action === "add" ? Number(amount) : -Number(amount);
    const next = structuredClone(data);
    const osrah = next.osrahs.find((o) => o.id === osrahId);
    osrah.points += delta;
    osrah.lastChange = { amount: delta, date: new Date().toISOString().slice(0, 10) };

    const beforeRanks = Object.fromEntries(rankedList(data.osrahs).map((o) => [o.id, o.rank]));
    const afterRanks = Object.fromEntries(rankedList(next.osrahs).map((o) => [o.id, o.rank]));
    next.osrahs.forEach((o) => { o.rankChange = beforeRanks[o.id] - afterRanks[o.id]; });

    const comp = competitionId ? data.competitions.find((c) => c.id === competitionId) : null;
    next.history.unshift({
      id: "h" + Date.now(), date: new Date().toISOString().slice(0, 16),
      osrahId, change: delta, reason: reason.trim(), competitionId: competitionId || null,
      teacher: teacher.name, note: note.trim(),
    });

    setData(next);
    persist(next);
    setSuccess(`${action === "add" ? "Added" : "Deducted"} ${amount} points ${action === "add" ? "to" : "from"} ${HOUSES_META[osrahId].name}.`);
    setConfirming(false);
    setAmount(""); setReason(""); setNote(""); setCompetitionId("");
    setTimeout(() => setSuccess(""), 4000);
  }

  return (
    <div className="max-w-lg">
      <div className="rounded-xl p-6" style={{ backgroundColor: SURFACE, boxShadow: "0 2px 10px rgba(18,24,43,0.07)" }}>
        <h2 className="font-display text-xl mb-1" style={{ color: TEXT }}>Update Osrah Points</h2>
        <p className="text-xs mb-5" style={{ color: MUTED }}>Every change is recorded with your name, the date, and the reason.</p>

        {success && (
          <div className="mb-4 text-sm font-medium px-3 py-2 rounded-md inline-flex items-center gap-2" style={{ backgroundColor: "#E4F3E8", color: "#1E6B37" }}>
            <Check size={15} /> {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Osrah</label>
            <select value={osrahId} onChange={(e) => setOsrahId(e.target.value)} className="w-full px-3 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }}>
              {HOUSE_ORDER.map((id) => <option key={id} value={id}>{HOUSES_META[id].name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Action</label>
            <div className="flex rounded-md border overflow-hidden text-sm" style={{ borderColor: "#DEDDD6" }}>
              <button type="button" onClick={() => setAction("add")} className="flex-1 py-2 inline-flex items-center justify-center gap-1.5 font-medium"
                style={{ backgroundColor: action === "add" ? "#E4F3E8" : "transparent", color: action === "add" ? "#1E6B37" : MUTED }}>
                <Plus size={14} /> Add
              </button>
              <button type="button" onClick={() => setAction("deduct")} className="flex-1 py-2 inline-flex items-center justify-center gap-1.5 font-medium border-l"
                style={{ borderColor: "#DEDDD6", backgroundColor: action === "deduct" ? "#F6E4E2" : "transparent", color: action === "deduct" ? "#8A2E23" : MUTED }}>
                <Minus size={14} /> Deduct
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Points</label>
            <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }} placeholder="e.g. 100" />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Reason</label>
            <input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }} placeholder="1st place in inter-house football" />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Related competition <span style={{ color: MUTED }}>(optional)</span></label>
            <select value={competitionId} onChange={(e) => setCompetitionId(e.target.value)} className="w-full px-3 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }}>
              <option value="">None</option>
              {data.competitions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Additional notes <span style={{ color: MUTED }}>(optional)</span></label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }} />
          </div>

          {formError && (
            <p className="text-xs font-medium px-3 py-2 rounded-md" style={{ backgroundColor: "#F6E4E2", color: "#8A2E23" }}>{formError}</p>
          )}

          <button type="button" onClick={handleSubmit} className="w-full py-2.5 rounded-md text-sm font-semibold" style={{ backgroundColor: BRASS, color: "#1B1200" }}>
            Submit Points
          </button>
        </div>
      </div>

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(18,24,43,0.55)" }}>
          <div className="w-full max-w-sm rounded-xl p-6" style={{ backgroundColor: SURFACE }}>
            <h3 className="font-display text-xl mb-3" style={{ color: TEXT }}>Confirm update</h3>
            <p className="text-sm mb-1" style={{ color: TEXT }}>
              You are about to {action === "add" ? "add" : "deduct"} <span className="font-semibold">{amount} points</span> {action === "add" ? "to" : "from"} <span className="font-semibold">{HOUSES_META[osrahId].name}</span>.
            </p>
            <p className="text-sm mb-5" style={{ color: MUTED }}>Reason: {reason}</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirming(false)} className="flex-1 py-2 rounded-md text-sm font-semibold border" style={{ borderColor: "#DEDDD6", color: TEXT }}>Cancel</button>
              <button onClick={confirmSubmit} className="flex-1 py-2 rounded-md text-sm font-semibold" style={{ backgroundColor: BRASS, color: "#1B1200" }}>Confirm Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Point history table                                                    */
/* ------------------------------------------------------------------ */
function PointHistoryTable({ history }) {
  const [osrahFilter, setOsrahFilter] = useState("All");
  const [teacherFilter, setTeacherFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const teachers = useMemo(() => ["All", ...new Set(history.map((h) => h.teacher))], [history]);

  const filtered = history
    .filter((h) => osrahFilter === "All" || h.osrahId === osrahFilter)
    .filter((h) => teacherFilter === "All" || h.teacher === teacherFilter)
    .filter((h) => typeFilter === "All" || (typeFilter === "Added" ? h.change > 0 : h.change < 0))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <Filter size={15} style={{ color: MUTED }} />
        <select value={osrahFilter} onChange={(e) => setOsrahFilter(e.target.value)} className="text-sm px-2.5 py-1.5 rounded-md border" style={{ borderColor: "#DEDDD6" }}>
          <option value="All">All Osrahs</option>
          {HOUSE_ORDER.map((id) => <option key={id} value={id}>{HOUSES_META[id].name}</option>)}
        </select>
        <select value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)} className="text-sm px-2.5 py-1.5 rounded-md border" style={{ borderColor: "#DEDDD6" }}>
          {teachers.map((t) => <option key={t} value={t}>{t === "All" ? "All Teachers" : t}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="text-sm px-2.5 py-1.5 rounded-md border" style={{ borderColor: "#DEDDD6" }}>
          <option value="All">Added & Deducted</option>
          <option value="Added">Added only</option>
          <option value="Deducted">Deducted only</option>
        </select>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: SURFACE, boxShadow: "0 2px 10px rgba(18,24,43,0.07)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#F7F6F1" }}>
                {["Date", "Osrah", "Change", "Reason", "Submitted by"].map((h) => (
                  <th key={h} className="text-left font-semibold px-4 py-2.5 whitespace-nowrap" style={{ color: MUTED }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((h) => (
                <tr key={h.id} className="border-t" style={{ borderColor: "#F0EFE9" }}>
                  <td className="px-4 py-2.5 whitespace-nowrap" style={{ color: TEXT }}>{fmtDateShort(h.date.slice(0, 10))}</td>
                  <td className="px-4 py-2.5"><HouseChip id={h.osrahId} size="sm" /></td>
                  <td className="px-4 py-2.5 font-semibold tabular-nums" style={{ color: h.change > 0 ? "#1E6B37" : "#8A2E23" }}>{h.change > 0 ? "+" : ""}{h.change}</td>
                  <td className="px-4 py-2.5" style={{ color: TEXT }}>{h.reason}{h.note ? <span style={{ color: MUTED }}> — {h.note}</span> : null}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap" style={{ color: MUTED }}>{h.teacher}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center" style={{ color: MUTED }}>No matching entries.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Competition management                                                 */
/* ------------------------------------------------------------------ */
function emptyCompForm() {
  return { name: "", description: "", date: "", startTime: "", endTime: "", location: "", category: "Sports", eligibleGroups: "", maxParticipants: "", registrationDeadline: "", status: "Upcoming" };
}

function CompetitionForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || emptyCompForm());
  const [formError, setFormError] = useState("");
  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }
  function submit() {
    if (!form.name.trim()) { setFormError("Enter a competition name."); return; }
    if (!form.date) { setFormError("Pick a date."); return; }
    if (!form.location.trim()) { setFormError("Enter a location."); return; }
    setFormError("");
    onSave(form);
  }
  return (
    <div className="rounded-xl p-6 space-y-3" style={{ backgroundColor: SURFACE, boxShadow: "0 2px 10px rgba(18,24,43,0.07)" }}>
      <h3 className="font-display text-lg mb-1" style={{ color: TEXT }}>{initial ? "Edit Competition" : "Create Competition"}</h3>
      {formError && (
        <p className="text-xs font-medium px-3 py-2 rounded-md" style={{ backgroundColor: "#F6E4E2", color: "#8A2E23" }}>{formError}</p>
      )}
      <div>
        <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Competition name</label>
        <input value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full px-3 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }} />
      </div>
      <div>
        <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Description</label>
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} className="w-full px-3 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Date</label>
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="w-full px-2 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }} />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Start time</label>
          <input type="time" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} className="w-full px-2 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }} />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>End time</label>
          <input type="time" value={form.endTime} onChange={(e) => set("endTime", e.target.value)} className="w-full px-2 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }} />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Location</label>
        <input value={form.location} onChange={(e) => set("location", e.target.value)} className="w-full px-3 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Category</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full px-3 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Status</label>
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full px-3 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Eligible year groups</label>
        <input value={form.eligibleGroups} onChange={(e) => set("eligibleGroups", e.target.value)} placeholder="e.g. Year 7 - Year 13" className="w-full px-3 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Max participants <span style={{ color: MUTED }}>(optional)</span></label>
          <input value={form.maxParticipants} onChange={(e) => set("maxParticipants", e.target.value)} className="w-full px-3 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }} />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: TEXT }}>Registration deadline <span style={{ color: MUTED }}>(optional)</span></label>
          <input type="date" value={form.registrationDeadline} onChange={(e) => set("registrationDeadline", e.target.value)} className="w-full px-3 py-2 rounded-md border text-sm" style={{ borderColor: "#DEDDD6" }} />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2 rounded-md text-sm font-semibold border" style={{ borderColor: "#DEDDD6", color: TEXT }}>Cancel</button>
        <button type="button" onClick={submit} className="flex-1 py-2 rounded-md text-sm font-semibold" style={{ backgroundColor: BRASS, color: "#1B1200" }}>Save Competition</button>
      </div>
    </div>
  );
}

function ResultsEntryForm({ comp, onSave, onCancel }) {
  const [points, setPoints] = useState(Object.fromEntries(HOUSE_ORDER.map((id) => [id, comp.results?.find((r) => r.osrahId === id)?.points ?? 0])));
  function submit() {
    onSave(HOUSE_ORDER.map((id) => ({ osrahId: id, points: Number(points[id]) || 0 })));
  }
  return (
    <div className="rounded-xl p-6 space-y-3" style={{ backgroundColor: SURFACE, boxShadow: "0 2px 10px rgba(18,24,43,0.07)" }}>
      <h3 className="font-display text-lg mb-1" style={{ color: TEXT }}>Record Results — {comp.name}</h3>
      <p className="text-xs mb-2" style={{ color: MUTED }}>Enter the points each Osrah earned. This is added directly to their totals and logged in the audit history.</p>
      <div className="space-y-2">
        {HOUSE_ORDER.map((id) => (
          <div key={id} className="flex items-center justify-between gap-3">
            <HouseChip id={id} size="sm" />
            <input
              type="number" value={points[id]}
              onChange={(e) => setPoints((p) => ({ ...p, [id]: e.target.value }))}
              className="w-24 px-2 py-1.5 rounded-md border text-sm text-right" style={{ borderColor: "#DEDDD6" }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2 rounded-md text-sm font-semibold border" style={{ borderColor: "#DEDDD6", color: TEXT }}>Cancel</button>
        <button type="button" onClick={submit} className="flex-1 py-2 rounded-md text-sm font-semibold" style={{ backgroundColor: BRASS, color: "#1B1200" }}>Save Results</button>
      </div>
    </div>
  );
}

function CompetitionManager({ data, setData, persist, teacher }) {
  const [mode, setMode] = useState("list"); // list | create | edit | results
  const [activeId, setActiveId] = useState(null);
  const active = data.competitions.find((c) => c.id === activeId);

  function createCompetition(form) {
    const next = structuredClone(data);
    next.competitions.unshift({ ...form, id: "c" + Date.now(), results: null });
    setData(next); persist(next); setMode("list");
  }
  function editCompetition(form) {
    const next = structuredClone(data);
    const c = next.competitions.find((c) => c.id === activeId);
    Object.assign(c, form);
    setData(next); persist(next); setMode("list");
  }
  function deleteCompetition(id) {
    const next = structuredClone(data);
    next.competitions = next.competitions.filter((c) => c.id !== id);
    setData(next); persist(next);
  }
  function saveResults(results) {
    const next = structuredClone(data);
    const comp = next.competitions.find((c) => c.id === activeId);
    const already = !!comp.results;
    comp.results = results;
    comp.status = "Completed";

    if (!already) {
      results.forEach((r) => {
        if (r.points === 0) return;
        const osrah = next.osrahs.find((o) => o.id === r.osrahId);
        osrah.points += r.points;
        osrah.lastChange = { amount: r.points, date: new Date().toISOString().slice(0, 10) };
        if (r.points === Math.max(...results.map((x) => x.points)) && r.points > 0) osrah.wins += 1;
        next.history.unshift({
          id: "h" + Date.now() + r.osrahId, date: new Date().toISOString().slice(0, 16),
          osrahId: r.osrahId, change: r.points, reason: `Results — ${comp.name}`,
          competitionId: comp.id, teacher: teacher.name, note: "",
        });
      });
      const beforeRanks = Object.fromEntries(rankedList(data.osrahs).map((o) => [o.id, o.rank]));
      const afterRanks = Object.fromEntries(rankedList(next.osrahs).map((o) => [o.id, o.rank]));
      next.osrahs.forEach((o) => { o.rankChange = beforeRanks[o.id] - afterRanks[o.id]; });
    }
    setData(next); persist(next); setMode("list");
  }

  if (mode === "create") return <CompetitionForm onSave={createCompetition} onCancel={() => setMode("list")} />;
  if (mode === "edit") return <CompetitionForm initial={active} onSave={editCompetition} onCancel={() => setMode("list")} />;
  if (mode === "results") return <ResultsEntryForm comp={active} onSave={saveResults} onCancel={() => setMode("list")} />;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setMode("create")} className="inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-md" style={{ backgroundColor: BRASS, color: "#1B1200" }}>
          <Plus size={15} /> Create Competition
        </button>
      </div>
      <div className="space-y-3">
        {data.competitions.map((c) => (
          <div key={c.id} className="rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ backgroundColor: SURFACE, boxShadow: "0 2px 10px rgba(18,24,43,0.07)" }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CategoryTag category={c.category} />
                <StatusPill status={c.status} />
              </div>
              <div className="font-medium text-sm" style={{ color: TEXT }}>{c.name}</div>
              <div className="text-xs" style={{ color: MUTED }}>{fmtDate(c.date)} · {c.location}</div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => { setActiveId(c.id); setMode("edit"); }} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md border" style={{ borderColor: "#DEDDD6", color: TEXT }}>
                <Edit2 size={13} /> Edit
              </button>
              {c.results ? (
                <span className="text-xs font-medium px-2.5 py-1.5" style={{ color: MUTED }}>Results recorded</span>
              ) : (
                <button onClick={() => { setActiveId(c.id); setMode("results"); }} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md" style={{ backgroundColor: "#E4F3E8", color: "#1E6B37" }}>
                  <Check size={13} /> Record Results
                </button>
              )}
              <button onClick={() => deleteCompetition(c.id)} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-md" style={{ backgroundColor: "#F6E4E2", color: "#8A2E23" }}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Error boundary — surfaces crashes instead of a silent dead page       */
/* ------------------------------------------------------------------ */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ backgroundColor: PAPER, minHeight: "300px" }} className="flex items-center justify-center p-8 font-sans">
          <div className="max-w-md text-center">
            <p className="font-semibold mb-2" style={{ color: "#8A2E23" }}>Something went wrong rendering the app.</p>
            <p className="text-xs mb-4" style={{ color: MUTED }}>{String(this.state.error && this.state.error.message ? this.state.error.message : this.state.error)}</p>
            <button onClick={() => this.setState({ error: null })} className="text-sm font-semibold px-4 py-2 rounded-md" style={{ backgroundColor: BRASS, color: "#1B1200" }}>
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/* Root app                                                              */
/* ------------------------------------------------------------------ */
function OsrahChampionshipApp() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nav, setNav] = useState({ page: "home" });
  const [teacher, setTeacher] = useState({ loggedIn: false, name: "" });
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, true);
        setData(JSON.parse(res.value));
      } catch {
        const seed = seedData();
        setData(seed);
        try { await window.storage.set(STORAGE_KEY, JSON.stringify(seed), true); } catch {}
      }
      setLoading(false);
    })();
  }, []);

  const persist = useCallback((next) => {
    window.storage.set(STORAGE_KEY, JSON.stringify(next), true).catch(() => {});
  }, []);

  function resetDemo() {
    const seed = seedData();
    setData(seed);
    persist(seed);
  }

  if (loading || !data) {
    return (
      <div className="min-h-[400px] flex items-center justify-center" style={{ backgroundColor: PAPER }}>
        <div className="flex items-center gap-2 text-sm" style={{ color: MUTED }}>
          <Loader2 size={16} className="animate-spin" /> Loading standings…
        </div>
      </div>
    );
  }

  const ranked = rankedList(data.osrahs);

  function goToOsrah(id) { setNav({ page: "osrah", id }); window.scrollTo(0, 0); }
  function goToComp(id) { setNav({ page: "competition", id }); window.scrollTo(0, 0); }

  return (
    <div style={{ backgroundColor: PAPER, minHeight: "100%" }} className="font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Oswald', sans-serif; letter-spacing: -0.01em; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      <Header
        nav={nav} setNav={setNav} teacher={teacher}
        onLoginClick={() => setShowLogin(true)}
        onLogout={() => { setTeacher({ loggedIn: false, name: "" }); setNav({ page: "home" }); }}
      />

      {nav.page === "home" && (
        <>
          <Hero leader={ranked[0]} />
          <StandingsSection ranked={ranked} onSelect={goToOsrah} />
          <OsrahCardsGrid ranked={ranked} onSelect={goToOsrah} />
          <UpcomingCompetitions competitions={data.competitions} onSelect={goToComp} onSeeAll={() => setNav({ page: "competitions" })} />
          <RecentResults competitions={data.competitions} onSelect={goToComp} onSeeAll={() => setNav({ page: "results" })} />
        </>
      )}

      {nav.page === "osrah" && (
        <OsrahDetailPage
          osrah={ranked.find((o) => o.id === nav.id)}
          competitions={data.competitions}
          history={data.history}
          onBack={() => setNav({ page: "home" })}
          onSelectComp={goToComp}
        />
      )}

      {nav.page === "competitions" && <CompetitionsPage competitions={data.competitions} onSelect={goToComp} />}
      {nav.page === "competition" && (
        <CompetitionDetailPage comp={data.competitions.find((c) => c.id === nav.id)} onBack={() => setNav({ page: "competitions" })} />
      )}
      {nav.page === "results" && <ResultsPage competitions={data.competitions} onSelect={goToComp} />}
      {nav.page === "about" && <AboutPage />}

      {nav.page === "dashboard" && (
        teacher.loggedIn ? (
          <TeacherDashboard data={data} setData={setData} persist={persist} teacher={teacher} />
        ) : (
          <div className="max-w-md mx-auto px-5 py-16 text-center">
            <Lock size={28} className="mx-auto mb-3" style={{ color: MUTED }} />
            <p className="text-sm mb-4" style={{ color: MUTED }}>Teacher login is required to view this page.</p>
            <button onClick={() => setShowLogin(true)} className="text-sm font-semibold px-4 py-2 rounded-md" style={{ backgroundColor: BRASS, color: "#1B1200" }}>
              Log in as teacher
            </button>
          </div>
        )
      )}

      {showLogin && (
        <TeacherLoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={(name) => { setTeacher({ loggedIn: true, name }); setShowLogin(false); setNav({ page: "dashboard" }); }}
        />
      )}

      <footer className="mt-6 border-t py-6" style={{ borderColor: "#E3E2DA" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: MUTED }}>
          <span>Osrah Championship · 2026–27 Season</span>
          {teacher.loggedIn && (
            <button onClick={resetDemo} className="inline-flex items-center gap-1 hover:underline">
              <RotateCcw size={12} /> Reset demo data
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function OsrahChampionship() {
  return (
    <ErrorBoundary>
      <OsrahChampionshipApp />
    </ErrorBoundary>
  );
}
