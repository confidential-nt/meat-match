'use client';

import MeatMatchWrapper from '@/app/components/MeatMatchGameBoardWrapper';
import styles from './page.module.css';
import { Header } from './components/layout/Header/Header';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useEffect } from 'react';

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <div className={styles.page}>
      <Header />
      <MeatMatchWrapper />
      <section className={styles.instructions}>
        <h3>🔪 Guidelines for Sustainable Consumption 🔪</h3>
        <div>
          <p>• Click a meat piece to select it</p>
          <p>• Click an adjacent piece to swap and create matches</p>
          <p>• Align 3 or more of the same cut to make them... disappear</p>
          <p>• Each clever move feeds the ever-hungry machine</p>
          <p>{'All cuts are virtual. The ethics, however, are up to you.'}</p>
        </div>
      </section>
    </div>
  );
}
