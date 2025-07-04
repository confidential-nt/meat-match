import MeatMatchWrapper from '@/app/components/MeatMatchGameBoardWrapper';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <MeatMatchWrapper />
    </div>
  );
}
