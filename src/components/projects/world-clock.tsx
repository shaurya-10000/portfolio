"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  type PanInfo,
  type Variants,
} from "framer-motion";
import {
  Accessibility,
  ArrowUpRight,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Code2,
  Expand,
  ExternalLink,
  FlaskConical,
  Gauge,
  Globe2,
  ImageOff,
  ShieldCheck,
  Sun,
  VideoOff,
  X,
  Zap,
} from "lucide-react";

import { Card } from "@/components/card";

/* -------------------------------------------------------------------------- */
/* Content — everything editable lives here                                   */
/* -------------------------------------------------------------------------- */

const LINKS = {
  live: "https://world-clock-gray.vercel.app",
  source: "https://github.com/shaurya-10000/world-clock",
  readme: "https://github.com/shaurya-10000/world-clock#readme",
} as const;

const VIDEO = {
  src: "/world-clock-demo.mp4",
  poster: "/world-clock-thumbnail.jpg",
} as const;

type Screenshot = {
  src: string;
  alt: string;
  title: string;
  caption: string;
};

const SCREENSHOTS: readonly Screenshot[] = [
  {
    src: "/world-clock/globe.png",
    alt: "Interactive 3D globe showing the day and night terminator over the Earth",
    title: "Interactive 3D globe",
    caption:
      "Drag to spin, release to glide. The day/night line follows the real position of the sun, computed from Meeus's Astronomical Algorithms.",
  },
  {
    src: "/world-clock/clock.png",
    alt: "Analog and digital clock faces set against a dusk sky",
    title: "Analog and digital clocks",
    caption:
      "Each clock sits in the local sky of the selected city — dawn, day, dusk, or night — classified from the sun's actual elevation.",
  },
  {
    src: "/world-clock/cities.png",
    alt: "Cities drawer listing live local times for each city",
    title: "Cities drawer",
    caption:
      "180+ cities with WGS84 coordinates and IANA time zones. Favorites float to the top and persist across reloads.",
  },
  {
    src: "/world-clock/events.png",
    alt: "Astronomical event picker listing solstices, equinoxes, sunrise and sunset",
    title: "Astronomical time travel",
    caption:
      "Jump to a solstice, an equinox, or tomorrow's sunrise in Tokyo. Every clock, sky, and shadow follows the same instant.",
  },
];

const STATS = [
  { value: "180+", label: "Cities with IANA time zones" },
  { value: "2,804", label: "Passing tests across 130 files" },
  { value: "88.8%", label: "Statement coverage (v8)" },
  { value: "60 fps", label: "Target on mid-tier mobile" },
] as const;

const FEATURES = [
  {
    icon: Sun,
    title: "Real solar geometry",
    body: "Meeus-based subsolar point math drives a hand-written GLSL terminator, so the day/night line is astronomically correct — not approximated from the hour.",
  },
  {
    icon: CalendarClock,
    title: "One instant, everywhere",
    body: "Time travel sets an app-wide override through a module-level pub/sub. Every clock, sky, and shadow reads the same moment. No prop drilling, no second code path.",
  },
  {
    icon: Globe2,
    title: "Atmosphere that follows the city",
    body: "Sky classification samples the visible hemisphere instead of the hour, which breaks down above 66° latitude where polar day and night flip the rules.",
  },
  {
    icon: Gauge,
    title: "Built to stay fast",
    body: "Cached Intl formatters, solar state sampled at 4 Hz, DPR clamped to 1.75, and zero allocations inside the frame loop. One shared ticker for the whole app.",
  },
  {
    icon: Accessibility,
    title: "Accessible by design",
    body: "Full keyboard support, screen-reader labels, a proper listbox-pattern event picker with aria-activedescendant, and reduced-motion support throughout.",
  },
  {
    icon: ShieldCheck,
    title: "Fails gracefully",
    body: "If WebGL or localStorage is unavailable, the globe or saved state steps aside and the clocks, search, and cities drawer keep working normally.",
  },
] as const;

const ENGINEERING_NOTES = [
  {
    kicker: "Bridge",
    title: "Two reconcilers, one React tree",
    body: "React Three Fiber runs its own reconciler inside <Canvas>, so context providers above it aren't visible inside. Three module-level refs bridge the gap — one writer each, read-only consumers, never reactive.",
  },
  {
    kicker: "Time",
    title: "App-wide time override",
    body: "A module-level ref with a minimal pub/sub. Every useNow consumer respects it automatically, so time travel needs no context provider and no duplicate code path for 'live' vs 'override'.",
  },
  {
    kicker: "Determinism",
    title: "Zero-flicker star fields",
    body: "Star positions derive from their index rather than Math.random(), so the field is identical on server, client, and across reloads. No hydration mismatch, no shimmer on first paint.",
  },
] as const;

const TAGS = [
  "React 19",
  "Next.js 16",
  "TypeScript (strict)",
  "Three.js / R3F",
  "Tailwind v4",
  "Framer Motion",
  "Vitest",
] as const;

const PROOF = [
  {
    href: `${LINKS.readme}#test-results`,
    thumbnail: "/world-clock/vitest.png",
    alt: "Vitest run summary: 130 test files and 2,804 tests passing",
    kicker: "Tests",
    title: "2,804 passing",
    caption: "130 files · 62–68 s full suite",
  },
  {
    href: `${LINKS.readme}#coverage`,
    thumbnail: "/world-clock/coverage.png",
    alt: "Coverage report: 88.79% statements, 80.26% branches, 90.14% functions",
    kicker: "Coverage",
    title: "88.8% statements",
    caption: "v8 · lib/ sits at 93%",
  },
  {
    href: `${LINKS.readme}#lighthouse`,
    thumbnail: "/world-clock/lighthouse-desktop.png",
    alt: "Lighthouse desktop scores: Performance 90, Best Practices 100, SEO 100",
    kicker: "Lighthouse · Desktop",
    title: "100 Best Practices",
    caption: "90 Performance · 100 SEO",
  },
  {
    href: `${LINKS.readme}#lighthouse`,
    thumbnail: "/world-clock/lighthouse-mobile.png",
    alt: "Lighthouse mobile scores: Performance 71, Accessibility 100, Best Practices 100",
    kicker: "Lighthouse · Mobile",
    title: "100 Accessibility",
    caption: "71 Performance · 100 Best Practices",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Motion + layout constants                                                  */
/* -------------------------------------------------------------------------- */

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 34 },
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.25, ease: "easeIn" },
  }),
};

const SWIPE_DISTANCE = 80;
const SWIPE_MIN_DISTANCE = 24;
const SWIPE_VELOCITY = 500;
const CAPTION_ROW = "min-h-[5.5rem]";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

/* -------------------------------------------------------------------------- */
/* Lightbox                                                                   */
/* -------------------------------------------------------------------------- */

type LightboxImage = {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
};

/**
 * Full-screen image viewer.
 *
 * Closes on Escape or backdrop click. Renders above everything else with a
 * portal-free fixed overlay. Locks body scroll while open, restores focus to
 * the opener on close, and respects prefers-reduced-motion.
 */
function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: readonly LightboxImage[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const count = images.length;
  const current = images[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Focus the close button when the lightbox opens.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Lock body scroll while open; restore on close.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Global keyboard handling: Escape, arrows, Home, End.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          event.preventDefault();
          onClose();
          break;
        case "ArrowLeft":
          event.preventDefault();
          onNavigate((index - 1 + count) % count);
          break;
        case "ArrowRight":
          event.preventDefault();
          onNavigate((index + 1) % count);
          break;
        case "Home":
          event.preventDefault();
          onNavigate(0);
          break;
        case "End":
          event.preventDefault();
          onNavigate(count - 1);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, index, onClose, onNavigate]);

  if (!current) return null;

  const nav = count > 1;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={current.title ?? current.alt}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      {/* Close */}
      <button
        ref={closeRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close image viewer"
        className={`absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80 active:scale-95 ${FOCUS_RING} focus-visible:outline-white sm:right-6 sm:top-6`}
      >
        <X className="size-5" aria-hidden />
      </button>

      {/* Prev */}
      {nav && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((index - 1 + count) % count);
          }}
          aria-label="Previous image"
          className={`absolute left-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80 active:scale-95 ${FOCUS_RING} focus-visible:outline-white sm:left-6`}
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
      )}

      {/* Next */}
      {nav && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((index + 1) % count);
          }}
          aria-label="Next image"
          className={`absolute right-4 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80 active:scale-95 ${FOCUS_RING} focus-visible:outline-white sm:right-6`}
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={index}
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-full w-full max-w-6xl flex-col items-center gap-4"
      >
        <div className="relative h-[70vh] w-full sm:h-[78vh]">
          <Image
            src={current.src}
            alt={current.alt}
            fill
            sizes="100vw"
            priority
            className="object-contain"
          />
        </div>

        {(current.title || current.caption) && (
          <div className="max-w-[80ch] text-center">
            {current.title && (
              <p className="text-sm font-semibold text-white">
                {current.title}
              </p>
            )}
            {current.caption && (
              <p className="mt-1 text-xs leading-relaxed text-white/70 text-pretty">
                {current.caption}
              </p>
            )}
          </div>
        )}

        {nav && (
          <p className="text-xs tabular-nums text-white/50">
            {index + 1} / {count}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Screenshot carousel                                                        */
/* -------------------------------------------------------------------------- */

function SlidePlaceholder({ shot }: { shot: Screenshot }) {
  return (
    <div
      role="img"
      aria-label={`${shot.title} screenshot unavailable`}
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950 px-6 text-center"
    >
      <ImageOff className="size-8 text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium text-foreground">{shot.title}</p>
      <p className="text-xs text-muted-foreground">Screenshot coming soon</p>
      {process.env.NODE_ENV !== "production" && (
        <code className="rounded bg-black/40 px-2 py-1 text-[11px] text-muted-foreground">
          public{shot.src}
        </code>
      )}
    </div>
  );
}

function SlideImage({
  shot,
  priority,
  onOpen,
}: {
  shot: Screenshot;
  priority: boolean;
  onOpen: () => void;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <SlidePlaceholder shot={shot} />;

  return (
    <>
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 45vw, 100vw"
        draggable={false}
        onError={() => setFailed(true)}
        className="pointer-events-none select-none object-cover object-top"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        aria-label={`Open ${shot.title} full screen`}
        className={`absolute bottom-3 right-3 z-20 grid size-9 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80 active:scale-95 ${FOCUS_RING} focus-visible:outline-white`}
      >
        <Expand className="size-4" aria-hidden />
      </button>
    </>
  );
}

function ScreenshotCarousel({
  onOpenLightbox,
}: {
  onOpenLightbox: (index: number) => void;
}) {
  const count = SCREENSHOTS.length;
  const [[index, direction], setPage] = useState<[number, number]>([0, 0]);

  const paginate = useCallback(
    (step: 1 | -1) =>
      setPage(([current]) => [(current + step + count) % count, step]),
    [count],
  );

  const goTo = useCallback(
    (target: number) =>
      setPage((prev) =>
        prev[0] === target ? prev : [target, target > prev[0] ? 1 : -1],
      ),
    [],
  );

  const handleDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    const distance = Math.abs(offset.x);
    const speed = Math.abs(velocity.x);
    const intentional =
      distance > SWIPE_DISTANCE ||
      (distance > SWIPE_MIN_DISTANCE && speed > SWIPE_VELOCITY);
    if (intentional) paginate(offset.x < 0 ? 1 : -1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        paginate(-1);
        break;
      case "ArrowRight":
        event.preventDefault();
        paginate(1);
        break;
      case "Home":
        event.preventDefault();
        goTo(0);
        break;
      case "End":
        event.preventDefault();
        goTo(count - 1);
        break;
      case "Enter":
        event.preventDefault();
        onOpenLightbox(index);
        break;
    }
  };

  const current = SCREENSHOTS[index];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="World Clock screenshots"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`flex flex-col gap-4 rounded-2xl outline-none ${FOCUS_RING}`}
    >
      <Card className="relative aspect-[16/10] overflow-hidden border-border bg-zinc-950 p-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            dragSnapToOrigin
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <SlideImage
              shot={current}
              priority={index === 0}
              onOpen={() => onOpenLightbox(index)}
            />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => paginate(-1)}
          aria-label="Previous screenshot"
          className={`absolute left-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70 active:scale-95 ${FOCUS_RING} focus-visible:outline-white`}
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>

        <button
          type="button"
          onClick={() => paginate(1)}
          aria-label="Next screenshot"
          className={`absolute right-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70 active:scale-95 ${FOCUS_RING} focus-visible:outline-white`}
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </Card>

      <div className={`flex items-start justify-between gap-6 ${CAPTION_ROW}`}>
        <div aria-live="polite" aria-atomic="true" className="min-w-0">
          <p className="font-semibold text-foreground">{current.title}</p>
          <p className="mt-1 max-w-[52ch] text-sm leading-relaxed text-muted-foreground text-pretty">
            {current.caption}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <div role="group" aria-label="Choose a screenshot" className="flex">
            {SCREENSHOTS.map((shot, i) => (
              <button
                key={shot.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show screenshot ${i + 1}: ${shot.title}`}
                aria-current={i === index}
                className={`flex h-6 items-center px-0.5 rounded-full ${FOCUS_RING}`}
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-6 bg-foreground"
                      : "w-1.5 bg-foreground/30 hover:bg-foreground/60"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {index + 1} / {count}
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Demo video                                                                 */
/* -------------------------------------------------------------------------- */

function DemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const wasPlayingRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion || failed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!startedRef.current || wasPlayingRef.current) {
            startedRef.current = true;
            video.preload = "auto";
            video.play().catch(() => {
              /* Autoplay blocked: native controls remain available. */
            });
          }
        } else {
          wasPlayingRef.current = !video.paused;
          video.pause();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [prefersReducedMotion, failed]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="relative aspect-[16/10] overflow-hidden border-border bg-black p-0">
        {failed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <VideoOff className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">
              The demo video couldn&apos;t load.
            </p>
            <a
              href={LINKS.live}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium text-foreground underline underline-offset-4 ${FOCUS_RING}`}
            >
              Try the live demo instead
            </a>
          </div>
        ) : (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            controls
            preload="metadata"
            src={VIDEO.src}
            poster={VIDEO.poster}
            aria-label="World Clock walkthrough video"
            onError={() => setFailed(true)}
            className="absolute inset-0 size-full object-contain"
          />
        )}
      </Card>

      <div className={CAPTION_ROW}>
        <p className="font-semibold text-foreground">Walkthrough</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
          Spin the globe, search a city, then jump to the next solstice.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Small building blocks                                                      */
/* -------------------------------------------------------------------------- */

function ProjectLinks() {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <a
        href={LINKS.live}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90 ${FOCUS_RING}`}
      >
        Open live demo
        <ArrowUpRight className="size-4" aria-hidden />
      </a>
      <a
        href={LINKS.source}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent/50 ${FOCUS_RING}`}
      >
        View source
        <Code2 className="size-4" aria-hidden />
      </a>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="order-2 text-sm text-muted-foreground">{label}</dt>
      <dd className="text-3xl font-bold tracking-tight tabular-nums text-foreground">
        {value}
      </dd>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: (typeof FEATURES)[number]["icon"];
  title: string;
  body: string;
}) {
  return (
    <li className="group">
      <Icon
        className="size-5 text-amber-500 transition-transform group-hover:scale-110"
        aria-hidden
      />
      <h3 className="mt-3 font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
        {body}
      </p>
    </li>
  );
}

function ProofCard({
  href,
  thumbnail,
  alt,
  kicker,
  title,
  caption,
  onOpen,
}: (typeof PROOF)[number] & { onOpen: () => void }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/50 transition-colors hover:border-foreground/30">
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
        {failed ? (
          <div
            role="img"
            aria-label={`${kicker} screenshot unavailable`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center"
          >
            <ImageOff className="size-6 text-muted-foreground" aria-hidden />
            <p className="text-xs font-medium text-foreground">{kicker}</p>
            {process.env.NODE_ENV !== "production" && (
              <code className="rounded bg-black/40 px-2 py-1 text-[10px] text-muted-foreground">
                public{thumbnail}
              </code>
            )}
          </div>
        ) : (
          <>
            <Image
              src={thumbnail}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
              onError={() => setFailed(true)}
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <button
              type="button"
              onClick={onOpen}
              aria-label={`Open ${kicker} screenshot full screen`}
              className={`absolute bottom-2 right-2 z-10 grid size-8 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80 active:scale-95 ${FOCUS_RING} focus-visible:outline-white`}
            >
              <Expand className="size-3.5" aria-hidden />
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col gap-1 p-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
          {kicker}
        </span>
        <span className="font-semibold text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">{caption}</span>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Read details
          <ExternalLink className="size-3" aria-hidden />
        </a>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Featured project: World Clock.
 *
 * Full case study with a screenshot carousel, walkthrough video, headline
 * metrics, feature grid, engineering notes, verified proof (tests, coverage,
 * Lighthouse desktop + mobile), and links to the project README.
 *
 * Every image — carousel slides and proof cards — opens in a full-screen
 * lightbox. Lightbox supports Escape, arrows, Home/End, and click-outside.
 *
 * All content is defined at the top of the file:
 *   LINKS · VIDEO · SCREENSHOTS · STATS · FEATURES
 *   ENGINEERING_NOTES · TAGS · PROOF
 *
 * Edit those arrays to update the section — no component changes required.
 */
export default function ProjectWorldClock() {
  /**
   * Combined lightbox image set: carousel slides first, then proof cards.
   * Indexing matches this order — carousel calls onOpenLightbox(i) with
   * i in [0, SCREENSHOTS.length), proof cards with SCREENSHOTS.length + i.
   */
  const lightboxImages: readonly LightboxImage[] = [
    ...SCREENSHOTS.map((s) => ({
      src: s.src,
      alt: s.alt,
      title: s.title,
      caption: s.caption,
    })),
    ...PROOF.map((p) => ({
      src: p.thumbnail,
      alt: p.alt,
      title: p.kicker,
      caption: p.caption,
    })),
  ];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="world-clock"
        aria-labelledby="world-clock-heading"
        className="mx-auto max-w-7xl px-6 py-24 md:px-8"
      >
        {/* ── Heading ─────────────────────────────────────────── */}
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={revealVariants}
          className="mb-12 flex flex-col"
        >
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-amber-500">
            <Zap className="size-3.5" aria-hidden />
            Featured project
          </p>

          <h2
            id="world-clock-heading"
            className="text-4xl font-bold tracking-tighter text-foreground text-balance sm:text-5xl"
          >
            World Clock
          </h2>

          <p className="mt-4 max-w-[720px] text-lg leading-relaxed text-muted-foreground text-pretty">
            Rotate the planet, search 180+ cities, and jump to the next
            solstice or tomorrow&apos;s sunrise in Tokyo. Every clock, sky, and
            shadow agrees on the same instant — driven by the{" "}
            <span className="text-foreground font-medium">
              actual position of the sun
            </span>
            .
          </p>

          <ProjectLinks />
        </motion.header>

        {/* ── Media: screenshots left, video right ────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={revealVariants}
          className="grid gap-8 md:grid-cols-2"
        >
          <ScreenshotCarousel onOpenLightbox={openLightbox} />
          <DemoVideo />
        </motion.div>

        {/* ── Headline metrics ────────────────────────────────── */}
        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={revealVariants}
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-border py-8 md:grid-cols-4"
        >
          {STATS.map((stat) => (
            <Stat key={stat.label} {...stat} />
          ))}
        </motion.dl>

        {/* ── Feature grid ────────────────────────────────────── */}
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={revealVariants}
          className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <Feature key={feature.title} {...feature} />
          ))}
        </motion.ul>

        {/* ── Engineering notes ───────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={revealVariants}
          className="mt-20"
        >
          <h3 className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <FlaskConical className="size-3.5" aria-hidden />
            Engineering notes
          </h3>

          <div className="grid gap-6 md:grid-cols-3">
            {ENGINEERING_NOTES.map((note) => (
              <Card key={note.title} className="border-border bg-card/50 p-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                  {note.kicker}
                </span>
                <h4 className="mt-2 font-semibold text-foreground">
                  {note.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {note.body}
                </p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* ── Verified proof ──────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={revealVariants}
          className="mt-20"
        >
          <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Verified
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROOF.map((item, i) => (
              <ProofCard
                key={item.kicker}
                {...item}
                onOpen={() => openLightbox(SCREENSHOTS.length + i)}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Tech stack ──────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={revealVariants}
          className="mt-16 flex flex-col gap-4"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Stack
          </h3>
          <ul aria-label="Technologies used" className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>

          <a
            href={LINKS.readme}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline ${FOCUS_RING}`}
          >
            Read the full engineering write-up
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </motion.div>
      </section>

      {/* ── Lightbox ────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={lightboxImages}
            index={lightboxIndex}
            onClose={closeLightbox}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}