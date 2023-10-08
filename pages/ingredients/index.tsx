import Layout from "@/components/Layout";
import { GetServerSidePropsContext } from "next";
import { ChangeEvent, FormEvent, Key, MouseEvent, useState } from "react";
import { query } from "@/lib/db";
import styles from "@/styles/ingredients/index.module.css";
import React from "react";
import { Category, Ingredient, Unit } from "@/lib/types";
import Modal from "@/components/Modal";
import IngredientForm from "@/components/IngredientForm";
import { useRouter } from "next/router";
import DeleteForm from "@/components/DeleteForm";
import IngredientInfo from "@/components/IngredientInfo";
import { APIError } from "@/lib/errors";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import AccessDenied from "@/components/AccessDenied";
import Field from "@/components/Field";
import Form from "@/components/Form";

interface Props {
    ingredients: Ingredient[],
    units: Unit[],
    categories: Category[]
}

export default function Ingredients({ ingredients, units, categories }: Props) {    
    
    const [ searchTerm, setSearchTerm ] = useState('');
    const [ infoOpen, setInfoOpen ] = useState(false);
    const [ addOpen, setAddOpen ] = useState(false);
    const [ editOpen, setEditOpen ] = useState(false);
    const [ deleteOpen, setDeleteOpen ] = useState(false);
    const [ selectedIngredient, setSelectedIngredient ] = useState<Ingredient | undefined>(undefined);
    
    const router = useRouter();
    
    const { data: session } = useSession();
    if (!session) {
        return (
            <Layout title="Access Denied">
                <AccessDenied />
            </Layout>
        );
    }

    const filteredIngredients = ingredients.filter(ingredient => ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    function handleChange({target}: ChangeEvent<HTMLInputElement>) {
        setSearchTerm(target.value);
    }

    function info(ingredient: Ingredient) {
        setSelectedIngredient(ingredient);
        setInfoOpen(true);
    }

    async function handleAdd(ingredient: Ingredient) {
        try {

            const response = await fetch(`${window.location.origin}/api/ingredients`, {
                method: "POST",
                body: JSON.stringify(ingredient),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const jsonResponse = await response.json();

            if (!response.ok) {
                throw new APIError(jsonResponse.error, response.status);
            }

            console.log(`%c${jsonResponse.message}`, "color:green");
            
        } catch (error) {
            console.log(error);
            handleError(error as APIError);
            
        } finally {
            setAddOpen(false);
            router.replace(router.asPath);
        }
    };

    function edit(ingredient: Ingredient) {
        setSelectedIngredient(ingredient);
        setEditOpen(true);
    }

    async function handleEdit(ingredient: Ingredient) {
        try {
            const response = await fetch(`${window.location.origin}/api/ingredients`, {
                method: "PUT",
                body: JSON.stringify(ingredient),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const jsonResponse = await response.json();
            
            if (!response.ok) {
                throw new APIError(jsonResponse.error, response.status);
            }

            console.log(`%c${jsonResponse.message}`, "color:green");
            router.replace(router.asPath);

        } catch (error) {

            console.log(error);
            handleError(error as APIError);

        } finally {
            setEditOpen(false);
        }
    }

    function trash(ingredient: Ingredient) {
        setSelectedIngredient(ingredient);
        setDeleteOpen(true);
    }

    async function handleDelete(e: MouseEvent<HTMLButtonElement>, id: number) {
        e.preventDefault();
        try {
            const response = await fetch(`${window.location.origin}/api/ingredients`, {
                method: "DELETE",
                credentials: 'include',
                body: JSON.stringify({
                    id: id
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": `${window.location.origin}`
                }
            });
            const jsonResponse = await response.json();

            if (!response.ok) {
                throw new APIError(jsonResponse.error, response.status);
            }

            console.log(`%c${jsonResponse.message}`, "color:green");
        } catch (error) {
            if (error instanceof APIError) {
                handleError(error);
            }
        } finally {
            setDeleteOpen(false);
            router.replace(router.asPath);
        }
    }

    function handleError(error: Error | APIError):void {
        if (error instanceof APIError) {
            switch (error.status) {
                case 401:
                    console.log(`${error.status} - ${error.message} - Redirecting to the login page`)
                    router.push('/login');
            }
        }
    }

    function handleCancel() {
        setSelectedIngredient(undefined);
        setDeleteOpen(false);
    }

    return (
        <Layout title="Ingredients">
            <h1 className={styles.heading}>Ingredients</h1>
            <input className={styles.formControl} type="text" name="searchTerm" value={searchTerm} onChange={handleChange} placeholder="Search" />
            <button className={styles.button} onClick={() => setAddOpen(true)}>Add Ingredient</button>
            <ul className={styles.list}>
                {filteredIngredients.map(ingredient => (
                    <li className={styles.listItem} key={ingredient.id as Key}>
                        <button className={styles.listButton} onClick={() => info(ingredient)}>{ingredient.name}</button>
                        <button className={styles.editButton} onClick={() => edit(ingredient)}></button>
                        <button className={styles.deleteButton} onClick={() => trash(ingredient)}></button>
                    </li>
                ))}
            </ul>
            <Modal open={addOpen} setOpen={setAddOpen}>
                <IngredientForm title="New Ingredient" units={units} categories={categories} onSubmit={handleAdd} />
            </Modal>
            <Modal open={editOpen} setOpen={setEditOpen}>
                <IngredientForm title="Edit Ingredient" units={units} categories={categories} onSubmit={handleEdit} initialIngredient={selectedIngredient} />
            </Modal>
            <Modal open={deleteOpen} setOpen={setDeleteOpen}>
                <DeleteForm ingredient={selectedIngredient!} onDelete={handleDelete} cancel={handleCancel} />
            </Modal>
            <Modal open={infoOpen} setOpen={setInfoOpen}>
                <IngredientInfo ingredient={selectedIngredient!} />
            </Modal>
        </Layout>
    );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    const session = await getServerSession(context.req, context.res, authOptions);

    let result = await query("SELECT * FROM units");
    const units: Unit[] = result.rows;
    result = await query("SELECT * FROM categories");
    const categories: Category[] = result.rows;

    result = await query("SELECT ingredients.id, ingredients.name, ingredients.unit_id, units.name AS unit, ingredients.category_id, categories.name AS category FROM ingredients JOIN units ON ingredients.unit_id = units.id JOIN categories ON ingredients.category_id = categories.id");
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