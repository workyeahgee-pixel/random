import React, { useState, useEffect } from 'react';

function SingleSlot({ students, targetResult, startSpin }) {
  const [list, setList] = useState([]);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (!students || students.length === 0) return;
    
    // Create a long list for the slot machine effect (e.g., 20 random items + 1 target)
    const items = Array.from({ length: 20 }, () => 
      students[Math.floor(Math.random() * students.length)]
    );
    items.push(targetResult);
    setList(items);
    
    // Reset spin state
    setSpinning(false);
    
    // Short delay before triggering the spin animation so CSS registers the initial 0 position
    const timer = setTimeout(() => {
      setSpinning(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [startSpin, students, targetResult]);

  return (
    <div className="slot">
      <div 
        className="slot-inner" 
        style={{ 
          transform: spinning ? `translateY(-${(list.length - 1) * 280}px)` : `translateY(0px)`,
          transition: spinning ? 'transform 3s cubic-bezier(0.15, 0.85, 0.35, 1)' : 'none'
        }}
      >
        {list.map((name, idx) => (
          <div key={idx} className="slot-item">
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

function SlotMachine({ students, targetResults, onComplete }) {
  const [spinKey, setSpinKey] = useState(0); // Used to re-trigger spin
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setSpinKey(prev => prev + 1);
    setCompleted(false);
    
    const timer = setTimeout(() => {
      setCompleted(true);
      if (onComplete) onComplete();
    }, 3500); // 3 seconds for animation + 0.5s padding

    return () => clearTimeout(timer);
  }, [targetResults, onComplete]);

  return (
    <div className="panel" style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>두구두구두구...</h2>
      <div className="slot-container">
        {targetResults.map((result, index) => (
          <SingleSlot 
            key={`${index}-${spinKey}`} 
            students={students} 
            targetResult={result} 
            startSpin={spinKey}
          />
        ))}
      </div>
      {completed && (
        <div style={{ marginTop: '20px', animation: 'fadeIn 0.5s ease' }}>
          <h1 data-text="당첨!">
            당첨!
          </h1>
        </div>
      )}
    </div>
  );
}

export default SlotMachine;
