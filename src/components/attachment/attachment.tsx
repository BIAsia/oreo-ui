import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { ShimmerText } from "@/components/activity-label";
import { attachment } from "./attachment.variants";
import docIcon from "./assets/doc.svg";
import textIcon from "./assets/text.svg";
import codeIcon from "./assets/code.svg";
import jsonIcon from "./assets/json.svg";
import musicIcon from "./assets/music.svg";
import unknownIcon from "./assets/unknown.svg";
import linkIcon from "./assets/link.svg";
import pdfIcon from "./assets/pdf.svg";
import playIcon from "./assets/play.svg";

export type AttachmentType =
  | "image"
  | "video"
  | "doc"
  | "text"
  | "code"
  | "json"
  | "music"
  | "unknown"
  | "link"
  | "pdf";

const TYPE_ICONS: Record<Exclude<AttachmentType, "image" | "video">, string> = {
  doc: docIcon,
  text: textIcon,
  code: codeIcon,
  json: jsonIcon,
  music: musicIcon,
  unknown: unknownIcon,
  link: linkIcon,
  pdf: pdfIcon,
};

export type AttachmentProps = {
  /** Filename shown next to the icon; omit for the icon-only square. */
  label?: string;
  /** File kind — picks the paper icon, or thumbnail treatment for image/video. */
  type?: AttachmentType;
  /** Thumbnail URL, used when type is image or video. */
  src?: string;
  /** sm compacts the labeled chip to 28px tall. */
  size?: "md" | "sm";
  /** Upload in flight — dot spinner plus shimmered label. */
  loading?: boolean;
  /** When set, the chip grows its remove affordance on hover. */
  onRemove?: () => void;
} & Omit<React.ComponentPropsWithoutRef<"div">, "children">;

/** The × glyph from the kit; geometry is the 9×9 union centered in a 16 box. */
function CloseGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className}>
      <path
        transform="translate(3.5 3.5)"
        fill="currentColor"
        d="M8.14645 0.146447C8.34171 -0.0488155 8.65822 -0.0488153 8.85348 0.146447C9.0487 0.341712 9.04873 0.658228 8.85348 0.853478L5.20699 4.49996L8.85348 8.14645C9.0487 8.34171 9.04873 8.65823 8.85348 8.85348C8.65823 9.04873 8.34171 9.0487 8.14645 8.85348L4.49996 5.20699L0.853478 8.85348C0.658228 9.04873 0.341712 9.0487 0.146447 8.85348C-0.0488153 8.65822 -0.0488155 8.34171 0.146447 8.14645L3.79293 4.49996L0.146447 0.853478C-0.0488155 0.658216 -0.0488155 0.341709 0.146447 0.146447C0.341709 -0.0488155 0.658216 -0.0488155 0.853478 0.146447L4.49996 3.79293L8.14645 0.146447Z"
      />
    </svg>
  );
}

/** Eight-bar dot spinner (Figma Spinner-Dots), stepped like a clock. */
function SpinnerDots({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className}>
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x="7.333"
          y="0"
          width="1.333"
          height="4"
          rx="0.667"
          fill="currentColor"
          transform={`rotate(${i * 45} 8 8)`}
        />
      ))}
    </svg>
  );
}

const tapSpring = { type: "spring", bounce: 0.4, duration: 0.3 } as const;

export function Attachment({
  label,
  type,
  src,
  size = "md",
  loading = false,
  onRemove,
  className,
  ...rest
}: AttachmentProps) {
  const kind: AttachmentType = type ?? (src ? "image" : "unknown");
  const media = (kind === "image" || kind === "video") && !!src;
  const withLabel = label != null;
  const slots = attachment({ withLabel, size, removable: !!onRemove, media });
  const removeLabel = label ? `Remove ${label}` : "Remove attachment";

  const leadingIcon = loading ? (
    <SpinnerDots className={slots.spinner()} />
  ) : media ? (
    <span className={slots.thumb()}>
      <img src={src} alt="" className={slots.image()} />
      {kind === "video" && (
        <img
          src={playIcon}
          alt=""
          className="absolute top-1/2 left-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 [filter:drop-shadow(0_2.33px_7px_rgba(0,0,0,0.08))_drop-shadow(0_0_0.29px_rgba(0,0,0,0.24))]"
        />
      )}
    </span>
  ) : (
    <img src={TYPE_ICONS[kind as Exclude<AttachmentType, "image" | "video">]} alt="" className={slots.typeIcon()} />
  );

  if (!withLabel) {
    return (
      <div className={cn(slots.root(), className)} {...rest}>
        {loading ? (
          <SpinnerDots className={slots.spinner()} />
        ) : media ? (
          <>
            <span className={slots.fill()}>
              <img src={src} alt="" className={slots.image()} />
            </span>
            {kind === "video" && (
              <img
                src={playIcon}
                alt=""
                className="pointer-events-none absolute top-1/2 left-1/2 size-[14px] -translate-x-1/2 -translate-y-1/2 [filter:drop-shadow(0_4.67px_14px_rgba(0,0,0,0.08))_drop-shadow(0_0_0.58px_rgba(0,0,0,0.24))]"
              />
            )}
          </>
        ) : (
          <img src={TYPE_ICONS[kind as Exclude<AttachmentType, "image" | "video">]} alt="" className={slots.typeIcon()} />
        )}
        {onRemove && (
          <motion.button
            type="button"
            aria-label={removeLabel}
            whileTap={{ scale: 0.88 }}
            transition={tapSpring}
            onClick={onRemove}
            className={slots.badge()}
          >
            <CloseGlyph className="size-[10px]" />
          </motion.button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(slots.root(), className)} {...rest}>
      <span className={slots.leading()}>
        {leadingIcon}
        {onRemove && (
          <motion.button
            type="button"
            aria-label={removeLabel}
            whileTap={{ scale: 0.88 }}
            transition={tapSpring}
            onClick={onRemove}
            className={slots.ghost()}
          >
            <CloseGlyph className="size-4" />
          </motion.button>
        )}
      </span>
      <span className={slots.label()}>{loading ? <ShimmerText>{label}</ShimmerText> : label}</span>
    </div>
  );
}

/** The Attachment Bar — a wrapping row of file chips, composer or message side. */
export function AttachmentBar({ className, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("flex flex-wrap items-center gap-[var(--space-x4)]", className)} {...rest} />;
}
