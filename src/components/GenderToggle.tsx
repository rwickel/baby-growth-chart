import { Gender } from '@/types/baby';
import { cn } from '@/lib/utils';

interface GenderToggleProps {
  value: Gender;
  onChange: (gender: Gender) => void;
}

export function GenderToggle({ value, onChange }: GenderToggleProps) {
  return (
    <div className="flex items-center gap-2 p-1.5 bg-muted rounded-full">
      <button
        onClick={() => onChange('male')}
        className={cn(
          'flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300',
          value === 'male'
            ? 'gender-toggle-boy'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <span className="text-xl">👦</span>
        <span>Boy</span>
      </button>
      <button
        onClick={() => onChange('female')}
        className={cn(
          'flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300',
          value === 'female'
            ? 'gender-toggle-girl'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <span className="text-xl">👧</span>
        <span>Girl</span>
      </button>
    </div>
  );
}
