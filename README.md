🩺 MediBot: Multimodal Multi-Agent Medical AI
A Self-Reflective, Parallel-Processed Mixture of Experts (MoE) for Safe Medical Triage

MediBot is an advanced medical AI system that moves beyond standard, single-prompt LLM wrappers. It utilizes a Dynamic 3-Tier Architecture powered by LangGraph to simulate a real-world medical council. By combining parallel specialist agents, an adversarial auditor, and hardcoded safety overrides, MediBot mitigates LLM hallucinations and delivers safe, grounded, and empathetic medical triage.

✨ Key Features
🧠 Dynamic Multi-Agent Routing: Uses a custom-trained Neural Network (router_nn.pkl) and Sentence Transformers to classify user intent in milliseconds, routing the query to the appropriate cognitive tier.

⚖️ The "Medical Council" (LangGraph): High-risk queries trigger a Directed Acyclic Graph (DAG) where specialized AI agents (Diagnosis & Treatment) research symptoms in parallel, while a "Skeptic" agent actively looks for confirmation bias.

👁️ Multimodal Vision Scanner: Users can upload injury images. The system uses a CNN/OpenCV backend to extract clinical features and forcibly injects this context into the LLM, outputting a downloadable PDF report.

🎙️ Zero-Latency Voice Engine: Real-time speech-to-text using a local GPU Whisper Tiny model, perfectly synchronized with an Edge-TTS voice output and a live Server-Sent Events (SSE) frontend UI log.

📈 Reinforcement Learning UI: Dynamic follow-up suggestion buttons powered by an Epsilon-Greedy Multi-Armed Bandit algorithm (Q-Table) that learns user preferences over time.

🛡️ Deterministic Safety Overrides: If the LLM hallucinates a "Low Risk" triage for severe keywords (e.g., "chest pain", "stroke"), a hardcoded Python regex layer intercepts and forcibly upgrades the system to "HIGH RISK".

🏗️ System Architecture: The 3 Tiers
MediBot optimizes API costs and latency by scaling its cognitive power based on the severity of the user's input:

Tier 1: Fast Lookup (Information)
For general definitions or medical info, the system bypasses triage and queries the FAISS Vector Database (RAG) directly. It responds in milliseconds using a single agent.

Tier 2: Linear Pipeline (Low/Medium Risk)
For mild symptoms (e.g., "I have a headache"), the query follows a strict linear path:

Specialist Agent: Drafts a response grounded in RAG medical literature.

Judge Agent: Formats the clinical data into an empathetic, patient-friendly response.

Tier 3: The LangGraph Core (High/Severe Risk)
For severe symptoms, the system triggers the full multi-agent MoE pipeline:

Parallelism (Fan-Out): A Dispatcher node triggers Dr_Diagnosis and Dr_Treatment to investigate simultaneously.

Adversarial Auditing (Fan-In): Both drafts are sent to a Skeptic agent (prompted with a "Dr. House" persona).

Acyclic Loopism: If the Skeptic detects dangerous advice or blind spots, it rejects the draft and loops the workflow back to the specialists (max 3 retries).

Synthesis: Once approved, the Judge agent finalizes the triage report.

🛠️ Tech Stack
Backend: FastAPI, Python, SQLite

AI/Orchestration: LangGraph, LangChain, Groq API (Llama-3.1-8b & Llama-3.3-70b)

RAG / Embeddings: FAISS, HuggingFace Sentence-Transformers

Audio / Vision: OpenAI Whisper (Local GPU), Edge-TTS, OpenCV, FPDF

Frontend: HTML/CSS/Vanilla JS (Glass-morphism UI, Polling/SSE state synchronization)

Resilience: Custom SafeChatGroq wrapper with exponential backoff for HTTP 429 Rate Limit handling.

🔒 Safety First
This system is designed for educational and triage simulation purposes only. It features built-in disclaimers and actively pushes high-risk users to seek immediate professional medical care.
