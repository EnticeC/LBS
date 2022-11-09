import React from 'react';

export function getInitialState(name, defaultValue) {
    try {
        console.log(`Getting ${name} history from local storage...`);
        const storedValue = localStorage.getItem(name);
        if (storedValue !== null) {
            const parsed = JSON.parse(storedValue, (key, value) => {
                return value;
            });
            if (!(Array.isArray(parsed) && parsed.length === 0)) {
                console.log(`Getting ${name} history from local storage...done`);
                return parsed;
            }
        }
        console.log(`Getting ${name} history from local storage...empty; using default value instead`);
        localStorage.setItem(name, JSON.stringify(defaultValue));
        return defaultValue;
    } catch {
        console.log(`Getting ${name} history from local storage...failed; using default value instead`);
        return defaultValue;
    }
}

export default (name, defaultValue) => {
    const [value, setValue] = React.useState(() => getInitialState(name, defaultValue));

    React.useEffect(() => {
        try {
            localStorage.setItem(name, JSON.stringify(value));
        } catch {}
    }, [value]);

    return [value, setValue];
};
