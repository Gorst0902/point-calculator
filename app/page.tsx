"use client";

import { useEffect, useState } from "react";

// ====== CHỈNH Ở ĐÂY ======
const STORAGE_KEY = "bida-state-v1";
const DEFAULT_NAMES = ["An", "Tôn", "Thiện"];
const STEP = 1; // mỗi lần bấm cộng/trừ bao nhiêu điểm

type Rank = { title: string; emoji: string; card: string; emojiClass?: string };

// Mỗi hạng có 1 chuỗi class Tailwind cho màu thẻ -> sửa màu ngay tại đây
const RANKS: Record<"top" | "mid" | "low" | "even", Rank> = {
  top: {
    title: "Phú ông",
    emoji: "👑",
    card: "bg-linear-to-br from-[#ffd45a] to-[#e8a300] text-[#3a2600] border-[#fff2b3] scale-[1.02]",
  },
  mid: {
    title: "Tiểu tư sản",
    emoji: "☕",
    card: "bg-linear-to-br from-[#e4f1f8] to-[#a9c7d8] text-[#17323f] border-white",
  },
  low: {
    title: "Nô lệ",
    emoji: "⛓️",
    card: "bg-linear-to-br from-[#8a5a3b] to-[#5a3320] text-[#f3e3d3] border-[#3a2012]",
    emojiClass: "animate-sway motion-reduce:animate-none",
  },
  even: {
    title: "Chưa phân giai cấp",
    emoji: "🎱",
    card: "bg-white/10 border-white/30",
  },
};
// =========================

function getRank(score: number, max: number, min: number): Rank {
  if (max === min) return RANKS.even;
  if (score === max) return RANKS.top;
  if (score === min) return RANKS.low;
  return RANKS.mid;
}

export default function Home() {
  const change = (i: number, delta: number) =>
    setScores((s) => s.map((v, idx) => (idx === i ? v + delta : v)));

  const [names, setNames] = useState<string[]>(DEFAULT_NAMES);
  const [scores, setScores] = useState<number[]>(DEFAULT_NAMES.map(() => 0));

  const rename = (i: number, value: string) =>
    setNames((n) => n.map((v, idx) => (idx === i ? value : v)));

  const max = Math.max(...scores);
  const min = Math.min(...scores);

  const [loaded, setLoaded] = useState(false);

  // Load saved data once, when the page opens
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        const ok =
          Array.isArray(data.names) &&
          Array.isArray(data.scores) &&
          data.names.length === DEFAULT_NAMES.length &&
          data.scores.length === DEFAULT_NAMES.length;
        if (ok) {
          setNames(data.names);
          setScores(data.scores);
        }
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Save every time names or scores change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ names, scores }));
    } catch {}
  }, [names, scores, loaded]);

  return (
    <main className="mx-auto flex h-dvh max-w-md flex-col border-x-8 border-[#4a2a14] px-3.5 pt-[calc(env(safe-area-inset-top)+12px)] pb-[calc(env(safe-area-inset-bottom)+12px)]">
      <section className="flex min-h-0 flex-1 flex-col gap-2.5">
        {names.map((name, i) => {
          const rank = getRank(scores[i], max, min);
          return (
            <article
              key={i}
              className={`flex min-h-0 flex-1 flex-col rounded-3xl border-[3px] px-3.5 py-2.5 transition duration-300 ${rank.card}`}
            >
              {/* Tên + danh hiệu */}
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-block text-4xl leading-none ${rank.emojiClass ?? ""}`}
                >
                  {rank.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <input
                    value={name}
                    onChange={(e) => rename(i, e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && e.currentTarget.blur()
                    }
                    maxLength={12}
                    aria-label={`Tên người chơi ${i + 1}`}
                    enterKeyHint="done"
                    className="w-full min-w-0 border-b-2 border-dashed border-current/30 bg-transparent text-2xl leading-none font-extrabold outline-none focus:border-current/80"
                  />
                  <strong className="text-[15px] font-bold">
                    {rank.title}
                  </strong>
                </div>
              </div>

              <div className="flex flex-1 justify-center">
                {/* Nút trừ - điểm - nút cộng */}
                <div className="flex items-center justify-between gap-2.5">
                  <button
                    onClick={() => change(i, -STEP)}
                    aria-label={`Trừ điểm ${name}`}
                    className="size-18 rounded-full bg-[#d0453a] text-[42px] leading-none font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,0.35)] transition active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,0.35)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#ffc83d] [@media(max-height:640px)]:size-14 [@media(max-height:640px)]:text-3xl"
                  >
                    −
                  </button>

                  <span
                    key={scores[i]}
                    className="min-w-22.5 animate-pop text-center text-6xl leading-none font-extrabold motion-reduce:animate-none [@media(max-height:640px)]:text-5xl"
                  >
                    {scores[i]}
                  </span>

                  <button
                    onClick={() => change(i, STEP)}
                    aria-label={`Cộng điểm ${name}`}
                    className="size-18 rounded-full bg-[#1f9d55] text-[42px] leading-none font-extrabold text-white shadow-[0_5px_0_rgba(0,0,0,0.35)] transition active:translate-y-1 active:shadow-[0_1px_0_rgba(0,0,0,0.35)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#ffc83d] [@media(max-height:640px)]:size-14 [@media(max-height:640px)]:text-3xl"
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
