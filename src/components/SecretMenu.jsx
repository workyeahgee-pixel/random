import React, { useState } from 'react';

function SecretMenu({ students, secretTarget, setSecretTarget, onClose }) {
  const [selected, setSelected] = useState(secretTarget || '');

  const handleSave = () => {
    setSecretTarget(selected);
    onClose();
  };

  const handleClear = () => {
    setSecretTarget(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 style={{ color: 'var(--secondary-color)' }}>교사용 비밀 설정</h2>
        <p style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
          다음에 무조건 당첨될 학생을 선택하세요. (설정 해제 시 무작위 추출)
        </p>

        <select 
          value={selected} 
          onChange={(e) => setSelected(e.target.value)}
          style={{ width: '100%', padding: '15px', fontSize: '1.2rem', marginBottom: '20px', borderRadius: '10px' }}
        >
          <option value="">-- 무작위 (설정 안 함) --</option>
          {students.map((student, idx) => (
            <option key={idx} value={student}>
              {student}
            </option>
          ))}
        </select>

        <div className="controls">
          <button onClick={handleSave}>저장 및 닫기</button>
          <button onClick={handleClear} style={{ backgroundColor: '#555', boxShadow: '0 8px 0 #333' }}>
            설정 해제
          </button>
          <button onClick={onClose} style={{ backgroundColor: '#888', boxShadow: '0 8px 0 #555' }}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default SecretMenu;
