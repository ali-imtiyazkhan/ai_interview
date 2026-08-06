const VIDEO_SRC = "/assets/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

export function AmbientBackground() {
  return (
    <>
      <video
        className="fixed inset-0 z-0 h-full w-full object-cover"
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="fixed inset-0 z-[1] bg-background/40" />
      <div className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,oklch(0.6_0.25_280/0.1),transparent_70%),radial-gradient(ellipse_50%_40%_at_90%_100%,oklch(0.55_0.2_160/0.06),transparent_70%)]" />
    </>
  );
}
