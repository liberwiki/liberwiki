export async function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-b-0">
      <span className="text-sm font-medium">{label}:</span>
      <span className="text-sm text-muted-foreground">{value}</span>
    </div>
  )
}
