import { Action } from "@/lib/types";

export enum ACTION {
    CHANGE = 'change',
    ADD = 'add',
    DELETE = 'delete'
};

export default function reducer(state: any[], action: Action): any {
    switch (action.type) {
        case ACTION.CHANGE:
            return state.map((item, index) => action.payload.index !== index ? item : { ...item, [action.payload.name]: action.payload.value });
    }
}