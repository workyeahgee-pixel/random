import { useState, useEffect } from 'react';
import StudentList from './components/StudentList';
import SlotMachine from './components/SlotMachine';
import SecretMenu from './components/SecretMenu';
import EthicsGateway from './components/EthicsGateway';
import Footer from './components/Footer';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [hasAgreedToEthics, setHasAgreedToEthics] = useLocalStorage('ethics_agreed', false);
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

  if (!hasAgreedToEthics) {
    return <EthicsGateway onAgree={() => setHasAgreedToEthics(true)} />;
  }

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

      <header className="app-header">
        <div className="app-header-icon">
          <span className="material-symbols-outlined">casino</span>
        </div>
        <div className="app-header-text">
          <h1>랜덤 발표자 뽑기</h1>
          <p className="app-header-subtitle">발표자를 공정하고 실공없이 추첨하세요</p>
        </div>
      </header>

      {!isDrawing ? (
        <>
          <StudentList students={students} setStudents={setStudents} />
          
          <div className="panel" style={{ marginTop: '20px', textAlign: 'center' }}>
            <h2>
              <span className="material-symbols-outlined">group</span>
              몇 명을 뽑을까요?
            </h2>
            <div className="text-field-container" style={{ width: '150px', margin: '0 auto 16px' }}>
              <input 
              type="number" 
              min="1" 
                max={Math.max(1, students.length)}
                value={drawCount} 
                onChange={(e) => setDrawCount(parseInt(e.target.value) || 1)}
                style={{ fontSize: '24px', textAlign: 'center' }}
              />
            </div>
            <br />
            <button 
              className="btn-filled"
              onClick={startDraw} 
              disabled={students.length === 0}
              style={{ marginTop: '8px' }}
            >
              <span className="material-symbols-outlined">play_arrow</span>
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
            <button onClick={() => setIsDrawing(false)} className="btn-outline">
              <span className="material-symbols-outlined">arrow_back</span>
              돌아가기
            </button>
          </div>
        </>
      )}
      <Footer />
    </>
  );
}

export default App;
