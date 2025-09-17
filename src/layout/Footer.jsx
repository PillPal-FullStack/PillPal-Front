import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        © {new Date().getFullYear()} PillPal · Tu aliado diario para no olvidar tu medicación. <br />
        Proyecto desarrollado en el Hackathon de Factoría F5.
      </p>
    </footer>
  );
}