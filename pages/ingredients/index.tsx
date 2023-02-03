import Layout from "@/components/Layout";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { ChangeEvent, Key, useState } from "react";
import { query } from "../api/db";
import styles from "./index.module.css";
import React from "react";
import { Ingredient } from "@/lib/types";

interface Props {
    ingredients: Ingredient[]
}


export default function Ingredients({ ingredients }: Props) {

    const [ searchTerm, setSearchTerm ] = useState('');

    const filteredIngredients = ingredients.filter(ingredient => ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    function handleChange({target}: ChangeEvent<HTMLInputElement>) {
        setSearchTerm(target.value);
    }

    return (
        <Layout title="Ingredients">
            <h1 className={styles.heading}>Ingredients</h1>
            <input className={styles.formControl} type="text" name="searchTerm" value={searchTerm} onChange={handleChange} placeholder="Search" />
            <Link className={styles.button} href="/ingredients/add">Add Ingredient</Link>
            <ul className={styles.list}>
                {filteredIngredients.map(ingredient => (
                    <li className={styles.listItem} key={ingredient.id as Key}>
                        <Link className={styles.listLink} href={`/ingredients/${ingredient.id}`}>{ingredient.name}</Link>
                    </li>
                ))}
            </ul>
        </Layout>
    );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    const result = await query("SELECT * FROM ingredients");
    const ingredients: Ingredient[] = result.rows;

    ingredients.sort((a, b) => {
        return a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
    });

    return {
        props: {
            ingredients
        }
    }
}