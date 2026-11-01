import { createContext, useContext, useMemo, useState } from 'react';
import { Kicker, SlideTitle, SlideShell, Divider } from './common';
import { matchPairs, situations, quizQuestions, reflectionPrompts } from '@/lib/content';

/* ---------- Контекст результатов теста (слайды 17–18) ---------- */
export interface QuizState {
  answers: (number | null)[];
  setAnswer: (q: number, a: number) => void;
}
export const QuizContext = createContext<QuizState>({
  answers: quizQuestions.map(() => null),
  setAnswer: () => {},
});

/* ---------- Слайд 15. Соотнеси пару ---------- */
export function MatchPairsSlide() {
  const shuffledDefs = useMemo(() => {
    const arr = matchPairs.map((p, i) => ({ def: p.definition, pair: i }));
    // фиксированное перемешивание (стабильно между ререндерами)
    const order = [2, 4, 0, 3, 1];
    return order.map((i) => arr[i]);
  }, []);

  const [selected, setSelected] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const done = matched.length === matchPairs.length;

  const pickConcept = (i: number) => {
    if (matched.includes(i)) return;
    setSelected(i === selected ? null : i);
  };
  const pickDef = (pairIdx: number, defKey: number) => {
    if (selected === null || matched.includes(pairIdx)) return;
    if (pairIdx === selected) {
      setMatched((m) => [...m, pairIdx]);
      setSelected(null);
    } else {
      setWrong(defKey);
      setTimeout(() => setWrong(null), 600);
    }
  };

  return (
    <SlideShell>
      <Kicker>Закрепление · задание 1</Kicker>
      <SlideTitle className="mb-2">Соотнеси пару</SlideTitle>
      <p className="text-dim mb-6">
        Нажмите понятие слева, затем подходящее определение справа.
      </p>
      <div className="grid gap-3 md:grid-cols-2 md:gap-6">
        <div className="grid gap-3 content-start">
          {matchPairs.map((p, i) => (
            <button
              key={p.concept}
              type="button"
              onClick={() => pickConcept(i)}
              className={`panel-card p-4 text-left font-display text-xl md:text-2xl transition-colors ${
                matched.includes(i)
                  ? 'border-gold text-gold'
                  : selected === i
                    ? 'border-gold bg-panel text-cream'
                    : 'hover:border-gold'
              }`}
              style={matched.includes(i) ? { borderColor: 'var(--good)', color: 'var(--good)' } : undefined}
            >
              {p.concept}
            </button>
          ))}
        </div>
        <div className="grid gap-3 content-start">
          {shuffledDefs.map((d, k) => (
            <button
              key={p_def_key(k, d)}
              type="button"
              onClick={() => pickDef(d.pair, k)}
              className={`panel-card p-4 text-left text-base leading-snug transition-colors ${
                matched.includes(d.pair)
                  ? ''
                  : selected !== null
                    ? 'hover:border-gold cursor-pointer'
                    : ''
              } ${wrong === k ? 'shake' : ''}`}
              style={
                matched.includes(d.pair)
                  ? { borderColor: 'var(--good)', color: 'var(--good)' }
                  : undefined
              }
            >
              {d.def}
            </button>
          ))}
        </div>
      </div>
      {done && (
        <p className="step-in mt-6 font-mono-ui text-xs tracking-widest uppercase text-gold">
          Все пары собраны верно — отличная работа!
        </p>
      )}
    </SlideShell>
  );
}
function p_def_key(k: number, d: { def: string }) {
  return `${k}-${d.def.slice(0, 8)}`;
}

/* ---------- Слайд 16. Нравственный перекрёсток ---------- */
export function CrossroadsSlide() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <SlideShell>
      <Kicker>Закрепление · задание 2 · обсуждение в парах</Kicker>
      <SlideTitle className="mb-6">Нравственный перекрёсток</SlideTitle>
      <div className="grid gap-4 md:grid-cols-3">
        {situations.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className={`panel-card p-6 text-left transition-colors hover:border-gold ${
              open === i ? 'border-gold' : ''
            }`}
            aria-expanded={open === i}
          >
            <p className="font-mono-ui text-xs tracking-widest uppercase text-gold mb-3">{s.title}</p>
            <p className="text-base md:text-lg leading-snug">{s.text}</p>
            {open === i && (
              <p className="step-in mt-4 font-display text-cream text-lg italic">{s.prompt}</p>
            )}
            <p className="mt-4 font-mono-ui text-xs text-dim">
              {open === i ? 'нажмите, чтобы свернуть' : 'нажмите, чтобы открыть'}
            </p>
          </button>
        ))}
      </div>
      <p className="mt-6 text-dim max-w-3xl">
        Обсудите в паре: какой выбор сделает человек, который слушает совесть?
      </p>
    </SlideShell>
  );
}

/* ---------- Слайд 17. Мини-тест ---------- */
export function QuizSlide() {
  const { answers, setAnswer } = useContext(QuizContext);
  return (
    <SlideShell>
      <Kicker>Закрепление · задание 3</Kicker>
      <SlideTitle className="mb-2">Мини-тест</SlideTitle>
      <p className="text-dim mb-6">Выберите один вариант в каждом вопросе. Ответ можно изменить.</p>
      <div className="grid gap-5">
        {quizQuestions.map((q, qi) => (
          <div key={q.question} className="panel-card p-5">
            <p className="text-lg md:text-xl leading-snug mb-4">
              <span className="font-mono-ui text-gold text-sm mr-2">{qi + 1}.</span>
              {q.question}
            </p>
            <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={q.question}>
              {q.options.map((opt, oi) => {
                const letter = ['а', 'б', 'в'][oi];
                const active = answers[qi] === oi;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setAnswer(qi, oi)}
                    className={`btn-ghost ${active ? 'btn-gold-active' : ''}`}
                    style={
                      active
                        ? { backgroundColor: 'var(--terra)', color: '#FFFBF2', borderColor: 'var(--terra)' }
                        : undefined
                    }
                  >
                    {letter}) {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

/* ---------- Слайд 18. Самопроверка ---------- */
export function QuizCheckSlide() {
  const { answers } = useContext(QuizContext);
  const [revealed, setRevealed] = useState(false);
  const answeredCount = answers.filter((a) => a !== null).length;
  const score = quizQuestions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0),
    0
  );
  const letters = ['а', 'б', 'в'];
  return (
    <SlideShell center>
      <Kicker>Самопроверка</Kicker>
      <SlideTitle>Проверим себя</SlideTitle>
      <Divider />
      {!revealed ? (
        <>
          <p className="text-dim max-w-xl mb-6">
            Отвечено на {answeredCount} из {quizQuestions.length} вопросов.
            Когда все готовы — откройте ключ и сверьте ответы.
          </p>
          <button type="button" className="btn-gold" onClick={() => setRevealed(true)}>
            Открыть ключ
          </button>
        </>
      ) : (
        <div className="step-in w-full max-w-2xl">
          <p className="font-display text-cream text-3xl md:text-4xl mb-6">
            Верных ответов: {score} из {quizQuestions.length}
          </p>
          <ol className="grid gap-3 text-left">
            {quizQuestions.map((q, i) => {
              const user = answers[i];
              const ok = user === q.correct;
              return (
                <li
                  key={q.question}
                  className="panel-card p-4 text-base leading-snug flex gap-3 items-baseline"
                  style={{ borderColor: ok ? 'var(--good)' : 'var(--bad)' }}
                >
                  <span className="font-mono-ui text-gold text-xs shrink-0">{i + 1}.</span>
                  <span>
                    {letters[q.correct]}) {q.options[q.correct]}
                    {user !== null && !ok && (
                      <span className="text-dim"> — ваш ответ: {letters[user!]}) {q.options[user!]}</span>
                    )}
                    {user === null && <span className="text-dim"> — вы не ответили</span>}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </SlideShell>
  );
}

/* ---------- Слайд 19. Вывод урока ---------- */
export function ConclusionSlide() {
  const [step, setStep] = useState(0);
  const points = [
    'Жизнь — дар Божий, прекращать её недопустимо («не убий»).',
    'Продлить жизнь можно заботой, добром и милосердием, а душу — вечной жизнью с Богом.',
    'Советчиком в выборе служит совесть — голос нравственный.',
  ];
  return (
    <SlideShell center>
      <Kicker>Возврат к проблемному вопросу</Kicker>
      <SlideTitle className="max-w-3xl">Так что же мы можем ответить?</SlideTitle>
      <Divider />
      <div className="grid gap-4 max-w-2xl w-full text-left">
        {points.map((p, i) => (
          <div
            key={p}
            className={`panel-card p-5 text-lg md:text-xl leading-snug transition-opacity duration-300 ${
              i < step ? 'step-in opacity-100 border-gold' : 'opacity-0'
            }`}
            aria-hidden={i >= step}
          >
            <span className="font-mono-ui text-gold text-sm mr-3">{i + 1}.</span>
            {p}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn-gold mt-8"
        onClick={() => setStep((s) => Math.min(s + 1, points.length))}
        disabled={step >= points.length}
      >
        {step >= points.length ? 'Вывод готов' : 'Добавить вывод'}
      </button>
    </SlideShell>
  );
}

/* ---------- Слайд 20. Рефлексия ---------- */
export function ReflectionSlide() {
  const [activePrompt, setActivePrompt] = useState<number | null>(null);
  const [light, setLight] = useState<string | null>(null);
  const lights = [
    { id: 'green', color: '#5f9e6e', label: 'Зелёный — всё понял(а), могу объяснить другому' },
    { id: 'yellow', color: '#c9a227', label: 'Жёлтый — понял(а), но есть вопросы' },
    { id: 'red', color: '#b0625a', label: 'Красный — было трудно' },
  ];
  return (
    <SlideShell>
      <Kicker>Рефлексия · подведение итогов</Kicker>
      <SlideTitle className="mb-6">Незаконченные предложения</SlideTitle>
      <div className="flex flex-wrap gap-3 mb-10">
        {reflectionPrompts.map((p, i) => (
          <button
            key={p}
            type="button"
            onClick={() => setActivePrompt(i)}
            className={`word-chip ${activePrompt === i ? 'in-answer' : ''}`}
          >
            {p}
          </button>
        ))}
      </div>
      {activePrompt !== null && (
        <p className="step-in font-display text-cream text-xl md:text-2xl mb-10 max-w-3xl">
          {reflectionPrompts[activePrompt]} — продолжите фразу вслух или в листе самооценки.
        </p>
      )}

      <p className="font-mono-ui text-xs tracking-widest uppercase text-gold mb-4">
        Светофор самооценки
      </p>
      <div className="flex flex-wrap gap-6 items-center">
        {lights.map((l) => (
          <div key={l.id} className="flex flex-col items-center gap-3 max-w-[180px]">
            <button
              type="button"
              aria-label={l.label}
              onClick={() => setLight(l.id)}
              className={`traffic ${light === l.id ? 'selected' : ''}`}
              style={{
                backgroundColor: light === l.id ? l.color : 'transparent',
                borderColor: light === l.id ? l.color : 'var(--navy-line)',
              }}
            />
            <p className="text-sm text-dim text-center leading-snug">{l.label}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

/* ---------- Слайд 21. Домашнее задание ---------- */
export function HomeworkSlide() {
  const levels = [
    {
      name: 'Уровень 1',
      title: '«Золотые правила совести»',
      body: 'Составьте 5 правил, которым решили следовать, и оформите их в тетради.',
    },
    {
      name: 'Уровень 2',
      title: 'Мини-эссе',
      body: 'Напишите 5–7 предложений на тему «Моя совесть — мой советчик».',
    },
    {
      name: 'Уровень 3 · творческое',
      title: 'Семейная история',
      body: 'Вместе с родителями вспомните историю о добром деле или о человеке, память о котором жива в вашей семье или вашем городе Подмосковья, и запишите её.',
    },
  ];
  return (
    <SlideShell>
      <Kicker>Домашнее задание</Kicker>
      <SlideTitle className="mb-6">Что сделать дома</SlideTitle>
      <div className="panel-card border-gold p-6 mb-6 max-w-3xl">
        <p className="font-mono-ui text-xs tracking-widest uppercase text-gold mb-2">Общее задание</p>
        <p className="text-base md:text-lg leading-relaxed">
          Перечитайте материалы темы № 2 (раздел 2.1) и письменно ответьте на вопросы после текста
          К. Д. Ушинского: чем человек отличается от животных? Кто дал человеку дар слова, волю,
          совесть, веру?
        </p>
      </div>
      <p className="font-mono-ui text-xs tracking-widest uppercase text-gold mb-3">
        На выбор — один из уровней
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {levels.map((l) => (
          <div key={l.name} className="panel-card p-6">
            <p className="font-mono-ui text-xs tracking-widest uppercase text-dim mb-2">{l.name}</p>
            <p className="font-display text-cream text-xl mb-2">{l.title}</p>
            <p className="text-base leading-snug">{l.body}</p>
          </div>
        ))}
      </div>
      <Divider />
      <p className="epigraph text-xl md:text-2xl text-center max-w-2xl mx-auto">
        «Берегите жизнь — свою и чужую, и слушайте совесть: она говорит тихо, но всегда правду»
      </p>
    </SlideShell>
  );
}
