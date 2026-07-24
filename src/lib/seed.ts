import type { Cv } from './schema';

export const tomaszCv: Cv = {
  personal: {
    name: 'Tomasz Mamala',
    title: 'Full-Stack Developer',
    email: 'mamalatomasz@gmail.com',
    phone: '+48 571 867 072',
    links: {
      github: 'github.com/majkipl27',
      linkedin: 'linkedin.com/in/tomaszmamala',
      portfolio: 'tmamala.pl',
    },
  },
  summary:
    "Full-Stack Developer with commercial experience building AI-powered platforms and cross-platform mobile apps. Proficient in TypeScript, Next.js, React Native, and Nest.js. Double hackathon winner - including 1st place at HackYeah, Europe's largest stationary hackathon. Track record of independently owning features from UI/UX design through to backend implementation, exceeding expectations in both internships.",
  experience: [
    {
      company: 'Fullstack House',
      role: 'Full Stack Engineer',
      startDate: 'May 2026',
      endDate: 'Present',
      bullets: [
        'Delivered production web apps end-to-end, owning features from frontend implementation through backend architecture and deployment.',
        'Built motion-rich Next.js frontends with a focus on animation and UX, rapidly prototyping new features before production implementation.',
        'Architected backend services in NestJS and PostgreSQL, designing schemas and APIs to support production features.',
        'Shipped reliably through Dockerised CI/CD pipelines and preview environments, keeping releases fast and low-risk.',
      ],
    },
    {
      company: 'discurso.ai',
      role: 'Frontend & Full-Stack Developer Internship',
      startDate: 'July 2025',
      endDate: 'September 2025',
      bullets: [
        'Designed and implemented core UI modules for an AI-driven negotiation learning platform using Next.js, Tailwind CSS, and Shadcn UI, building a consistent design system from Figma prototypes to production code.',
        'Independently expanded beyond the original frontend scope to deliver full features including backend logic in Nest.js, exceeding expectations set at hire.',
        'Collaborated directly with the founding team in an early-stage startup environment, adapting to a fast-moving codebase and shipping weekly.',
      ],
    },
    {
      company: 'Tukano Software House Sp. z o. o.',
      role: 'React Native Developer Internship',
      startDate: 'July 2024',
      endDate: 'July 2024',
      bullets: [
        'Accelerated development of the EcoGuide mobile app by implementing complex cross-platform features in React Native targeting both iOS and Android.',
        'Integrated the app with a RESTful API and handled testing and debugging of mobile-specific behaviour.',
        'Maintained code in Git, collaborating with designers and a project team to deliver production-ready features against spec.',
      ],
    },
  ],
  projects: [
    {
      name: 'Halupedia',
      url: 'halupedia.com',
      description:
        'Co-created Halupedia, a satirical Wikipedia clone where every article is generated on the fly by an LLM pretending it has always existed - complete with fake footnotes, fictional scholars, and invented historical events.',
      bullets: [
        'Built on a Cloudflare Worker with results cached forever in KV, so each hallucinated article is generated once and served instantly after.',
        'Reached #1 on Hacker News and grew to 300k+ users within weeks of launch, with coverage across Cybernews, TechRound, Futurism, Fast Company, and Slashdot.',
        'Includes AI-hallucinated user identities and threaded, Wikipedia-talk-page-style comments, with no signup required.',
      ],
    },
    {
      name: 'Gace AI',
      url: 'gace.dev',
      description:
        'Co-built a developer platform for creating and deploying AI plugins - functions that any LLM can call.',
      bullets: [
        'Includes a TypeScript SDK with a decorator-based API, a sandboxed remote dev server with hot-reload, a browser automation layer, and a plugin marketplace.',
        'Zero-config: developers go from a function to a live remote URL with a single `npm run dev`.',
        'Live product with real users.',
      ],
    },
    {
      name: 'Nuecli',
      url: 'github.com/Majkipl27/neucli',
      description:
        'Comprehensive platform for building production-ready React + TypeScript + Tailwind SPAs from YAML configuration. Includes a CLI scaffolding engine and a visual CMS editor with drag-and-drop configuration management.',
      bullets: [
        'Visual editor with block-based drag-and-drop configuration and real-time YAML export.',
        'Built-in SEO hook generation and persistent global layouts to prevent unnecessary re-renders.',
        'Zustand-based state management with undo/redo and an auto-registered modular block system.',
      ],
    },
  ],
  education: [
    {
      school: 'Zespół Szkół Elektryczno-Mechanicznych w Nowym Sączu',
      degree: 'Technik Programista (Certified Programming Technician)',
      startDate: 'September 2021',
      endDate: 'May 2026',
    },
    {
      school: 'CKE (Centralna Komisja Egzaminacyjna)',
      degree: 'Dyplom zawodowy - Technik Programista',
      startDate: '',
      endDate: 'May 2026',
    },
  ],
  skills: [
    {
      category: 'Front-End',
      items: [
        'JavaScript / TypeScript',
        'React',
        'React Native',
        'Next.js',
        'TailwindCSS',
        'Framer Motion',
        'Shadcn UI',
      ],
    },
    {
      category: 'Backend & Databases',
      items: [
        'Nest.js / Express.js',
        'Node.js',
        'SQL (Postgres, MariaDB)',
        'Prisma',
        'REST API',
      ],
    },
    { category: 'Tools', items: ['Linux', 'Git', 'Vercel', 'Figma'] },
    { category: 'Others', items: ['UI/UX Design'] },
  ],
  languages: [
    { name: 'English', level: 'Professional Working Proficiency' },
    { name: 'Polish', level: 'Native' },
  ],
  achievements: [
    '1st Place - HackYeah 2024, "Social Impact Bridge" category. Europe\'s largest stationary hackathon. Built and shipped a fully working product in 24 hours competing against hundreds of teams.',
    '1st Place - Coding Night 2024 (school hackathon). Outcompeted all teams through rapid architectural planning and frontend prototyping of a complex web application, built overnight.',
  ],
  volunteer: [
    {
      organization: 'Zwolnieni z Teorii',
      role: '"Łeb w Web" - Digital Safety Initiative',
      startDate: 'December 2024',
      endDate: 'April 2025',
      bullets: [
        'Co-led a public digital safety project reaching a wide audience through educational content and social media campaigns.',
        'Managed timelines and cross-functional communication across a team of volunteers.',
        'The project contributed to the Social Impact work recognised at HackYeah 2024.',
      ],
    },
    {
      organization: 'Foundation: Sursum Corda',
      role: 'IT Support',
      startDate: 'September 2022',
      endDate: 'June 2023',
      bullets: [
        'Set up and maintained workstations and managed software installations for a team of 30, providing day-to-day IT support that kept office operations running smoothly.',
      ],
    },
  ],
};
