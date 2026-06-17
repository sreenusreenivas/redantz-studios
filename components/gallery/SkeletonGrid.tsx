export default function SkeletonGrid({ count = 12 }: { count?: number }) {
  const heights = [280, 340, 220, 380, 260, 310, 360, 240, 420, 280, 320, 260]
  return (
    <div className="px-[var(--px)] max-w-[var(--max-w)] mx-auto"
      style={{ columns: 3, columnGap: '6px' }}>
      <style>{`
        @media (max-width: 900px) { .sk-wrap { columns: 2 !important; } }
        @media (max-width: 540px) { .sk-wrap { columns: 1 !important; } }
      `}</style>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="mb-1.5 break-inside-avoid rounded bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse"
          style={{ height: heights[i % heights.length] }}
        />
      ))}
    </div>
  )
}
