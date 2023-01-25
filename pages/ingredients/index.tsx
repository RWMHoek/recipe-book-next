import Layout from "@/components/Layout";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { Key } from "react";
import { query } from "../api/db";
import styles from "./index.module.css";
import React from "react";

export interface Ingredient {
    id: number,
    name: string,
    unit_id?: number,
    unit?: string,
    category_id?: number,
    category?: string
}

export interface Props {
    ingredients: Ingredient[]
}


export default function Ingredients({ ingredients }: Props) {

    return (
        <Layout title="Ingredients">
            <h1 className={styles.heading}>Ingredients</h1>
            <ul className={styles.list}>
                {ingredients.map(ingredient => (
                    <li className={styles.listItem} key={ingredient.id as Key}>
                        <Link className={styles.listLink} href={`/ingredients/${ingredient.id}`}>{ingredient.name}</Link>
                    </li>
                ))}
            </ul>
            <Link className={styles.button} href="/ingredients/add">Add Ingredient</Link>
        </Layout>
    );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    const result = await query("SELECT * FROM ingredients");
    const ingredients = result.rows;

    ingredients.sort((a:Ingredient, b: Ingredient) => {
        return a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
    });

    return {
        props: {
            ingredients
        }
    }
}