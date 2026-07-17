import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, CheckCircle, AlertCircle } from 'lucide-react';

const HealthMetricsTracker = ({ reports, user }) => {
  if (!reports || reports.length === 0) return null;

  const sortedReports = [...reports].sort((a, b) => new Date(b.report_date) - new Date(a.report_date));
  const current = sortedReports[0];
  const previous = sortedReports.length > 1 ? sortedReports[1] : null;

  const gender = (user?.gender || 'Male').toLowerCase();

  const getRanges = () => {
    return {
      hemoglobin: { min: gender === 'female' ? 12.1 : 13.8, max: gender === 'female' ? 15.1 : 17.2, unit: 'g/dL', name: 'Hemoglobin' },
      vitamin_d: { min: 30, max: 50, unit: 'ng/mL', name: 'Vitamin D' },
      cholesterol: { min: 125, max: 200, unit: 'mg/dL', name: 'Cholesterol' },
      blood_sugar_fasting: { min: 70, max: 100, unit: 'mg/dL', name: 'Blood Sugar' },
      creatinine: { min: gender === 'female' ? 0.59 : 0.74, max: gender === 'female' ? 1.04 : 1.35, unit: 'mg/dL', name: 'Creatinine' },
      bmi: { min: 18.5, max: 24.9, unit: 'kg/m²', name: 'BMI' },
      urine_protein: { min: null, max: null, unit: '', name: 'Urine Protein', isString: true }
    };
  };

  const ranges = getRanges();

  const metrics = [
    { key: 'hemoglobin', ...ranges.hemoglobin },
    { key: 'vitamin_d', ...ranges.vitamin_d },
    { key: 'cholesterol', ...ranges.cholesterol },
    { key: 'blood_sugar_fasting', ...ranges.blood_sugar_fasting },
    { key: 'creatinine', ...ranges.creatinine },
    { key: 'bmi', ...ranges.bmi },
    { key: 'urine_protein', ...ranges.urine_protein }
  ];

  const calculateStatus = (val, min, max) => {
    if (val < min) return { label: 'Deficient/Low', color: '#3b82f6', bg: '#eff6ff', icon: <ArrowDownRight size={14} /> };
    if (val > max) return { label: 'Excess/High', color: '#ef4444', bg: '#fef2f2', icon: <ArrowUpRight size={14} /> };
    return { label: 'Healthy', color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle size={14} /> };
  };

  const refinedDelta = (curr, prev) => {
     if (prev === null || prev === undefined || curr === null || curr === undefined || curr === '' || prev === '') return null;
     const currNum = Number(curr);
     const prevNum = Number(prev);
     if (isNaN(currNum) || isNaN(prevNum)) return null;

     const diff = currNum - prevNum;
     if (diff === 0) return <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px' }}><Minus size={12}/> 0%</span>;

     const percentage = ((diff / prevNum) * 100).toFixed(1);
     const isIncrease = diff > 0;
     
     const color = isIncrease ? '#6366f1' : '#8b5cf6'; 

     return (
       <span style={{ color, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 500 }}>
         {isIncrease ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} 
         {Math.abs(percentage)}% vs last report
       </span>
     );
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)' }}>Key Health Attributes</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem' }}>
        {metrics.map(metric => {
          const val = current[metric.key];
          if (val === null || val === undefined || val === '') return null;

          const isStringMetric = metric.isString;
          const displayVal = isStringMetric ? String(val) : Number(val);
          
          let status;
          if (isStringMetric) {
            const valLower = String(val).toLowerCase().trim();
            if (valLower === 'nil' || valLower === 'negative' || valLower === 'normal' || valLower === 'absent') {
               status = { label: 'Healthy', color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle size={14} /> };
            } else {
               status = { label: 'Attention', color: '#f59e0b', bg: '#fef3c7', icon: <AlertCircle size={14} /> };
            }
          } else {
            status = calculateStatus(displayVal, metric.min, metric.max);
          }

          return (
            <div key={metric.key} className="card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{metric.name}</div>
                <div style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '2px', width: 'fit-content',
                  padding: '2px 6px', borderRadius: '8px', fontSize: '0.55rem', fontWeight: 600, textTransform: 'uppercase',
                  backgroundColor: status.bg, color: status.color
                }}>
                  {status.icon} {status.label}
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayVal}</span>
                {!isStringMetric && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{metric.unit}</span>}
              </div>

              {previous && !isStringMetric && refinedDelta(displayVal, previous[metric.key])}
              
              <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
                {isStringMetric ? 'Qualitative result' : `Ref: ${metric.min} - ${metric.max} ${metric.unit}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HealthMetricsTracker;
