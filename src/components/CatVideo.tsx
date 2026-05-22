/**
 * Free-floating cat animation.
 *
 * WebM (VP9 with alpha) is preferred — true transparency, the page
 * background (including gradients) shows through cleanly.
 * MP4 with a flat cream background is the fallback for older Safari.
 */
export function CatVideo({ className }: { className?: string }) {
  return (
    <video
      poster="/video/cat-poster.png"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disableRemotePlayback
      controlsList="nodownload noplaybackrate"
      aria-label="A cat enjoying a newsletter"
      className={className ?? "block w-full h-auto"}
    >
      <source src="/video/cat.webm" type="video/webm" />
      <source src="/video/cat.mp4" type="video/mp4" />
    </video>
  );
}
