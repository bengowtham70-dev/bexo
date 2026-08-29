export type DemoProfileData = {
  id: string;
  slug: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
  category: string;
  yearsOfExp: number;
  availability: string;
  paidAmount: number;
  featured: boolean;
  visibility: "PUBLIC";
  hideFromSearch: boolean;
  skills: { id?: string; name: string }[];
  experiences: {
    id: string;
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string | null;
    current: boolean;
    description: string;
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    stack?: string;
    url?: string;
  }[];
  educations: {
    id: string;
    degree: string;
    institution: string;
    startDate: string;
    endDate?: string;
  }[];
};

export const DEMO_PROFILES: Record<string, DemoProfileData> = {
  "rahul-sharma": {
    id: "cand-1",
    slug: "rahul-sharma",
    name: "Rahul Sharma",
    headline: "Senior AI Systems & LLM Infrastructure Engineer",
    bio: "Ex-Scale AI. Built distributed fine-tuning pipelines and low-latency inference gateways serving 50M+ daily tokens. 5+ years in production PyTorch & CUDA optimization. Passionate about kernel-level GPU optimizations and open source model evaluations.",
    location: "Bangalore • Remote",
    category: "ai",
    yearsOfExp: 5,
    availability: "Available for Full-time Roles",
    paidAmount: 450,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "PyTorch" },
      { name: "vLLM" },
      { name: "CUDA" },
      { name: "Python" },
      { name: "LangChain" },
      { name: "Kubernetes" },
      { name: "Distributed Training" },
      { name: "Triton" },
    ],
    experiences: [
      {
        id: "exp-1",
        title: "Senior AI Infrastructure Engineer",
        company: "Nexus AI Systems",
        location: "Bangalore",
        startDate: "2023-01-01",
        current: true,
        description:
          "Architected vLLM-based multi-tenant inference cluster reducing latency by 42%. Engineered automated pipeline for continuous LoRA adapter training across 64x H100 GPUs.",
      },
      {
        id: "exp-2",
        title: "Machine Learning Engineer",
        company: "Scale AI Partner Group",
        location: "Remote",
        startDate: "2021-06-01",
        endDate: "2022-12-31",
        current: false,
        description:
          "Developed data validation workflows for RLHF annotation pipelines. Scaled synthetic data generation engine processing 10M+ tokens/day.",
      },
    ],
    projects: [
      {
        id: "proj-1",
        name: "FastInference-vLLM",
        description:
          "Open source high-throughput batching wrapper for local open-weights LLMs with automatic GPU memory paging.",
        stack: "Python, CUDA, C++, Docker",
        url: "https://github.com/example/fast-inference",
      },
      {
        id: "proj-2",
        name: "AgentEval-Bench",
        description:
          "Evaluation benchmark for measuring tool-calling precision and multi-turn hallucination in autonomous agent swarms.",
        stack: "PyTorch, FastAPI, Next.js",
        url: "https://github.com/example/agenteval",
      },
    ],
    educations: [
      {
        id: "edu-1",
        degree: "B.Tech in Computer Science & Engineering",
        institution: "Indian Institute of Technology (IIT)",
        startDate: "2017-08-01",
        endDate: "2021-05-30",
      },
    ],
  },

  "elena-lin": {
    id: "cand-2",
    slug: "elena-lin",
    name: "Elena Lin",
    headline: "Staff Product Designer & Design Systems Lead",
    bio: "Crafted design systems and core UI for top venture-backed developer tools. Obsessed with high-density data visualizations, micro-interactions, and accessibility. 6+ years designing developer-centric software.",
    location: "London • Hybrid",
    category: "design",
    yearsOfExp: 6,
    availability: "Available for Contract / Full-time",
    paidAmount: 380,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "Design Systems" },
      { name: "Figma" },
      { name: "UI/UX" },
      { name: "Tailwind CSS" },
      { name: "Prototyping" },
      { name: "Design Tokens" },
      { name: "Accessibility (WCAG)" },
    ],
    experiences: [
      {
        id: "exp-3",
        title: "Lead Design System Architect",
        company: "Synthetix Design Lab",
        location: "London",
        startDate: "2022-03-01",
        current: true,
        description:
          "Led a multi-brand tokenized design system spanning Web and Mobile. Built accessible components used by 120+ engineers daily.",
      },
      {
        id: "exp-4",
        title: "Senior Product Designer",
        company: "VentureCraft Studio",
        location: "London",
        startDate: "2019-09-01",
        endDate: "2022-02-28",
        current: false,
        description:
          "Designed data-dense analytics dashboards, developer workspaces, and collaborative real-time canvases.",
      },
    ],
    projects: [
      {
        id: "proj-3",
        name: "Radix Brutalist Tokens",
        description:
          "Modular CSS variable token foundation tailored for technical SaaS and high-density developer interfaces.",
        stack: "Figma Tokens, Tailwind CSS, TypeScript",
        url: "https://github.com/example/brutalist-tokens",
      },
    ],
    educations: [
      {
        id: "edu-2",
        degree: "BA in Interaction Design",
        institution: "University of the Arts London",
        startDate: "2015-09-01",
        endDate: "2019-06-30",
      },
    ],
  },

  "marcus-vance": {
    id: "cand-3",
    slug: "marcus-vance",
    name: "Marcus Vance",
    headline: "Principal Full-Stack & Distributed Systems Architect",
    bio: "Specializing in high-throughput event architectures, TypeScript, Go microservices, and reactive Next.js applications. Built cloud backends processing 200k+ RPS with sub-10ms p99 latency.",
    location: "San Francisco • Remote",
    category: "engineering",
    yearsOfExp: 7,
    availability: "Available for Lead / Architect Roles",
    paidAmount: 290,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "Go" },
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "PostgreSQL" },
      { name: "Kafka" },
      { name: "Redis" },
      { name: "Distributed Systems" },
    ],
    experiences: [
      {
        id: "exp-5",
        title: "Principal Infrastructure Engineer",
        company: "HyperScale Cloud",
        location: "San Francisco",
        startDate: "2021-10-01",
        current: true,
        description:
          "Architected real-time event streaming pipeline processing 15B messages/month using Go and Kafka. Reduced cloud infrastructure spend by $340k/yr.",
      },
    ],
    projects: [
      {
        id: "proj-4",
        name: "GoStream-CQRS",
        description:
          "Production-ready event-sourcing and CQRS microframework written in pure Go with outbox pattern support.",
        stack: "Go, PostgreSQL, Kafka, OpenTelemetry",
        url: "https://github.com/example/gostream",
      },
    ],
    educations: [
      {
        id: "edu-3",
        degree: "B.S. in Computer Engineering",
        institution: "UC Berkeley",
        startDate: "2013-08-01",
        endDate: "2017-05-30",
      },
    ],
  },

  "priya-nair": {
    id: "cand-4",
    slug: "priya-nair",
    name: "Priya Nair",
    headline: "Lead Data Scientist & Recommender Systems",
    bio: "Applied machine learning specialist focused on graph neural networks, search ranking algorithms, and scalable vector search pipelines.",
    location: "Singapore • Remote",
    category: "data",
    yearsOfExp: 4,
    availability: "Open to Remote Opportunities",
    paidAmount: 220,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "Vector DB" },
      { name: "Embeddings" },
      { name: "Python" },
      { name: "Scikit-Learn" },
      { name: "FastAPI" },
      { name: "Pinecone" },
      { name: "Qdrant" },
    ],
    experiences: [
      {
        id: "exp-6",
        title: "Senior ML Engineer",
        company: "Cortex Intelligence",
        location: "Singapore",
        startDate: "2022-01-01",
        current: true,
        description:
          "Designed hybrid lexical-semantic search engine improving click-through conversion by 31% for enterprise catalog search.",
      },
    ],
    projects: [
      {
        id: "proj-5",
        name: "VectorRank-Hybrid",
        description: "Reciprocal Rank Fusion library combining BM25 and vector semantic embeddings.",
        stack: "Python, FastAPI, Docker",
        url: "https://github.com/example/vector-rank",
      },
    ],
    educations: [
      {
        id: "edu-4",
        degree: "M.S. in Artificial Intelligence",
        institution: "National University of Singapore",
        startDate: "2018-08-01",
        endDate: "2020-05-30",
      },
    ],
  },

  "alex-thorne": {
    id: "cand-5",
    slug: "alex-thorne",
    name: "Alex Thorne",
    headline: "Senior Product Manager — Developer Platforms & AI",
    bio: "Led developer experience & API platform products from 0 to $8M ARR. Technical PM with background in computer science and developer ecosystems.",
    location: "New York • Remote",
    category: "product",
    yearsOfExp: 5,
    availability: "Available for Senior PM Roles",
    paidAmount: 180,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "Product Strategy" },
      { name: "API Design" },
      { name: "Growth Metrics" },
      { name: "Roadmapping" },
      { name: "Developer Experience" },
    ],
    experiences: [
      {
        id: "exp-7",
        title: "Senior Product Manager",
        company: "DevBridge Platforms",
        location: "New York",
        startDate: "2021-04-01",
        current: true,
        description: "Spearheaded Developer Platform APIs driving 400% developer signup growth across 18 months.",
      },
    ],
    projects: [
      {
        id: "proj-6",
        name: "API First Playbook",
        description: "Open source framework for developer onboarding and self-service API token management.",
        stack: "Next.js, MDX, OpenAPI",
        url: "https://github.com/example/api-playbook",
      },
    ],
    educations: [
      {
        id: "edu-5",
        degree: "B.S. in Computer Science",
        institution: "Columbia University",
        startDate: "2015-09-01",
        endDate: "2019-05-30",
      },
    ],
  },

  "sophia-chen": {
    id: "cand-6",
    slug: "sophia-chen",
    name: "Sophia Chen",
    headline: "Full-Stack AI Engineer & Agent Frameworks Specialist",
    bio: "Building autonomous multi-agent systems and real-time streaming interfaces. Open source contributor to agentic evaluation benchmarks.",
    location: "Seattle • Remote",
    category: "ai",
    yearsOfExp: 3,
    availability: "Available Immediately",
    paidAmount: 150,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "LangGraph" },
      { name: "FastAPI" },
      { name: "React" },
      { name: "TypeScript" },
      { name: "OpenAI API" },
      { name: "PostgreSQL" },
    ],
    experiences: [
      {
        id: "exp-8",
        title: "AI Engineer",
        company: "Agentic Systems Co",
        location: "Seattle",
        startDate: "2023-02-01",
        current: true,
        description: "Constructed multi-agent tool execution engine with sandboxed code execution and human-in-the-loop review.",
      },
    ],
    projects: [
      {
        id: "proj-7",
        name: "AgentTrace",
        description: "Telemetry and cost tracker for multi-step agent reasoning chains.",
        stack: "TypeScript, LangGraph, Tailwind CSS",
        url: "https://github.com/example/agent-trace",
      },
    ],
    educations: [
      {
        id: "edu-6",
        degree: "B.S. in Software Engineering",
        institution: "University of Washington",
        startDate: "2019-09-01",
        endDate: "2023-06-30",
      },
    ],
  },

  "david-kim": {
    id: "cand-7",
    slug: "david-kim",
    name: "David Kim",
    headline: "Growth Engineer & Technical SEO Specialist",
    bio: "Engineered programmatic SEO and viral acquisition funnels driving 2M+ monthly organic pageviews for SaaS startups.",
    location: "Austin • Hybrid",
    category: "growth",
    yearsOfExp: 4,
    availability: "Available for Growth / Engineering Roles",
    paidAmount: 120,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "Growth Engineering" },
      { name: "Next.js" },
      { name: "Analytics" },
      { name: "Programmatic SEO" },
      { name: "Tailwind CSS" },
    ],
    experiences: [
      {
        id: "exp-9",
        title: "Lead Growth Engineer",
        company: "ScaleGrowth Inc",
        location: "Austin",
        startDate: "2022-05-01",
        current: true,
        description: "Built automated directory indexing engine and schema markup systems ranking #1 across 400+ competitive keywords.",
      },
    ],
    projects: [
      {
        id: "proj-8",
        name: "pSEO-Engine",
        description: "Edge-cached static page generation engine for massive directory platforms.",
        stack: "Next.js, Vercel Edge, Redis",
        url: "https://github.com/example/pseo-engine",
      },
    ],
    educations: [
      {
        id: "edu-7",
        degree: "B.S. in Information Systems",
        institution: "University of Texas at Austin",
        startDate: "2017-09-01",
        endDate: "2021-05-30",
      },
    ],
  },

  "maya-patel": {
    id: "cand-8",
    slug: "maya-patel",
    name: "Maya Patel",
    headline: "Senior Mobile Engineer — iOS & React Native",
    bio: "Built top-rated consumer finance and healthcare mobile apps with Swift and React Native. Focused on offline-first architecture and performance.",
    location: "Toronto • Remote",
    category: "engineering",
    yearsOfExp: 5,
    availability: "Available for Mobile Roles",
    paidAmount: 100,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "React Native" },
      { name: "Swift" },
      { name: "iOS" },
      { name: "State Management" },
      { name: "GraphQL" },
    ],
    experiences: [
      {
        id: "exp-10",
        title: "Senior Mobile Developer",
        company: "FinFlow Mobile",
        location: "Toronto",
        startDate: "2021-08-01",
        current: true,
        description: "Shipped biometric security and offline sync engine for 250,000+ active mobile wallet users.",
      },
    ],
    projects: [
      {
        id: "proj-9",
        name: "OfflineSync-Kit",
        description: "Zero-dependency optimistic sync engine for SQLite-backed mobile clients.",
        stack: "Swift, Kotlin, TypeScript",
        url: "https://github.com/example/offline-sync",
      },
    ],
    educations: [
      {
        id: "edu-8",
        degree: "B.S. in Computer Science",
        institution: "University of Toronto",
        startDate: "2016-09-01",
        endDate: "2020-05-30",
      },
    ],
  },

  "liam-oconnor": {
    id: "cand-9",
    slug: "liam-oconnor",
    name: "Liam O'Connor",
    headline: "Cloud Infrastructure & SRE Engineer",
    bio: "Terraform, Kubernetes, and AWS architecture specialist. Automated multi-region zero-downtime failover for fintech services.",
    location: "Dublin • Remote",
    category: "engineering",
    yearsOfExp: 6,
    availability: "Available for Cloud / SRE Roles",
    paidAmount: 85,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "Kubernetes" },
      { name: "Terraform" },
      { name: "AWS" },
      { name: "CI/CD" },
      { name: "Prometheus" },
    ],
    experiences: [
      {
        id: "exp-11",
        title: "Staff SRE Engineer",
        company: "CloudVanguard",
        location: "Dublin",
        startDate: "2020-06-01",
        current: true,
        description: "Implemented multi-cluster GitOps deployment workflows maintaining 99.995% service SLA.",
      },
    ],
    projects: [
      {
        id: "proj-10",
        name: "K8s-Failover-Automator",
        description: "Automated DNS routing and cross-region database promote scripts for emergency disaster recovery.",
        stack: "Go, Kubernetes Operator, AWS SDK",
        url: "https://github.com/example/k8s-failover",
      },
    ],
    educations: [
      {
        id: "edu-9",
        degree: "B.Sc. in Computing",
        institution: "Trinity College Dublin",
        startDate: "2014-09-01",
        endDate: "2018-05-30",
      },
    ],
  },

  "zoe-martinez": {
    id: "cand-10",
    slug: "zoe-martinez",
    name: "Zoe Martinez",
    headline: "Product Designer & Motion Specialist",
    bio: "Crafting fluid digital experiences, interactive web components, and brand identities for emerging tech startups.",
    location: "Berlin • Hybrid",
    category: "design",
    yearsOfExp: 3,
    availability: "Available for Contract / Full-time",
    paidAmount: 60,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "UI Design" },
      { name: "Figma" },
      { name: "Framer" },
      { name: "Motion Design" },
      { name: "Design Systems" },
    ],
    experiences: [
      {
        id: "exp-12",
        title: "Product & Motion Designer",
        company: "Kinetics Creative",
        location: "Berlin",
        startDate: "2023-01-01",
        current: true,
        description: "Designed 3D web experiences and micro-interactions increasing product landing page conversions by 28%.",
      },
    ],
    projects: [
      {
        id: "proj-11",
        name: "FluidMotion UI",
        description: "Spring physics micro-interaction library for Next.js applications.",
        stack: "React, Framer Motion, TypeScript",
        url: "https://github.com/example/fluid-motion",
      },
    ],
    educations: [
      {
        id: "edu-10",
        degree: "B.A. in Digital Arts & Design",
        institution: "Berlin University of the Arts",
        startDate: "2018-10-01",
        endDate: "2022-07-30",
      },
    ],
  },

  "aravind-swaminathan": {
    id: "cand-11",
    slug: "aravind-swaminathan",
    name: "Aravind Swaminathan",
    headline: "Staff Backend Engineer — High-Frequency Distributed Systems",
    bio: "Ex-Zerodha. Scaled order processing matching engines handling 12M+ daily trades. Rust and Go systems specialist with zero-allocation networking experience.",
    location: "Bangalore • Remote",
    category: "engineering",
    yearsOfExp: 8,
    availability: "Available for Staff / Principal Roles",
    paidAmount: 40,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "Rust" },
      { name: "Go" },
      { name: "PostgreSQL" },
      { name: "Kafka" },
      { name: "gRPC" },
      { name: "Low-Latency" },
    ],
    experiences: [
      {
        id: "exp-13",
        title: "Staff Backend Engineer",
        company: "Apex Fintech Labs",
        location: "Bangalore",
        startDate: "2021-01-01",
        current: true,
        description: "Engineered ultra-low latency matching engine in Rust with sub-microsecond tick execution.",
      },
    ],
    projects: [
      {
        id: "proj-12",
        name: "RustEngine-ZeroAlloc",
        description: "Lock-free ring-buffer message bus for financial order books.",
        stack: "Rust, Tokio, C FFI",
        url: "https://github.com/example/rust-engine",
      },
    ],
    educations: [
      {
        id: "edu-11",
        degree: "B.Tech in Computer Science",
        institution: "NIT Trichy",
        startDate: "2012-08-01",
        endDate: "2016-05-30",
      },
    ],
  },

  "hannah-schmidt": {
    id: "cand-12",
    slug: "hannah-schmidt",
    name: "Hannah Schmidt",
    headline: "Security Engineer & Application Pentesting Lead",
    bio: "DevSecOps and Cloud Security architect. Specialized in Kubernetes threat modeling, SOC2 compliance automation, and automated SAST/DAST CI gates.",
    location: "Munich • Remote",
    category: "engineering",
    yearsOfExp: 5,
    availability: "Open to Security Lead Roles",
    paidAmount: 25,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "AppSec" },
      { name: "Kubernetes Security" },
      { name: "SOC2" },
      { name: "Penetration Testing" },
      { name: "Trivy" },
      { name: "AWS IAM" },
    ],
    experiences: [
      {
        id: "exp-14",
        title: "Lead Application Security Engineer",
        company: "SecurSphere Europe",
        location: "Munich",
        startDate: "2021-09-01",
        current: true,
        description: "Architected automated CI/CD vulnerability scanning pipeline blocking 450+ CVEs pre-production.",
      },
    ],
    projects: [
      {
        id: "proj-13",
        name: "K8s-Policy-Gate",
        description: "Admission controller validating container signatures and zero-trust IAM roles.",
        stack: "Go, OPA/Rego, Kubernetes",
        url: "https://github.com/example/k8s-policy",
      },
    ],
    educations: [
      {
        id: "edu-12",
        degree: "M.Sc. in Cybersecurity",
        institution: "Technical University of Munich",
        startDate: "2016-10-01",
        endDate: "2019-06-30",
      },
    ],
  },

  "carlos-mendez": {
    id: "cand-13",
    slug: "carlos-mendez",
    name: "Carlos Mendez",
    headline: "Senior Frontend Architect — React & Next.js Performance",
    bio: "Specializing in Web Vitals optimization, micro-frontends, and accessible design system components. Shipped consumer web applications used by 5M+ monthly users.",
    location: "Madrid • Remote",
    category: "engineering",
    yearsOfExp: 6,
    availability: "Available for Frontend Lead Roles",
    paidAmount: 15,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Web Vitals" },
      { name: "Tailwind CSS" },
      { name: "GraphQL" },
    ],
    experiences: [
      {
        id: "exp-15",
        title: "Senior Frontend Architect",
        company: "Veloce Media Global",
        location: "Madrid",
        startDate: "2020-11-01",
        current: true,
        description: "Optimized Next.js e-commerce storefront achieving 99/100 Google Lighthouse score and reducing LCP to 0.9s.",
      },
    ],
    projects: [
      {
        id: "proj-14",
        name: "LighthouseOptimizer-Vite",
        description: "Automatic asset bundling and critical CSS extraction plugin for high-speed SPAs.",
        stack: "TypeScript, Rollup, Vite",
        url: "https://github.com/example/lighthouse-opt",
      },
    ],
    educations: [
      {
        id: "edu-13",
        degree: "B.Sc. in Software Engineering",
        institution: "Universidad Politécnica de Madrid",
        startDate: "2014-09-01",
        endDate: "2018-06-30",
      },
    ],
  },

  "chloe-dubois": {
    id: "cand-14",
    slug: "chloe-dubois",
    name: "Chloé Dubois",
    headline: "Product Marketing & Technical Content Strategist",
    bio: "Translating complex developer infrastructure into high-converting messaging, developer documentation, and go-to-market launch campaigns.",
    location: "Paris • Hybrid",
    category: "growth",
    yearsOfExp: 4,
    availability: "Available for PMM Roles",
    paidAmount: 10,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "Product Marketing" },
      { name: "Technical Writing" },
      { name: "Launch Strategy" },
      { name: "Developer Relations" },
      { name: "SEO" },
    ],
    experiences: [
      {
        id: "exp-16",
        title: "Lead Product Marketing Manager",
        company: "DevCloud SAS",
        location: "Paris",
        startDate: "2022-03-01",
        current: true,
        description: "Orchestrated GTM launch of Cloud Database product generating 12,000 developer activations in 30 days.",
      },
    ],
    projects: [
      {
        id: "proj-15",
        name: "DevMarketing-Handbook",
        description: "Open source guide for developer tool positioning and developer marketing funnels.",
        stack: "Nextra, MDX, Markdown",
        url: "https://github.com/example/dev-marketing",
      },
    ],
    educations: [
      {
        id: "edu-14",
        degree: "Master in Management & Marketing",
        institution: "HEC Paris",
        startDate: "2017-09-01",
        endDate: "2020-06-30",
      },
    ],
  },

  "kenji-sato": {
    id: "cand-15",
    slug: "kenji-sato",
    name: "Kenji Sato",
    headline: "Lead Computer Vision & Robotics ML Engineer",
    bio: "Specializing in real-time object detection, SLAM, and TensorRT deployment on edge robotics hardware (NVIDIA Jetson, Orin).",
    location: "Tokyo • Remote",
    category: "ai",
    yearsOfExp: 7,
    availability: "Available for AI / Robotics Roles",
    paidAmount: 5,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "Computer Vision" },
      { name: "TensorRT" },
      { name: "PyTorch" },
      { name: "C++" },
      { name: "ROS2" },
      { name: "CUDA" },
    ],
    experiences: [
      {
        id: "exp-17",
        title: "Lead Robotics ML Engineer",
        company: "Mirai Autonomy Labs",
        location: "Tokyo",
        startDate: "2020-04-01",
        current: true,
        description: "Deployed 60fps edge neural perception models on autonomous industrial warehouse robots.",
      },
    ],
    projects: [
      {
        id: "proj-16",
        name: "JetsonVision-RT",
        description: "Optimized YOLO TensorRT execution pipeline for robotic camera arrays.",
        stack: "C++, CUDA, TensorRT",
        url: "https://github.com/example/jetson-vision",
      },
    ],
    educations: [
      {
        id: "edu-15",
        degree: "M.Eng. in Mechanical & Information Engineering",
        institution: "University of Tokyo",
        startDate: "2014-04-01",
        endDate: "2019-03-30",
      },
    ],
  },

  "amara-okafor": {
    id: "cand-16",
    slug: "amara-okafor",
    name: "Amara Okafor",
    headline: "Senior Data Engineer — Lakehouse & DBT Architect",
    bio: "Building petabyte-scale data lakes and real-time CDC streaming pipelines using Apache Iceberg, Snowflake, DBT, and Apache Kafka.",
    location: "Lagos • Remote",
    category: "data",
    yearsOfExp: 5,
    availability: "Available for Data Lead Roles",
    paidAmount: 3,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "DBT" },
      { name: "Snowflake" },
      { name: "Kafka" },
      { name: "Python" },
      { name: "Apache Iceberg" },
      { name: "SQL" },
    ],
    experiences: [
      {
        id: "exp-18",
        title: "Senior Data Architect",
        company: "Pan-Africa Analytics",
        location: "Lagos",
        startDate: "2021-07-01",
        current: true,
        description: "Constructed medallion architecture lakehouse processing 2.5TB streaming data daily with automated data quality testing.",
      },
    ],
    projects: [
      {
        id: "proj-17",
        name: "DBT-Quality-Sentinel",
        description: "Automated anomaly detection hooks for DBT model runs.",
        stack: "Python, DBT, SQL",
        url: "https://github.com/example/dbt-sentinel",
      },
    ],
    educations: [
      {
        id: "edu-16",
        degree: "B.Sc. in Computer Science",
        institution: "University of Lagos",
        startDate: "2015-09-01",
        endDate: "2019-07-30",
      },
    ],
  },

  "nina-ross": {
    id: "cand-17",
    slug: "nina-ross",
    name: "Nina Ross",
    headline: "Principal DevOps & Cloud Platform Architect",
    bio: "Kubernetes, GitOps (ArgoCD), and Multi-Cloud Infrastructure as Code specialist. Designed compliant zero-trust architectures for healthcare & fintech enterprises.",
    location: "Zurich • Remote",
    category: "engineering",
    yearsOfExp: 8,
    availability: "Available for Consulting / Lead Roles",
    paidAmount: 2,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "Kubernetes" },
      { name: "ArgoCD" },
      { name: "Terraform" },
      { name: "AWS" },
      { name: "GCP" },
      { name: "Golang" },
    ],
    experiences: [
      {
        id: "exp-19",
        title: "Principal Cloud Architect",
        company: "Helvetia Cloud Solutions",
        location: "Zurich",
        startDate: "2019-10-01",
        current: true,
        description: "Built multi-tenant Kubernetes platform running 400+ microservices across AWS and GCP with automated disaster recovery.",
      },
    ],
    projects: [
      {
        id: "proj-18",
        name: "ArgoCD-MultiTenant-Helm",
        description: "Declarative GitOps repository structure for self-service microservice provisioning.",
        stack: "Helm, ArgoCD, Kubernetes",
        url: "https://github.com/example/argocd-multitenant",
      },
    ],
    educations: [
      {
        id: "edu-17",
        degree: "M.Sc. in Computer Science",
        institution: "ETH Zurich",
        startDate: "2013-09-01",
        endDate: "2017-06-30",
      },
    ],
  },

  "liam-patel": {
    id: "cand-18",
    slug: "liam-patel",
    name: "Liam Patel",
    headline: "AI Prompt Engineer & Agentic Evaluation Lead",
    bio: "Specializing in context optimization, prompt chain evaluation, and fine-tuning reasoning models for complex financial analysis workflows.",
    location: "Chicago • Remote",
    category: "ai",
    yearsOfExp: 4,
    availability: "Available for AI Roles",
    paidAmount: 1,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "Prompt Engineering" },
      { name: "RAG" },
      { name: "Python" },
      { name: "Evaluation" },
      { name: "LangChain" },
      { name: "OpenAI API" },
    ],
    experiences: [
      {
        id: "exp-20",
        title: "Lead AI Prompt Engineer",
        company: "FinReason AI",
        location: "Chicago",
        startDate: "2022-08-01",
        current: true,
        description: "Created deterministic reasoning prompts and structured JSON schema extraction workflows achieving 99.4% accuracy.",
      },
    ],
    projects: [
      {
        id: "proj-19",
        name: "PromptEval-Toolkit",
        description: "Automated regression testing framework for LLM prompts across multiple model providers.",
        stack: "Python, FastAPI, Streamlit",
        url: "https://github.com/example/prompt-eval",
      },
    ],
    educations: [
      {
        id: "edu-18",
        degree: "B.S. in Cognitive Science & CS",
        institution: "Northwestern University",
        startDate: "2016-09-01",
        endDate: "2020-05-30",
      },
    ],
  },

  "clara-novak": {
    id: "cand-19",
    slug: "clara-novak",
    name: "Clara Novak",
    headline: "Product Growth & Conversion Rate Optimization Specialist",
    bio: "Engineered sign-up funnels and activation flows generating +44% free-to-paid conversion for SaaS developer tools.",
    location: "Prague • Remote",
    category: "growth",
    yearsOfExp: 5,
    availability: "Available for Growth Roles",
    paidAmount: 1,
    featured: true,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "Growth Strategy" },
      { name: "CRO" },
      { name: "PostHog" },
      { name: "A/B Testing" },
      { name: "Next.js" },
    ],
    experiences: [
      {
        id: "exp-21",
        title: "Senior CRO & Growth Specialist",
        company: "MetricScale Europe",
        location: "Prague",
        startDate: "2021-04-01",
        current: true,
        description: "Ran 120+ statistically significant A/B experiments on onboarding and checkout flows for B2B SaaS clients.",
      },
    ],
    projects: [
      {
        id: "proj-20",
        name: "A/B Testing Playbook for Next.js",
        description: "Edge-based feature flags and variant routing library for zero-flicker experiments.",
        stack: "Next.js Edge, TypeScript, PostHog",
        url: "https://github.com/example/ab-nextjs",
      },
    ],
    educations: [
      {
        id: "edu-19",
        degree: "B.A. in Marketing & Economics",
        institution: "Charles University Prague",
        startDate: "2015-09-01",
        endDate: "2019-06-30",
      },
    ],
  },

  "tariq-al-mansoor": {
    id: "cand-20",
    slug: "tariq-al-mansoor",
    name: "Tariq Al-Mansoor",
    headline: "Lead Quantitative Software Developer — Python & C++",
    bio: "Ex-Citadel algorithmic developer. High-frequency time-series processing, factor modeling, and vectorized execution engines.",
    location: "Dubai • Remote",
    category: "engineering",
    yearsOfExp: 6,
    availability: "Available for Quant / Engineering Roles",
    paidAmount: 0,
    featured: false,
    visibility: "PUBLIC",
    hideFromSearch: false,
    skills: [
      { name: "Python" },
      { name: "C++" },
      { name: "NumPy" },
      { name: "Time Series" },
      { name: "PostgreSQL" },
      { name: "FastAPI" },
    ],
    experiences: [
      {
        id: "exp-22",
        title: "Senior Quantitative Developer",
        company: "Oasis Quant Capital",
        location: "Dubai",
        startDate: "2021-01-01",
        current: true,
        description: "Developed vectorized backtesting engine in C++ and Python processing 10 years of tick data in under 4 seconds.",
      },
    ],
    projects: [
      {
        id: "proj-21",
        name: "FastBacktest-Engine",
        description: "High-performance vector backtesting simulator for multi-asset trading strategies.",
        stack: "C++, Cython, Python, Polars",
        url: "https://github.com/example/fast-backtest",
      },
    ],
    educations: [
      {
        id: "edu-20",
        degree: "B.S. in Applied Mathematics & Computing",
        institution: "American University of Sharjah",
        startDate: "2014-09-01",
        endDate: "2018-05-30",
      },
    ],
  },
};
