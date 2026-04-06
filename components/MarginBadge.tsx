interface MarginBadgeProps {
  margin: number
}

export default function MarginBadge({ margin }: MarginBadgeProps) {
  let colorClass = 'bg-yellow-100 text-yellow-800'
  if (margin > 70) colorClass = 'bg-green-100 text-green-800'
  else if (margin < 30) colorClass = 'bg-red-100 text-red-800'

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {margin.toFixed(1)}%
    </span>
  )
}
