import MeatMatchWrapper from '@/app/components/MeatMatchGameBoardWrapper';
import styles from './page.module.css';
import { Header } from './components/layout/Header/Header';

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <MeatMatchWrapper />
      <section className={styles.instructions}>
        <h3>🔪 BUTCHER&apos;S INSTRUCTIONS 🔪</h3>
        <div>
          <p>• Click a meat piece to select it (it will glow with bloodlust)</p>
          <p>• Click an adjacent piece to swap and create matches</p>
          <p>• Match 3+ identical meats to send them to the slaughterhouse</p>
          <p>
            • Each massacre earns you points in this carnivorous capitalism!
          </p>
          <p>
            {
              '"Remember: No animal was harmed in the making of this game... yet. 😈"'
            }
          </p>
        </div>
      </section>
    </div>
  );
}
