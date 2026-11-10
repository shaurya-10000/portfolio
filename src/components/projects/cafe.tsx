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
  Bot,
  ChevronLeft,
  ChevronRight,
  Code2,
  CreditCard,
  Database,
  Expand,
  ExternalLink,
  ImageOff,
  Layers,
  MessageSquare,
  ShieldCheck,
  VideoOff,
  X,
  Zap,
} from "lucide-react";

import { Card } from "@/components/card";

/* -------------------------------------------------------------------------- */
/* Content — everything editable lives here                                   */
/* -------------------------------------------------------------------------- */

const LINKS = {
  live: "https://cafe-ruddy-pi.vercel.app",
  source: "https://github.com/shaurya-10000/cafe",
  readme: "https://github.com/shaurya-10000/cafe#readme",
} as const;

const VIDEO = {
  src: "/cafe-demo.mp4",
  poster: "/cafe-thumbnail.jpg",
} as const;

type Screenshot = {
  src: string;
  alt: string;
  title: string;
  caption: string;
};

const SCREENSHOTS: readonly Screenshot[] = [
  {
    src: "/cafe/storefront.png",
    alt: "Storefront menu grid with filters and favorites",
    title: "Storefront",
    caption:
      "Menu grid with filters, favorites, live catalog, and a product modal with reviews — all backed by Supabase Realtime.",
  },
  {
    src: "/cafe/concierge.png",
    alt: "AI concierge streaming a reply with an action card",
    title: "AI concierge",
    caption:
      "Gemini streams a reply and attaches at most one typed action. Destructive actions are confirm-gated before they run.",
  },
  {
    src: "/cafe/checkout.png",
    alt: "Cart and Stripe-hosted checkout",
    title: "Checkout",
    caption:
      "Server-priced totals, coupons, and Stripe-hosted payment. The client never sends a number the database trusts.",
  },
  {
    src: "/cafe/customer-dashboard.png",
    alt: "Customer dashboard with orders and live status timeline",
    title: "Customer dashboard",
    caption:
      "Orders with a live status timeline, capacity-aware booking cancellation, favorites, coupons, and notifications.",
  },
  {
    src: "/cafe/admin-orders.png",
    alt: "Admin orders board with status menus",
    title: "Admin: Orders",
    caption:
      "Active, Scheduled and Past views with in-row status menus, mark-paid buttons, and realtime refetch.",
  },
  {
    src: "/cafe/admin-analytics.png",
    alt: "Revenue chart and logistics split",
    title: "Admin: Analytics",
    caption:
      "Revenue trajectory, order count, top and least item, and a logistics split — computed from live order data.",
  },
];

const STATS = [
  { value: "30", label: "Customer AI actions" },
  { value: "12", label: "Admin AI actions" },
  { value: "6", label: "Admin modules" },
  { value: "0", label: "Client-trusted prices" },
] as const;

const FEATURES = [
  {
    icon: Bot,
    title: "Streaming AI concierge",
    body: "Gemini streams responses that can carry at most one typed action (ADD_TO_CART, PREFILL_RESERVATION, UPDATE_ORDER_STATUS, …). Zod validates every action before the client trusts it.",
  },
  {
    icon: Database,
    title: "Database-enforced pricing",
    body: "Prices, discounts, totals, capacity and booking windows are computed by Postgres triggers. The server never trusts a number the browser typed.",
  },
  {
    icon: ShieldCheck,
    title: "RLS as the real boundary",
    body: "Route protection lives in server layouts for UX, but every mutating policy re-checks the caller's role in the database. Service-role writes sit behind an admin guard.",
  },
  {
    icon: CreditCard,
    title: "Stripe with a ledger",
    body: "order_payments records sessions, payment intents, refunds and disputes. Late payments, amount mismatches and failed refunds are flagged rather than silently accepted.",
  },
  {
    icon: Layers,
    title: "Idempotent by design",
    body: "process_stripe_event() deduplicates events, claim_game_reward() is race-safe, and checkout rolls back cleanly when a coupon expires mid-flight.",
  },
  {
    icon: Accessibility,
    title: "Accessible by default",
    body: "Interactive components have a named control, a visible focus ring, and a prefers-reduced-motion path. The AI confirms before destructive actions.",
  },
] as const;

const ENGINEERING_NOTES = [
  {
    kicker: "Money",
    title: "Postgres is the source of truth",
    body: "Order totals are written as 0 and computed by validate_order_integrity(). Coupons are locked before used_count increments. Capacity is enforced on insert and update.",
  },
  {
    kicker: "AI",
    title: "One typed action per reply",
    body: "The model emits at most one JSON action per turn. The client validates it with Zod, routes it, and asks for confirmation on destructive ones. No free-form tool loops.",
  },
  {
    kicker: "Auth",
    title: "Layouts for UX, RLS for security",
    body: "Server layouts redirect early. Every RLS policy re-verifies the caller. Admin server actions call assertIsAdmin() before the service-role client is used.",
  },
] as const;

const TAGS = [
  "Next.js 15",
  "React 19",
  "TypeScript (strict)",
  "Supabase (Postgres + RLS)",
  "Clerk",
  "Stripe",
  "Google Gemini",
  "Zod",
  "Vitest",
] as const;

const PROOF = [
  {
    href: `${LINKS.readme}#core-guarantees`,
    thumbnail: "/cafe/proof-guarantees.png",
    alt: "Core guarantees table: totals can't be forged, discounts can't be double-spent",
    kicker: "Guarantees",
    title: "9 invariants",
    caption: "totals · coupons · capacity · Stripe",
  },
  {
    href: `${LINKS.readme}#testing`,
    thumbnail: "/cafe/proof-tests.png",
    alt: "Vitest coverage for pricing, coupons, Stripe reconciliation and AI actions",
    kicker: "Tests",
    title: "Pricing & payments",
    caption: "Vitest · order integrity · Stripe",
  },
  {
    href: `${LINKS.readme}#operations`,
    thumbnail: "/cafe/proof-ops.png",
    alt: "ops_health and assert_production_ready SQL checks",
    kicker: "Ops",
    title: "SQL health checks",
    caption: "ops_health · assert_production_ready",
  },
  {
    href: `${LINKS.readme}#security-model`,
    thumbnail: "/cafe/proof-security.png",
    alt: "Security model: RLS, service role gates, Stripe signatures, CSP",
    kicker: "Security",
    title: "RLS + signed webhooks",
    caption: "BOLA-safe · CSP · timing-safe",
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

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

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
      aria-label="Cafe screenshots"
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
              priority={false}
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
            aria-label="Cafe walkthrough video"
            onError={() => setFailed(true)}
            className="absolute inset-0 size-full object-contain"
          />
        )}
      </Card>

      <div className={CAPTION_ROW}>
        <p className="font-semibold text-foreground">Walkthrough</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
          Ask the concierge to add an item, then complete checkout with Stripe.
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

export default function ProjectCafe() {
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
        id="cafe"
        aria-labelledby="cafe-heading"
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
            id="cafe-heading"
            className="text-4xl font-bold tracking-tighter text-foreground text-balance sm:text-5xl"
          >
            Cafe
          </h2>

          <p className="mt-4 max-w-[720px] text-lg leading-relaxed text-muted-foreground text-pretty">
            A full-stack cafe platform where customers order, book and pay in one
            flow, and admins run{" "}
            <span className="text-foreground font-medium">
              orders, bookings, inventory, branches and analytics
            </span>{" "}
            from a live dashboard. A Gemini-powered concierge turns natural
            language into{" "}
            <span className="text-foreground font-medium">
              typed, validated, confirm-gated actions
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
            <MessageSquare className="size-3.5" aria-hidden />
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
          <h3 className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <ShieldCheck className="size-3.5" aria-hidden />
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