import MeatMatchWrapper from '@/app/components/MeatMatchGameBoardWrapper';
import styles from './page.module.css';
import { Header } from './components/layout/Header/Header';

export default function Home() {
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
          <p>• Each clever arrangement keeps the butcher’s business booming</p>
          <p>{'All cuts are virtual. The ethics, however, are up to you.'}</p>
        </div>
      </section>
    </div>
  );
}
