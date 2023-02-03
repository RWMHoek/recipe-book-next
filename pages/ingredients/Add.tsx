import Layout from '@/components/Layout';
import { Category, Unit } from '@/lib/types';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { query } from '../api/db';
import styles from './add.module.css';

interface Props {
    units: Unit[],
    categories: Category[]
}

export default function Add(props: Props) {

    const router = useRouter();

    const [ ingredient, setIngredient ] = useState({
        name: "",
        unit_id: 0,
        category_id: 0
    });

    function handleChange({target}: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) {
        setIngredient(prevIngredient => {
            return {
                ...prevIngredient,
                [target.name]: target.value
            };
        });
    };

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
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
            router.push(`/ingredients/${jsonResponse.newIngredient.id}`);
        } catch (error) {
            console.log({error});
        }
    };
    
    return (
        <Layout title='Add Ingredient'>
            <h1 className={styles.heading}>New Ingredient</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input className={styles.formControl} name='name' id='name' type="text" value={ingredient.name} onChange={handleChange} placeholder="Name" />

                <select className={styles.formControl} name="unit_id" id="unit_id" onChange={handleChange} defaultValue={0}>
                    <option value="0" disabled>Select a unit</option>
                    {props.units.map(unit => {
                        return <option value={unit.id} key={unit.id}>{unit.name} ({unit.abbreviation})</option>
                    })}
                </select>

                <select className={styles.formControl} name="category_id" id="category_id" onChange={handleChange} defaultValue={0}>
                    <option value="0" disabled>Select a category</option>
                    {props.categories.map(category => {
                        return <option value={category.id} key={category.id}>{category.name}</option>
                    })}
                </select>

                <input className={styles.button} type="submit" value="Save" />
            </form>
        </Layout>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    let result = await query("SELECT * FROM units");
    const units: Unit[] = result.rows;
    result = await query("SELECT * FROM categories");
    const categories: Category[] = result.rows;

    return {
        props: {
            units,
            categories
        }
    }
};
