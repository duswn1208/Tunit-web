import '../css/time-inputs.css';
import { Button } from '@/shared/components';
import { toMinutes, toHHMM } from '../lib/timeUtils.ts';

interface Props {
  startTime: string;
  endTime: string;
  onChangeStart: (v: string) => void;
  onChangeEnd: (v: string) => void;
  onAdd: () => void;
}

// 슬라이더 범위: 06:00 ~ 24:00, 30분 단위
const MIN = 6 * 60; // 360
const MAX = 24 * 60; // 1440
const STEP = 30;
const SPAN = MAX - MIN;

export default function TimeInputs({
  startTime,
  endTime,
  onChangeStart,
  onChangeEnd,
  onAdd,
}: Props) {
  const startMin = toMinutes(startTime);
  const endMin = toMinutes(endTime);

  // 시작 핸들: 종료보다 최소 STEP 만큼 앞이어야 함
  const handleStart = (v: number) => {
    const next = Math.min(v, endMin - STEP);
    onChangeStart(toHHMM(next));
  };
  // 종료 핸들: 시작보다 최소 STEP 만큼 뒤여야 함
  const handleEnd = (v: number) => {
    const next = Math.max(v, startMin + STEP);
    onChangeEnd(toHHMM(next));
  };

  const leftPct = ((startMin - MIN) / SPAN) * 100;
  const widthPct = ((endMin - startMin) / SPAN) * 100;

  return (
    <div className="px-4">
      <div className="time-slider">
        <div className="time-slider__track" />
        <div
          className="time-slider__fill"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
        <input
          type="range"
          className="time-slider__range time-slider__range--start"
          min={MIN}
          max={MAX}
          step={STEP}
          value={startMin}
          onChange={(e) => handleStart(Number(e.target.value))}
          aria-label="시작 시간"
        />
        <input
          type="range"
          className="time-slider__range time-slider__range--end"
          min={MIN}
          max={MAX}
          step={STEP}
          value={endMin}
          onChange={(e) => handleEnd(Number(e.target.value))}
          aria-label="종료 시간"
        />
      </div>

      <div className="time-slider__labels">
        <span>{toHHMM(MIN)}</span>
        <span>{toHHMM(MAX)}</span>
      </div>

      <div className="time-slider__selected">
        <span className="time-slider__value">
          {startTime} ~ {endTime}
        </span>
        <Button className="ui-btn--accent" onClick={onAdd}>
          + 구간 추가
        </Button>
      </div>
    </div>
  );
}
