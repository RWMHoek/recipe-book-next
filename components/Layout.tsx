import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import styles from "./Layout.module.css";
import { useRouter } from "next/router";

interface LayoutComponentProps {
    children: React.ReactNode,
    title: string
}

const Layout = ({ children, title }: LayoutComponentProps) => {

    const router = useRouter();

    const links = [ "ingredients", "recipes", "shoppinglists" ];

    return (
        <>
            <Head>
                <link rel="icon" href="/cookbook.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>{`RecipeBook - ${title}`}</title>
            </Head>

            <nav className={styles.navBar}>
                <Link className={styles.homeLink} href="/"><Image src="/cookbook.ico" width="50" height="50" alt="Cook book"></Image></Link>
                <ul className={styles.navList}>
                    {links.map((link, index) => {
                        const matchLink = new RegExp(`/${link}`);
                        return (
                            <li key={index} className={styles.navListItem}>
                                <Link className={router.pathname.match(matchLink) ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink} href={`/${link}`}>{capitalize(link)}</Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <main className={styles.children}>{children}</main>

            
        </>
    );

    function capitalize(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

export default Layout;