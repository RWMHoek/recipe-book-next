import Layout from "@/components/Layout";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { ChangeEvent, Key, useState } from "react";
import { query } from "../api/db";
import styles from "@/styles/ingredients/index.module.css";
import React from "react";
import { Category, Ingredient, Unit } from "@/lib/types";
import Modal from "@/components/Modal";
import IngredientForm from "@/components/IngredientForm";
import { useRouter } from "next/router";

interface Props {
    ingredients: Ingredient[],
    units: Unit[],
    categories: Category[]
}


export default function Ingredients({ ingredients, units, categories }: Props) {

    const [ searchTerm, setSearchTerm ] = useState('');
    const [ isOpen, setIsOpen ] = useState(false);

    const router = useRouter();

    const filteredIngredients = ingredients.filter(ingredient => ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    function handleChange({target}: ChangeEvent<HTMLInputElement>) {
        setSearchTerm(target.value);
    }

    async function handleSubmit(ingredient: Ingredient) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}:${process.env.NEXT_PUBLIC_BASE_PORT}/api/ingredients`, {
                method: "POST",
                body: JSON.stringify(ingredient),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const jsonResponse = await response.json();
            console.log(`%c${jsonResponse.message}`, "color:green");
            setIsOpen(false);
            router.reload();
        } catch (error) {
            console.log({error});
        }
    };

    return (
        <Layout title="Ingredients">
            <h1 className={styles.heading}>Ingredients</h1>
            <input className={styles.formControl} type="text" name="searchTerm" value={searchTerm} onChange={handleChange} placeholder="Search" />
            <button className={styles.button} onClick={() => setIsOpen(true)}>Add Ingredient</button>
            <ul className={styles.list}>
                {filteredIngredients.map(ingredient => (
                    <li className={styles.listItem} key={ingredient.id as Key}>
                        <Link className={styles.listLink} href={`/ingredients/${ingredient.id}`}>{ingredient.name}</Link>
                    </li>
                ))}
            </ul>
            <Modal open={isOpen} setOpen={setIsOpen}>
                <IngredientForm units={units} categories={categories} onSubmit={handleSubmit} />
            </Modal>
        </Layout>
    );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    let result = await query("SELECT * FROM units");
    const units: Unit[] = result.rows;
    result = await query("SELECT * FROM categories");
    const categories: Category[] = result.rows;

    result = await query("SELECT * FROM ingredients");
    const ingredients: Ingredient[] = result.rows;

    ingredients.sort((a, b) => {
        return a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
    });

    return {
        props: {
            ingredients,
            units,
            categories
        }
    }
}