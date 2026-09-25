import { useRef } from 'react';
import { cn } from '../../utils/cn';

export default function AudioProgressBar({
  current = 0,
  duration = 0,
  onSeek,
  className,
}) {
  const inputRef = useRef(null);
  const percent = duration > 0 ? (current / duration) * 100 : 0;

  const handleChange = (e) => {
    const v = Number(e.target.value);
    onSeek?.(v);
  };

  return (
    <div className={cn('relative w-full', className)}>
      {/* Track */}
      <div className="relative h-1.5 w-full rounded-full bg-line-soft overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-emerald-main/80"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Input transparan di atas untuk interaksi */}
      <input
        ref={inputRef}
        type="range"
        min={0}
        max={duration || 100}
        step={0.5}
        value={current}
        onChange={handleChange}
        disabled={!duration}
        aria-label="Posisi audio"
        className={cn(
          'absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed',
          '[&::-webkit-slider-thumb]:appearance-none'
        )}
      />
    </div>
  );
}