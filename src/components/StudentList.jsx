import React, { useState } from 'react';

function StudentList({ students, setStudents }) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    
    // Split by comma or newline for bulk add
    const newNames = inputValue
      .split(/[\n,]+/)
      .map(name => name.trim())
      .filter(name => name.length > 0 && !students.includes(name));

    if (newNames.length > 0) {
      setStudents([...students, ...newNames]);
      setInputValue('');
    }
  };

  const handleRemove = (nameToRemove) => {
    setStudents(students.filter(name => name !== nameToRemove));
  };

  const handleClearAll = () => {
    if (window.confirm('정말 모든 학생 명단을 삭제하시겠습니까?')) {
      setStudents([]);
    }
  };

  return (
    <div className="panel">
      <h2>
        <span className="material-symbols-outlined">manage_accounts</span>
        학생 명단 관리
      </h2>
      
      <div className="text-field-container">
        <textarea 
          rows="3" 
          placeholder="학생 이름을 입력하세요. 여러 명일 경우 줄바꿈이나 쉼표로 구분하세요."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      
      <div className="controls" style={{ marginBottom: '20px' }}>
        <button className="btn-filled" onClick={handleAdd}>
          <span className="material-symbols-outlined">person_add</span>
          추가하기
        </button>
        {students.length > 0 && (
          <button onClick={handleClearAll} className="btn-error">
            <span className="material-symbols-outlined">delete_sweep</span>
            모두 삭제
          </button>
        )}
      </div>

      <div className="student-list">
        {students.map((student, index) => (
          <div key={index} className="student-tag">
            {student}
            <button onClick={() => handleRemove(student)} aria-label={`${student} 삭제`}>
              <span className="material-symbols-outlined">cancel</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentList;
