import * as React from 'react';
import Button from '@mui/material/Button';

export default function MyButton({ children, onClick }) {
  const handleClick = () => {
    // 効果音を鳴らす
    const audio = new Audio('/sound/drops2-87989.mp3');
    audio.volume = 0.4; // お好みで調整
    audio.play();

    // 元のクリック動作を呼ぶ
    if (onClick) onClick();
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      {children}
    </Button>
  );
}
