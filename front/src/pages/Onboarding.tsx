import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronRight, ChevronLeft, MapPin, Wallet, Clock, Target,
  CheckCircle2, Building2, Train, Baby, Briefcase
} from 'lucide-react';
import { usePivot } from '../context/PivotContext';
import { createSimulationSession } from '../lib/sessionApi';

const SEOUL_DISTRICTS = [
  '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
  '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구',
  '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구',
  '종로구', '중구', '중랑구',
];

const DISTRICT_HOUSING_HINT: Record<string, string> = {
  '강남구': '평균 월세 180만원대',
  '서초구': '평균 월세 170만원대',
  '용산구': '평균 월세 160만원대',
  '마포구': '평균 월세 120만원대',
  '성동구': '평균 월세 115만원대',
  '송파구': '평균 월세 130만원대',
  '노원구': '평균 월세 65만원대',
  '은평구': '평균 월세 70만원대',
  '강서구': '평균 월세 80만원대',
  '관악구': '평균 월세 68만원대',
};

const steps = [
  { id: 0, label: '거주지', icon: MapPin },
  { id: 1, label: '소득·지출', icon: Wallet },
  { id: 2, label: '생활 조건', icon: Clock },
  { id: 3, label: '비교 목표', icon: Target },
];

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  hint?: string;
  color?: string;
}

function SliderField({ label, value, min, max, step, unit, onChange, hint, color = '#6366F1' }: SliderFieldProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{label}</span>
        <span style={{ color: '#F1F5F9', fontSize: '1rem', fontWeight: 600 }}>
          {value.toLocaleString()}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, rgba(51,65,85,0.8) ${pct}%, rgba(51,65,85,0.8) 100%)`,
          outline: 'none',
        }}
      />
      <div className="flex justify-between">
        <span style={{ color: '#475569', fontSize: '0.7rem' }}>{min.toLocaleString()}{unit}</span>
        {hint && <span style={{ color: color + 'AA', fontSize: '0.7rem' }}>{hint}</span>}
        <span style={{ color: '#475569', fontSize: '0.7rem' }}>{max.toLocaleString()}{unit}</span>
      </div>
    </div>
  );
}

export function Onboarding() {
  const navigate = useNavigate();
  const { profile, updateProfile, setIsOnboarded, sessionId, setSessionId } = usePivot();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lifeStageLabel: Record<string, string> = {
    youth: '청년기',
    family: '신혼·출산기',
    senior: '노년기',
  };

  const lifeStageCodeMap: Record<string, string> = {
    youth: 'YOUTH',
    family: 'FAMILY',
    senior: 'SENIOR',
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        setIsSubmitting(true);
        if (!sessionId) {
          const createdSession = await createSimulationSession({
            lifeStageCode: profile.lifeStage ? lifeStageCodeMap[profile.lifeStage] : 'YOUTH',
            currentDistrict: profile.currentDistrict,
            compareDistrict: profile.compareDistrict,
            monthlyIncome: profile.monthlyIncome,
            monthlyHousing: profile.monthlyHousing,
            monthlyLiving: profile.monthlyLiving,
            commuteTime: profile.commuteTime,
            childcareCost: profile.childcareCost,
            returnToWorkMonths: profile.returnToWorkMonths,
            retirementAge: profile.retirementAge,
            savings: profile.savings,
          });
          setSessionId(createdSession.sessionId);
        }
        setIsOnboarded(true);
        updateProfile({
          currentDistrict: profile.currentDistrict || '마포구',
          compareDistrict: profile.compareDistrict || '노원구',
        });
        navigate('/scenario');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 0) navigate('/');
    else setStep(step - 1);
  };

  const getHousingHint = (district: string) => {
    return DISTRICT_HOUSING_HINT[district] || '';
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Progress header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '4px' }}>
              생애 단계: <span style={{ color: '#A5B4FC' }}>{profile.lifeStage ? lifeStageLabel[profile.lifeStage] : '-'}</span>
            </p>
            <h2 style={{ color: '#F1F5F9', fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              내 조건 입력하기
            </h2>
          </div>
          <span style={{ color: '#475569', fontSize: '0.85rem' }}>{step + 1} / 4</span>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-0">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isDone = i < step;
            const isActive = i === step;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isDone
                        ? '#10B981'
                        : isActive
                        ? 'linear-gradient(135deg, #6366F1, #818CF8)'
                        : 'rgba(51,65,85,0.6)',
                      color: isDone || isActive ? 'white' : '#475569',
                      boxShadow: isActive ? '0 0 15px rgba(99,102,241,0.5)' : 'none',
                      border: isDone ? '2px solid #10B981' : isActive ? '2px solid #6366F1' : '2px solid rgba(51,65,85,0.5)',
                    }}
                  >
                    {isDone ? <CheckCircle2 size={14} /> : <Icon size={14} />}
                  </div>
                  <span style={{ color: isActive ? '#A5B4FC' : isDone ? '#10B981' : '#475569', fontSize: '0.68rem' }}>
                    {s.label}
                  </span>
                </div>
                {i < 3 && (
                  <div
                    className="flex-1 h-0.5 mx-2 mb-4 rounded-full"
                    style={{ background: isDone ? 'rgba(16,185,129,0.4)' : 'rgba(51,65,85,0.5)' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'rgba(30,41,59,0.7)',
          border: '1px solid rgba(99,102,241,0.15)',
          backdropFilter: 'blur(20px)',
          minHeight: '380px',
        }}
      >
        {/* Step 0: 거주지 */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.2)' }}>
                <MapPin size={16} style={{ color: '#6366F1' }} />
              </div>
              <h3 style={{ color: '#F1F5F9', fontSize: '1.05rem', fontWeight: 600 }}>현재 거주지</h3>
            </div>

            <div className="space-y-2">
              <label style={{ color: '#94A3B8', fontSize: '0.85rem' }}>현재 거주 자치구</label>
              <div className="grid grid-cols-5 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {SEOUL_DISTRICTS.map((d) => (
                  <button
                    key={d}
                    onClick={() => updateProfile({ currentDistrict: d })}
                    className="px-2 py-1.5 rounded-lg text-xs transition-all duration-200"
                    style={{
                      background: profile.currentDistrict === d ? 'rgba(99,102,241,0.25)' : 'rgba(15,23,42,0.5)',
                      border: `1px solid ${profile.currentDistrict === d ? '#6366F1' : 'rgba(51,65,85,0.5)'}`,
                      color: profile.currentDistrict === d ? '#A5B4FC' : '#64748B',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {profile.currentDistrict && DISTRICT_HOUSING_HINT[profile.currentDistrict] && (
                <p style={{ color: '#6366F1', fontSize: '0.75rem' }}>
                  📍 {profile.currentDistrict}: {DISTRICT_HOUSING_HINT[profile.currentDistrict]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label style={{ color: '#94A3B8', fontSize: '0.85rem' }}>거주 형태</label>
              <div className="grid grid-cols-3 gap-2">
                {['월세', '전세', '자가'].map((type) => (
                  <button
                    key={type}
                    className="py-2 rounded-lg text-sm transition-all duration-200"
                    style={{
                      background: 'rgba(15,23,42,0.5)',
                      border: '1px solid rgba(51,65,85,0.5)',
                      color: '#64748B',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: 소득·지출 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.2)' }}>
                <Wallet size={16} style={{ color: '#6366F1' }} />
              </div>
              <h3 style={{ color: '#F1F5F9', fontSize: '1.05rem', fontWeight: 600 }}>소득 & 지출 조건</h3>
            </div>

            <SliderField
              label="월 소득 (세후)"
              value={profile.monthlyIncome}
              min={150}
              max={800}
              step={10}
              unit="만원"
              onChange={(v) => updateProfile({ monthlyIncome: v })}
              hint="서울 평균: 320만원"
              color="#6366F1"
            />
            <SliderField
              label="월 주거비 (월세/관리비)"
              value={profile.monthlyHousing}
              min={30}
              max={300}
              step={5}
              unit="만원"
              onChange={(v) => updateProfile({ monthlyHousing: v })}
              hint={`주거비율: ${Math.round((profile.monthlyHousing / profile.monthlyIncome) * 100)}%`}
              color={profile.monthlyHousing / profile.monthlyIncome > 0.38 ? '#EF4444' : profile.monthlyHousing / profile.monthlyIncome > 0.28 ? '#F59E0B' : '#10B981'}
            />
            <SliderField
              label="월 생활비 (식비·교통·기타)"
              value={profile.monthlyLiving}
              min={50}
              max={400}
              step={10}
              unit="만원"
              onChange={(v) => updateProfile({ monthlyLiving: v })}
              color="#818CF8"
            />

            {/* Surplus indicator */}
            <div
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: 'rgba(15,23,42,0.5)',
                border: `1px solid ${profile.monthlyIncome - profile.monthlyHousing - profile.monthlyLiving > 50 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}
            >
              <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>월 예상 잔여</span>
              <span
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: profile.monthlyIncome - profile.monthlyHousing - profile.monthlyLiving > 50 ? '#10B981' : '#EF4444',
                }}
              >
                {(profile.monthlyIncome - profile.monthlyHousing - profile.monthlyLiving).toLocaleString()}만원
              </span>
            </div>
          </div>
        )}

        {/* Step 2: 생활 조건 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.2)' }}>
                <Clock size={16} style={{ color: '#6366F1' }} />
              </div>
              <h3 style={{ color: '#F1F5F9', fontSize: '1.05rem', fontWeight: 600 }}>
                {profile.lifeStage === 'family' ? '통근 & 보육·복직 조건' : profile.lifeStage === 'senior' ? '통근 & 은퇴 계획' : '통근 & 생활 조건'}
              </h3>
            </div>

            <SliderField
              label="편도 통근 시간"
              value={profile.commuteTime}
              min={10}
              max={120}
              step={5}
              unit="분"
              onChange={(v) => updateProfile({ commuteTime: v })}
              hint={profile.commuteTime > 70 ? '⚠ 통근 과부담' : profile.commuteTime > 50 ? '주의 구간' : '✓ 양호'}
              color={profile.commuteTime > 70 ? '#EF4444' : profile.commuteTime > 50 ? '#F59E0B' : '#10B981'}
            />

            {profile.lifeStage === 'family' && (
              <>
                <SliderField
                  label="월 보육비"
                  value={profile.childcareCost}
                  min={0}
                  max={150}
                  step={5}
                  unit="만원"
                  onChange={(v) => updateProfile({ childcareCost: v })}
                  hint={`보육비율: ${Math.round((profile.childcareCost / profile.monthlyIncome) * 100)}%`}
                  color="#F59E0B"
                />
                <SliderField
                  label="배우자 복직까지 남은 기간"
                  value={profile.returnToWorkMonths}
                  min={0}
                  max={36}
                  step={1}
                  unit="개월"
                  onChange={(v) => updateProfile({ returnToWorkMonths: v })}
                  color="#818CF8"
                />
              </>
            )}

            {profile.lifeStage === 'senior' && (
              <SliderField
                label="은퇴 예정 연령"
                value={profile.retirementAge}
                min={55}
                max={75}
                step={1}
                unit="세"
                onChange={(v) => updateProfile({ retirementAge: v })}
                color="#10B981"
              />
            )}

            {profile.lifeStage === 'youth' && (
              <SliderField
                label="현재 저축액"
                value={profile.savings}
                min={0}
                max={20000}
                step={100}
                unit="만원"
                onChange={(v) => updateProfile({ savings: v })}
                color="#10B981"
              />
            )}
          </div>
        )}

        {/* Step 3: 비교 목표 */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.2)' }}>
                <Target size={16} style={{ color: '#6366F1' }} />
              </div>
              <h3 style={{ color: '#F1F5F9', fontSize: '1.05rem', fontWeight: 600 }}>비교해보고 싶은 조건</h3>
            </div>

            <div className="space-y-2">
              <label style={{ color: '#94A3B8', fontSize: '0.85rem' }}>이사 고려 중인 자치구</label>
              <div className="grid grid-cols-5 gap-1.5 max-h-44 overflow-y-auto pr-1">
                {SEOUL_DISTRICTS.filter((d) => d !== profile.currentDistrict).map((d) => (
                  <button
                    key={d}
                    onClick={() => updateProfile({ compareDistrict: d })}
                    className="px-2 py-1.5 rounded-lg text-xs transition-all duration-200"
                    style={{
                      background: profile.compareDistrict === d ? 'rgba(129,140,248,0.25)' : 'rgba(15,23,42,0.5)',
                      border: `1px solid ${profile.compareDistrict === d ? '#818CF8' : 'rgba(51,65,85,0.5)'}`,
                      color: profile.compareDistrict === d ? '#C7D2FE' : '#64748B',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label style={{ color: '#94A3B8', fontSize: '0.85rem' }}>주요 관심 변수 (복수 선택)</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '주거비 절감', icon: Building2 },
                  { label: '통근 단축', icon: Train },
                  { label: '보육비 지원', icon: Baby },
                  { label: '복직 시점', icon: Briefcase },
                ].map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200"
                    style={{
                      background: 'rgba(15,23,42,0.5)',
                      border: '1px solid rgba(51,65,85,0.5)',
                      color: '#64748B',
                    }}
                  >
                    <Icon size={14} />
                    <span style={{ fontSize: '0.82rem' }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary preview */}
            <div
              className="p-4 rounded-xl"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <p style={{ color: '#A5B4FC', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
                입력 요약
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: '#94A3B8' }}>
                <span>현재: {profile.currentDistrict}</span>
                <span>비교: {profile.compareDistrict || '-'}</span>
                <span>소득: 월 {profile.monthlyIncome}만원</span>
                <span>주거: 월 {profile.monthlyHousing}만원</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200"
          style={{
            background: 'rgba(30,41,59,0.6)',
            border: '1px solid rgba(51,65,85,0.5)',
            color: '#94A3B8',
            fontSize: '0.88rem',
          }}
        >
          <ChevronLeft size={15} />
          이전
        </button>

        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #6366F1, #818CF8)',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: 600,
            boxShadow: '0 0 20px rgba(99,102,241,0.35)',
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? '세션 생성 중...' : step === 3 ? 'A/B 시나리오 설정하기' : '다음 단계'}
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
