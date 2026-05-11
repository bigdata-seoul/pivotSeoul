import { Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface PdfDownloadButtonProps {
  resultId: string;
}

export function PdfDownloadButton({ resultId }: PdfDownloadButtonProps) {
  const { c } = useTheme();

  return (
    <button
      type="button"
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
      style={{ color: c.textSec, background: c.card, border: `1px solid ${c.border}`, fontSize: '0.68rem' }}
      aria-label={`${resultId} PDF 다운로드`}
    >
      <Download size={11} />
      PDF
    </button>
  );
}
