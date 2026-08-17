"use client";
import { useState } from 'react';

export default function EligibilityChecker({ post }) {
  const [dob, setDob] = useState('');
  const [category, setCategory] = useState('General');
  const [qual, setQual] = useState('');
  const [result, setResult] = useState(null);

  // Parse requirements from post.category tags (e.g. "Graduate", "12th Pass", "10th Pass")
  const reqQualLevel = post.category?.some(c => c.includes('Graduate')) ? 3 :
                       post.category?.some(c => c.includes('12th')) ? 2 :
                       post.category?.some(c => c.includes('10th')) ? 1 : 0;

  const checkEligibility = (e) => {
    e.preventDefault();
    if (!dob) return setResult({ status: 'error', msg: 'Please enter your Date of Birth.' });
    if (reqQualLevel > 0 && !qual) return setResult({ status: 'error', msg: 'Please select your qualification.' });

    // Mock age calculation
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Default age limits (in reality this would come from JSON)
    const minAge = 18;
    let maxAge = post.dept === 'Defence' ? 21 : 27;
    
    // Category relaxation
    if (category === 'OBC') maxAge += 3;
    if (category === 'SC/ST') maxAge += 5;

    if (age < minAge) {
      return setResult({ status: 'fail', msg: `❌ You are under-age (Age: ${age}, Min: ${minAge}).` });
    }
    if (age > maxAge) {
      return setResult({ status: 'fail', msg: `❌ You are over-age (Age: ${age}, Max for ${category}: ${maxAge}).` });
    }

    // Qualification check
    const userQualLevel = qual === 'Graduate' ? 3 : qual === '12th Pass' ? 2 : qual === '10th Pass' ? 1 : 0;
    if (reqQualLevel > userQualLevel) {
      return setResult({ status: 'fail', msg: `❌ Qualification mismatch (Required: Higher than your current).` });
    }

    setResult({ status: 'success', msg: `✅ You are Eligible! (Age: ${age}, Qual: OK)` });
  };

  return (
    <div className="card" style={{ padding: '24px', background: 'var(--bg-2)', border: '1px solid var(--brand)', marginBottom: '24px' }}>
      <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        🎯 Am I Eligible?
      </h3>
      <form onSubmit={checkEligibility} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 600 }}>Date of Birth</label>
          <input type="date" value={dob} onChange={e => setDob(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--text)' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 600 }}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--text)' }}>
            <option value="General">General / UR</option>
            <option value="OBC">OBC (+3 yrs)</option>
            <option value="SC/ST">SC / ST (+5 yrs)</option>
            <option value="EWS">EWS</option>
          </select>
        </div>
        {reqQualLevel > 0 && (
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: 600 }}>Highest Qualification</label>
            <select value={qual} onChange={e => setQual(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--bg)', color: 'var(--text)' }}>
              <option value="">Select Qualification...</option>
              <option value="10th Pass">10th Pass</option>
              <option value="12th Pass">12th Pass</option>
              <option value="Graduate">Graduate / Degree</option>
            </select>
          </div>
        )}
        <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
          <button type="submit" className="btn btn-primary btn-block">Check Now</button>
        </div>
      </form>

      {result && (
        <div style={{ 
          marginTop: '16px', padding: '12px', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
          background: result.status === 'success' ? 'rgba(31,157,85,0.1)' : result.status === 'fail' ? 'rgba(224,49,49,0.1)' : 'var(--bg)',
          color: result.status === 'success' ? 'var(--green)' : result.status === 'fail' ? 'var(--red)' : 'var(--text)'
        }}>
          {result.msg}
        </div>
      )}
    </div>
  );
}
