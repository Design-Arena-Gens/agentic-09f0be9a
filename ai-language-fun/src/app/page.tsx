"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark";

type LanguageOption = {
  code: string;
  name: string;
  nativeName: string;
  family: string;
};

type SkillTrack = {
  id: string;
  title: string;
  icon: string;
  description: string;
  outcomes: string[];
};

type Milestone = {
  id: string;
  title: string;
  badge: string;
  focus: string;
  aiSupport: string;
  duration: string;
};

type Flashcard = {
  prompt: string;
  translation: string;
  tip: string;
};

type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  hint: string;
};

type PhraseBuilderCard = {
  clue: string;
  tiles: string[];
  solution: string[];
  context: string;
};

const languageCatalog: LanguageOption[] = [
  { code: "ar", name: "Arabic", nativeName: "العربية", family: "Semitic" },
  { code: "en", name: "English", nativeName: "English", family: "Germanic" },
  { code: "es", name: "Spanish", nativeName: "Español", family: "Romance" },
  { code: "fr", name: "French", nativeName: "Français", family: "Romance" },
  { code: "de", name: "German", nativeName: "Deutsch", family: "Germanic" },
  { code: "zh", name: "Mandarin", nativeName: "中文", family: "Sino-Tibetan" },
  { code: "ja", name: "Japanese", nativeName: "日本語", family: "Japonic" },
  { code: "ko", name: "Korean", nativeName: "한국어", family: "Koreanic" },
  { code: "ru", name: "Russian", nativeName: "Русский", family: "Slavic" },
  { code: "pt", name: "Portuguese", nativeName: "Português", family: "Romance" },
  { code: "it", name: "Italian", nativeName: "Italiano", family: "Romance" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", family: "Turkic" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", family: "Indo-Aryan" },
  { code: "th", name: "Thai", nativeName: "ไทย", family: "Kra–Dai" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", family: "Germanic" },
  { code: "pl", name: "Polish", nativeName: "Polski", family: "Slavic" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", family: "Austronesian" },
  { code: "fa", name: "Persian", nativeName: "فارسی", family: "Iranian" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", family: "Semitic" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", family: "Bantu" },
];

const levelRoadmap: Milestone[] = [
  {
    id: "starter",
    title: "Starter Spark",
    badge: "🎯",
    focus: "Build unstoppable foundations with smart spaced repetition and pronunciation mirrors.",
    aiSupport: "AI Companion records every attempt, corrects sound waves, and awards streak boosts.",
    duration: "7 days",
  },
  {
    id: "explorer",
    title: "Explorer Quest",
    badge: "🧭",
    focus: "Unlock travel packs, cultural survival stories, and rapid response mini-games.",
    aiSupport: "Scenario simulator adapts role plays based on your native language reflexes.",
    duration: "21 days",
  },
  {
    id: "storyteller",
    title: "Storyteller Rise",
    badge: "📚",
    focus: "Craft confident conversations, improvise jokes, and weave cultural anecdotes.",
    aiSupport: "Narrative AI stitches variations of your stories to test depth and nuance.",
    duration: "35 days",
  },
  {
    id: "mastery",
    title: "Mastery Arena",
    badge: "🏆",
    focus: "Specialize in business, academia, or creative mastery with expert-guided sprints.",
    aiSupport: "Coach blends real-world articles, voice clones, and peer challenges on demand.",
    duration: "90 days",
  },
];

const skillTracks: SkillTrack[] = [
  {
    id: "vocabulary",
    title: "Vocabulary Maps",
    icon: "🗺️",
    description: "Discover themed word constellations with AI clustering and pronunciation playback.",
    outcomes: [
      "Adaptive decks build from your mistakes.",
      "Visual memory palaces for long-term recall.",
      "Daily speed-rounds with smart difficulty shifts.",
    ],
  },
  {
    id: "grammar",
    title: "Grammar Workshop",
    icon: "⚙️",
    description: "Turn tricky grammar into friendly hacks powered by pattern-aware explanations.",
    outcomes: [
      "AI rewrites explainers using your native language.",
      "Interactive sandboxes show rules in action.",
      "Instant feedback on sentence crafting challenges.",
    ],
  },
  {
    id: "conversation",
    title: "Conversation Studio",
    icon: "🎙️",
    description: "Role-play real-life situations with avatars that coach you to natural fluency.",
    outcomes: [
      "Voice mirror responds with accents you choose.",
      "Emotion tracker scores confidence and clarity.",
      "AI supervisor summarizes progress every session.",
    ],
  },
  {
    id: "culture",
    title: "Culture Adventures",
    icon: "🎭",
    description: "Dive into festivals, cuisine, cinema, and micro-cultures through story quests.",
    outcomes: [
      "Interactive maps unlock regional phrases.",
      "Cultural quizzes reward collectible badges.",
      "Community duels celebrate local knowledge.",
    ],
  },
];

const aiPersonas = [
  {
    id: "sensei",
    title: "Sensei Nova",
    tag: "Precision Pronunciation",
    accent: "Neutral global accent with tone-perfect guidance.",
    bestFor: ["Beginners", "Audio Learners", "Daily streakers"],
  },
  {
    id: "companion",
    title: "Companion Lila",
    tag: "Friendly Conversationalist",
    accent: "Adapts to your chosen region with empathetic corrections.",
    bestFor: ["Confidence building", "Storytelling", "Travel prep"],
  },
  {
    id: "strategist",
    title: "Strategist Orion",
    tag: "Goal-driven Mentor",
    accent: "Business and academia focused, crisp articulation.",
    bestFor: ["Interviews", "Presentations", "Professional polish"],
  },
];

const flashcardDeck: Record<string, Flashcard[]> = {
  en: [
    { prompt: "مرحبا", translation: "Hello", tip: "Smile when you say it to mimic intonation." },
    { prompt: "شكراً", translation: "Thank you", tip: "Practice with a gratitude journal entry." },
    { prompt: "أين المترو؟", translation: "Where is the metro?", tip: "Visualize yourself at a busy station." },
  ],
  es: [
    { prompt: "Good morning", translation: "Buenos días", tip: "Link it with a sunrise playlist." },
    { prompt: "How are you?", translation: "¿Cómo estás?", tip: "Emphasize the rising tone on the last word." },
    { prompt: "See you later", translation: "Hasta luego", tip: "Wave your hand as a kinesthetic cue." },
  ],
  fr: [
    { prompt: "Thank you very much", translation: "Merci beaucoup", tip: "Round your lips for the ending sound." },
    { prompt: "I would like coffee", translation: "Je voudrais un café", tip: "Practice with a café role-play." },
    { prompt: "Where do you live?", translation: "Où habites-tu ?", tip: "Keep the liaison between words smooth." },
  ],
};

const quizBank: Record<string, QuizQuestion[]> = {
  en: [
    {
      question: "Choose the correct response: ما اسمك؟",
      options: ["How old are you?", "What's your name?", "Where are you going?", "What do you do?"],
      answer: "What's your name?",
      hint: "Focus on polite introductions.",
    },
    {
      question: "Pick the best translation: أحب القراءة",
      options: ["I love reading", "I need rest", "I lost the book", "I will arrive early"],
      answer: "I love reading",
      hint: "Think about hobbies and passions.",
    },
  ],
  es: [
    {
      question: "Translate to Spanish: I need an extra ticket.",
      options: [
        "Necesito un boleto extra.",
        "Necesito llegar temprano.",
        "Tengo un boleto extra.",
        "¿Dónde está la taquilla?",
      ],
      answer: "Necesito un boleto extra.",
      hint: "Look for the verb that mirrors 'need'.",
    },
    {
      question: "Pick the correct phrase for ordering food at a café.",
      options: ["Quisiera un té verde, por favor.", "¿Dónde está el tren?", "Necesito cambiar dinero.", "¿Puedes ayudarme?"],
      answer: "Quisiera un té verde, por favor.",
      hint: "Mind the polite opening phrase.",
    },
  ],
  fr: [
    {
      question: "Quelle est la bonne traduction de “I'm learning French” ?",
      options: [
        "J'apprends le français.",
        "Je cherche le français.",
        "Je visite le français.",
        "Je trouve le français.",
      ],
      answer: "J'apprends le français.",
      hint: "Spot the verb that means 'to learn'.",
    },
    {
      question: "Choisissez la réponse appropriée : Où est la bibliothèque ?",
      options: ["Elle est près du parc.", "Je suis en retard.", "Nous sommes heureux.", "C'est délicieux."],
      answer: "Elle est près du parc.",
      hint: "Think about locations.",
    },
  ],
};

const phraseDeck: Record<string, PhraseBuilderCard[]> = {
  en: [
    {
      clue: "Arrange to describe a daily routine",
      tiles: ["I", "wake", "up", "at", "six", "every", "day"],
      solution: ["I", "wake", "up", "at", "six", "every", "day"],
      context: "Say it out loud with your morning stretch.",
    },
    {
      clue: "Build a polite request for directions",
      tiles: ["Excuse", "me", "could", "you", "show", "me", "the", "museum?"],
      solution: ["Excuse", "me", "could", "you", "show", "me", "the", "museum?"],
      context: "Add a friendly tone to feel authentic.",
    },
  ],
  es: [
    {
      clue: "Forma una frase para pedir la cuenta",
      tiles: ["¿Nos", "puedes", "traer", "la", "cuenta", "por", "favor?"],
      solution: ["¿Nos", "puedes", "traer", "la", "cuenta", "por", "favor?"],
      context: "Practice it with a smile and eye contact.",
    },
    {
      clue: "Construye una frase sobre tus hobbies",
      tiles: ["Me", "encanta", "tocar", "la", "guitarra", "los", "fines", "de", "semana"],
      solution: ["Me", "encanta", "tocar", "la", "guitarra", "los", "fines", "de", "semana"],
      context: "Share it with a friend to anchor the memory.",
    },
  ],
  fr: [
    {
      clue: "Composer une phrase pour faire des courses",
      tiles: ["Je", "cherche", "un", "cadeau", "pour", "mon", "ami"],
      solution: ["Je", "cherche", "un", "cadeau", "pour", "mon", "ami"],
      context: "Imagine yourself in a stylish Paris boutique.",
    },
    {
      clue: "Exprimez votre passion pour la cuisine",
      tiles: ["J'adore", "préparer", "des", "plats", "traditionnels", "le", "dimanche"],
      solution: ["J'adore", "préparer", "des", "plats", "traditionnels", "le", "dimanche"],
      context: "Visualize the aroma of your favorite recipe.",
    },
  ],
};

const premiumHighlights = [
  {
    tier: "Spark",
    price: "$9",
    cadence: "per month",
    perks: [
      "Unlimited AI conversations with Sensei Nova",
      "Daily story quests tailored to your native language",
      "Offline lesson packs across 12 skill missions",
    ],
  },
  {
    tier: "Galaxy",
    price: "$19",
    cadence: "per month",
    perks: [
      "All Spark benefits",
      "Live community leagues with weekly rewards",
      "Professional pronunciation analysis with spectral heatmaps",
      "Personal AI strategist for interviews and presentations",
    ],
    featured: true,
  },
  {
    tier: "Infinity",
    price: "$199",
    cadence: "per year",
    perks: [
      "Galaxy tier unlocked across every language",
      "Custom curricula mapped to academic or corporate goals",
      "Quarterly fluency certifications with human mentors",
      "Vercel-powered API access for innovators and schools",
    ],
  },
];

const motivationalGreetings: Record<string, string> = {
  ar: "أهلاً بك! لنحوّل تعلم اللغات إلى مغامرة ممتعة تدعمها الذكاء الاصطناعي.",
  en: "Welcome! Let’s turn language learning into an adventure powered by joyful AI.",
  es: "¡Bienvenido! Aprender idiomas será una aventura emocionante con ayuda de la IA.",
  fr: "Bienvenue ! Transformons l'apprentissage des langues en aventure ludique avec l'IA.",
  de: "Willkommen! Wir machen Sprachenlernen zur KI-gestützten Entdeckungsreise.",
  ru: "Добро пожаловать! Сделаем изучение языков захватывающим с поддержкой ИИ.",
  zh: "欢迎！让我们把语言学习变成充满乐趣的人工智能冒险。",
  ja: "ようこそ！AIと一緒に楽しく言語をマスターしましょう。",
};

function resolveGreeting(nativeCode: string) {
  return motivationalGreetings[nativeCode] ?? motivationalGreetings.en;
}

function getLanguageByCode(code: string) {
  return languageCatalog.find((entry) => entry.code === code);
}

function formatLanguageOption(language: LanguageOption) {
  return `${language.nativeName} · ${language.name}`;
}

function buildAiPlan(
  goal: string,
  level: string,
  native: LanguageOption | undefined,
  target: LanguageOption | undefined,
  variationSeed = 0,
) {
  const trimmedGoal = goal.trim();
  const effectiveGoal =
    trimmedGoal.length > 0
      ? trimmedGoal
      : "I want to express myself confidently in everyday conversations.";

  const nativeHint = native
    ? `We will leverage ${native.nativeName} (${native.name}) cognates and phonetic bridges`
    : "We will leverage your native language patterns";

  const targetLabel = target ? target.nativeName : "اللغة الجديدة";

  const plans: Record<string, string[]> = {
    starter: [
      "Micro lessons that introduce sounds, scripts, and top 100 survival words.",
      "Emoji-powered drills and voice mirrors to build muscle memory.",
      "Interactive quests celebrating every streak you complete.",
    ],
    explorer: [
      "Scenario role plays for travel, study, and social moments.",
      "Live pronunciation corrections with instant spectral feedback.",
      "Weekly remix challenges turning vocabulary into mini stories.",
    ],
    storyteller: [
      "Creative writing sparks with AI co-authors adapting to your tone.",
      "Cultural insights that unlock idioms, humor, and local expressions.",
      "Conversation circles powered by adaptive avatars with different accents.",
    ],
    mastery: [
      "Specialized tracks for business, academia, and creative fluency.",
      "Deep-dive feedback comparing your speech to expert benchmarks.",
      "Personalized fluency missions culminating in certification labs.",
    ],
  };

  const stagePlan = plans[level as keyof typeof plans] ?? plans.starter;

  const inspirationPool = [
    "🎉 Unlock a hidden celebration badge when you finish three consecutive missions.",
    "🎵 Add a music-powered shadowing session to infuse rhythm into your speech.",
    "🧩 End every mission with a culture trivia tile to widen your worldview.",
    "🪄 Turn your mistakes into collectible power-ups inside Game Lab quests.",
  ];

  const accentAdvice = [
    "Focus on breath control and intonation arcs for natural prosody.",
    "Mirror native speech by recording and comparing waveforms with the AI analyzer.",
    "Use the color-coded pronunciation tracker to smooth tricky consonant clusters.",
  ];

  const bonus = inspirationPool[variationSeed % inspirationPool.length];
  const accentTip = accentAdvice[variationSeed % accentAdvice.length];

  return [
    `🎯 Target focus for ${targetLabel}: ${effectiveGoal}`,
    `🧠 ${nativeHint} to accelerate understanding.`,
    `⚡ Weekly blueprint:`,
    ...stagePlan.map((line, index) => `${index + 1}. ${line}`),
    `🎧 Accent boost: ${accentTip}`,
    `${bonus}`,
    "🚀 Track progress on your dashboard and celebrate every milestone you unlock!",
  ].join("\n");
}

function useTheme(): [ThemeMode, (mode: ThemeMode) => void] {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    const stored = window.localStorage.getItem("linguaplay-theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.dataset.theme = mode;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("linguaplay-theme", mode);
    }
  }, [mode]);

  return [mode, setMode];
}

function ThemeToggle() {
  const [theme, setTheme] = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

function FlashcardGame({ targetLanguage }: { targetLanguage: string }) {
  const deck = useMemo(() => flashcardDeck[targetLanguage] ?? flashcardDeck.en, [targetLanguage]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = deck[index % deck.length];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/90 p-6 shadow-lg backdrop-blur">
      <header className="flex items-center justify-between">
        <span className="text-sm font-semibold uppercase text-muted">Flashcard Arcade</span>
        <span className="text-xs text-muted">
          {(index % deck.length) + 1}/{deck.length}
        </span>
      </header>
      <button
        onClick={() => setFlipped(!flipped)}
        className="flex min-h-32 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/60 p-6 text-center text-lg font-semibold transition hover:scale-[1.02]"
      >
        <span className="text-3xl">{flipped ? current.translation : current.prompt}</span>
        <span className="mt-2 text-xs text-muted">{flipped ? "Tap to hide translation" : "Tap to reveal translation"}</span>
      </button>
      <p className="rounded-lg bg-secondary/70 p-3 text-sm text-muted">{current.tip}</p>
      <div className="flex justify-between">
        <button
          onClick={() => {
            const nextIndex = (index - 1 + deck.length) % deck.length;
            setIndex(nextIndex);
            setFlipped(false);
          }}
          className="rounded-full bg-background px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-primary hover:text-primary-foreground"
        >
          ◀︎ Previous
        </button>
        <button
          onClick={() => {
            const nextIndex = (index + 1) % deck.length;
            setIndex(nextIndex);
            setFlipped(false);
          }}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Next ▶︎
        </button>
      </div>
    </div>
  );
}

function QuickQuiz({ targetLanguage }: { targetLanguage: string }) {
  const questions = useMemo(() => quizBank[targetLanguage] ?? quizBank.en, [targetLanguage]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string>();
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);

  const current = questions[index];

  function handleSelect(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === current.answer) {
      setScore((prev) => prev + 1);
    }
  }

  function handleNext() {
    if (index === questions.length - 1) {
      setComplete(true);
      return;
    }
    setIndex((prev) => prev + 1);
    setSelected(undefined);
  }

  if (complete) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/90 p-6 shadow-lg backdrop-blur">
        <h3 className="text-xl font-semibold">🏁 Quiz Complete!</h3>
        <p className="text-sm text-muted">
          You answered {score} out of {questions.length} correctly. Replay tomorrow to unlock harder levels.
        </p>
        <button
          onClick={() => {
            setIndex(0);
            setScore(0);
            setSelected(undefined);
            setComplete(false);
          }}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Restart Challenge
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/90 p-6 shadow-lg backdrop-blur">
      <header className="flex items-center justify-between">
        <span className="text-sm font-semibold uppercase text-muted">Lightning Quiz</span>
        <span className="text-xs text-muted">
          {index + 1}/{questions.length}
        </span>
      </header>
      <h3 className="text-lg font-semibold">{current.question}</h3>
      <div className="flex flex-col gap-3">
        {current.options.map((option) => {
          const isCorrect = selected && option === current.answer;
          const isWrong = selected && option === selected && option !== current.answer;
          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`rounded-xl border border-border px-4 py-3 text-left text-sm font-medium transition ${
                isCorrect
                  ? "bg-green-500/20 text-green-600 dark:text-green-200"
                  : isWrong
                    ? "bg-red-500/20 text-red-600 dark:text-red-200"
                    : "bg-secondary/60 hover:bg-secondary/90"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted">💡 Hint: {current.hint}</p>
      <button
        onClick={handleNext}
        disabled={!selected}
        className="rounded-full bg-background px-4 py-2 text-sm font-semibold shadow-sm transition enabled:hover:bg-primary enabled:hover:text-primary-foreground"
      >
        {index === questions.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  );
}

function PhraseBuilder({ targetLanguage }: { targetLanguage: string }) {
  const cards = useMemo(() => phraseDeck[targetLanguage] ?? phraseDeck.en, [targetLanguage]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const current = cards[index];

  if (!current) {
    return null;
  }

  const isSolved = picked.join(" ") === current.solution.join(" ");

  const nextStepLabel =
    completed ? "Replay Deck" : index === cards.length - 1 ? "Finish Deck" : "Next Card";

  function handleAdvance() {
    if (index === cards.length - 1) {
      setCompleted(true);
      return;
    }
    setIndex((prev) => prev + 1);
    setPicked([]);
  }

  function handleReplay() {
    setCompleted(false);
    setIndex(0);
    setPicked([]);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/90 p-6 shadow-lg backdrop-blur">
      <header className="flex items-center justify-between">
        <span className="text-sm font-semibold uppercase text-muted">Phrase Builder</span>
        <span className="text-xs text-muted">
          {index + 1}/{cards.length}
        </span>
      </header>
      <p className="text-sm text-muted">{current.clue}</p>

      <div className="min-h-16 rounded-xl border border-dashed border-border bg-secondary/60 p-4 text-sm">
        {picked.length === 0 ? (
          <span className="text-muted">Tap tiles to build your sentence.</span>
        ) : (
          <span className={isSolved ? "font-semibold text-primary" : "text-foreground"}>
            {picked.join(" ")}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {current.tiles.map((tile, idx) => {
          const usedCount = picked.filter((item) => item === tile).length;
          const totalCount = current.solution.filter((item) => item === tile).length;
          const disabled = usedCount >= totalCount;
          return (
            <button
              key={`${tile}-${idx}-${usedCount}`}
              onClick={() => {
                if (disabled) return;
                setPicked((prev) => [...prev, tile]);
              }}
              className="rounded-full bg-secondary px-3 py-2 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-40"
              disabled={disabled}
            >
              {tile}
            </button>
          );
        })}
      </div>

      {isSolved && (
        <div className="rounded-xl bg-green-500/10 p-4 text-sm text-green-600 dark:text-green-200">
          ✅ Perfect! {current.context}
        </div>
      )}

      <button
        onClick={nextStepLabel === "Replay Deck" ? handleReplay : handleAdvance}
        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        {nextStepLabel}
      </button>
      {completed && (
        <button
          onClick={handleReplay}
          className="rounded-full bg-background px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-secondary"
        >
          Start Again
        </button>
      )}
    </div>
  );
}

function SectionTitle({ eyebrow, title, highlight }: { eyebrow: string; title: string; highlight?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">{eyebrow}</span>
      <h2 className="text-3xl font-bold leading-tight">
        {title} {highlight ? <span className="text-primary">{highlight}</span> : null}
      </h2>
    </div>
  );
}

export default function HomePage() {
  const [nativeLanguage, setNativeLanguage] = useState("ar");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [level, setLevel] = useState("starter");
  const [goal, setGoal] = useState("أريد التحدث بثقة مع أصدقائي حول العالم.");
  const [aiSeed, setAiSeed] = useState(0);

  const native = useMemo(() => getLanguageByCode(nativeLanguage), [nativeLanguage]);
  const target = useMemo(() => getLanguageByCode(targetLanguage), [targetLanguage]);

  const aiPlan = useMemo(
    () => buildAiPlan(goal, level, native, target, aiSeed),
    [goal, level, native, target, aiSeed],
  );

  const filteredTargets = useMemo(
    () => languageCatalog.filter((entry) => entry.code !== nativeLanguage),
    [nativeLanguage],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌍</span>
            <div className="flex flex-col">
              <span className="text-lg font-bold">LinguaPlay</span>
              <span className="text-xs text-muted">Learn every language with joy + AI.</span>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <a href="#journey" className="transition hover:text-primary">
              Journey
            </a>
            <a href="#tracks" className="transition hover:text-primary">
              Skills
            </a>
            <a href="#games" className="transition hover:text-primary">
              Games
            </a>
            <a href="#premium" className="transition hover:text-primary">
              Premium
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="#premium"
              className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg md:inline-flex"
            >
              Upgrade
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-24 px-6 py-16">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-7 rounded-3xl border border-border bg-card/90 p-10 shadow-xl backdrop-blur">
            <span className="w-fit rounded-full bg-secondary px-4 py-1 text-xs font-semibold uppercase text-primary">
              تعلم ممتع مدعوم بالذكاء الاصطناعي
            </span>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              اصنع رحلتك اللغوية من الصفر إلى الإتقان مع تجارب تفاعلية تشعل الحماس كل يوم.
            </h1>
            <p className="text-base text-muted lg:text-lg">{resolveGreeting(nativeLanguage)}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-semibold text-muted">لغتي الأم</span>
                <select
                  value={nativeLanguage}
                  onChange={(event) => setNativeLanguage(event.target.value)}
                  className="rounded-xl border border-border bg-background px-4 py-3 text-base font-semibold shadow-inner focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {languageCatalog.map((language) => (
                    <option key={language.code} value={language.code}>
                      {formatLanguageOption(language)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-semibold text-muted">أرغب في تعلم</span>
                <select
                  value={targetLanguage}
                  onChange={(event) => setTargetLanguage(event.target.value)}
                  className="rounded-xl border border-border bg-background px-4 py-3 text-base font-semibold shadow-inner focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {filteredTargets.map((language) => (
                    <option key={language.code} value={language.code}>
                      {formatLanguageOption(language)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/10 p-5">
                <p className="text-sm font-semibold uppercase text-primary">Personal AI Tutor</p>
                <p className="mt-3 text-sm text-muted">
                  Real-time corrections, cultural cues, and gamified missions that adapt to every move you make.
                </p>
              </div>
              <div className="rounded-2xl border border-dashed border-accent/40 bg-accent/10 p-5">
                <p className="text-sm font-semibold uppercase text-accent">Premium Missions</p>
                <p className="mt-3 text-sm text-muted">
                  Unlock expert immersion labs, voice cloning, and live communities competing for weekly trophies.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background/70 p-6 shadow-inner">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Native Language Boost</span>
              <p className="text-sm text-muted">
                {native ? `${native.nativeName} speakers learn ${target?.nativeName ?? "اللغة"} faster with tailored mnemonics, mirrored grammar maps, and cultural bridges forged by our AI.` : null}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-background to-accent/20 p-8 shadow-xl">
              <h3 className="text-2xl font-bold">لوحة القيادة الفورية</h3>
              <p className="mt-2 text-sm text-muted">
                لقاء صباحي مع مدرب الذكاء الاصطناعي يمنحك خطة يومية مع دروس قصيرة، ألعاب تفاعلية، وتحديات صوتية.
              </p>
              <div className="mt-6 grid gap-4">
                <div className="flex items-center justify-between rounded-2xl bg-background/70 px-4 py-3 text-sm font-semibold shadow-inner">
                  <span>🔥 سلسلة الانجازات</span>
                  <span className="text-primary">12 يوم</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-background/70 px-4 py-3 text-sm font-semibold shadow-inner">
                  <span>🗣️ دقائق المحادثة</span>
                  <span className="text-primary">46 دقيقة</span>
                </div>
                <div className="flex flex-col gap-2 rounded-2xl bg-background/70 p-4 shadow-inner">
                  <span className="text-sm font-semibold text-muted">أهداف اليوم</span>
                  <ul className="list-outside list-disc pl-5 text-sm text-muted">
                    <li>أكمل 3 بطاقات كلمات في لعبة فلاش</li>
                    <li>تحدى نفسك مع لغز بناء الجملة</li>
                    <li>سجل 5 جمل واحصل على تقييم فوري</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card/95 p-8 shadow-xl">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">AI Personas</span>
              <div className="mt-4 flex flex-col gap-4">
                {aiPersonas.map((persona) => (
                  <div key={persona.id} className="rounded-2xl border border-border bg-background/70 p-4 shadow-inner">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold">{persona.title}</h4>
                      <span className="text-xs font-semibold uppercase text-primary">
                        {persona.tag}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted">{persona.accent}</p>
                    <p className="mt-4 text-xs font-semibold uppercase text-muted">Best For</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {persona.bestFor.map((benefit) => (
                        <span
                          key={benefit}
                          className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="journey" className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card/90 p-10 shadow-lg backdrop-blur">
            <SectionTitle eyebrow="Journey Map" title="خطة الذكاء الاصطناعي" highlight="الشخصية" />
            <p className="text-sm text-muted">
              اختر مرحلتك الحالية وسيقوم مساعدنا الذكي بابتكار خطة مخصصة تمزج بين المراجعة، المحادثة، واللعب المتناغم مع جدولك اليومي.
            </p>
            <div className="flex flex-wrap gap-3">
              {levelRoadmap.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setLevel(stage.id)}
                  className={`flex flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
                    level === stage.id
                      ? "border-primary bg-primary/15"
                      : "border-border bg-secondary/60"
                  }`}
                >
                  <span className="text-sm font-semibold">
                    {stage.badge} {stage.title}
                  </span>
                  <span className="text-xs text-muted">{stage.duration}</span>
                </button>
              ))}
            </div>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-muted">ما هو هدفك الحالي؟</span>
              <textarea
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                rows={3}
                className="resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/10 p-4 text-sm text-muted">
              ✨ كل خطة تتجدد تلقائياً بحسب تقدمك الفعلي، ويقارنها المدرب بالطلاب المتفوقين ليبقيك متحمساً.
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grow rounded-3xl border border-border bg-card/90 p-8 shadow-lg backdrop-blur">
              <h3 className="text-xl font-bold">خطة المدرب الذكي</h3>
              <pre className="mt-4 min-h-56 whitespace-pre-wrap rounded-3xl border border-dashed border-border bg-background/70 p-6 text-sm leading-relaxed text-muted shadow-inner">
                {aiPlan}
              </pre>
              <button
                onClick={() => setAiSeed((prev) => prev + 1)}
                className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                🔁 أنشئ خطة جديدة الآن
              </button>
            </div>
          </div>
        </section>

        <section id="tracks" className="rounded-3xl border border-border bg-card/90 p-10 shadow-xl backdrop-blur">
          <SectionTitle eyebrow="Skill Universes" title="أطلق مهاراتك اللغوية عبر" highlight="مسارات ممتعة" />
          <p className="mt-3 text-sm text-muted">
            تعلم بكفاءة مع وحدات قصيرة تحوّل كل معرفة إلى لعبة. ذكاءنا الاصطناعي يراقب سرعتك ويعيد ترتيب الدروس والألعاب تلقائياً.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {skillTracks.map((track) => (
              <div key={track.id} className="flex flex-col gap-4 rounded-3xl border border-border bg-background/80 p-6 shadow-inner">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{track.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold">{track.title}</h3>
                    <p className="text-sm text-muted">{track.description}</p>
                  </div>
                </div>
                <ul className="grid gap-3">
                  {track.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-3 text-sm text-muted">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">✓</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="games">
          <SectionTitle eyebrow="Game Lab" title="ألعاب تفاعلية" highlight="تجعلك تدمن التعلم" />
          <p className="mt-3 max-w-3xl text-sm text-muted">
            استكشف مختبر الألعاب الذي يحول المفردات والقواعد والمحادثة إلى تحديات سريعة. كل لعبة تغذي المدرب بالبيانات ليطور رحلتك التالية.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <FlashcardGame key={`flash-${targetLanguage}`} targetLanguage={targetLanguage} />
            <QuickQuiz key={`quiz-${targetLanguage}`} targetLanguage={targetLanguage} />
            <PhraseBuilder key={`phrase-${targetLanguage}`} targetLanguage={targetLanguage} />
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card/95 p-10 shadow-xl backdrop-blur">
          <SectionTitle eyebrow="Milestones" title="رحلة الإنجاز" highlight="من الصفر إلى الاحتراف" />
          <p className="mt-3 max-w-3xl text-sm text-muted">
            تقدمك محفوظ في لوحة واحدة: شاهد الأوسمة التي تفوز بها، وعدد التحديات المنجزة، وأفضل أداء للألعاب خلال الأسبوع.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {levelRoadmap.map((milestone) => (
              <div key={milestone.id} className="flex flex-col gap-3 rounded-3xl border border-border bg-background/80 p-6 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{milestone.badge}</span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase text-muted">
                    {milestone.duration}
                  </span>
                </div>
                <h4 className="text-lg font-bold">{milestone.title}</h4>
                <p className="text-sm text-muted">{milestone.focus}</p>
                <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/10 p-4 text-xs text-muted">
                  🤖 {milestone.aiSupport}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="premium" className="rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-background to-accent/20 p-10 shadow-2xl">
          <SectionTitle eyebrow="Premium Club" title="خصائص ومميزات" highlight="مدفوعة مذهلة" />
          <p className="mt-3 max-w-3xl text-sm text-muted">
            اشترك لتحصل على محتوى حصري، دعم بشري مباشر، وتقارير تقدم تحليلية. خططنا مرنة للأفراد، العائلات، والمدارس.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {premiumHighlights.map((plan) => (
              <div
                key={plan.tier}
                className={`flex flex-col gap-5 rounded-3xl border p-6 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl ${
                  plan.featured
                    ? "border-primary bg-background/95"
                    : "border-border bg-card/90"
                }`}
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">Plan</span>
                  <h3 className="mt-2 text-2xl font-bold">{plan.tier}</h3>
                </div>
                <div>
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="ml-2 text-sm text-muted">{plan.cadence}</span>
                </div>
                <ul className="flex flex-col gap-3 text-sm text-muted">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-xs text-primary">
                        ★
                      </span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition ${
                    plan.featured
                      ? "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg"
                      : "bg-background text-foreground hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  اشترك الآن
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} LinguaPlay. Crafted for dreamers who love languages.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="#journey" className="transition hover:text-primary">
              Journey
            </Link>
            <Link href="#tracks" className="transition hover:text-primary">
              Skills
            </Link>
            <Link href="#games" className="transition hover:text-primary">
              Games
            </Link>
            <Link href="#premium" className="transition hover:text-primary">
              Premium
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
