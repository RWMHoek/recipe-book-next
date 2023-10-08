import React, { PropsWithChildren, useState } from 'react';

type State = {
    [key: string]: any
}

interface FormProps {
    initialState: State,
    onSubmit: (values: State) => void
}

function Form({initialState, onSubmit, children}: PropsWithChildren<FormProps>) {

    const [ state, setState ] = useState({
        values: initialState,
        touched: {},
        errors: {}
    });

    function handleChange(value: any, name: string, options?: any) {
        setState(prevState => ({
            ...prevState,
            values: {
                ...prevState.values,
                [name]: value
            }
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit(state.values);
    }


    
    return (
        <form onSubmit={handleSubmit}>
            {
                React.Children.map(children, (child) => {
                    
                    if (child === null || child === undefined) return;
                    
                    if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') return child;
                    
                    if (React.isValidElement<any>(child)) {
                        return React.cloneElement(child, {
                            change: handleChange,
                            value: state.values[child.props.name]
                        });
                    }
                    
                    return <div> Unknown Element </div>
                })
            }
        </form>
    );
    
    // function getValue(name: string): any {
    //     if (name === undefined) return;
    //     return name.split(".").reduce((prev, curr) => prev[curr], {...state.values});
    // }
    
    // function setValue(name: string, value: any): any {
    //     return name.split(".").reverse().reduce((prev, curr) => ({[curr]: prev}), value);
    // }
}

export default Form;
    