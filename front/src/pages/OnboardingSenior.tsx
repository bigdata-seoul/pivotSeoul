import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, ChevronLeft, MapPin, Wallet, Sunset, CheckCircle2 } from 'lucide-react';
import { usePivot } from '../context/PivotContext';
import { useTheme } from '../context/ThemeContext';

const DISTRICTS = ['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'];
const DISTRICT_RENT: Record<string, number> = { '강남구': 180, '서초구': 170, '용산구': 160, '마포구': 120, '성동구': 115, '송파구': 130, '노원구': 65, '은평구': 70, '강서구': 80, '관악구': 68 };

const steps = [
  { label: '거주지', icon: MapPin },
  { label: '자산·소득', icon: Wallet },
  { label: '노후 계획', icon: Sunset },
];

function SliderField({ label, value, min, max, step, unit, onChange, hint, color = '#10B981', c }: any) {
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
        <span style={{ color: c.textMuted, fontSize: '0.7rem' }}>{min.toLocaleString()}{unit}</span>
        {hint && <span style={{ color: `${color}CC`, fontSize: '0.7rem' }}>{hint}</span>}
        <span style={{ color: c.textMuted, fontSize: '0.7rem' }}>{max.toLocaleString()}{unit}</span>
      </div>
    </div>
  );
}

export function OnboardingSenior() {
  const navigate = useNavigate();
  const { profile, updateProfile } = usePivot();
  const { c, isDark } = useTheme();
  const [step, setStep] = useState(0);
  const [housingType, setHousingType] = useState('자가');

  const monthlyPension = Math.round(profile.savings * 0.004); // simple monthly return estimate
  const monthlySurplus = profile.monthlyIncome + monthlyPension - profile.monthlyHousing - profile.monthlyLiving;
  const housingRatio = Math.round((profile.monthlyHousing / Math.max(1, profile.monthlyIncome)) * 100);
  const progressPct = (step / (steps.length - 1)) * 100;

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
          <p style={{ color: c.textMuted, fontSize: '0.72rem' }}>노년기 STEP {step + 1} / {steps.length}</p>
          <h2 style={{ color: c.text, fontSize: '1.1rem', fontWeight: 700 }}>내 조건 입력하기</h2>
        </div>
        <span style={{ color: c.textMuted, fontSize: '0.85rem' }}>{step + 1}/{steps.length}</span>
      </div>

      {/* Step indicators */}
      <div className="relative flex items-start gap-0 mb-9 mt-1 shrink-0 w-full">
        <div
          className="absolute top-6 left-6 right-6 h-1 rounded-full"
          style={{ background: c.borderSoft }}
        />
        <div
          className="absolute top-6 left-6 h-1 rounded-full transition-all duration-300"
          style={{ width: `calc((100% - 3rem) * ${progressPct / 100})`, background: c.success }}
        />
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isDone = i < step;
          const isActive = i === step;
          return (
            <div key={s.label} className={`relative z-10 flex items-start flex-1 min-w-0 ${i === 0 ? 'justify-start' : i === steps.length - 1 ? 'justify-end' : 'justify-center'}`}>
              <div className="relative z-10 flex flex-col items-center shrink-0 w-12">
                <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{ background: isDone ? c.success : isActive ? '#10B981' : c.badgeBg, color: isDone || isActive ? 'white' : c.textMuted, boxShadow: isActive ? '0 0 15px rgba(16,185,129,0.4)' : 'none' }}>
                  {isDone ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                </div>
                <span className="absolute top-14 whitespace-nowrap text-center" style={{ color: isActive ? '#10B981' : isDone ? c.success : c.textMuted, fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.2 }}>{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Card */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none rounded-2xl p-5 md:p-6" style={{ background: c.card, border: `1px solid ${c.cardBorder}`, boxShadow: c.cardShadow }}>
        {/* Step 0: 거주지 */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label style={{ color: c.textSec, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>현재 거주 자치구</label>
              <div className="grid grid-cols-5 gap-1.5 max-h-44 overflow-y-auto pr-1">
                {DISTRICTS.map(d => (
                  <button key={d} onClick={() => updateProfile({ currentDistrict: d })} className="px-2 py-1.5 rounded-lg text-xs transition-all"
                    style={{ background: profile.currentDistrict === d ? 'rgba(16,185,129,0.15)' : (isDark ? 'rgba(15,23,42,0.5)' : '#F8FAFC'), border: `1px solid ${profile.currentDistrict === d ? '#10B981' : c.borderSoft}`, color: profile.currentDistrict === d ? '#10B981' : c.textMuted }}>
                    {d}
                  </button>
                ))}
              </div>
              {DISTRICT_RENT[profile.currentDistrict] && (
                <p style={{ color: '#10B981', fontSize: '0.75rem', marginTop: '6px' }}>📍 {profile.currentDistrict} 평균 월세: {DISTRICT_RENT[profile.currentDistrict]}만원대</p>
              )}
            </div>
            <div>
              <label style={{ color: c.textSec, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>거주 형태</label>
              <div className="grid grid-cols-3 gap-2">
                {['월세', '전세', '자가'].map(t => (
                  <button key={t} onClick={() => setHousingType(t)} className="py-2 rounded-xl transition-all"
                    style={{ background: housingType === t ? 'rgba(16,185,129,0.15)' : (isDark ? 'rgba(15,23,42,0.4)' : '#F8FAFC'), border: `1px solid ${housingType === t ? '#10B981' : c.border}`, color: housingType === t ? '#10B981' : c.textSec, fontSize: '0.88rem' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ color: c.textSec, fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>다운사이징 고려 자치구</label>
              <div className="grid grid-cols-5 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {DISTRICTS.filter(d => d !== profile.currentDistrict).map(d => (
                  <button key={d} onClick={() => updateProfile({ compareDistrict: d })} className="px-2 py-1.5 rounded-lg text-xs transition-all"
                    style={{ background: profile.compareDistrict === d ? 'rgba(16,185,129,0.2)' : (isDark ? 'rgba(15,23,42,0.5)' : '#F8FAFC'), border: `1px solid ${profile.compareDistrict === d ? '#10B981' : c.borderSoft}`, color: profile.compareDistrict === d ? '#10B981' : c.textMuted }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: 자산·소득 */}
        {step === 1 && (
          <div className="space-y-5">
            <SliderField label="월 연금·소득 (세후)" value={profile.monthlyIncome} min={0} max={500} step={10} unit="만원" onChange={(v: number) => updateProfile({ monthlyIncome: v })} hint="서울 평균 연금: 98만원" color="#10B981" c={c} />
            <SliderField label="총 자산 (부동산 제외)" value={profile.savings} min={0} max={100000} step={1000} unit="만원" onChange={(v: number) => updateProfile({ savings: v })} hint={`월 환산: ~${Math.round(profile.savings * 0.004)}만원`} color="#10B981" c={c} />
            <SliderField label="월 주거비" value={profile.monthlyHousing} min={0} max={200} step={5} unit="만원" onChange={(v: number) => updateProfile({ monthlyHousing: v })} hint={`주거비율: ${housingRatio}% ${housingRatio > 38 ? '⚠ 위험' : '양호'}`} color={housingRatio > 38 ? c.error : c.success} c={c} />
            <SliderField label="월 생활비 (의료 포함)" value={profile.monthlyLiving} min={50} max={300} step={10} unit="만원" onChange={(v: number) => updateProfile({ monthlyLiving: v })} color="#818CF8" c={c} />
          </div>
        )}

        {/* Step 2: 노후 계획 */}
        {step === 2 && (
          <div className="space-y-5">
            <SliderField label="은퇴 예정 연령 (미은퇴 시)" value={profile.retirementAge} min={55} max={75} step={1} unit="세" onChange={(v: number) => updateProfile({ retirementAge: v })} color="#10B981" c={c} />
            <SliderField label="편도 통근 시간 (재직 시)" value={profile.commuteTime} min={0} max={120} step={5} unit="분" onChange={(v: number) => updateProfile({ commuteTime: v })} color="#818CF8" c={c} />

            {/* Cash flow summary */}
            <div className="p-4 rounded-xl space-y-2" style={{ background: isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.05)', border: `1px solid ${c.successBorder}` }}>
              <p style={{ color: c.success, fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>📊 노후 현금흐름 예상</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '월 연금·소득', value: `${profile.monthlyIncome}만원`, color: c.success },
                  { label: '자산 월 환산', value: `+${monthlyPension}만원`, color: c.success },
                  { label: '주거비', value: `-${profile.monthlyHousing}만원`, color: c.error },
                  { label: '생활비', value: `-${profile.monthlyLiving}만원`, color: c.error },
                ].map(item => (
                  <div key={item.label} className="p-2 rounded-lg" style={{ background: isDark ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.7)', border: `1px solid ${c.borderSoft}` }}>
                    <div style={{ color: c.textMuted, fontSize: '0.65rem' }}>{item.label}</div>
                    <div style={{ color: item.color, fontSize: '0.9rem', fontWeight: 700 }}>{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: c.border }}>
                <span style={{ color: c.textSec, fontSize: '0.85rem' }}>월 잔여</span>
                <span style={{ color: monthlySurplus > 0 ? c.success : c.error, fontSize: '1.1rem', fontWeight: 700 }}>
                  {monthlySurplus >= 0 ? '+' : ''}{monthlySurplus}만원
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl" style={{ background: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)', border: `1px solid ${c.primaryBorder}` }}>
              <p style={{ color: c.accent, fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>📋 노년기 입력 요약</p>
              <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-xs" style={{ color: c.textSec }}>
                <span>거주: {profile.currentDistrict}</span>
                <span>비교: {profile.compareDistrict || '-'}</span>
                <span>은퇴: {profile.retirementAge}세</span>
                <span>자산: {profile.savings.toLocaleString()}만원</span>
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
          style={{ background: 'linear-gradient(135deg, #10B981, #34D399)', color: 'white', fontSize: '0.9rem', fontWeight: 600, boxShadow: '0 0 20px rgba(16,185,129,0.35)' }}>
          {step === steps.length - 1 ? 'A/B 시나리오 설정' : '다음 단계'}
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}