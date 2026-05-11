import { AlertTriangle, Shield, TrendingDown, TrendingUp, XCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { RiskAnalysis } from '../../context/PivotContext';
import type { RiskStatus } from '../../api/resultApi';

interface ResultSummaryCardProps {
  scenarioLabel: 'A' | 'B' | 'B-A';
  district: string;
  risk: RiskAnalysis;
  comparedRisk?: RiskAnalysis;
}

const STATUS_LABELS: Record<RiskStatus, string> = {
  safe: '안전',
  warning: '경계',
  danger: '위험',
};

const STATUS_DESCRIPTIONS: Record<RiskStatus, string> = {
  safe: '현재 생활 조건이 안정적입니다',
  warning: '일부 지표가 임계점에 근접해 있습니다',
  danger: '즉각적인 조건 개선이 필요합니다',
};

export function ResultSummaryCard({ scenarioLabel, district, risk, comparedRisk }: ResultSummaryCardProps) {
  const { c } = useTheme();
  const isDelta = Boolean(comparedRisk);
  const improved = comparedRisk ? risk.overallScore < comparedRisk.overallScore : false;
  const deltaColor = improved ? c.success : c.error;
  const deltaBg = improved ? c.successBg : c.errorBg;
  const deltaBorder = improved ? c.successBorder : c.errorBorder;
  const statusStyle = getStatusStyle(risk.status, c);
  const StatusIcon = getStatusIcon(risk.status);
  const DeltaIcon = improved ? TrendingDown : TrendingUp;

  if (isDelta && comparedRisk) {
    const delta = Math.abs(comparedRisk.overallScore - risk.overallScore);

    return (
      <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: deltaBg, border: `1px solid ${deltaBorder}`, backdropFilter: 'blur(12px)' }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${deltaColor}22` }}>
          <DeltaIcon size={20} style={{ color: deltaColor }} />
        </div>
        <div>
          <div style={{ color: deltaColor, fontSize: '1.35rem', fontWeight: 700 }}>
            {improved ? '-' : '+'}{delta}점
          </div>
          <p style={{ color: c.textSec, fontSize: '0.75rem' }}>B 시나리오 리스크 {improved ? '감소' : '증가'}</p>
          <p style={{ color: c.textMuted, fontSize: '0.68rem' }}>월 여유: {risk.monthlySurplus > 0 ? '+' : ''}{risk.monthlySurplus}만원</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}`, backdropFilter: 'blur(12px)' }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${statusStyle.color}22` }}>
        <StatusIcon size={20} style={{ color: statusStyle.color }} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span style={{ color: statusStyle.color, fontSize: '1rem', fontWeight: 700 }}>시나리오 {scenarioLabel}: {STATUS_LABELS[risk.status]}</span>
          <span style={{ color: statusStyle.color, fontSize: '0.72rem', opacity: 0.8 }}>{risk.overallScore}점</span>
        </div>
        <p style={{ color: c.textSec, fontSize: '0.75rem' }}>{STATUS_DESCRIPTIONS[risk.status]}</p>
        <p style={{ color: c.textMuted, fontSize: '0.68rem' }}>{district} 기준</p>
      </div>
    </div>
  );
}

function getStatusIcon(status: RiskStatus) {
  if (status === 'safe') return Shield;
  if (status === 'warning') return AlertTriangle;
  return XCircle;
}

function getStatusStyle(status: RiskStatus, c: ReturnType<typeof useTheme>['c']) {
  if (status === 'safe') return { color: c.success, bg: c.successBg, border: c.successBorder };
  if (status === 'warning') return { color: c.warning, bg: c.warningBg, border: c.warningBorder };
  return { color: c.error, bg: c.errorBg, border: c.errorBorder };
}
