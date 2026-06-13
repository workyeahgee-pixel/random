import { useState, useEffect } from 'react';
import StudentList from './components/StudentList';
import SlotMachine from './components/SlotMachine';
import SecretMenu from './components/SecretMenu';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [students, setStudents] = useLocalStorage('presenter_students', []);
  const [secretTarget, setSecretTarget] = useLocalStorage('presenter_secret', null);
  
  const [drawCount, setDrawCount] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [results, setResults] = useState([]);
  
  // Secret Menu trigger
  const [clickCount, setClickCount] = useState(0);
  const [showSecretMenu, setShowSecretMenu] = useState(false);

  useEffect(() => {
    let timeout;
    if (clickCount > 0) {
      if (clickCount >= 5) {
        setShowSecretMenu(true);
        setClickCount(0);
      } else {
        timeout = setTimeout(() => setClickCount(0), 1000); // reset if not fast enough
      }
    }
    return () => clearTimeout(timeout);
  }, [clickCount]);

  const handleSecretClick = () => {
    setClickCount(prev => prev + 1);
  };

  const startDraw = () => {
    if (students.length === 0) {
      alert("학생을 먼저 추가해주세요!");
      return;
    }
    
    let actualCount = Math.min(drawCount, students.length);
    if (actualCount <= 0) actualCount = 1;
    
    const shuffled = [...students].sort(() => 0.5 - Math.random());
    let drawn = shuffled.slice(0, actualCount);

    if (secretTarget && students.includes(secretTarget)) {
      // Ensure secretTarget is in the result
      if (!drawn.includes(secretTarget)) {
        // Replace random element with secret target
        drawn[Math.floor(Math.random() * drawn.length)] = secretTarget;
      }
      
      // Optional: Shuffle again so secret target isn't always at the replaced index
      drawn = drawn.sort(() => 0.5 - Math.random());
    }

    setResults(drawn);
    setIsDrawing(true);
  };

  return (
    <>
      <div className="secret-trigger" onClick={handleSecretClick} aria-hidden="true" title="비밀 영역" />
      
      {showSecretMenu && (
        <SecretMenu 
          students={students} 
          secretTarget={secretTarget} 
          setSecretTarget={setSecretTarget} 
          onClose={() => setShowSecretMenu(false)} 
        />
      )}

      <h1>랜덤 발표자 뽑기</h1>

      {!isDrawing ? (
        <>
          <StudentList students={students} setStudents={setStudents} />
          
          <div className="panel" style={{ marginTop: '20px', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--text-color)' }}>몇 명을 뽑을까요?</h2>
            <input 
              type="number" 
              min="1" 
              max={Math.max(1, students.length)}
              value={drawCount} 
              onChange={(e) => setDrawCount(parseInt(e.target.value) || 1)}
              style={{ width: '150px', fontSize: '2rem', textAlign: 'center', height: '60px' }}
            />
            <br />
            <button 
              onClick={startDraw} 
              disabled={students.length === 0}
              style={{ fontSize: '2.5rem', padding: '20px 60px', marginTop: '20px' }}
            >
              추첨 시작!
            </button>
          </div>
        </>
      ) : (
        <>
          <SlotMachine 
            students={students} 
            targetResults={results} 
            onComplete={() => {}} 
          />
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button onClick={() => setIsDrawing(false)} style={{ fontSize: '2rem', padding: '15px 40px' }}>
              돌아가기
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default App;
