"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";
import { TerminalSquare, X } from "lucide-react";
import { siteConfig, projects, skillGroups, experience } from "@/lib/data";
import { getAllPosts, formatDate } from "@/lib/blog";

// =============================================================
// Types & static text
// =============================================================
type Line = {
  kind: "input" | "out" | "ok" | "err" | "ghost";
  text: string;
};

const PROMPT = "sumeet@portfolio:~$";

const WELCOME: Line[] = [
  { kind: "ghost", text: "" },
  { kind: "ghost", text: "  ┌─────────────────────────────────────────┐" },
  { kind: "ghost", text: "  │  sumeet@portfolio · interactive shell   │" },
  { kind: "ghost", text: "  └─────────────────────────────────────────┘" },
  { kind: "ghost", text: "" },
  { kind: "out", text: "Type 'help' for commands. Press Esc or click outside to close." },
  { kind: "ghost", text: "" },
];

const HELP_LINES: string[] = [
  "Available commands:",
  "",
  "  about         — short bio",
  "  whoami        — full identity",
  "  projects, ls  — list selected projects",
  "  skills        — tech stack",
  "  experience    — career timeline",
  "  blog          — open writing",
  "  resume        — open resume",
  "  contact       — get in touch",
  "  github        — open GitHub",
  "  linkedin      — open LinkedIn",
  "  email         — compose email",
  "  date          — current date",
  "  clear         — clear terminal",
  "  exit          — close terminal",
  "",
  "Try one of these for fun:",
  "  sudo hire-me · cowsay <msg> · matrix · vim · coffee · neofetch",
];

// =============================================================
// Easter egg generators
// =============================================================
function cowsay(message: string): string[] {
  const msg = message.trim() || "moo";
  const border = "_".repeat(Math.min(msg.length + 2, 60));
  const top = ` ${border}`;
  const middle = `< ${msg} >`;
  const bottom = ` ${"-".repeat(Math.min(msg.length + 2, 60))}`;
  return [
    top,
    middle,
    bottom,
    "        \\   ^__^",
    "         \\  (oo)\\_______",
    "            (__)\\       )\\/\\",
    "                ||----w |",
    "                ||     ||",
  ];
}

function neofetch(): string[] {
  return [
    "       _____                          _   ",
    "      / ____|                        | |  ",
    "     | (___  _   _ _ __ ___   ___  __| |_ ",
    "      \\___ \\| | | | '_ ` _ \\ / _ \\/ _` | __|",
    "      ____) | |_| | | | | | |  __/ (_| | |_ ",
    "     |_____/ \\__,_|_| |_| |_|\\___|\\__,_|\\__|",
    "",
    "     User:     Sumeet Shrestha",
    "     Title:    Senior Developer @ NepseTrading",
    "     Location: Kathmandu, Nepal",
    "     Studying: BCSIT @ Shubhashree College",
    "     Stack:    Next.js · NestJS · Postgres · Docker",
    "     Learning: Rust · Kubernetes",
    "     Status:   Available for freelance",
    "     Editor:   VS Code (and learning vim, badly)",
    "     Uptime:   3+ years coding · 1+ year shipping prod",
  ];
}

// =============================================================
// Component
// =============================================================
// Routes where the terminal should NOT appear (e.g. printable resume).
const HIDDEN_ON = ["/resume"];

export default function Terminal() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [matrixOn, setMatrixOn] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ----- Open/close + global ⌘K + Esc ---------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K toggles
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((p) => !p);
        return;
      }
      // Backtick opens (only when nothing is focused / not typing already)
      if (
        e.key === "`" &&
        !open &&
        !(document.activeElement instanceof HTMLInputElement) &&
        !(document.activeElement instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // ----- GSAP open animation ------------------------------------------
  useEffect(() => {
    if (!open) return;
    if (!overlayRef.current || !panelRef.current) return;
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: "power2.out" }
    );
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "expo.out" }
    );
    // Focus input after the animation begins
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // ----- Auto-scroll to bottom on new output --------------------------
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  // ----- Output helpers ----------------------------------------------
  const print = (text: string | string[], kind: Line["kind"] = "out") => {
    const arr = Array.isArray(text) ? text : [text];
    setLines((prev) => [...prev, ...arr.map((t) => ({ kind, text: t }))]);
  };

  // ----- Command executor --------------------------------------------
  const execute = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      // Echo the command back as a prompt + input line
      setLines((prev) => [...prev, { kind: "input", text: cmd }]);
      if (!cmd) return;

      const [name, ...rest] = cmd.toLowerCase().split(/\s+/);
      const arg = rest.join(" ");
      const originalArg = cmd.split(/\s+/).slice(1).join(" ");

      switch (name) {
        case "help":
        case "?":
          print(HELP_LINES);
          break;

        case "about":
          print([
            "Sumeet Shrestha — Full-Stack Developer",
            "",
            "Senior Developer at NepseTrading, building real-time trading platforms.",
            "Currently pursuing BCSIT at Shubhashree College of Management.",
            "I care about reliability — slow paths, failure paths, catch-up paths.",
            "",
            "Open to freelance. Sometimes writes about real-time systems & career growth.",
          ]);
          break;

        case "whoami":
          print(`${siteConfig.name} · ${siteConfig.role} · ${siteConfig.location}`);
          break;

        case "neofetch":
          print(neofetch());
          break;

        case "projects":
        case "ls":
          print([
            "Selected work (newest first):",
            "",
            ...projects.map(
              (p, i) =>
                `  ${String(i + 1).padStart(2, "0")}. ${p.name.padEnd(28)} ${p.year.padEnd(14)} ${p.tech.slice(0, 3).join(" · ")}`
            ),
            "",
            "→ Visit live links via the Work section, or type 'cd <slug>'.",
          ]);
          break;

        case "skills":
          print([
            "Tech I ship with daily:",
            "",
            ...skillGroups.flatMap((g) => [
              `  ${g.title}:`,
              `    ${g.items.map((i) => i.name).join(" · ")}`,
              "",
            ]),
          ]);
          break;

        case "experience":
          print([
            "Career timeline:",
            "",
            ...experience.flatMap((e) => [
              `  ${e.period.padEnd(28)} ${e.role}`,
              `  ${" ".padEnd(28)} ${e.company} · ${e.location}`,
              "",
            ]),
          ]);
          break;

        case "blog":
        case "writing": {
          const posts = getAllPosts();
          print([
            "Latest writing:",
            "",
            ...posts.map((p) => `  ${formatDate(p.date).padEnd(20)} ${p.title}`),
            "",
            "Opening /blog ...",
          ]);
          setTimeout(() => {
            router.push("/blog");
            setOpen(false);
          }, 700);
          break;
        }

        case "resume":
          print("Opening /resume ...", "ok");
          setTimeout(() => {
            router.push("/resume");
            setOpen(false);
          }, 500);
          break;

        case "contact":
          print([
            "Get in touch:",
            "",
            `  email     ${siteConfig.email}`,
            `  github    ${siteConfig.links.github}`,
            `  linkedin  ${siteConfig.links.linkedin}`,
            "",
            "Type 'email', 'github', or 'linkedin' to open one of these.",
          ]);
          break;

        case "github":
          print("Opening github.com/sumeetm10 in a new tab ...", "ok");
          window.open(siteConfig.links.github, "_blank", "noopener");
          break;

        case "linkedin":
          print("Opening LinkedIn in a new tab ...", "ok");
          window.open(siteConfig.links.linkedin, "_blank", "noopener");
          break;

        case "email":
        case "mail":
          print("Composing email ...", "ok");
          window.location.href = siteConfig.links.email;
          break;

        case "date":
          print(new Date().toString());
          break;

        case "pwd":
          print("/home/sumeet/portfolio");
          break;

        case "clear":
        case "cls":
          setLines([]);
          break;

        case "exit":
        case "quit":
          print("Goodbye 👋", "ok");
          setTimeout(() => setOpen(false), 400);
          break;

        case "cd": {
          const dest = (arg || "").replace(/^\//, "").replace(/\/$/, "");
          if (dest === "resume") {
            print("Opening /resume ...", "ok");
            setTimeout(() => { router.push("/resume"); setOpen(false); }, 400);
          } else if (dest === "blog" || dest === "writing") {
            print("Opening /blog ...", "ok");
            setTimeout(() => { router.push("/blog"); setOpen(false); }, 400);
          } else if (dest === "" || dest === "~" || dest === "home" || dest === "/") {
            print("Already home.");
          } else {
            print(`cd: no such directory: ${dest}`, "err");
          }
          break;
        }

        // -------------------- Easter eggs --------------------
        case "sudo": {
          if (arg.toLowerCase() === "hire-me" || arg.toLowerCase() === "hire me") {
            print([
              "[sudo] password for sumeet: *********",
              "",
              "  ┌──────────────────────────────────────────┐",
              "  │   ✓ Authentication accepted              │",
              "  │   Drafting your hire-Sumeet email ...    │",
              "  └──────────────────────────────────────────┘",
              "",
            ], "ok");
            setTimeout(() => {
              window.location.href = `mailto:${siteConfig.email}?subject=Let's%20work%20together&body=Hi%20Sumeet%2C%0A%0AI%20saw%20your%20portfolio%20and...`;
            }, 800);
          } else {
            print(`sudo: ${arg || "(nothing)"} : command not found`, "err");
          }
          break;
        }

        case "cowsay":
          print(cowsay(originalArg || "moo"));
          break;

        case "matrix":
          print("Entering the matrix ... (Esc to exit)", "ok");
          setMatrixOn(true);
          setTimeout(() => setMatrixOn(false), 3500);
          break;

        case "vim":
          print([
            "Entering vim ...",
            "(press :wq to save and quit — just kidding, you're still here)",
          ], "ghost");
          break;

        case "rm":
          if (arg === "-rf /" || arg === "-rf /*") {
            print("Nice try.", "err");
          } else {
            print(`rm: cannot remove '${arg || "(nothing)"}': Operation not permitted`, "err");
          }
          break;

        case "coffee":
          print(["    ( (", "     ) )", "  ........", "  |      |]", "  \\      /", "   `----'", "", "☕ Always."]);
          break;

        case "hack":
          print([
            "Initiating hack sequence ...",
            "[####                ] 20%",
            "[##########          ] 50%",
            "[##################  ] 90%",
            "Access granted. Just kidding.",
          ], "ok");
          break;

        case "echo":
          print(originalArg);
          break;

        // -------------------- Fallback --------------------
        default:
          print(`zsh: command not found: ${name}`, "err");
          print("Type 'help' to see what's available.", "ghost");
      }
    },
    [router]
  );

  // ----- Input keydown handling --------------------------------------
  const onInputKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = input;
      if (value.trim()) {
        setHistory((h) => [...h, value]);
      }
      setInput("");
      setHistoryIdx(-1);
      execute(value);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(next);
      setInput(history[next]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const next = historyIdx + 1;
      if (next >= history.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(next);
        setInput(history[next]);
      }
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      // Crude tab-completion: pick the first command whose name starts with input
      const candidates = [
        "help", "about", "whoami", "projects", "skills", "experience",
        "blog", "resume", "contact", "github", "linkedin", "email",
        "date", "clear", "exit", "cd", "ls", "pwd", "neofetch",
        "sudo hire-me", "cowsay ", "matrix", "vim", "coffee", "hack", "echo ",
      ];
      const lower = input.toLowerCase();
      const match = candidates.find((c) => c.startsWith(lower) && c !== lower);
      if (match) setInput(match);
    }
  };

  // ----- Click-outside closes -----------------------------------------
  const onOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      setOpen(false);
    }
  };

  // Skip rendering on standalone pages (e.g. printable resume)
  if (HIDDEN_ON.some((r) => pathname?.startsWith(r))) {
    return null;
  }

  // ----- Floating launch button --------------------------------------
  const FloatingButton = (
    <button
      onClick={() => setOpen(true)}
      aria-label="Open terminal"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full border border-line bg-bg-soft/80 backdrop-blur-xl text-ink-muted hover:text-accent hover:border-accent/50 transition-all shadow-lg shadow-black/30"
    >
      <TerminalSquare size={16} className="group-hover:text-accent" />
      <span className="font-mono text-xs">
        <span className="text-accent">&gt;_</span>
        <span className="hidden sm:inline ml-2 text-ink-subtle">⌘K</span>
      </span>
    </button>
  );

  return (
    <>
      {!open && FloatingButton}

      {open && (
        <div
          ref={overlayRef}
          onClick={onOverlayClick}
          className="fixed inset-0 z-[70] flex items-start justify-center pt-[10vh] px-4 bg-black/60 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Interactive terminal"
        >
          <div
            ref={panelRef}
            className="relative w-full max-w-3xl rounded-xl border border-accent/30 bg-bg/95 backdrop-blur-2xl shadow-2xl shadow-accent/10 overflow-hidden"
            style={{ height: "min(70vh, 600px)" }}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-line bg-bg-soft/60">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <span className="h-3 w-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs font-mono text-ink-subtle">
                  sumeet@portfolio — zsh — 80x24
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close terminal"
                className="text-ink-subtle hover:text-ink p-1 rounded"
              >
                <X size={14} />
              </button>
            </div>

            {/* Scrollback */}
            <div
              ref={scrollRef}
              className="font-mono text-[13px] leading-relaxed p-4 overflow-y-auto"
              style={{ height: "calc(100% - 88px)" }}
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) => (
                <LineView key={i} line={line} />
              ))}
              {matrixOn && <MatrixRain />}
            </div>

            {/* Input row */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-t border-line bg-bg-soft/40 font-mono text-[13px]"
              onClick={() => inputRef.current?.focus()}
            >
              <span className="text-accent select-none whitespace-pre">{PROMPT}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKey}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                className="flex-1 bg-transparent outline-none border-0 text-ink placeholder:text-ink-subtle caret-accent"
                placeholder="type 'help' and press enter"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// =============================================================
// Sub-components
// =============================================================
function LineView({ line }: { line: Line }) {
  if (line.kind === "input") {
    return (
      <div className="flex gap-2 whitespace-pre-wrap break-words">
        <span className="text-accent select-none">{PROMPT}</span>
        <span className="text-ink">{line.text}</span>
      </div>
    );
  }
  const cls =
    line.kind === "ok"
      ? "text-emerald-400"
      : line.kind === "err"
      ? "text-rose-400"
      : line.kind === "ghost"
      ? "text-ink-subtle"
      : "text-ink-muted";
  return (
    <div className={`whitespace-pre-wrap break-words ${cls}`}>{line.text || " "}</div>
  );
}

function MatrixRain() {
  // Brief visual effect — random characters in cascading columns
  const chars = "0123456789ABCDEFｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ@#$%&*+/<>";
  const cols = 36;
  const rows = 10;
  return (
    <div className="my-2 select-none">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="font-mono text-emerald-400/80 leading-none">
          {Array.from({ length: cols })
            .map(() => chars[Math.floor((r + Math.random() * cols * 11) % chars.length)])
            .join(" ")}
        </div>
      ))}
    </div>
  );
}
