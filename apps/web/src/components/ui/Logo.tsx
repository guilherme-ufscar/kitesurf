interface LogoProps {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return <img src="/logo.svg" alt="KITE360º" className={className} />
}
