import React, { useState } from 'react';
import PolicyModal from './PolicyModal';

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openTerms = (e) => {
    e.preventDefault();
    setActiveModal('terms');
  };

  const openPrivacy = (e) => {
    e.preventDefault();
    setActiveModal('privacy');
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <footer className="app-footer">
        <div className="footer-content">
          <p className="copyright">© 2026 랜덤 발표자 추출. All rights reserved.</p>
          <div className="footer-links">
            <a href="#" onClick={openTerms}>이용약관</a>
            <span className="separator">|</span>
            <a href="#" onClick={openPrivacy}>개인정보처리방침</a>
          </div>
          <p className="manager-info">
            개인정보책임자: 신예지 교사 (서울정민학교) | 문의: 02-798-1447
          </p>
        </div>
      </footer>
      
      {activeModal && <PolicyModal type={activeModal} onClose={closeModal} />}
    </>
  );
};

export default Footer;
