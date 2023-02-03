/* eslint-disable react-hooks/exhaustive-deps */
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { query } from '@/pages/api/db';
import { GetServerSidePropsContext } from 'next';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import styles from "./[id].module.css";
import { getTargetValue } from '@/lib/utils';
import { Category, Ingredient, Unit } from '@/lib/types';

interface Props {
    initialIngredient: Ingredient,
    units: Unit[],
    categories: Category[]
};

export default function EditIngredient({ initialIngredient, units, categories }: Props) {

    const router = useRouter();

    const [ ingredient, setIngredient ] = useState({
        ...initialIngredient
    });

    const [ isUpdated, setIsUpdated ] = useState(false);

    function handleChange({ target }: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) {
        setIngredient(prevIngredient => {
            return {
                ...prevIngredient,
                [target.name]: getTargetValue(target),
            }
        });
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}:${process.env.NEXT_PUBLIC_BASE_PORT}/api/ingredients`, {
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
        <Layout title={`Edit Ingredient - ${ingredient.name}`}>
            <h1 className={styles.heading}>Edit Ingredient</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input className={styles.formControl} name='name' id='name' type="text" value={ingredient.name} onChange={handleChange} placeholder="Name" data-type='string' />

                <select className={styles.formControl} name="unit_id" id="unit_id" onChange={handleChange} value={ingredient.unit_id} data-type='number'>
                    <option value="0" disabled>Select a unit</option>
                    {units.map(unit => {
                        return <option value={unit.id} key={unit.id}>{unit.name} ({unit.abbreviation})</option>
                    })}
                </select>

                <select className={styles.formControl} name="category_id" id="category_id" onChange={handleChange} value={ingredient.category_id} data-type='number'>
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
    const initialIngredient: Ingredient = result.rows[0];

    result = await query("SELECT * FROM units");
    const units: Unit[] = result.rows;

    result = await query("SELECT * FROM categories");
    const categories: Category[] = result.rows;

    return {
        props: {
            initialIngredient,
            units,
            categories
        }
    };
};
