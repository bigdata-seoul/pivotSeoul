import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, ChevronLeft, MapPin, Wallet, Baby, CheckCircle2 } from 'lucide-react';
import { usePivot } from '../context/PivotContext';
import { useTheme } from '../context/ThemeContext';

const DISTRICTS = ['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'];
const DISTRICT_RENT: Record<string, number> = { '강남구': 180, '서초구': 170, '용산구': 160, '마포구': 120, '성동구': 115, '송파구': 130, '노원구': 65, '은평구': 70, '강서구': 80, '관악구': 68 };

const steps = [
  { label: '거주·직장', icon: MapPin },
  { label: '소득·지출', icon: Wallet },
  { label: '보육·복직', icon: Baby },
];

function SliderField({ label, value, min, max, step, unit, onChange, hint, color = '#6366F1', c }: any) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span style={{ color: c.textSec, fontSize: '0.85rem' }}>{label}</span>
        <span style={{ color: c.text, fontSize: '1rem', fontWeight: 600 }}>{value.toLocaleString()}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, ${c.borderSoft} ${pct}%, ${c.borderSoft} 100%)`, outline: 'none' }}
      />
      <div className="flex justify-between">
        <span style={{ color: c.textMuted, fontSize: '0.7rem' }}>{min}{unit}</span>
        {hint && <span style={{ color: `${color}CC`, fontSize: '0.7rem' }}>{hint}</span>}
        <span style={{ color: c.textMuted, fontSize: '0.7rem' }}>{max}{unit}</span>
      </div>
    </div>
  );
}

export function OnboardingFamily() {
  const navigate = useNavigate();
  const { profile, updateProfile } = usePivot();
  const { c, isDark } = useTheme();
  const [step, setStep] = useState(0);
  const [housingType, setHousingType] = useState('월세');

  const monthlySurplus = profile.monthlyIncome - profile.monthlyHousing - profile.monthlyLiving - profile.childcareCost;
  const housingRatio = Math.round((profile.monthlyHousing / profile.monthlyIncome) * 100);
  const childcareRatio = Math.round((profile.childcareCost / profile.monthlyIncome) * 100);

  return (
    <div className="h-full flex flex-col p-4 md:p-6 w-full">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <button onClick={() => step === 0 ? navigate('/stage') : setStep(step - 1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: c.card, border: `1px solid ${c.border}`, color: c.textSec }}>
          <ChevronLeft size={16} />
        </button>
        <div className="flex-1">
          <p style={{ color: c.textMuted, fontSize: '0.72rem' }}>신혼·출산기 STEP {step + 1} / {steps.length}</p>
          <h2 style={{ color: c.text, fontSize: '1.1rem', fontWeight: 700 }}>내 조건 입력하기</h2>
        </div>
        <span style={{ color: c.textMuted, fontSize: '0.85rem' }}>{step + 1}/{steps.length}</span>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-0 mb-4 shrink-0">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isDone = i < step;
          const isActive = i === step;
          return (
            <div key={s.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{ background: isDone ? c.success : isActive ? '#F59E0B' : c.badgeBg, color: isDone || isActive ? 'white' : c.textMuted, boxShadow: isActive ? '0 0 15px rgba(245,158,11,0.4)' : 'none' }}>
                  {isDone ? <CheckCircle2 size={14} /> : <Icon size={14} />}
                </div>
                <span style={{ color: isActive ? '#F59E0B' : isDone ? c.success : c.textMuted, fontSize: '0.68rem' }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-0.5 mx-2 mb-4 rounded-full" style={{ background: isDone ? c.success : c.borderSoft }} />}
            </div>
          );
        })}
      </div>

      {/* Card */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none rounded-2xl p-5 md:p-6" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
        {/* Step 0: 거주·직장 */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label style={{ color: c.textSec, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>현재 거주 자치구</label>
              <div className="grid grid-cols-5 gap-1.5 max-h-44 overflow-y-auto pr-1">
                {DISTRICTS.map(d => (
                  <button key={d} onClick={() => updateProfile({ currentDistrict: d })} className="px-2 py-1.5 rounded-lg text-xs transition-all"
                    style={{ background: profile.currentDistrict === d ? c.primaryBg : (isDark ? 'rgba(15,23,42,0.5)' : '#F8FAFC'), border: `1px solid ${profile.currentDistrict === d ? c.primary : c.borderSoft}`, color: profile.currentDistrict === d ? c.primary : c.textMuted }}>
                    {d}
                  </button>
                ))}
              </div>
              {DISTRICT_RENT[profile.currentDistrict] && (
                <p style={{ color: '#F59E0B', fontSize: '0.75rem', marginTop: '6px' }}>📍 {profile.currentDistrict} 평균 월세: {DISTRICT_RENT[profile.currentDistrict]}만원대</p>
              )}
            </div>
            <div>
              <label style={{ color: c.textSec, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>거주 형태</label>
              <div className="grid grid-cols-3 gap-2">
                {['월세', '전세', '자가'].map(t => (
                  <button key={t} onClick={() => setHousingType(t)} className="py-2 rounded-xl transition-all"
                    style={{ background: housingType === t ? 'rgba(245,158,11,0.15)' : (isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC'), border: `1px solid ${housingType === t ? '#F59E0B' : c.border}`, color: housingType === t ? '#F59E0B' : c.textSec, fontSize: '0.88rem' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ color: c.textSec, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>비교해볼 자치구</label>
              <div className="grid grid-cols-5 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {DISTRICTS.filter(d => d !== profile.currentDistrict).map(d => (
                  <button key={d} onClick={() => updateProfile({ compareDistrict: d })} className="px-2 py-1.5 rounded-lg text-xs transition-all"
                    style={{ background: profile.compareDistrict === d ? 'rgba(129,140,248,0.2)' : (isDark ? 'rgba(15,23,42,0.5)' : '#F8FAFC'), border: `1px solid ${profile.compareDistrict === d ? '#818CF8' : c.borderSoft}`, color: profile.compareDistrict === d ? '#818CF8' : c.textMuted }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: 소득·지출 */}
        {step === 1 && (
          <div className="space-y-5">
            <SliderField label="월 소득 (세후 합산)" value={profile.monthlyIncome} min={150} max={1000} step={10} unit="만원" onChange={(v: number) => updateProfile({ monthlyIncome: v })} hint="서울 부부 평균: 450만원" color="#F59E0B" c={c} />
            <SliderField label="월 주거비" value={profile.monthlyHousing} min={20} max={300} step={5} unit="만원" onChange={(v: number) => updateProfile({ monthlyHousing: v })} hint={`주거비율: ${housingRatio}% ${housingRatio > 38 ? '⚠ 위험' : housingRatio > 28 ? '⚠ 주의' : '✓ 양호'}`} color={housingRatio > 38 ? c.error : housingRatio > 28 ? c.warning : c.success} c={c} />
            <SliderField label="월 생활비 (식비·교통·기타)" value={profile.monthlyLiving} min={50} max={400} step={10} unit="만원" onChange={(v: number) => updateProfile({ monthlyLiving: v })} color="#818CF8" c={c} />
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: isDark ? 'rgba(15,23,42,0.5)' : '#F8FAFC', border: `1px solid ${monthlySurplus > 50 ? c.successBorder : c.errorBorder}` }}>
              <span style={{ color: c.textSec, fontSize: '0.85rem' }}>보육비 제외 월 잔여</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: monthlySurplus + profile.childcareCost > 50 ? c.success : c.error }}>
                {(profile.monthlyIncome - profile.monthlyHousing - profile.monthlyLiving) >= 0 ? '+' : ''}{profile.monthlyIncome - profile.monthlyHousing - profile.monthlyLiving}만원
              </span>
            </div>
          </div>
        )}

        {/* Step 2: 보육·복직 */}
        {step === 2 && (
          <div className="space-y-5">
            <SliderField label="월 보육비" value={profile.childcareCost} min={0} max={150} step={5} unit="만원" onChange={(v: number) => updateProfile({ childcareCost: v })} hint={`보육비율: ${childcareRatio}% ${childcareRatio > 18 ? '⚠ 위험' : childcareRatio > 12 ? '⚠ 주의' : '✓ 양호'}`} color={childcareRatio > 18 ? c.error : childcareRatio > 12 ? c.warning : c.success} c={c} />
            <SliderField label="배우자 복직까지 남은 기간" value={profile.returnToWorkMonths} min={0} max={36} step={1} unit="개월" onChange={(v: number) => updateProfile({ returnToWorkMonths: v })} hint={profile.returnToWorkMonths === 0 ? '현재 복직 중' : `${profile.returnToWorkMonths}개월 후 복직`} color="#F59E0B" c={c} />
            <SliderField label="편도 통근 시간" value={profile.commuteTime} min={10} max={120} step={5} unit="분" onChange={(v: number) => updateProfile({ commuteTime: v })} hint={profile.commuteTime > 70 ? '⚠ 통근 과부담' : profile.commuteTime > 50 ? '주의 구간' : '✓ 양호'} color={profile.commuteTime > 70 ? c.error : profile.commuteTime > 50 ? c.warning : c.success} c={c} />
            <div className="p-4 rounded-xl" style={{ background: isDark ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.05)', border: `1px solid ${c.warningBorder}` }}>
              <p style={{ color: c.warning, fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>📋 신혼·출산기 입력 요약</p>
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs" style={{ color: c.textSec }}>
                <span>거주: {profile.currentDistrict}</span>
                <span>비교: {profile.compareDistrict || '-'}</span>
                <span>소득: 월 {profile.monthlyIncome}만원</span>
                <span>주거: 월 {profile.monthlyHousing}만원</span>
                <span>보육비: 월 {profile.childcareCost}만원</span>
                <span>복직: {profile.returnToWorkMonths}개월 후</span>
                <span>통근: {profile.commuteTime}분</span>
                <span style={{ color: monthlySurplus > 0 ? c.success : c.error }}>잔여: {monthlySurplus}만원/월</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4 shrink-0">
        <button onClick={() => step === 0 ? navigate('/stage') : setStep(step - 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: c.card, border: `1px solid ${c.border}`, color: c.textSec, fontSize: '0.88rem' }}>
          <ChevronLeft size={15} /> 이전
        </button>
        <button
          onClick={() => step < steps.length - 1 ? setStep(step + 1) : navigate('/scenario')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl"
          style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)', color: 'white', fontSize: '0.9rem', fontWeight: 600, boxShadow: '0 0 20px rgba(245,158,11,0.35)' }}>
          {step === steps.length - 1 ? 'A/B 시나리오 설정' : '다음 단계'}
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}