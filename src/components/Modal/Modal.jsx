import PropTypes from 'prop-types';

import { Overlay, ModalSt } from './Modal.styled';
import { useEffect } from 'react';

export function Modal({ onGiveImg, onClose }) {
  // componentDidMount() {
  //   window.addEventListener('keydown', this.hendleKeyDown);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('keydown', this.hendleKeyDown);
  // }

  useEffect(() => {
    window.addEventListener('keydown', hendleKeyDown);
  }, []);

  const handleBackdropClick = e => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  const hendleKeyDown = e => {
    if (e.code === 'Escape') {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleBackdropClick}>
      <ModalSt>
        <img src={onGiveImg.largeImageURL} alt={onGiveImg.tags} />
      </ModalSt>
    </Overlay>
  );
}

Modal.propTypes = {
  onGiveImg: PropTypes.object.isRequired,
};
