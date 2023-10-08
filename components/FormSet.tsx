import React, { PropsWithChildren } from 'react'

interface Value {
    [key: string]: any
}

interface FormSetProps {
    name: string,
    value?: Value,
    change?: (value: Value, name: string, options?: any) => void,
    options?: any
}

function FormSet({ children, name, value, change, options }: PropsWithChildren<FormSetProps>) {

    function handleChange(newValue: Value, subName: string, subOptions?: any) {
        const updatedValue = {
            ...value,
            [subName]: newValue
        }
        change!(updatedValue, name, options);
    }
    
    return (
        <>
            {React.Children.map(children, child => {
                // Return strings, numbers, and booleans as they are
                if (child === null || child === undefined) return;
                if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') return child;

                // Clone any elements and add the value, name, change, and data-index properties
                if (React.isValidElement<any>(child)) {
                    return React.cloneElement(child, {
                        value: value![child.props.name],
                        change: handleChange
                    });
                }
            })}
        </>
    )
}

export default FormSet
