export const site = {
  name: "Khushi Parmar",
  title: "Khushi Parmar, Software Engineer",
  description:
    "I'm a software engineer in New York. I build backend systems and full stack products, and I work with applied AI.",
  location: "New York, NY",
  email: "khushieeparmar@gmail.com",
  github: "https://github.com/khushi491",
  linkedin: "https://linkedin.com/in/khushieeparmar",
  x: "https://x.com/khushi_js",
  xHandle: "@khushi_js",
  resume: "/Khushi_Parmar_Resume.pdf",
  /**
   * Optional portrait. Drop a file in /public and set this to its path
   * (for example "/portrait.jpg") to show it in the hero. Leave null to
   * keep the typography-led layout.
   */
  portraitSrc: null as string | null,
  portraitAlt: "Portrait of Khushi Parmar",
};

export const nav = [
  { href: "#work", label: "Work" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#story", label: "Story" },
  { href: "#contact", label: "Contact" },
] as const;

export type Link = { href: string; label: string; external?: boolean };

export type CaseStudy = {
  id: string;
  kicker: string;
  title: string;
  lede: string;
  problem: string;
  built: string[];
  flow: { step: string; text: string }[];
  stack: string[];
  links: Link[];
  codeOnRequest?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "monsoon",
    kicker: "01  /  Featured",
    title: "Monsoon",
    lede: "An agent that can run errands with a user's money, but only up to the on chain spend limits the user set. It cannot raise those limits.",
    problem:
      "If an agent is going to spend on someone's behalf, the hard part is not the checkout. It is making sure the agent cannot spend more than the user allowed, and choosing a payment rail the seller will actually accept.",
    built: [
      "A deterministic router that picks a rail. It uses x402 where the seller supports it, or a Rain virtual card everywhere else.",
      "Spend limits live in a PolicyTreasury contract on Monad testnet, so the agent cannot raise them.",
      "A SwapPool converts other holdings into the USDC the treasury spends.",
      "A Next.js dashboard for the spend feed, plus an MCP layer with 12 tools the agent can use. The tools themselves don't hold the business logic.",
    ],
    flow: [
      {
        step: "01",
        text: "PolicyTreasury holds the user's spend limits on Monad testnet.",
      },
      {
        step: "02",
        text: "The router selects x402 or a Rain virtual card from those limits.",
      },
      {
        step: "03",
        text: "SwapPool converts other holdings into the USDC being spent.",
      },
      {
        step: "04",
        text: "The dashboard and MCP tools expose the spend feed to the user and the agent.",
      },
    ],
    stack: [
      "TypeScript",
      "Next.js",
      "Express",
      "Solidity",
      "Foundry",
      "viem",
      "x402",
      "Rain",
      "Monad testnet",
      "MCP",
    ],
    links: [
      {
        href: "https://monsoon-dashboard.vercel.app/",
        label: "Live demo",
        external: true,
      },
    ],
    codeOnRequest: true,
  },
  {
    id: "arcpay",
    kicker: "02  /  Featured",
    title: "ArcPay",
    lede: "A chainless, cross chain payment system. You can type something like “send $5 to coffee@arcpay” and it settles the transfer.",
    problem:
      "Balances live in silos. USDC might be on one chain, EURC on another, gas somewhere else. A merchant just wants to get paid. The payer should not have to assemble the path by hand.",
    built: [
      "An LLM payment assistant that uses OpenRouter function calling. It turns a request in plain language into a structured payment call, and it resolves UPI style @arcpay handles to on chain addresses.",
      "The settlement path is chosen by a deterministic Smart Transfer engine, not by the model.",
      "USDC can settle across chains over Circle CCTP (burn and mint, with attestation polling). On the same chain, EURC can be swapped to USDC. Balances on Arc, Ethereum Sepolia, and Solana can be pulled into one transfer.",
      "Payment, wallet, and balance operations are exposed as MCP tools behind typed Next.js API routes, using Circle Programmable Wallets and Prisma/Postgres, so an agent can call every action.",
    ],
    flow: [
      {
        step: "01",
        text: "A request in plain language is parsed into a structured payment call, and @arcpay handles resolve to addresses.",
      },
      {
        step: "02",
        text: "Balances are aggregated across Arc, Ethereum Sepolia, and Solana.",
      },
      {
        step: "03",
        text: "The Smart Transfer engine chooses a path. That can be a direct transfer, a same chain swap, or a CCTP bridge.",
      },
      {
        step: "04",
        text: "Settlement runs through Circle Programmable Wallets. MCP tools and API routes make the same actions available to an agent.",
      },
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "OpenRouter",
      "Circle CCTP",
      "Circle Programmable Wallets",
      "Prisma",
      "PostgreSQL",
      "MCP",
      "NextAuth",
    ],
    links: [
      {
        href: "https://governsai-site-x4ti.vercel.app/login?callbackUrl=%2F",
        label: "Live demo",
        external: true,
      },
    ],
    codeOnRequest: true,
  },
];

export type Project = {
  id: string;
  title: string;
  summary: string;
  stack: string[];
  links: Link[];
  codeOnRequest?: boolean;
};

export const projects: Project[] = [
  {
    id: "flowpilot",
    title: "FlowPilot",
    summary:
      "A visual workflow builder for LLM automations. You drag nodes onto a canvas, connect them, run the graph, and watch live traces over WebSockets. That includes RAG, human approval, retries, and branching.",
    stack: [
      "Next.js",
      "TypeScript",
      "React Flow",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "Redis",
      "Celery",
    ],
    links: [
      {
        href: "https://flow-pilot-web-alpha.vercel.app/",
        label: "Live demo",
        external: true,
      },
      {
        href: "https://github.com/khushi491/FlowPilot",
        label: "Source",
        external: true,
      },
    ],
  },
  {
    id: "tabletalk",
    title: "TableTalk AI",
    summary:
      "A restaurant host assistant. It answers questions about hours, wait times, the menu, allergies, reservations, and pickup. It can play answers back with OpenAI TTS, and it has tools for restaurant and menu management.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Prisma",
      "SQLite",
      "OpenAI",
      "Vercel AI SDK",
    ],
    links: [
      {
        href: "https://tabletalk-ai-28l1.vercel.app/",
        label: "Live demo",
        external: true,
      },
      {
        href: "https://github.com/khushi491/tabletalk-ai",
        label: "Source",
        external: true,
      },
    ],
  },
  {
    id: "evalloop",
    title: "EvalLoop",
    summary:
      "A loop that improves itself. A runner generates output from a policy, an evaluator scores it against a rubric, a patcher updates the rules, and the cycle repeats until it hits a target score. The UI shows attempts, score trends, violations, and policy diffs.",
    stack: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "SQLite",
      "Recharts",
      "OpenAI compatible API",
    ],
    links: [
      {
        href: "https://github.com/khushi491/evalloop",
        label: "Source",
        external: true,
      },
    ],
  },
  {
    id: "careerbakers",
    title: "CareerBakers",
    summary:
      "A full stack AI career platform, built as a Turborepo monorepo. Auth is unified, and a Prisma/PostgreSQL data layer covers resumes, interviews, jobs, and billing. One AI engine, OpenAI GPT-4 and the Assistants API, handles resume tailoring, ATS optimization, and mock interviews based on a job description, for both candidates and recruiters.",
    stack: [
      "Turborepo",
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "NextAuth",
      "Google OAuth",
      "Stripe",
      "OpenAI",
    ],
    links: [
      {
        href: "https://www.careerbakers.com/",
        label: "Live site",
        external: true,
      },
    ],
    codeOnRequest: true,
  },
];

export type Role = {
  title: string;
  company: string;
  dates: string;
  bullets: string[];
};

export const experience: Role[] = [
  {
    title: "Full Stack Developer",
    company: "Stealth Startup",
    dates: "February 2024 to August 2025",
    bullets: [
      "I worked on a metaverse NFT gaming platform, and built full stack features for that blockchain metaverse game ecosystem.",
      "I implemented game APIs and user interactions for the marketplace, assets, and gameplay systems.",
      "I worked on Web3 integrations for wallet connectivity and NFT ownership verification.",
      "I set up CI/CD pipelines with GitHub Actions and Docker to automate build, testing, and deployment, which made development more efficient and releases more reliable.",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "Webforest LLP",
    dates: "November 2022 to December 2023",
    bullets: [
      "I designed and built full stack applications and backend services with Node.js, Python, and Core Java, using OOP principles so the systems would stay reliable.",
      "I built REST APIs to support microservice architectures, so data could flow end to end and the systems would stay stable in production.",
      "I improved scalability by deploying services on GCP and Azure.",
      "I handled deployments with Docker, Kubernetes, CI/CD, and infrastructure as code, which made releases more stable and faster to iterate on.",
    ],
  },
  {
    title: "React Js Developer",
    company: "Wedowebapps LLC",
    dates: "May 2021 to November 2022",
    bullets: [
      "I built responsive, mobile friendly UIs with TypeScript, React, and Redux, so state stayed manageable and data flows stayed predictable.",
      "I used software design patterns and a component based architecture to make the frontend easier to scale and maintain.",
      "I worked in an Agile/Scrum setup, and kept frontend delivery in line with backend services and product timelines.",
      "I tightened user feedback loops by improving how the client and server communicate, and by handling data asynchronously with AJAX and Axios.",
      "I added health checks, logging, and monitoring to make services more reliable and cut down on downtime.",
    ],
  },
  {
    title: "Web Developer Intern",
    company: "Techyhood Software Solution",
    dates: "December 2020 to May 2021",
    bullets: [
      "I built full stack features with Core Java, JDBC, and Node.js, and got hands on experience with enterprise style web applications.",
      "I built and consumed REST APIs, and worked with SQL and NoSQL databases for data persistence.",
      "I helped with backend services that used Spring and Hibernate, and learned ORM concepts and layered application design.",
      "I followed SDLC processes, and helped with testing, debugging, and iterative feature work on the team.",
    ],
  },
];

export const education = [
  {
    school: "Monroe University",
    place: "New Rochelle, NY",
    degree: "M.S., Computer Science",
    dates: "September 2023 to December 2025",
    detail: "GPA 3.9",
  },
  {
    school: "Maharaja Sayajirao University",
    place: "Baroda, Gujarat, India",
    degree: "Bachelor's, Computer Application",
    dates: "June 2018 to May 2021",
    detail: null as string | null,
  },
];

export const skillGroups = [
  {
    label: "Languages & data",
    items: [
      "JavaScript",
      "TypeScript",
      "Python",
      "MySQL",
      "MongoDB",
      "PostgreSQL",
      "GraphQL",
      "Vector databases",
    ],
  },
  {
    label: "Backend",
    items: [
      "REST API design",
      "Microservice foundations",
      "Secure backend architecture",
      "Node.js",
      "Express",
    ],
  },
  {
    label: "Frameworks",
    items: ["React", "Next.js", "React Native", "Angular", "Vue", "Chart.js"],
  },
  {
    label: "Cloud & tools",
    items: [
      "AWS",
      "GCP",
      "Azure",
      "Docker",
      "Flask",
      "FastAPI",
      "Firebase",
      "CI/CD",
    ],
  },
  {
    label: "AI & systems",
    items: [
      "LLM development",
      "Prompt engineering",
      "Vector search",
      "Orchestration",
      "ML pipelines",
      "Natural language processing",
    ],
  },
];

export const skillTickerLines = [
  skillGroups[0].items,
  [...skillGroups[1].items, ...skillGroups[2].items],
  skillGroups[3].items,
  skillGroups[4].items,
];
