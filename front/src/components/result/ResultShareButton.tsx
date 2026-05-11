import { Share2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ResultShareButtonProps {
  resultId: string;
}

export function ResultShareButton({ resultId }: ResultShareButtonProps) {
  const { c } = useTheme();

  return (
    <button
      type="button"
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
      style={{ color: c.primary, background: c.primaryBg, border: `1px solid ${c.primaryBorder}`, fontSize: '0.68rem' }}
      aria-label={`${resultId} 공유`}
    >
      <Share2 size={11} />
      공유
    </button>
  );
}
