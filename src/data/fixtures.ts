/**
 * PREVIEW DATA ONLY.
 *
 * Every figure in this file is sample data used to design the admin console
 * before it is connected to the live Abdulsobbur Anatomy platform. Nothing here
 * reflects real users, questions, or AI usage. The UI shows a "Preview data"
 * banner wherever these fixtures are rendered.
 *
 * A later milestone (see PLAN.md) replaces these exports with server functions
 * that read from the live platform's database through an authorised,
 * server-side connection. Keep the shapes stable so screens don't need to change.
 */

export type Role = 'student' | 'moderator' | 'admin'
export type AccountStatus = 'active' | 'suspended'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: Role
  status: AccountStatus
  university: string
  department: string
  programme: string
  level: string
  joinedAt: string
  lastActiveAt: string
  quizzesTaken: number
  questionsAnswered: number
  accuracy: number
  recentQuizzes: { topic: string; score: number; total: number; date: string }[]
}

export type Difficulty = 'easy' | 'medium' | 'hard'
export type QuestionStatus = 'published' | 'pending_review' | 'archived'
export type QuestionSource = 'manual' | 'ai'

export interface Question {
  id: string
  subject: string
  topic: string
  difficulty: Difficulty
  status: QuestionStatus
  source: QuestionSource
  stem: string
  options: string[]
  answerIndex: number
  explanation: string
  timesAnswered: number
  correctRate: number
  updatedAt: string
}

export const universities = [
  'University of Ilorin',
  'Ahmadu Bello University',
  'University of Lagos',
  'Obafemi Awolowo University',
  'University of Ibadan',
]

export const subjects = ['Gross Anatomy', 'Histology', 'Embryology', 'Neuroanatomy']

export const topics: Record<string, string[]> = {
  'Gross Anatomy': ['Osteology', 'Upper Limb', 'Lower Limb', 'Thorax', 'Abdomen'],
  Histology: ['Epithelium', 'Connective Tissue', 'Muscle Tissue'],
  Embryology: ['Gametogenesis', 'Germ Layers', 'Cardiac Development'],
  Neuroanatomy: ['Brainstem', 'Cranial Nerves', 'Spinal Cord'],
}

const firstNames = [
  'Aisha', 'Tunde', 'Chiamaka', 'Ibrahim', 'Fatima', 'Emeka', 'Zainab', 'Femi',
  'Ngozi', 'Musa', 'Halima', 'Segun', 'Amina', 'Chinedu', 'Yetunde', 'Usman',
  'Blessing', 'Kabir', 'Funmilayo', 'Abdullahi', 'Ifeoma', 'Sadiq', 'Bisola', 'Yusuf',
]
const lastNames = [
  'Bello', 'Okafor', 'Adeyemi', 'Suleiman', 'Eze', 'Lawal', 'Okonkwo', 'Abubakar',
  'Balogun', 'Nwosu', 'Danjuma', 'Ogunleye',
]
const programmes = ['MBBS', 'BDS', 'B.Sc Anatomy', 'B.NSc Nursing', 'B.MLS']
const departments: Record<string, string> = {
  MBBS: 'Medicine & Surgery',
  BDS: 'Dentistry',
  'B.Sc Anatomy': 'Human Anatomy',
  'B.NSc Nursing': 'Nursing Science',
  'B.MLS': 'Medical Laboratory Science',
}
const levels = ['100L', '200L', '300L', '400L']

// Deterministic pseudo-random so server and client render identical markup.
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}
const rand = seeded(42)
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)]

const TODAY = new Date('2026-10-09T12:00:00Z')
const daysAgo = (d: number) => new Date(TODAY.getTime() - d * 86400000).toISOString()

export const users: AdminUser[] = firstNames.map((first, i) => {
  const last = lastNames[i % lastNames.length]
  const programme = pick(programmes)
  const quizzesTaken = Math.floor(rand() * 60)
  const accuracy = Math.round(45 + rand() * 45)
  const allTopics = Object.values(topics).flat()
  return {
    id: `usr_${(1000 + i * 37).toString(36)}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.edu.ng`,
    role: i === 0 ? 'admin' : i === 5 ? 'moderator' : 'student',
    status: i === 7 || i === 15 ? 'suspended' : 'active',
    university: pick(universities),
    department: departments[programme],
    programme,
    level: pick(levels),
    joinedAt: daysAgo(Math.floor(rand() * 180) + 1),
    lastActiveAt: daysAgo(Math.floor(rand() * 20)),
    quizzesTaken,
    questionsAnswered: quizzesTaken * 20,
    accuracy,
    recentQuizzes: Array.from({ length: 4 }, (_, q) => {
      const total = pick([10, 20, 30])
      return {
        topic: pick(allTopics),
        total,
        score: Math.min(total, Math.round(total * (accuracy / 100) * (0.85 + rand() * 0.3))),
        date: daysAgo(q * 3 + Math.floor(rand() * 3)),
      }
    }),
  }
})

const stems: Record<string, { stem: string; options: string[]; answer: number; explanation: string }[]> = {
  Osteology: [
    {
      stem: 'Which bone forms the prominence of the cheek?',
      options: ['Maxilla', 'Zygomatic bone', 'Temporal bone', 'Sphenoid'],
      answer: 1,
      explanation: 'The zygomatic bone forms the cheek prominence and part of the lateral orbital wall.',
    },
    {
      stem: 'The anatomical snuffbox is bounded medially by the tendon of which muscle?',
      options: ['Abductor pollicis longus', 'Extensor pollicis brevis', 'Extensor pollicis longus', 'Flexor carpi radialis'],
      answer: 2,
      explanation: 'Extensor pollicis longus forms the medial (ulnar) border of the anatomical snuffbox.',
    },
  ],
  'Upper Limb': [
    {
      stem: 'Wrist drop is most commonly caused by injury to which nerve?',
      options: ['Median nerve', 'Ulnar nerve', 'Radial nerve', 'Musculocutaneous nerve'],
      answer: 2,
      explanation: 'The radial nerve supplies the wrist extensors; injury in the spiral groove causes wrist drop.',
    },
  ],
  Thorax: [
    {
      stem: 'The sinoatrial node is usually supplied by a branch of which artery?',
      options: ['Left anterior descending', 'Right coronary artery', 'Circumflex artery', 'Posterior interventricular'],
      answer: 1,
      explanation: 'In about 60% of people the SA nodal artery arises from the right coronary artery.',
    },
  ],
  'Cranial Nerves': [
    {
      stem: 'Which cranial nerve innervates the lateral rectus muscle?',
      options: ['Oculomotor (III)', 'Trochlear (IV)', 'Abducens (VI)', 'Facial (VII)'],
      answer: 2,
      explanation: 'LR6SO4: lateral rectus is supplied by the abducens nerve (CN VI).',
    },
    {
      stem: 'Which cranial nerve supplies the lateral rectus of the eye?',
      options: ['CN III', 'CN IV', 'CN VI', 'CN V'],
      answer: 2,
      explanation: 'The abducens nerve (CN VI) supplies lateral rectus.',
    },
  ],
  Epithelium: [
    {
      stem: 'The urinary bladder is lined by which type of epithelium?',
      options: ['Simple columnar', 'Transitional', 'Stratified squamous', 'Pseudostratified'],
      answer: 1,
      explanation: 'Transitional epithelium (urothelium) allows the bladder to stretch.',
    },
  ],
  'Germ Layers': [
    {
      stem: 'The nervous system is derived from which germ layer?',
      options: ['Endoderm', 'Mesoderm', 'Ectoderm', 'Extra-embryonic mesoderm'],
      answer: 2,
      explanation: 'The neural tube and neural crest both arise from ectoderm.',
    },
  ],
  Brainstem: [
    {
      stem: 'The nucleus ambiguus is located in which part of the brainstem?',
      options: ['Midbrain', 'Pons', 'Medulla oblongata', 'Thalamus'],
      answer: 2,
      explanation: 'Nucleus ambiguus lies in the medulla and gives motor fibres to CN IX, X and XI.',
    },
  ],
  'Cardiac Development': [
    {
      stem: 'Failure of the foramen ovale to close results in which defect?',
      options: ['Ventricular septal defect', 'Atrial septal defect', 'Patent ductus arteriosus', 'Tetralogy of Fallot'],
      answer: 1,
      explanation: 'A patent foramen ovale is a form of atrial septal defect.',
    },
  ],
}

const subjectOf = (topic: string) =>
  Object.entries(topics).find(([, t]) => t.includes(topic))?.[0] ?? 'Gross Anatomy'

let qn = 0
export const questions: Question[] = Object.entries(stems).flatMap(([topic, list]) =>
  list.map((s, j) => {
    qn++
    const source: QuestionSource = qn % 3 === 0 ? 'ai' : 'manual'
    return {
      id: `q_${String(1040 + qn).padStart(5, '0')}`,
      subject: subjectOf(topic),
      topic,
      difficulty: (['easy', 'medium', 'hard'] as Difficulty[])[(qn + j) % 3],
      status: source === 'ai' && qn % 2 === 0 ? 'pending_review' : qn === 5 ? 'archived' : 'published',
      source,
      stem: s.stem,
      options: s.options,
      answerIndex: s.answer,
      explanation: s.explanation,
      timesAnswered: Math.floor(rand() * 900) + 40,
      correctRate: Math.round(35 + rand() * 55),
      updatedAt: daysAgo(Math.floor(rand() * 40)),
    }
  }),
)

/** Weekly new registrations, oldest first (12 weeks). */
export const registrationsByWeek = [14, 19, 17, 23, 31, 28, 35, 42, 38, 47, 52, 49].map((count, i) => ({
  weekStart: daysAgo((11 - i) * 7).slice(0, 10),
  count,
}))

/** Daily AI generation requests, oldest first (14 days). */
export const aiRequestsByDay = [120, 134, 98, 156, 171, 142, 88, 193, 205, 187, 164, 212, 228, 196].map((requests, i) => ({
  date: daysAgo(13 - i).slice(0, 10),
  requests,
  failed: Math.round(requests * (0.01 + (i % 4) * 0.008)),
}))

export const aiSummary = {
  requests30d: 4870,
  questionsGenerated30d: 3115,
  approvedRate: 0.71,
  failedRate30d: 0.024,
  estimatedCost30dUsd: 18.4,
  monthlyBudgetUsd: 40,
  cacheHitRate: 0.38,
}

export const topicAccuracy = [
  { topic: 'Osteology', accuracy: 74 },
  { topic: 'Upper Limb', accuracy: 68 },
  { topic: 'Thorax', accuracy: 61 },
  { topic: 'Epithelium', accuracy: 79 },
  { topic: 'Germ Layers', accuracy: 66 },
  { topic: 'Brainstem', accuracy: 49 },
  { topic: 'Cranial Nerves', accuracy: 55 },
]

export type ActivityKind = 'signup' | 'quiz' | 'ai' | 'admin' | 'error'
export const recentActivity: { id: string; kind: ActivityKind; text: string; at: string }[] = [
  { id: 'a1', kind: 'quiz', text: 'Zainab Okonkwo completed "Cranial Nerves" — 17/20', at: daysAgo(0.02) },
  { id: 'a2', kind: 'ai', text: '24 AI-generated questions queued for review (Brainstem)', at: daysAgo(0.05) },
  { id: 'a3', kind: 'signup', text: 'New student registered from University of Ilorin', at: daysAgo(0.09) },
  { id: 'a4', kind: 'admin', text: 'Aisha Bello archived question q_01045', at: daysAgo(0.2) },
  { id: 'a5', kind: 'error', text: 'AI generation request timed out (retried successfully)', at: daysAgo(0.4) },
  { id: 'a6', kind: 'quiz', text: 'Emeka Eze completed "Osteology" — 12/20', at: daysAgo(0.6) },
  { id: 'a7', kind: 'signup', text: 'New student registered from Ahmadu Bello University', at: daysAgo(0.9) },
]

export const alerts: { id: string; level: 'info' | 'warning' | 'critical'; text: string }[] = [
  { id: 'al1', level: 'warning', text: 'AI spend has reached 46% of the monthly budget with 22 days remaining.' },
  { id: 'al2', level: 'info', text: '3 AI-generated questions are awaiting review.' },
  { id: 'al3', level: 'info', text: '2 possible duplicate questions detected in Cranial Nerves.' },
]

export const systemStatus: { name: string; ok: boolean; detail: string }[] = [
  { name: 'Student site', ok: true, detail: 'Responding normally' },
  { name: 'Database', ok: true, detail: 'Not yet connected (preview)' },
  { name: 'AI generation', ok: true, detail: '2.4% failure rate (30d)' },
  { name: 'Authentication', ok: true, detail: 'Not yet connected (preview)' },
]

/** Simple normalised-token similarity used to flag likely duplicate questions. */
export function similarity(a: string, b: string) {
  const tokens = (s: string) =>
    new Set(
      s
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, ' ')
        .split(/\s+/)
        .filter((t) => t.length > 2 && !['which', 'the', 'what', 'from', 'with', 'muscle', 'nerve'].includes(t)),
    )
  const A = tokens(a)
  const B = tokens(b)
  if (!A.size || !B.size) return 0
  let inter = 0
  A.forEach((t) => B.has(t) && inter++)
  return inter / Math.min(A.size, B.size)
}
