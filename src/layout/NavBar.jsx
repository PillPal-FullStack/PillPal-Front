import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { CiPill } from "react-icons/ci";
import { CiCalendarDate } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className={styles.navbar}>

            {/* Botón hamburguesa */}
            <button
                className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}
                onClick={toggleMenu}
            >
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
            </button>

            {/* Logo */}
            <div className={styles.logo}>
                <Link to="/">
                    <img src="/pillpal.png" alt="Logo" />
                </Link>
            </div>

            {/* Menú */}
            <ul className={`${styles.menu} ${isOpen ? styles.open : ""}`}>
                <li>
                    <NavLink
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) => isActive ? styles.activeLink : ""}
                    >
                        Inicio
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/create"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) => isActive ? styles.activeLink : ""}
                    >
                        <CiPill /> Añadir medicación
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/history"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) => isActive ? styles.activeLink : ""}
                    >
                        <CiCalendarDate /> Mi historial
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) => isActive ? styles.activeLink : ""}
                    >
                        <CiUser /> Mi perfil
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}