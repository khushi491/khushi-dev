import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiPython,
  SiDocker,
  SiGooglecloud,
  SiGithubactions,
  SiPostgresql,
  SiMongodb,
  SiGraphql,
  SiMysql,
  SiAngular,
  SiVuedotjs,
  SiExpress,
  SiFlask,
  SiFastapi,
  SiFirebase,
  SiChartdotjs,
} from "react-icons/si";
import {
  FaCode,
  FaCubes,
  FaShieldHalved,
  FaAws,
  FaCloud,
  FaDatabase,
  FaBrain,
  FaComments,
  FaMicrochip,
  FaDiagramProject,
} from "react-icons/fa6";

export type SkillIcon = {
  Icon: IconType;
  color: string;
  label: string;
};

const EXACT: Record<string, SkillIcon> = {
  javascript: { Icon: SiJavascript, color: "#F7DF1E", label: "JavaScript" },
  typescript: { Icon: SiTypescript, color: "#5A9FE0", label: "TypeScript" },
  python: { Icon: SiPython, color: "#5A9FD4", label: "Python" },
  mysql: { Icon: SiMysql, color: "#5B9BD5", label: "MySQL" },
  mongodb: { Icon: SiMongodb, color: "#4DB33D", label: "MongoDB" },
  postgresql: { Icon: SiPostgresql, color: "#7BA7CC", label: "PostgreSQL" },
  graphql: { Icon: SiGraphql, color: "#EA4AAA", label: "GraphQL" },
  "vector databases": { Icon: FaDatabase, color: "#4FD1C5", label: "Vector databases" },
  "rest api design": { Icon: FaCode, color: "#8B93F8", label: "REST API design" },
  "microservice foundations": {
    Icon: FaCubes,
    color: "#2DD4BF",
    label: "Microservice foundations",
  },
  "secure backend architecture": {
    Icon: FaShieldHalved,
    color: "#C4A56A",
    label: "Secure backend architecture",
  },
  "node.js": { Icon: SiNodedotjs, color: "#6CC24A", label: "Node.js" },
  express: { Icon: SiExpress, color: "#D6CFC2", label: "Express" },
  react: { Icon: SiReact, color: "#61DAFB", label: "React" },
  "next.js": { Icon: SiNextdotjs, color: "#FFFFFF", label: "Next.js" },
  "react native": { Icon: SiReact, color: "#61DAFB", label: "React Native" },
  angular: { Icon: SiAngular, color: "#E23A5E", label: "Angular" },
  vue: { Icon: SiVuedotjs, color: "#4FC08D", label: "Vue" },
  "chart.js": { Icon: SiChartdotjs, color: "#FF6384", label: "Chart.js" },
  aws: { Icon: FaAws, color: "#FF9900", label: "AWS" },
  gcp: { Icon: SiGooglecloud, color: "#4285F4", label: "GCP" },
  azure: { Icon: FaCloud, color: "#3AA0E3", label: "Azure" },
  docker: { Icon: SiDocker, color: "#2496ED", label: "Docker" },
  flask: { Icon: SiFlask, color: "#E8E0DA", label: "Flask" },
  fastapi: { Icon: SiFastapi, color: "#0BA88E", label: "FastAPI" },
  firebase: { Icon: SiFirebase, color: "#FFCA28", label: "Firebase" },
  "ci/cd": { Icon: SiGithubactions, color: "#2088FF", label: "CI/CD" },
  "llm development": { Icon: FaMicrochip, color: "#F472B6", label: "LLM development" },
  "prompt engineering": { Icon: FaBrain, color: "#C084FC", label: "Prompt engineering" },
  "vector search": { Icon: FaDatabase, color: "#4FD1C5", label: "Vector search" },
  orchestration: { Icon: FaDiagramProject, color: "#5FBFA8", label: "Orchestration" },
  "ml pipelines": { Icon: FaBrain, color: "#A78BFA", label: "ML pipelines" },
  "natural language processing": {
    Icon: FaComments,
    color: "#38BDF8",
    label: "Natural language processing",
  },
};

export function getSkillIcon(skill: string): SkillIcon {
  const key = skill.toLowerCase().trim();
  return EXACT[key] ?? { Icon: FaCode, color: "#9C8B82", label: skill };
}
