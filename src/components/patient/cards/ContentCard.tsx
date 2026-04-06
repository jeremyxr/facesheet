function ContentCard({ title, children }: { title: string; children: React.ReactNode; hasLink?: boolean }) {
  return (
    <div className="bg-white border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[var(--color-border-subtle)]">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">{title}</h3>
      </div>
      <div className="px-4 py-3 text-[12px] text-[var(--color-text-secondary)] leading-relaxed flex-1">
        {children}
      </div>
    </div>
  )
}

export { ContentCard }
