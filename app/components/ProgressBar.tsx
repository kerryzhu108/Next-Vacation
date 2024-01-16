export default function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="fixed top-11 h-1 w-full">
      <div
        className="h-full bg-black rounded-md"
        style={{ transition: "width 1s ease-in-out", width: `${percentage}%` }}
      />
    </div>
  )
}
