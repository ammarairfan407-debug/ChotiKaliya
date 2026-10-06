// ─── Language ────────────────────────────────────────
export type Language = 'en' | 'ur' | 'both';

// ─── Roles ───────────────────────────────────────────
export type UserRole = 'admin' | 'parent';

// ─── Age Groups ──────────────────────────────────────
export type AgeGroup = 'little' | 'junior';

// ─── Sections ────────────────────────────────────────
export type LittleLearnerSection =
  | 'islamic'
  | 'manners'
  | 'fine-motor'
  | 'poems'
  | 'speaking'
  | 'tracing'
  | 'stories'
  | 'weekly-activity';

export type JuniorLearnerSection =
  | 'maths'
  | 'english'
  | 'urdu'
  | 'science'
  | 'quiz'
  | 'creative'
  | 'stories';

export type Section = LittleLearnerSection | JuniorLearnerSection;

// ─── Bilingual Text ──────────────────────────────────
export interface BilingualContent {
  en: string;
  ur: string;
}

// ─── Characters ──────────────────────────────────────
export interface Character {
  id: string;
  name: string;
  nameUr: string;
  emoji: string;
  section: Section;
  color: string;
  description: string;
  descriptionUr: string;
  imageSrc?: string;
}

// ─── Content Items ───────────────────────────────────
export interface ContentItem {
  id: string;
  section: Section;
  ageGroup: AgeGroup;
  title: BilingualContent;
  text: BilingualContent;
  videoUrl?: string;
  audioUrl?: string;
  audioSlowUrl?: string;
  transcript?: string;
  verified: boolean;
  sortOrder: number;
  imageUrl?: string;
  category?: string;
}

// ─── Stories ─────────────────────────────────────────
export interface StoryPage {
  id: string;
  storyId: string;
  pageNumber: number;
  imageUrl?: string;
  imageDescription?: string;
  textEn: string;
  textUr: string;
  audioUrl?: string;
  audioSlowUrl?: string;
}

export interface StoryQuestion {
  id: string;
  storyId: string;
  questionEn: string;
  questionUr: string;
  options: BilingualContent[];
  correctIndex: number;
  imageUrl?: string;
}

export interface Story {
  id: string;
  titleEn: string;
  titleUr: string;
  category: string;
  ageGroup: string;
  guideCharacter: string;
  moralEn: string;
  moralUr: string;
  parentPromptEn: string;
  parentPromptUr: string;
  homeActivityEn: string;
  homeActivityUr: string;
  pages: StoryPage[];
  questions: StoryQuestion[];
  published: boolean;
  coverImageUrl?: string;
}

// ─── Home Activities ─────────────────────────────────
export interface HomeActivity {
  id: string;
  title: BilingualContent;
  category: string;
  materials: BilingualContent[];
  steps: BilingualContent[];
  timeEstimate: string;
  learningGoal: BilingualContent;
  parentTip: BilingualContent;
  safetyNote?: BilingualContent;
  audioUrl?: string;
  imageUrl?: string;
  ageGroup: AgeGroup;
}

// ─── Weekly Plan ─────────────────────────────────────
export interface WeeklyPlanDay {
  dayOfWeek: number; // 1=Monday ... 5=Friday
  activities: BilingualContent[];
}

export interface WeeklyPlan {
  id: string;
  weekStart: string;
  theme: BilingualContent;
  ageGroup: AgeGroup;
  days: WeeklyPlanDay[];
  sortOrder: number;
}

// ─── Assignments ─────────────────────────────────────
export interface Assignment {
  id: string;
  title: BilingualContent;
  description: BilingualContent;
  ageGroup: AgeGroup;
  childId?: string;
  dueDate: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  childId: string;
  parentId: string;
  status: 'pending' | 'completed' | 'reviewed';
  feedback?: string;
  mediaUrls: string[];
  createdAt: string;
}

// ─── Rewards ─────────────────────────────────────────
export type GardenStage = 'seed' | 'sprout' | 'bud' | 'flower';

export interface Reward {
  id: string;
  childId: string;
  type: 'star' | 'badge' | 'character';
  section: Section;
  stars: number;
  badge?: string;
  createdAt: string;
}

export interface GardenProgress {
  totalStars: number;
  stage: GardenStage;
  unlockedCharacters: string[];
  sectionProgress: Record<Section, number>;
}

// ─── Progress ────────────────────────────────────────
export interface Progress {
  id: string;
  childId: string;
  section: Section;
  itemId: string;
  completed: boolean;
  score?: number;
  createdAt: string;
}

// ─── User Profiles ───────────────────────────────────
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export interface ChildProfile {
  id: string;
  parentId: string;
  name: string;
  ageGroup: AgeGroup;
  avatar?: string;
  createdAt: string;
}

// ─── Section Card ────────────────────────────────────
export interface SectionCardData {
  id: Section;
  title: BilingualContent;
  character: Character;
  color: string;
  gradient: string;
  href: string;
  icon: string;
  description: BilingualContent;
}

// ─── Poem ────────────────────────────────────────────
export interface Poem {
  id: string;
  title: BilingualContent;
  lyrics: BilingualContent;
  category: string;
  videoUrl?: string;
  audioUrl?: string;
  ageGroup: AgeGroup;
}

// ─── Dua / Islamic Content ───────────────────────────
export interface IslamicItem {
  id: string;
  type: 'dua' | 'kalma' | 'surah' | 'name-of-allah' | 'prayer-step' | 'wudu-step';
  title: BilingualContent;
  arabicText?: string;
  transliteration?: string;
  translation: BilingualContent;
  audioUrl?: string;
  audioSlowUrl?: string;
  imageUrl?: string;
  verified: boolean;
  sortOrder: number;
}

// ─── Fine Motor Activity ─────────────────────────────
export interface FineMotorActivity {
  id: string;
  title: BilingualContent;
  description: BilingualContent;
  type: 'video' | 'printable' | 'game';
  materials?: BilingualContent[];
  videoUrl?: string;
  printableUrl?: string;
  gameType?: 'drag-drop' | 'dots-join' | 'puzzle' | 'coloring';
  ageGroup: AgeGroup;
}

// ─── Manners Scenario ────────────────────────────────
export interface MannerScenario {
  id: string;
  title: BilingualContent;
  description: BilingualContent;
  type: 'lesson' | 'right-wrong' | 'challenge';
  imageUrl?: string;
  videoUrl?: string;
  correctAnswer?: boolean;
  weeklyChallenge?: BilingualContent;
}

// ─── Timer Settings ──────────────────────────────────
export interface TimerSettings {
  duration: number; // in minutes (10-30)
  isActive: boolean;
  remainingSeconds: number;
}

// ─── Game Types ──────────────────────────────────────
export interface GameCard {
  id: string;
  content: string;
  imageUrl?: string;
  matched: boolean;
  flipped: boolean;
}

export interface QuizQuestion {
  id: string;
  question: BilingualContent;
  options: BilingualContent[];
  correctIndex: number;
  imageUrl?: string;
  level: number;
}
