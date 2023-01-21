import Layout from "@/components/Layout";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Key } from "react";
import { query } from "../api/db";
import styles from "./index.module.css";

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

export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    const result = await query("SELECT * FROM ingredients");
    const ingredients = result.rows;

    return {
        props: {
            ingredients
        }
    }
}

const Ingredients = ({ ingredients }: Props) => {

    const router = useRouter();

    return (
        <Layout>
            <h1>Ingredients</h1>
            <ul>
                {ingredients.map(ingredient => (
                    <li key={ingredient.id as Key}>
                        <Link href={`/ingredients/${ingredient.id}`}>{ingredient.name}</Link>
                    </li>
                ))}
            </ul>
            <input className={styles.button} type="button" value="Add Ingredient" onClick={() => router.push("/ingredients/Add")} />
        </Layout>
    );
};

export default Ingredients;