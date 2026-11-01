import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  TitleSlide,
  BelieveRulesSlide,
  BelieveSingleSlide,
  AssembleTopicSlide,
  ProblemSlide,
  GoalTreeSlide,
} from '@/components/deck/slides-a';
import {
  GroupMissionSlide,
  SpeechSlide,
  SchemeSlide,
  SaintsSlide,
} from '@/components/deck/slides-b';
import {
  MatchPairsSlide,
  CrossroadsSlide,
  QuizSlide,
  QuizCheckSlide,
  ConclusionSlide,
  ReflectionSlide,
  HomeworkSlide,
  QuizContext,
} from '@/components/deck/slides-c';
import { groupMissions, quizQuestions, roman } from '@/lib/content';

const SLIDES: { title: string; bg: string; node: React.ReactNode }[] = [
  { title: 'Титульный лист', bg: 'image1_1', node: <TitleSlide /> },
  { title: 'Игра «Веришь — не веришь»: правила', bg: 'image2_1', node: <BelieveRulesSlide /> },
  { title: 'Веришь — не веришь · 1', bg: 'image2_1', node: <BelieveSingleSlide index={0} /> },
  { title: 'Веришь — не веришь · 2', bg: 'image2_1', node: <BelieveSingleSlide index={1} /> },
  { title: 'Веришь — не веришь · 3', bg: 'image2_1', node: <BelieveSingleSlide index={2} /> },
  { title: 'Веришь — не веришь · 4 и беседа', bg: 'image2_1', node: <BelieveSingleSlide index={3} /> },
  { title: 'Собери тему', bg: 'image5_1', node: <AssembleTopicSlide /> },
  { title: 'Тема и проблемный вопрос', bg: 'image5_1', node: <ProblemSlide /> },
  { title: 'Дерево целей', bg: 'image5_1', node: <GoalTreeSlide /> },
  { title: 'Группа 1 «Жизнь — дар Божий»', bg: 'image8_1', node: <GroupMissionSlide mission={groupMissions[0]} /> },
  { title: 'Группа 2 «Не убий!»', bg: 'image9_1', node: <GroupMissionSlide mission={groupMissions[1]} /> },
  { title: 'Группа 3 «Голос совести»', bg: 'image10_1', node: <GroupMissionSlide mission={groupMissions[2]} /> },
  { title: 'Выступление группы 1', bg: 'image5_1', node: <SpeechSlide groups={[1]} /> },
  { title: 'Выступление группы 2', bg: 'image5_1', node: <SpeechSlide groups={[2]} /> },
  { title: 'Выступление группы 3', bg: 'image5_1', node: <SpeechSlide groups={[3]} /> },
  { title: 'Опорная схема', bg: 'image5_1', node: <SchemeSlide /> },
  { title: 'Вера, Надежда, Любовь и София', bg: 'image14_1', node: <SaintsSlide /> },
  { title: 'Соотнеси пару', bg: 'image5_1', node: <MatchPairsSlide /> },
  { title: 'Нравственный перекрёсток', bg: 'image5_1', node: <CrossroadsSlide /> },
  { title: 'Мини-тест', bg: 'image5_1', node: <QuizSlide /> },
  { title: 'Самопроверка', bg: 'image5_1', node: <QuizCheckSlide /> },
  { title: 'Вывод урока', bg: 'image19_1', node: <ConclusionSlide /> },
  { title: 'Рефлексия', bg: 'image19_1', node: <ReflectionSlide /> },
  { title: 'Домашнее задание', bg: 'image19_1', node: <HomeworkSlide /> },
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<'next' | 'prev'>('next');
  const [overview, setOverview] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // shared quiz state (slides 17–18)
  const [answers, setAnswers] = useState<(number | null)[]>(quizQuestions.map(() => null));
  const quizState = useMemo(
    () => ({
      answers,
      setAnswer: (q: number, a: number) =>
        setAnswers((prev) => prev.map((v, i) => (i === q ? a : v))),
    }),
    [answers]
  );

  const go = useCallback(
    (to: number) => {
      const clamped = Math.max(0, Math.min(SLIDES.length - 1, to));
      setDir(clamped >= index ? 'next' : 'prev');
      setIndex(clamped);
      setOverview(false);
    },
    [index]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        if ((e.target as HTMLElement)?.closest('button, [role="radio"]')) return;
        e.preventDefault();
        go(index + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === 'Escape') {
        setOverview(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 60) go(dx < 0 ? index + 1 : index - 1);
    touchStartX.current = null;
  };

  return (
    <QuizContext.Provider value={quizState}>
      <div className="min-h-100dvh flex flex-col" style={{ minHeight: '100dvh' }}>
        {/* header */}
        <header className="border-b border-line">
          <div className="max-w-5xl mx-auto px-5 md:px-10 h-14 flex items-center justify-between gap-4">
            <p className="slide-badge truncate">
              Жизнь человека и совесть · 5 класс
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <span className="slide-badge">
                {roman(index + 1)} / {roman(SLIDES.length)}
              </span>
              <button
                type="button"
                className="btn-ghost !py-2 !px-3 !min-h-0"
                style={{ minHeight: 36 }}
                onClick={() => setOverview((o) => !o)}
                aria-expanded={overview}
              >
                Слайды
              </button>
            </div>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${((index + 1) / SLIDES.length) * 100}%` }}
            />
          </div>
        </header>

        {/* stage */}
        <main
          className="flex-1 flex items-stretch md:items-center justify-center py-4 md:py-8 px-3 md:px-6"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="deck-frame stage-bg w-full max-w-6xl flex items-center min-h-[60vh]"
            style={{ backgroundImage: `url(/bg/${SLIDES[index].bg}.jpg)` }}
          >
            <div key={index} className={`w-full ${dir === 'next' ? 'slide-in-next' : 'slide-in-prev'}`}>
              {SLIDES[index].node}
            </div>
          </div>
        </main>

        {/* footer nav */}
        <footer className="border-t border-line">
          <div className="max-w-5xl mx-auto px-5 md:px-10 py-3 flex items-center justify-between gap-3">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              style={index === 0 ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
            >
              ← Назад
            </button>
            <p className="slide-badge text-center hidden sm:block truncate">{SLIDES[index].title}</p>
            <button
              type="button"
              className="btn-gold"
              onClick={() => go(index + 1)}
              disabled={index === SLIDES.length - 1}
              style={index === SLIDES.length - 1 ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
            >
              Далее →
            </button>
          </div>
        </footer>

        {/* overview overlay */}
        {overview && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-10"
            style={{ backgroundColor: 'rgba(74, 64, 54, 0.55)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Все слайды"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOverview(false);
            }}
          >
            <div className="bg-navy deck-frame w-full max-w-4xl p-5 md:p-8 my-auto">
              <div className="flex items-center justify-between mb-6">
                <p className="kicker !mb-0">Все слайды урока</p>
                <button type="button" className="btn-ghost" onClick={() => setOverview(false)}>
                  Закрыть ✕
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => go(i)}
                    className={`panel-card p-4 text-left transition-colors hover:border-gold ${
                      i === index ? 'border-gold' : ''
                    }`}
                  >
                    <span className="font-mono-ui text-gold text-xs mr-2">{roman(i + 1)}</span>
                    <span className="text-base">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </QuizContext.Provider>
  );
}
