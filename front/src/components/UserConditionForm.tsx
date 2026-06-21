import { type FormEvent, useMemo, useState } from 'react';
import type { LifeStage, UserProfile } from '../context/PivotContext';
import { useTheme } from '../context/ThemeContext';

type UserConditionFormValues = Pick<
  UserProfile,
  | 'lifeStage'
  | 'currentDistrict'
  | 'compareDistrict'
  | 'monthlyIncome'
  | 'monthlyHousing'
  | 'monthlyLiving'
  | 'commuteTime'
  | 'childcareCost'
  | 'returnToWorkMonths'
  | 'retirementAge'
  | 'savings'
>;

type ValidationErrors = Partial<Record<keyof UserConditionFormValues | 'form', string>>;

interface UserConditionFormProps {
  value: UserConditionFormValues;
  onChange: (updates: Partial<UserConditionFormValues>) => void;
  onSubmit: (value: UserConditionFormValues) => void | Promise<void>;
  submitLabel?: string;
  disabled?: boolean;
}

type NumberField = {
  field: keyof Pick<
    UserConditionFormValues,
    | 'monthlyIncome'
    | 'monthlyHousing'
    | 'monthlyLiving'
    | 'commuteTime'
    | 'childcareCost'
    | 'returnToWorkMonths'
    | 'retirementAge'
    | 'savings'
  >;
  label: string;
  unit: string;
  min: number;
  max: number;
  required?: boolean;
};

const DISTRICTS = [
  '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구',
  '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구',
  '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구',
  '종로구', '중구', '중랑구',
];

const NUMBER_FIELDS: NumberField[] = [
  { field: 'monthlyIncome', label: '월 소득', unit: '만원', min: 1, max: 2000, required: true },
  { field: 'monthlyHousing', label: '월 주거비', unit: '만원', min: 0, max: 500 },
  { field: 'monthlyLiving', label: '월 생활비', unit: '만원', min: 0, max: 800 },
  { field: 'commuteTime', label: '편도 통근 시간', unit: '분', min: 0, max: 180 },
  { field: 'childcareCost', label: '월 보육비', unit: '만원', min: 0, max: 300 },
  { field: 'returnToWorkMonths', label: '복직까지 남은 기간', unit: '개월', min: 0, max: 60 },
  { field: 'retirementAge', label: '은퇴 예정 연령', unit: '세', min: 45, max: 90 },
  { field: 'savings', label: '저축액', unit: '만원', min: 0, max: 200000 },
];

function validateNumberField(value: number, field: NumberField) {
  if (!Number.isFinite(value)) return `${field.label}을(를) 숫자로 입력해 주세요.`;
  if (field.required && value <= 0) return `${field.label}은(는) 0보다 커야 합니다.`;
  if (value < field.min || value > field.max) {
    return `${field.label}은(는) ${field.min.toLocaleString()}${field.unit} 이상 ${field.max.toLocaleString()}${field.unit} 이하로 입력해 주세요.`;
  }
  return undefined;
}

export function validateUserConditions(value: UserConditionFormValues): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!value.lifeStage) errors.lifeStage = '생활 단계를 선택해 주세요.';
  if (!value.currentDistrict.trim()) errors.currentDistrict = '현재 거주 자치구를 선택해 주세요.';
  if (!value.compareDistrict.trim()) errors.compareDistrict = '비교할 자치구를 선택해 주세요.';
  if (value.currentDistrict && value.currentDistrict === value.compareDistrict) {
    errors.compareDistrict = '현재 자치구와 다른 자치구를 선택해 주세요.';
  }

  for (const field of NUMBER_FIELDS) {
    const error = validateNumberField(value[field.field], field);
    if (error) errors[field.field] = error;
  }

  const totalMonthlyCost = value.monthlyHousing + value.monthlyLiving + value.childcareCost;
  if (Number.isFinite(value.monthlyIncome) && value.monthlyIncome > 0 && totalMonthlyCost > value.monthlyIncome * 1.5) {
    errors.form = '월 지출이 소득 대비 과도합니다. 입력값을 다시 확인해 주세요.';
  }

  return errors;
}

export function UserConditionForm({
  value,
  onChange,
  onSubmit,
  submitLabel = '저장',
  disabled = false,
}: UserConditionFormProps) {
  const { c, isDark } = useTheme();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nextErrors = validateUserConditions(value);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;
    await onSubmit(value);
  };

  const updateField = (updates: Partial<UserConditionFormValues>) => {
    onChange(updates);
    if (hasErrors) setErrors(validateUserConditions({ ...value, ...updates }));
  };

  const updateNumber = (field: NumberField['field'], nextValue: string) => {
    updateField({ [field]: nextValue === '' ? Number.NaN : Number(nextValue) } as Partial<UserConditionFormValues>);
  };

  const inputStyle = {
    background: c.inputBg,
    border: `1px solid ${c.inputBorder}`,
    color: c.text,
  };

  const renderError = (field: keyof ValidationErrors) => (
    errors[field] ? (
      <p style={{ color: c.error, fontSize: '0.75rem', marginTop: '4px' }}>{errors[field]}</p>
    ) : null
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errors.form && (
        <div
          className="rounded-lg px-3 py-2"
          role="alert"
          style={{
            background: c.errorBg,
            border: `1px solid ${c.errorBorder}`,
            color: c.error,
            fontSize: '0.85rem',
          }}
        >
          {errors.form}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="space-y-1">
          <span style={{ color: c.textSec, fontSize: '0.82rem' }}>생활 단계</span>
          <select
            value={value.lifeStage ?? ''}
            onChange={(event) => updateField({ lifeStage: (event.target.value || null) as LifeStage | null })}
            disabled={disabled}
            className="w-full rounded-lg px-3 py-2"
            style={inputStyle}
            aria-invalid={Boolean(errors.lifeStage)}
          >
            <option value="">선택</option>
            <option value="youth">청년기</option>
            <option value="family">신혼/출산기</option>
            <option value="senior">중장년기</option>
          </select>
          {renderError('lifeStage')}
        </label>

        <label className="space-y-1">
          <span style={{ color: c.textSec, fontSize: '0.82rem' }}>현재 자치구</span>
          <select
            value={value.currentDistrict}
            onChange={(event) => updateField({ currentDistrict: event.target.value })}
            disabled={disabled}
            className="w-full rounded-lg px-3 py-2"
            style={inputStyle}
            aria-invalid={Boolean(errors.currentDistrict)}
          >
            <option value="">선택</option>
            {DISTRICTS.map((district) => <option key={district} value={district}>{district}</option>)}
          </select>
          {renderError('currentDistrict')}
        </label>

        <label className="space-y-1">
          <span style={{ color: c.textSec, fontSize: '0.82rem' }}>비교 자치구</span>
          <select
            value={value.compareDistrict}
            onChange={(event) => updateField({ compareDistrict: event.target.value })}
            disabled={disabled}
            className="w-full rounded-lg px-3 py-2"
            style={inputStyle}
            aria-invalid={Boolean(errors.compareDistrict)}
          >
            <option value="">선택</option>
            {DISTRICTS.map((district) => <option key={district} value={district}>{district}</option>)}
          </select>
          {renderError('compareDistrict')}
        </label>

        {NUMBER_FIELDS.map(({ field, label, unit, min, max }) => (
          <label key={field} className="space-y-1">
            <span style={{ color: c.textSec, fontSize: '0.82rem' }}>{label}</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={min}
                max={max}
                value={Number.isFinite(value[field]) ? value[field] : ''}
                onChange={(event) => updateNumber(field, event.target.value)}
                disabled={disabled}
                className="w-full rounded-lg px-3 py-2"
                style={inputStyle}
                aria-invalid={Boolean(errors[field])}
              />
              <span style={{ color: c.textMuted, fontSize: '0.8rem', minWidth: '40px' }}>{unit}</span>
            </div>
            {renderError(field)}
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full rounded-xl px-4 py-2.5 transition-all"
        style={{
          background: disabled ? c.borderSoft : 'linear-gradient(135deg, #6366F1, #818CF8)',
          color: disabled ? c.textMuted : 'white',
          border: `1px solid ${disabled ? c.border : 'transparent'}`,
          boxShadow: !disabled && !isDark ? '0 8px 18px rgba(99,102,241,0.18)' : 'none',
          fontWeight: 700,
        }}
      >
        {hasErrors ? '입력값을 확인해 주세요' : submitLabel}
      </button>
    </form>
  );
}
