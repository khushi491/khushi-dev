import { caseStudies, projects, site, type Link } from "@/lib/site";

export const agentOrder = ["muse", "grokbot", "claude", "dots"] as const;

export type AgentId = (typeof agentOrder)[number];

export type PeekSlot = "left" | "topRight" | "bottom";

export type Beat = {
  id: string;
  chip: string;
  text: string;
  links?: Link[];
  codeOnRequest?: boolean;
};

export type AgentScript = {
  id: AgentId;
  name: string;
  role: string;
  /** Short line when this agent wins the turn. */
  victory: string;
  /** First story bubble after the victory line. */
  intro: string;
  beats: Beat[];
  /** Links shown as soon as the panel opens. */
  always?: Link[];
  /** Extra text link, for the skills carousel. */
  more?: Link;
};

export const scuffleLines = [
  "My turn!",
  "No, it's my turn!",
  "Not your turn!",
  "Oh, you did it last time!",
  "I called it!",
  "Save some for me!",
  "You always go first!",
  "I had it first!",
  "Wait, that was my line!",
  "Move over, I was next!",
] as const;

function projectBits(id: string): Pick<Beat, "links" | "codeOnRequest"> {
  const item =
    caseStudies.find((entry) => entry.id === id) ??
    projects.find((entry) => entry.id === id);
  return {
    links: item?.links ?? [],
    codeOnRequest: Boolean(item?.codeOnRequest),
  };
}

export const agents: Record<AgentId, AgentScript> = {
  muse: {
    id: "muse",
    name: "Muse",
    role: "Storyteller",
    victory: "Ha! My turn!",
    intro:
      "I am Muse. Khushi is a software engineer in New York. She builds backend and full stack systems, and she works with applied AI. Ask me how she got here.",
    beats: [
      {
        id: "start",
        chip: "Where did she start?",
        text: "She started as a React JS developer at Wedowebapps. Responsive interfaces, TypeScript, React, and Redux, on an Agile team.",
      },
      {
        id: "webforest",
        chip: "What came next?",
        text: "Webforest LLP, as a full stack developer. Backend services in Node.js, Python, and Core Java, REST APIs, and deploys on GCP and Azure with Docker and Kubernetes.",
      },
      {
        id: "startup",
        chip: "And the startup?",
        text: "From February 2024 to August 2025 she was at a stealth startup, building a blockchain marketplace for a metaverse game. Game APIs, wallets, and NFT ownership.",
      },
      {
        id: "school",
        chip: "What about school?",
        text: "She finished an M.S. in Computer Science at Monroe University in December 2025, with a GPA of 3.9. Before that, a bachelor's degree in computer application from Maharaja Sayajirao University in Baroda.",
      },
      {
        id: "now",
        chip: "Where is she now?",
        text: "New York. Backend and full stack, with applied AI in the work she ships. She likes a messy brief that turns into software people can actually use.",
      },
    ],
  },
  grokbot: {
    id: "grokbot",
    name: "Grok",
    role: "The quick one",
    victory: "Yes! My turn!",
    intro:
      "I am Grok. I will be quick. Backend, full stack, and applied AI, plus payments and agents that call tools. The skills carousel below is the real list. I did not add anything she does not use.",
    beats: [
      {
        id: "backend",
        chip: "Backend?",
        text: "That is home. Node.js, TypeScript, Python, Express, REST APIs, and care about how a service is shaped so it can stay up.",
      },
      {
        id: "fullstack",
        chip: "Full stack?",
        text: "React, Next.js, and the other frameworks on the carousel. She builds the interface and the API under it.",
      },
      {
        id: "ai",
        chip: "Applied AI?",
        text: "LLM development, prompt engineering, vector search, and agents that call tools instead of guessing. The model does not get to invent the important decision.",
      },
      {
        id: "payments",
        chip: "Payments?",
        text: "Web3 payment agents, and products where money has to move across chains. The path is chosen by code, not by the model.",
      },
    ],
    more: { href: "#skills", label: "See the skills carousel" },
  },
  claude: {
    id: "claude",
    name: "Claude Duet",
    role: "Projects",
    victory: "Ha! My turn!",
    intro:
      "I am Claude Duet. Projects, then. I will keep this accurate, even if I would like to gloat. Pick one.",
    beats: [
      {
        id: "monsoon",
        chip: "Monsoon",
        text: "Monsoon lets an agent spend on someone's behalf, only up to the limits that person set. The limits live in a contract, so the agent cannot raise them. She built it for the Raingentic Commerce Hackathon in New York.",
        ...projectBits("monsoon"),
      },
      {
        id: "arcpay",
        chip: "ArcPay",
        text: "ArcPay is a chainless, cross chain payment system. You can ask it to send money to a handle like coffee@arcpay. A deterministic engine picks the settlement path. The model does not.",
        ...projectBits("arcpay"),
      },
      {
        id: "careerbakers",
        chip: "CareerBakers",
        text: "CareerBakers is a full stack career platform. OpenAI GPT-4 and the Assistants API tailor resumes, do ATS optimization, and run mock interviews for candidates and recruiters. Stripe handles subscriptions.",
        ...projectBits("careerbakers"),
      },
      {
        id: "flowpilot",
        chip: "FlowPilot",
        text: "FlowPilot is a visual builder for LLM workflows. Drag nodes, connect them, run the graph, and watch a live trace. RAG, human approval, retries, and branching are part of it.",
        ...projectBits("flowpilot"),
      },
      {
        id: "tabletalk",
        chip: "TableTalk AI",
        text: "TableTalk AI is a restaurant host. It answers questions about hours, the wait, the menu, allergies, reservations, and pickup, and it can speak the answer with OpenAI TTS.",
        ...projectBits("tabletalk"),
      },
      {
        id: "evalloop",
        chip: "EvalLoop",
        text: "EvalLoop works on its own output. A runner writes, an evaluator scores it, a patcher updates the rules, and the loop repeats until it hits a target. The screen shows attempts, scores, violations, and policy diffs.",
        ...projectBits("evalloop"),
      },
    ],
  },
  dots: {
    id: "dots",
    name: "Dot",
    role: "Contact",
    victory: "Oh. My turn?",
    intro:
      "Oh. Hi. I am Dot. I can share how to reach Khushi, if that is alright. She is in New York.",
    beats: [
      {
        id: "email",
        chip: "Is email okay?",
        text: "Yes. khushieeparmar@gmail.com. She reads it.",
      },
      {
        id: "resume",
        chip: "Where is the resume?",
        text: "Right here. It is her resume, as a PDF.",
      },
    ],
    always: [
      { href: `mailto:${site.email}`, label: site.email },
      { href: site.github, label: "github.com/khushi491", external: true },
      {
        href: site.linkedin,
        label: "linkedin.com/in/khushieeparmar",
        external: true,
      },
      { href: site.x, label: "@khushi_js", external: true },
      { href: site.resume, label: "Download resume" },
    ],
  },
};

const slotPreference: Record<PeekSlot, AgentId[]> = {
  left: ["muse", "dots", "claude", "grokbot"],
  topRight: ["grokbot", "claude", "dots", "muse"],
  bottom: ["claude", "grokbot", "dots", "muse"],
};

export function assignPeeks(selected: AgentId): Record<PeekSlot, AgentId> {
  const rest = agentOrder.filter((id) => id !== selected);
  const used = new Set<AgentId>();
  const slots: PeekSlot[] = ["left", "topRight", "bottom"];
  const result = {} as Record<PeekSlot, AgentId>;
  for (const slot of slots) {
    const pick = slotPreference[slot].find(
      (id) => rest.includes(id) && !used.has(id),
    );
    if (!pick) {
      throw new Error(`No agent left for the ${slot} peek`);
    }
    used.add(pick);
    result[slot] = pick;
  }
  return result;
}
