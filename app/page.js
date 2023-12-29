"use client";
import dynamic from "next/dynamic";

import Image from "next/image";
import styles from "./page.module.css";

const LexicalTest = dynamic(() => import("./lexical-test"), {
    ssr: false,
});

export default function Home() {
    return (
        <main className={styles.main}>
            <LexicalTest />
        </main>
    );
}
