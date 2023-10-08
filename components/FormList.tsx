import React, { PropsWithChildren } from 'react';

interface FormListProps<T> {
    name?: string,
    value?: T[],
    change?: (value: T[], name: string, options?: any) => void,
    options?: Record<string, any>
}

function FormList<T>({ name, value, change, options, children }: PropsWithChildren<FormListProps<T>>) {

    function handleChange(newValue: any, subName?: string, subOptions?: any) {
        value = [
            ...value!.slice(0, subOptions.index),
            newValue,
            ...value!.slice(subOptions.index + 1)
        ];
        change!(value, name!, options);
    }

    return (
        <ul id={name}>

            {/* Iterate over value array and return a set of supplied children for each wrapped in a <li> */}
            {value!.map((item, i) => { 
                return (
                    <li key={i}>

                        {/* Iterate over the supplied children and return them appropriately */}
                        {React.Children.map(children, child => {

                            // Return strings, numbers, and booleans as they are
                            if (child === null || child === undefined) return;
                            if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') return child;

                            // Clone any elements and add the value, name, change, and data-index properties
                            if (React.isValidElement<any>(child)) {
                                console.log()
                                return React.cloneElement(child, {
                                    value: item,
                                    change: handleChange,
                                    options: {index: i}
                                });
                            }
                        })}
 
                    </li>
                );
            })}

        </ul>
    );
}

export default FormList;