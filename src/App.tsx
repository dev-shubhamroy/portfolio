import Navbar from './components/Navbar'
import Footer from './components/Footer'
import About from './sections/About'
import Contact from './sections/Contact'
import Hero from './sections/Hero'
import Projects from './sections/Projects'

export default function App() {
  return (
    <div className="min-h-svh bg-[radial-gradient(ellipse_at_top,var(--color-ink-800),var(--color-ink-950)_60%)]">
      <a
        href="#main"
        className="sr-only z-[60] rounded-md bg-ink-900 px-4 py-2 text-sm text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus-visible:outline-2 focus-visible:outline-electric"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
