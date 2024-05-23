import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';
import Head from "./Head";

export default function Home() {
  return (
    <div className={styles.main}>
      <Head />
    </div>
  );
}
