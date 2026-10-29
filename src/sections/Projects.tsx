import SectionLabel from '../components/SectionLabel'
import ProjectCard from '../components/projects/ProjectCard'
import { projects } from '../data/projects'
import { useReveal } from '../hooks/useReveal'

export default function Projects() {
  const heading = useReveal<HTMLDivElement>()

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative px-5 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div ref={heading} className="reveal-on-scroll max-w-2xl">
          <SectionLabel index="02">Selected work</SectionLabel>
          <h2 id="projects-title" className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Featured{' '}
            <span className="bg-gradient-to-r from-electric to-violet bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="mt-5 text-slate-400">
            Three projects from my GitHub. Descriptions and tech stacks are taken from each
            repository's code and README.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 lg:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} total={projects.length} />
          ))}
        </ul>
      </div>
    </section>
  )
}
