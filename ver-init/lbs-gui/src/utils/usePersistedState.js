import React from 'react';
// import { datetime_fields, date_fields } from '../settings/data-headers';
import { parseDate } from './datetime';

export function getInitialState(name, defaultValue) {
    try {
        console.log(`Getting ${name} history from local storage...`);
        const storedValue = localStorage.getItem(name);
        if (storedValue !== null) {
            const parsed = JSON.parse(storedValue, (key, value) => {
                // if (date_fields.includes(key) || datetime_fields.includes(key)) {
                //     try {
                //         const date = parseDate(value);
                //         if (date) return date;
                //         else return value;
                //     } catch {
                //         return value;
                //     }
                // }
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
