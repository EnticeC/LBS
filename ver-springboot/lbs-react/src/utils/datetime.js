/**
 * Parse string into date object. If format is given, it is used to parse the
 * string; otherwise several common formats will be tried.
 *
 * @param dateString string representing a date
 * @param format? (optional) format of the date string
 * @return date object
 */
export function parseDate(dateString, format) {
    if (dateString instanceof Date) return dateString;
    if (format) {
        let reggie;
        if (format === 'yyyy-MM-dd HH:mm:ss') {
            reggie = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
            const result = reggie.exec(dateString);
            if (result) {
                const [, year, month, day, hours, minutes, seconds] = result;
                return new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
            }
        } else if (format === 'yyyyMMddHHmmss') {
            reggie = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/;
            const result = reggie.exec(dateString);
            if (result) {
                const [, year, month, day, hours, minutes, seconds] = result;
                return new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
            }
        } else if (format === 'yyyy-MM-ddTHH:mm') {
            reggie = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
            const result = reggie.exec(dateString);
            if (result) {
                const [, year, month, day, hours, minutes] = result;
                return new Date(+year, +month - 1, +day, +hours, +minutes);
            }
        } else if (format === 'yyyy-MM-dd') {
            reggie = /^(\d{4})-(\d{2})-(\d{2})$/;
            const result = reggie.exec(dateString);
            if (result) {
                const [, year, month, day] = result;
                return new Date(+year, +month - 1, +day);
            }
        } else if (format === 'yyyyMMdd') {
            reggie = /^(\d{4})(\d{2})(\d{2})$/;
            const result = reggie.exec(dateString);
            if (result) {
                const [, year, month, day] = result;
                return new Date(+year, +month - 1, +day);
            }
        } /*  else { */
        /*     throw `Format (${format}) is not supported. Only "yyyy-MM-dd HH:mm:ss", "yyyyMMddHHmmss" and "yyyy-MM-ddTHH:mm" formats are supported.`; */
        /* } */
    } else {
        let reggies = [
            /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
            /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,
        ];
        let date = null;
        reggies.forEach((reggie) => {
            const matches = reggie.exec(dateString);
            if (matches === null) return;
            const [, year, month, day, hours, minutes, seconds] = matches;
            date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
        });
        if (date === null) {
            reggies = [/^(\d{4})-(\d{2})-(\d{2})$/, /^(\d{4})(\d{2})(\d{2})$/];
            reggies.forEach((reggie) => {
                const matches = reggie.exec(dateString);
                if (matches === null) return;
                const [, year, month, day] = matches;
                date = new Date(+year, +month - 1, +day);
            });
        }
        if (date === null) {
            const reggie = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
            const matches = reggie.exec(dateString);
            /* if (matches === null) { */
            /*     throw `Cannot parse date string: ${dateString}. Only "yyyy-MM-dd HH:mm:ss", "yyyyMMddHHmmss" and "yyyy-MM-ddTHH:mm" formats are supported.`; */
            /* } */
            if (matches) {
                const [, year, month, day, hours, minutes] = matches;
                date = new Date(+year, +month - 1, +day, +hours, +minutes);
            }
        }
        return date;
    }
    return null;
}

/**
 * Convert a date object to a string representing a date in the format
 * ``YYYY-MM-dd''.
 *
 * @param date date object
 * @return string representing the date
 */
export function formatDate(date) {
    if (typeof date === 'string') return date;
    try {
        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        let year = '' + date.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        /* YYYY-MM-dd */
        return [year, month, day].join('-');
    } catch (e) {
        return '';
    }
}

/**
 * Convert a date object to a string representing a date time in the format
 * ``YYYY-MM-dd HH:mm:ss''.
 *
 * @param date date object
 * @return string representing the date time
 */
export function formatDatetime(date) {
    if (typeof date === 'string') return date;
    try {
        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        let year = '' + date.getFullYear();
        let hour = '' + date.getHours();
        let min = '' + date.getMinutes();
        let sec = '' + date.getSeconds();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hour.length < 2) hour = '0' + hour;
        if (min.length < 2) min = '0' + min;
        if (sec.length < 2) sec = '0' + sec;

        /* yyyy-MM-dd HH:mm:ss */
        return [year, month, day].join('-') + ' ' + [hour, min, sec].join(':');
    } catch (e) {
        return '';
    }

    /* yyyyMMddHHmmss */
    /* return [year, month, day, hour, min, sec].join(''); */
}

/**
 * Convert a date object to a string representing a date time in the format
 * ``MM-dd HH:mm''.
 *
 * @param date date object
 * @return string representing the date time
 */
export function formatDatetimeSansYearSec(date) {
    if (typeof date === 'string') return date;
    try {
        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        let hour = '' + date.getHours();
        let min = '' + date.getMinutes();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        if (hour.length < 2) hour = '0' + hour;
        if (min.length < 2) min = '0' + min;

        /* MM-dd HH:mm */
        return [month, day].join('-') + ' ' + [hour, min].join(':');
    } catch (e) {
        return '';
    }

    /* yyyyMMddHHmmss */
    /* return [year, month, day, hour, min, sec].join(''); */
}

/**
 * Convert a date object to a string representing a date time in the format
 * ``MM-dd''.
 *
 * @param date date object
 * @return string representing the date time
 */
export function formatDateSansYear(date) {
    if (typeof date === 'string') return date;
    try {
        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        /* MM-dd */
        return [month, day].join('-');
    } catch (e) {
        return '';
    }

    /* yyyyMMddHHmmss */
    /* return [year, month, day, hour, min, sec].join(''); */
}

/**
 * Convert a date object to a string representing a date time in the format
 * ``YYYY-MM-ddTHH:mm'', which is the datetime format in an HTML datetime-local
 * input element.
 *
 * @param date date object
 * @return string representing the date time
 */
export function formatDatetimeForInput(date) {
    let date1;
    if (date.getSeconds() !== 0) {
        date1 = new Date(date.valueOf() + 60000);
    } else {
        date1 = new Date(date);
    }
    let month = '' + (date1.getMonth() + 1);
    let day = '' + date1.getDate();
    let year = '' + date1.getFullYear();
    let hour = '' + date1.getHours();
    let min = '' + date1.getMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (min.length < 2) min = '0' + min;

    return [year, month, day].join('-') + 'T' + [hour, min].join(':');
}

/**
 * Get number of days in month.
 *
 * Month here is 1-indexed (January is 1, February is 2, etc). This is
 * because we're using 0 as the day so that it returns the last day
 * of the last month, so you have to add 1 to the month number
 * so it returns the correct amount of days
 */
export function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

/**
 * There is a bug when reading xlsx dates involving time zones. When reading
 * xlsx into json, there will be a loss (43s in China (GMT+8)); when converting
 * json to xlsx, there will be an excess.
 */
export function correctTimeJson(rowObs, offset) {
    rowObs.forEach((r) => {
        Object.values(r).forEach((v) => {
            if (v instanceof Date) {
                v.setSeconds(v.getSeconds() + offset);
            }
        });
    });
}

/**
 * There is a bug when reading xlsx dates involving time zones. When reading
 * xlsx into sheet, there will be a loss (43s in China (GMT+8)); when converting
 * sheet to xlsx, there will be an excess.
 */
export function correctTimeSheet(sheet, offset) {
    Object.values(sheet).forEach((cell) => {
        if (cell.z === 'yyyy-MM-dd HH:mm:ss') {
            cell.v += offset / (24 * 3600);
        }
    });
}
