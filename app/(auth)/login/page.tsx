import LoginForm from '@/components/forms/LoginForm'
import Image from 'next/image'

const Login = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f2ec] dark:bg-[#120f0b]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(200,104,36,0.2),transparent_38%),radial-gradient(circle_at_80%_30%,rgba(143,74,28,0.15),transparent_36%),radial-gradient(circle_at_45%_85%,rgba(217,168,107,0.22),transparent_40%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(200,104,36,0.26),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(143,74,28,0.2),transparent_38%),radial-gradient(circle_at_45%_85%,rgba(217,168,107,0.12),transparent_36%)]" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1600px] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14 lg:py-14">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(255,255,255,0.74),rgba(255,255,255,0.45))] dark:bg-[linear-gradient(120deg,rgba(26,20,14,0.72),rgba(22,17,12,0.52))]" />
          <div className="absolute right-0 top-0 hidden h-56 w-56 translate-x-1/3 -translate-y-1/4 rounded-full border border-[#d6b894]/65 bg-[#fdf7ef]/55 blur-[2px] lg:block dark:border-[#8f5f3b]/40 dark:bg-[#402814]/20" />
          <div className="w-full max-w-xl">
            <div className="mb-8 hidden lg:block">
              <p className="[font-family:var(--font-cormorant)] text-2xl font-semibold tracking-[0.04em] text-[#9b6430] dark:text-[#d6aa7f]">
                Autumn Studio
              </p>
              <p className="max-w-sm text-sm text-[#8e7965] dark:text-[#b59b83]">
                Gestion elegante y clara para inventario, ventas y pagos.
              </p>
            </div>
            <LoginForm />
          </div>
        </section>

        <section className="relative hidden min-h-screen lg:block">
          <Image
            src="/beach-home.avif"
            alt="Calabazas naranjas"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(9,7,5,0.05),rgba(9,7,5,0.35))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_18%,rgba(255,206,157,0.32),transparent_30%),radial-gradient(circle_at_30%_84%,rgba(91,45,12,0.24),transparent_35%)]" />
          <div className="absolute bottom-10 left-10 max-w-sm rounded-2xl border border-white/30 bg-black/28 px-5 py-4 backdrop-blur-sm">
            <p className="[font-family:var(--font-cormorant)] text-3xl italic leading-tight text-[#ffe6cf]">
              Bienvenido a tu panel
            </p>
            <p className="mt-1 text-sm text-[#ffd8b5]/90">
              Controla tus transacciones con una vista limpia, precisa y profesional.
            </p>
          </div>
        </section>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,rgba(246,242,236,0.95),transparent)] dark:bg-[linear-gradient(to_top,rgba(18,15,11,0.95),transparent)]" />
    </div>
  )
}

export default Login
