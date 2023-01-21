/* eslint-disable react-hooks/exhaustive-deps */
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { query } from '@/pages/api/db';
import { GetServerSidePropsContext } from 'next';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Ingredient } from '..';
import { Category, Unit } from '../Add';
import styles from "./[id].module.css";

interface Props {
    initialIngredient: Ingredient,
    units: Unit[],
    categories: Category[]
};

export default function Edit({ initialIngredient, units, categories }: Props) {

    const router = useRouter();

    const [ ingredient, setIngredient ] = useState({
        ...initialIngredient
    });

    const [ isUpdated, setIsUpdated ] = useState(false);

    function handleChange({ target }: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) {
        setIngredient(prevIngredient => {
            return target.name === 'name' ? {
                ...prevIngredient,
                [target.name]: target.value,
            } : {
                ...prevIngredient,
                [target.name]: parseInt(target.value)
            }
        });
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3001/api/ingredients", {
                method: "PUT",
                body: JSON.stringify(ingredient),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const jsonResponse = await response.json();
            console.log(`%c${jsonResponse.message}`, "color:green");
            setIsUpdated(true);
        } catch (error) {
            console.log({error});
        }
    }

    useEffect(() => {
        if (isUpdated) {
            router.push(`/ingredients/${ingredient.id}`);
        }
    }, [isUpdated]);

    return (
        <Layout>
            <h1 className={styles.heading}>Edit Ingredient</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input className={styles.formControl} name='name' id='name' type="text" value={ingredient.name} onChange={handleChange} placeholder="Name" />

                <select className={styles.formControl} name="unit_id" id="unit_id" onChange={handleChange} value={ingredient.unit_id}>
                    <option value="0" disabled>Select a unit</option>
                    {units.map(unit => {
                        return <option value={unit.id} key={unit.id}>{unit.name} ({unit.abbreviation})</option>
                    })}
                </select>

                <select className={styles.formControl} name="category_id" id="category_id" onChange={handleChange} value={ingredient.category_id}>
                    <option value="0" disabled>Select a category</option>
                    {categories.map(category => {
                        return <option value={category.id} key={category.id}>{category.name}</option>
                    })}
                </select>

                <input className={styles.button} type="submit" value="Save" />
            </form>
        </Layout>
    );
};

export async function getServerSideProps({ params }: GetServerSidePropsContext) {
    let result = await query("SELECT * FROM ingredients WHERE id = $1", [params?.id]);
    const initialIngredient = result.rows[0];

    result = await query("SELECT * FROM units");
    const units = result.rows;

    result = await query("SELECT * FROM categories");
    const categories = result.rows;

    return {
        props: {
            initialIngredient,
            units,
            categories
        }
    };
};
