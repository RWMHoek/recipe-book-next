import { getTargetValue } from '@/lib/utils';
import React from 'react'


function Field({ type, change, ...rest }: any) {

    const {options, value} = rest;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(value, options);
        change(getTargetValue(e.target), e.target.name, options);
    }
    
    return <input type={type} value={value} onChange={handleChange} {...rest} />;
}

export default Field;
