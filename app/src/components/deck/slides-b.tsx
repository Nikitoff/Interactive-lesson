import { useEffect, useRef, useState } from 'react';
import { Kicker, SlideTitle, SlideShell, Divider, Reveal } from './common';
import { schemeSteps, fitnessActions, type GroupMission } from '@/lib/content';

/* ---------- Слайды 8–10. Миссии групп ---------- */
export function GroupMissionSlide({ mission }: { mission: GroupMission }) {
  const [openText, setOpenText] = useState(false);
  const [openConclusion, setOpenConclusion] = useState(false);
  return (
    <SlideShell>
      <Kicker>Групповая работа · группа {mission.id}</Kicker>
      <SlideTitle className="mb-6">«{mission.title}»</SlideTitle>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="panel-card p-6">
          <p className="font-mono-ui text-xs tracking-widest uppercase text-gold mb-3">
            Текст (тема 2.1 учебника)
          </p>
          {openText ? (
            <p className="step-in text-base leading-relaxed">{mission.text}</p>
          ) : (
            <button type="button" className="btn-ghost" onClick={() => setOpenText(true)}>
              Открыть текст
            </button>
          )}
        </div>
        <div className="panel-card p-6">
          <p className="font-mono-ui text-xs tracking-widest uppercase text-gold mb-3">
            Вопросы для обсуждения
          </p>
          <ul className="grid gap-3">
            {mission.questions.map((q, i) => (
              <li key={q} className="flex gap-3 text-base leading-snug">
                <span className="font-mono-ui text-gold text-xs mt-1">{i + 1}.</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <Reveal
          shown={openConclusion}
          onReveal={() => setOpenConclusion(true)}
          label="Открыть после обсуждения"
        >
          <div className="panel-card border-gold p-6">
            <p className="font-mono-ui text-xs tracking-widest uppercase text-gold mb-2">
              Ожидаемый вывод
            </p>
            <p className="font-display text-cream text-lg md:text-xl leading-snug">
              {mission.conclusion}
            </p>
          </div>
        </Reveal>
      </div>
      <p className="mt-5 text-dim panel-card px-4 py-3">
        Задание: прочитайте текст, обсудите вопросы и подготовьте двухминутное выступление.
      </p>
    </SlideShell>
  );
}

/* ---------- Слайды 11–12. Таймер выступлений ---------- */
export function SpeechSlide({ groups }: { groups: number[] }) {
  const DURATION = 120;
  const [seconds, setSeconds] = useState(DURATION);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const progress = seconds / DURATION;

  return (
    <SlideShell center>
      <Kicker>Выступления групп</Kicker>
      <SlideTitle>
        {groups.length > 1
          ? `Группы ${groups.join(' и ')} делятся выводами`
          : `Группа ${groups[0]} делится выводами`}
      </SlideTitle>
      <p className="mt-4 text-dim max-w-2xl panel-card px-4 py-3">
        Докладчики опираются на вопросы своей карточки. Класс слушает и готовится дополнить.
        На выступление — две минуты.
      </p>
      <Divider />
      <div
        className={`font-display text-cream font-semibold text-7xl md:text-8xl tabular-nums ${
          seconds === 0 ? '' : running ? 'glow-pulse' : ''
        }`}
        aria-live="polite"
      >
        {mm}:{ss}
      </div>
      <div className="w-64 md:w-80 progress-track mt-4" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>
      {seconds === 0 && (
        <p className="step-in mt-4 font-mono-ui text-xs tracking-widest uppercase text-gold">
          Время вышло — спасибо докладчикам!
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <button type="button" className="btn-gold" onClick={() => setRunning((r) => !r)}>
          {running ? 'Пауза' : seconds < DURATION && seconds > 0 ? 'Продолжить' : 'Старт'}
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            setRunning(false);
            setSeconds(DURATION);
          }}
        >
          Сбросить
        </button>
      </div>
    </SlideShell>
  );
}

/* ---------- Слайд 13. Опорная схема ---------- */
export function SchemeSlide() {
  const [step, setStep] = useState(0);
  const done = step >= schemeSteps.length;
  return (
    <SlideShell>
      <Kicker>Обобщение · перенесите в тетрадь</Kicker>
      <SlideTitle className="mb-6">Опорная схема урока</SlideTitle>
      <p className="text-dim mb-6">Схема собирается по щелчку — по ходу наших выводов.</p>

      <div className="grid gap-4 md:grid-cols-3">
        {schemeSteps.map((s, i) => (
          <div key={s.title} className="flex md:flex-row flex-col items-stretch md:items-center gap-2">
            <div
              className={`panel-card p-5 flex-1 transition-opacity duration-300 ${
                i < step ? 'step-in opacity-100' : 'opacity-20'
              } ${i < step ? 'border-gold' : ''}`}
              aria-hidden={i >= step}
            >
              <p className="font-display text-cream font-semibold text-2xl mb-2">{s.title}</p>
              <p className="text-base leading-snug">{s.body}</p>
            </div>
            {i < schemeSteps.length - 1 && (
              <>
                <div className="hidden md:flex items-center justify-center w-6 text-gold font-display text-2xl shrink-0" aria-hidden="true">
                  →
                </div>
                <div className="md:hidden self-center text-gold font-display text-2xl" aria-hidden="true">
                  ↓
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          type="button"
          className="btn-gold"
          onClick={() => setStep((s) => Math.min(s + 1, schemeSteps.length))}
          disabled={done}
        >
          {done ? 'Схема собрана' : step === 0 ? 'Начать сборку схемы' : 'Следующий элемент'}
        </button>
      </div>
    </SlideShell>
  );
}

/* ---------- Слайд 14. Вера, Надежда, Любовь и София + физкультминутка ---------- */
export function SaintsSlide() {
  const [storyOpen, setStoryOpen] = useState(false);
  const [fitIdx, setFitIdx] = useState(-1);
  const [fitAnswer, setFitAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const startFit = () => {
    setFitIdx(0);
    setFitAnswer(null);
    setScore(0);
  };
  const answerFit = (good: boolean) => {
    if (fitAnswer !== null) return;
    const correct = fitnessActions[fitIdx].good === good;
    setFitAnswer(good);
    if (correct) setScore((s) => s + 1);
  };
  const nextFit = () => {
    setFitIdx((i) => i + 1);
    setFitAnswer(null);
  };

  return (
    <SlideShell>
      <Kicker>Пример верности совести и вере</Kicker>
      <SlideTitle className="mb-6">Вера, Надежда, Любовь и мать их София</SlideTitle>

      {storyOpen ? (
        <div className="step-in panel-card p-6 max-w-3xl">
          <p className="text-base md:text-lg leading-relaxed">
            Святые мученицы Вера, Надежда, Любовь и мать их София не испугались смерти, потому что
            христиане верили: за смертью стоит вечная жизнь с Богом. Изменить совести и вере нельзя —
            даже под страхом смерти.
          </p>
        </div>
      ) : (
        <button type="button" className="btn-ghost self-start" onClick={() => setStoryOpen(true)}>
          Прочитать историю
        </button>
      )}

      <Divider />

      <div className="w-full">
        <p className="font-mono-ui text-xs tracking-widest uppercase text-gold mb-2">
          Физкультминутка «Выбор совести»
        </p>
        <p className="text-dim mb-4 max-w-3xl panel-card px-4 py-3">
          Если поступок добрый — встаём и тихо хлопаем; если недобрый — сидим молча. На экране
          отвечайте кнопками.
        </p>

        {fitIdx === -1 && (
          <button type="button" className="btn-gold" onClick={startFit}>
            Начать физкультминутку
          </button>
        )}

        {fitIdx >= 0 && fitIdx < fitnessActions.length && (
          <div className="panel-card p-6 max-w-3xl pop-in" key={fitIdx}>
            <p className="font-mono-ui text-xs text-dim mb-2">
              Поступок {fitIdx + 1} из {fitnessActions.length}
            </p>
            <p className="font-display text-cream text-xl md:text-2xl mb-5">
              {fitnessActions[fitIdx].text}
            </p>
            {fitAnswer === null ? (
              <div className="flex flex-wrap gap-3">
                <button type="button" className="btn-gold" onClick={() => answerFit(true)}>
                  Добрый поступок
                </button>
                <button type="button" className="btn-ghost" onClick={() => answerFit(false)}>
                  Недобрый поступок
                </button>
              </div>
            ) : (
              <div className="step-in">
                <p
                  className="font-mono-ui text-xs tracking-widest uppercase mb-3"
                  style={{ color: fitnessActions[fitIdx].good === fitAnswer ? 'var(--good)' : 'var(--bad)' }}
                >
                  {fitnessActions[fitIdx].good === fitAnswer
                    ? 'Верно! Совесть довольна'
                    : fitnessActions[fitIdx].good
                      ? 'Это добрый поступок'
                      : 'Это недобрый поступок — совесть тревожится'}
                </p>
                <button type="button" className="btn-ghost" onClick={nextFit}>
                  Дальше
                </button>
              </div>
            )}
          </div>
        )}

        {fitIdx >= fitnessActions.length && (
          <div className="panel-card border-gold p-6 max-w-3xl step-in">
            <p className="font-display text-cream text-xl">
              Молодцы! Верных ответов: {score} из {fitnessActions.length}.
            </p>
            <p className="text-dim mt-2">Совесть всегда подсказывает добро — стоит её слушать.</p>
          </div>
        )}
      </div>
    </SlideShell>
  );
}
