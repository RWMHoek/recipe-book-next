export function getData(key: string, data: {[key: string]: any}): any {
    
    const keys = key.split(".");

    keys.forEach(k => {
        data = data[k];
    });

    return data;
}

export {};