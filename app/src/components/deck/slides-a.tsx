import { useMemo, useState } from 'react';
import { Kicker, SlideTitle, SlideShell, Divider, Reveal } from './common';
import {
  believeStatements,
  topicWords,
  lessonTopic,
  goals,
  goalSteps,
} from '@/lib/content';

/* ---------- Слайд 1. Титульный ---------- */
export function TitleSlide() {
  const [epigraphShown, setEpigraphShown] = useState(false);
  return (
    <SlideShell center>
      <div className="panel-card px-6 py-8 md:px-14 md:py-12 flex flex-col items-center">
        <Kicker>ОРКСЭ · Основы православной культуры · Тема № 2</Kicker>
        <h1 className="font-display text-cream font-semibold leading-tight text-4xl md:text-6xl">
          Жизнь человека
          <br />и совесть
        </h1>
        <p className="mt-5 font-mono-ui uppercase tracking-[0.2em] text-sm md:text-base text-dim">
          Недопустимость прекращения · Продление · Совесть
        </p>
        <Divider />
        <Reveal
          shown={epigraphShown}
          onReveal={() => setEpigraphShown(true)}
          label="Показать эпиграф"
        >
          <blockquote className="epigraph text-xl md:text-2xl leading-relaxed max-w-2xl">
            «Береги свою совесть от всякого плохого дела и мысли»
            <footer className="mt-3 not-italic text-sm text-dim font-mono-ui tracking-widest uppercase">
              из заповедей блаженства
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </SlideShell>
  );
}

/* ---------- Слайд 2. Правила игры ---------- */
export function BelieveRulesSlide() {
  return (
    <SlideShell center>
      <Kicker>Актуализация знаний</Kicker>
      <SlideTitle>Игра «Веришь — не веришь»</SlideTitle>
      <Divider />
      <div className="grid gap-5 md:grid-cols-2 max-w-3xl w-full text-left">
        <div className="panel-card p-6">
          <p className="font-mono-ui text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--good)' }}>
            Верю
          </p>
          <p className="text-lg">
            Если считаете утверждение верным — нажмите «Верю».
          </p>
        </div>
        <div className="panel-card p-6">
          <p className="font-mono-ui text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--bad)' }}>
            Не верю
          </p>
          <p className="text-lg">
            Если утверждение неверное — нажмите «Не верю».
          </p>
        </div>
      </div>
      <p className="mt-6 text-dim max-w-2xl panel-card px-4 py-3">
        Утверждения появляются по одному. На экране отвечаем кнопками «Верю» / «Не верю» —
        после ответа откроется правильный вариант с пояснением.
      </p>
    </SlideShell>
  );
}

/* ---------- Слайды 3–6. Утверждения (по одному на слайд) ---------- */
export function BelieveSingleSlide({ index }: { index: number }) {
  const item = believeStatements[index];
  const [answered, setAnswered] = useState<boolean | null>(null);
  return (
    <SlideShell center>
      <Kicker>Веришь — не веришь · утверждение {index + 1} из {believeStatements.length}</Kicker>
      <div className="panel-card p-8 md:p-12 max-w-3xl w-full">
        <p className="font-display text-cream text-2xl md:text-4xl leading-snug mb-8">
          {item.text}
        </p>
        {answered === null ? (
          <div className="flex flex-wrap justify-center gap-4">
            <button type="button" className="btn-gold min-w-[160px]" onClick={() => setAnswered(true)}>
              Верю
            </button>
            <button type="button" className="btn-ghost min-w-[160px]" onClick={() => setAnswered(false)}>
              Не верю
            </button>
          </div>
        ) : (
          <div className="step-in">
            <p className="font-mono-ui text-sm tracking-widest uppercase mb-2">
              <span style={{ color: answered === item.answer ? 'var(--good)' : 'var(--bad)' }}>
                {answered === item.answer ? 'Правильно! ' : 'Ошибка. '}
              </span>
              <span className="text-gold">{item.answer ? 'Это верно' : 'Это неверно'}</span>
            </p>
            <p className="text-dim text-lg">{item.explanation}</p>
          </div>
        )}
      </div>
      {index === believeStatements.length - 1 && (
        <p className="mt-6 text-dim max-w-2xl panel-card px-4 py-3">
          Вопросы для беседы: Что такое заповедь? Какие первые правила для счастливой жизни Бог дал
          людям? Почему история Каина и Авеля названа среди самых печальных?
        </p>
      )}
    </SlideShell>
  );
}

/* ---------- Слайд 5. Собери тему ---------- */
export function AssembleTopicSlide() {
  const shuffled = useMemo(() => {
    const arr = [...topicWords];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (i * 5 + 3) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const pick = (w: string) => {
    if (checked) return;
    setPicked((p) => [...p, w]);
  };
  const reset = () => {
    setPicked([]);
    setChecked(false);
  };

  return (
    <SlideShell>
      <Kicker>Постановка проблемы · работа в парах</Kicker>
      <SlideTitle className="mb-2">Собери тему урока</SlideTitle>
      <p className="text-dim mb-6">
        Нажимайте на слова в нужном порядке, чтобы составить тему. Потом сверимся с темой-эталоном.
      </p>
      <div className="flex flex-wrap gap-3 mb-8">
        {shuffled.map((w) => (
          <button
            key={w}
            type="button"
            className={`word-chip ${picked.includes(w) ? 'used' : ''}`}
            onClick={() => pick(w)}
          >
            {w}
          </button>
        ))}
      </div>
      <div
        className="panel-card p-5 min-h-[72px] flex flex-wrap items-center gap-2"
        aria-live="polite"
      >
        {picked.length === 0 && <span className="text-dim">Ваша версия темы появится здесь…</span>}
        {picked.map((w, i) => (
          <span key={`${w}-${i}`} className="word-chip in-answer pop-in" style={{ pointerEvents: 'none' }}>
            {w}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-5">
        <button
          type="button"
          className="btn-gold"
          onClick={() => setChecked(true)}
          disabled={picked.length === 0 || checked}
        >
          Сверить с темой-эталоном
        </button>
        <button type="button" className="btn-ghost" onClick={reset}>
          Собрать заново
        </button>
      </div>
      {checked && (
        <div className="step-in panel-card p-5 mt-5 border-gold">
          <p className="font-mono-ui text-xs tracking-widest uppercase text-gold mb-2">Тема урока</p>
          <p className="font-display text-cream text-xl md:text-2xl leading-snug">{lessonTopic}</p>
        </div>
      )}
    </SlideShell>
  );
}

/* ---------- Слайд 6. Проблемный вопрос ---------- */
export function ProblemSlide() {
  const [shown, setShown] = useState(false);
  return (
    <SlideShell center>
      <Kicker>Тема урока</Kicker>
      <SlideTitle className="max-w-3xl">Жизнь человека и допустимость её прекращения или продления</SlideTitle>
      <Divider />
      <Reveal shown={shown} onReveal={() => setShown(true)} label="Открыть проблемный вопрос">
        <div className="panel-card border-gold p-6 md:p-8 max-w-3xl">
          <p className="font-display text-cream text-xl md:text-2xl leading-relaxed">
            Жизнь — самое ценное, что есть у человека. Но всегда ли человек вправе распоряжаться
            жизнью — чужой и своей собственной? Можно ли жизнь продлить? И кто внутри нас
            подсказывает, как поступить правильно?
          </p>
          <p className="mt-4 text-dim">
            Ответить точно пока трудно — значит, это и есть наша работа сегодня.
          </p>
        </div>
      </Reveal>
    </SlideShell>
  );
}

/* ---------- Слайд 7. Дерево целей ---------- */
export function GoalTreeSlide() {
  const [grown, setGrown] = useState(0);
  const allGrown = grown >= goals.length;
  return (
    <SlideShell>
      <Kicker>Целеполагание</Kicker>
      <SlideTitle className="mb-2">Дерево целей</SlideTitle>
      <p className="text-dim mb-8">Нажимайте на ствол — на дереве «вырастут» цели урока.</p>

      <div className="flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-2 max-w-4xl">
          {goals.map((g, i) => (
            <div key={g} className="flex flex-col items-center w-full sm:w-auto sm:max-w-[240px]">
              <div
                className={`panel-card border-gold p-4 text-center transition-opacity duration-300 ${
                  i < grown ? 'step-in opacity-100' : 'opacity-0'
                }`}
                aria-hidden={i >= grown}
              >
                <p className="font-mono-ui text-xs tracking-widest uppercase text-gold mb-1">
                  Цель {i + 1}
                </p>
                <p className="text-base leading-snug">{g}</p>
              </div>
              <div className="w-px h-6" style={{ backgroundColor: 'var(--terra)', opacity: i < grown ? 1 : 0.25 }} />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setGrown((g) => Math.min(g + 1, goals.length))}
          disabled={allGrown}
          className="btn-gold mt-2"
          aria-label="Вырастить следующую цель"
        >
          {allGrown ? 'Все цели выросли' : 'Вырастить цель'}
        </button>
        <div
          className="w-px h-8 mt-2"
          style={{ backgroundColor: 'var(--terra)' }}
          aria-hidden="true"
        />
        <div className="panel-card px-8 py-3 font-mono-ui text-xs tracking-widest uppercase text-dim">
          Корни: наши знания темы № 2
        </div>
      </div>

      {allGrown && (
        <div className="step-in mt-8 max-w-2xl mx-auto w-full">
          <p className="font-mono-ui text-xs tracking-widest uppercase text-gold mb-3">
            Шаги (задачи)
          </p>
          <ol className="grid gap-2 sm:grid-cols-2">
            {goalSteps.map((s, i) => (
              <li key={s} className="panel-card p-3 text-base flex gap-3 items-baseline">
                <span className="font-mono-ui text-gold text-xs">{String(i + 1).padStart(2, '0')}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}
    </SlideShell>
  );
}
