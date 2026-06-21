import type { LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { WeeklyAction } from '../../api/resultApi';

interface WeeklyActionListProps {
  actions: WeeklyAction[];
  checkedIds: number[];
  checkedIcon: LucideIcon;
  uncheckedIcon: LucideIcon;
  onToggle: (id: number) => void;
}

export function WeeklyActionList({ actions, checkedIds, checkedIcon: CheckedIcon, uncheckedIcon: UncheckedIcon, onToggle }: WeeklyActionListProps) {
  const { c } = useTheme();

  return (
    <div className="space-y-2">
      {actions.map((action) => {
        const isDone = checkedIds.includes(action.id);

        return (
          <button key={action.id} type="button" className="flex items-center gap-2.5 w-full text-left" onClick={() => onToggle(action.id)}>
            {isDone ? <CheckedIcon size={14} className="shrink-0" style={{ color: c.success }} /> : <UncheckedIcon size={14} className="shrink-0" style={{ color: c.textMuted }} />}
            <span style={{ color: isDone ? c.textMuted : c.textSec, fontSize: '0.78rem', textDecoration: isDone ? 'line-through' : 'none', flex: 1 }}>
              {action.title}
            </span>
            <span style={{ color: c.textMuted, fontSize: '0.62rem', flexShrink: 0 }}>{action.sourceLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
