import { Ingredient } from "@/lib/types";
import React, { MouseEvent } from "react";

interface Props {
    ingredient: Ingredient,
    onDelete(e: MouseEvent<HTMLButtonElement>, id: number): void,
    cancel(): void
}

export default function DeleteForm(props: Props) {
    return (
        <>
            <h1>Are you sure?</h1>
            <p>You are about to delete {props.ingredient.name} from the database. Do you wish to continue?</p>
            <button onClick={(e) => props.onDelete(e, props.ingredient.id!)}>Yes</button>
            <button onClick={props.cancel}>No</button>
        </>
    );
}