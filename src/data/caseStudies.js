export const caseStudies = {
  // Thesis report dated 3 July 2026: Chapters 3–7, Tables 5.1 and 5.3, Section 5.2.
  "master-thesis-kgqa": {
    subtitle: "Making truck-component compatibility constraints accessible through natural-language questions.",
    role: "Master’s thesis at Traton · system design, implementation, and evaluation",
    result: {
      value: "96.4%",
      label: "Hybrid retrieval verdict accuracy",
      context: "Up from 77.1% with dense retrieval · 280 graph-derived questions",
    },
    sections: [
      {
        title: "The problem",
        paragraphs: [
          "Traton’s MAZE knowledge graph records combinations of truck components that must not be used together. Answering a compatibility question requires exact component identities and the complete blocking combination. Similar descriptions can refer to different options, and a partial match to a larger blocker does not necessarily make a configuration invalid.",
          "My thesis investigated how a natural-language interface could recover that evidence reliably, comparing static retrieval with direct graph access.",
        ],
      },
      {
        title: "What I built",
        paragraphs: [
          "I built a Python research system around a local GraphDB snapshot, with three answering strategies using Claude Sonnet 4.6 through Amazon Bedrock:",
        ],
        points: [
          "Dense RAG: serialize each complete blocking combination as one document, then retrieve it from Qdrant using vector similarity.",
          "Hybrid RAG: add BM25 lexical search and Reciprocal Rank Fusion to the same documents, preserving exact identifiers alongside semantic matching.",
          "SPARQL graph agent: let a schema-prompted model query the RDF graph, inspect results, and repair queries within a bounded tool-use loop.",
        ],
      },
      {
        title: "The results",
        paragraphs: [
          "I generated a reproducible benchmark of 280 questions, balanced between blocked and compatible cases. Expected verdicts came directly from graph constraints, without an LLM judge. The evaluation measured verdict accuracy, retrieval of the reference blocker, response time, token usage, and failure modes.",
        ],
        comparisonCaption: "Single complete run · 280 questions · RAG: top 10 documents · graph agent: up to 5 rounds",
        comparison: [
          { approach: "Dense retrieval", accuracy: "77.1%", medianLatency: "5.34 s" },
          { approach: "Hybrid lexical-semantic retrieval", accuracy: "96.4%", medianLatency: "5.45 s" },
          { approach: "SPARQL graph agent", accuracy: "98.2%", medianLatency: "21.62 s" },
        ],
      },
      {
        title: "The takeaway",
        paragraphs: [
          "Adding lexical search was the strongest controlled improvement: reference-blocker retrieval rose from 56.4% to 95.7%, while median response time stayed close to the dense baseline. The graph agent answered five more questions correctly than hybrid retrieval, but used roughly four times the response time and seven times the median tokens. Most of its delay came from LLM planning and synthesis, rather than database execution.",
          "The small graph-agent accuracy advantage was not statistically decisive in either the complete run or a repeated 70-question subset check. My conclusion was to use hybrid retrieval as the practical default for low-latency compatibility answers, with graph access useful when inspectable query traces and flexibility justify its cost.",
          "These results come from a single diagnostic run over a fixed local snapshot and controlled questions. They do not establish production reliability or general graph QA accuracy; explanation correctness was not scored.",
        ],
      },
    ],
    imageCaption: "The MAZE research interface sketched in an engineering setting. The person and truck scene are illustrative.",
  },
  snuskoll: {
    subtitle: "A mobile-first product catalog with personal ratings and social reviews.",
    role: "Personal project · full-stack development",
    sections: [
      { title: "The problem", paragraphs: ["SnusKoll brings product discovery and personal preferences together. Users can browse a catalog, keep their own ratings, and save products they want to return to."] },
      { title: "What I built", paragraphs: ["I built a Blazor WebAssembly frontend, an ASP.NET API, shared DTOs, and Dockerized services. Supabase handles authentication and data."], points: ["Search and filter the product catalog.", "Rate products and maintain favorites and wishlists.", "Read recent reviews from other users or discover a product at random."] },
      { title: "How the pieces fit", paragraphs: ["The browser interface and the API are separate parts of the application. Shared DTOs define the data exchanged between them, and the services run in Docker."], architecture: true },
      { title: "Engineering choices", paragraphs: ["The separate frontend and API make the client/server boundary explicit. The tradeoff is maintaining those parts and their shared contracts together.", "Authentication and data are handled by Supabase, with contract tests around authorization. This gives authorization behavior its own verification alongside the product features."] },
      { title: "The result", paragraphs: ["The app supports the complete browsing, rating, and saving workflow in a mobile-first interface. It remains an ongoing personal project and is available to try, with the source code on GitHub."] },
    ],
    imageCaption: "SnusKoll’s product browsing interface. Open the image for a closer look, or try the live app below.",
  },
  "ai-diary": {
    subtitle: "From a short spoken update to a daily note the technician can review.",
    role: "Professional project · internal application",
    sections: [
      { title: "The problem", paragraphs: ["Technicians in the field need a way to record a daily update without typing a long report. AI-Diary uses a short voice recording as the starting point."] },
      { title: "My contribution", paragraphs: ["I worked on the internal tool that turns spoken check-ins into structured daily notes. The published technology stack includes React, TypeScript, Material UI, Azure, and Azure Speech."] },
      { title: "The workflow", points: ["The technician records a short voice update.", "Azure Speech creates a transcript.", "An LLM turns the transcript into a draft note.", "The user reviews the result before it is added to the diary."] },
      { title: "The design decision", paragraphs: ["The generated note is a draft with a review step before it enters the diary. This keeps the technician involved in the final record while reducing the amount of typing required."] },
      { title: "Availability", paragraphs: ["AI-Diary is an internal application. This case study covers the public workflow and technology summary; there is no public demo or source repository."] },
    ],
    imageCaption: "Public portfolio image of the AI-Diary workflow.",
  },
  bachelor: {
    subtitle: "Can summarized conversation history reduce LLM cost without weakening answers?",
    role: "Bachelor’s thesis · experiments and evaluation",
    result: { value: "Up to 92%", label: "Lower cost in the best tested setup", context: "Without a statistically significant drop in measured performance" },
    sections: [
      { title: "The question", paragraphs: ["A chatbot’s conversation history grows as the conversation continues. My bachelor’s thesis tested whether summarizing older messages could reduce LLM cost while preserving answer quality."] },
      { title: "What I evaluated", paragraphs: ["I compared full conversation history with several summarized versions. The experiments measured both answer quality and API cost, using Python for the research work."] },
      { title: "The result", paragraphs: ["The best tested setup reduced cost by up to 92% without a statistically significant drop in performance. The result applies to the setups and measurements in the thesis; it does not guarantee the same saving for every conversation or model."] },
      { title: "The tradeoff", paragraphs: ["Summarization reduces the context sent to the model, but also changes the information available for future answers. Measuring quality together with cost is necessary to assess that tradeoff."] },
      { title: "Read the research", paragraphs: ["The thesis was completed between January and June 2024. The full publication is available through DiVA, linked below."] },
    ],
    imageCaption: "Portfolio overview of the context-summarization research. The full thesis is available on DiVA.",
  },
};
