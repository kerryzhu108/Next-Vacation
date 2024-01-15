import { faUnlock } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { loadStripe } from "@stripe/stripe-js"

export default function UpgradeButton({ className }: { className?: string }) {
  const handleUpgrade = async () => {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "")
    const res = await fetch("/api/stripe", {
      method: "POST",
    })
    const { sessionId } = await res.json()

    stripe?.redirectToCheckout({ sessionId })
  }
  return (
    <button
      className={`bg-gradient-to-r from-indigo-500 to-blue-500 py-3 w-full rounded-md text-white ${className}`}
      onClick={() => handleUpgrade()}
    >
      Upgrade <FontAwesomeIcon icon={faUnlock} className="ml-1" />
    </button>
  )
}
