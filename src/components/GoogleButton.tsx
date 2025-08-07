import Image from 'next/image'

interface GoogleButtonProps {
  onClick?: () => void
  disabled?: boolean
}

export function GoogleButton({ onClick, disabled }: GoogleButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-center gap-2 bg-[#0A0A0A] text-white py-3 px-4 rounded-lg transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1a1a1a]'
      }`}
    >
      <Image
        src="/google.svg"
        alt="Google logo"
        width={20}
        height={20}
        priority
      />
      Sign in with Google
    </button>
  )
} 