/* eslint-disable react-hooks/exhaustive-deps */
import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useState } from 'react'
import { query } from '../api/db'
import { Ingredient } from '.';
import Layout from '@/components/Layout';
import styles from './[id].module.css';
import { useRouter } from 'next/router';

export interface Props {
    ingredient: Ingredient
};

export default function IngredientPage({ ingredient }: Props) {

    const router = useRouter();

    const [ isDeleted, setIsDeleted ] = useState(false);

    async function handleDelete() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}:${process.env.NEXT_PUBLIC_BASE_PORT}/api/ingredients`, {
                method: "DELETE",
                body: JSON.stringify({
                    id: ingredient.id
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const jsonResponse = await response.json();
            console.log(`%c${jsonResponse.message}`, "color:green");
            setIsDeleted(true);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (isDeleted) {
            router.push('/ingredients');
        }
    }, [isDeleted]);

    return (
        <Layout title={`Ingredient - ${ingredient.name}`}>
            <h1 className={styles.heading}>
                {ingredient.name}
            </h1>

            <p>{ingredient.unit}</p>

            <p>{ingredient.category}</p>

            <input type="button" className={styles.editButton} value="Edit" onClick={() => { router.push(`/ingredients/edit/${ingredient.id}`)}} />

            <input type="button" className={styles.deleteButton} value="Delete" onClick={handleDelete} />
        </Layout>
    )
};

export async function getServerSideProps({ params }: GetServerSidePropsContext) {
    const result = await query("SELECT ingredients.id AS id, ingredients.name AS name, units.name AS unit, categories.name AS category FROM ingredients JOIN units ON ingredients.unit_id = units.id JOIN categories ON ingredients.category_id = categories.id WHERE ingredients.id = $1", [params?.id]);
    const ingredient = result.rows[0];

    if (!ingredient) return;

    return {
        props: {
            ingredient
        }
    };
};
