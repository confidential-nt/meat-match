'use client';

import { useEffect } from 'react';

export default function MeatMatchGameBoardWrapper() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('./web-components/meat-match-game-board').then((mod) => {
        if (!customElements.get('meat-match-game-board')) {
          customElements.define('meat-match-game-board', mod.default);
        }
      });
    }
  }, []);

  return <meat-match-game-board />;
}
