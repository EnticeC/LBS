import XLSX from 'xlsx';

/**
 * There is a bug when reading xlsx dates involving time zones. When reading
 * xlsx into json, there will be a loss (43s in China (GMT+8)); when converting
 * json to xlsx, there will be an excess.
 */
function correctTimeJson(obs, offset) {
    obs.forEach((r) => {
        Object.values(r).forEach((v) => {
            if (v instanceof Date) {
                v.setSeconds(v.getSeconds() + offset);
            }
        });
    });
}

/**
 * Read .xlsx file to an array of objects. The object keys will be the cell
 * contents of the header row.
 *
 * @param f Blob type representing the content of the file
 * @param callback function to call after obtaining the result
 */
export function readXlsxToJson(f, callback) {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        const data = new Uint8Array(ev.target.result);
        const workbook = XLSX.read(data, { cellDates: true, type: 'array' });
        const sheet_name_list = workbook.SheetNames;
        const obs = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]); /* Time incorrect */
        correctTimeJson(obs, 43);

        callback(obs);
    };
    reader.readAsArrayBuffer(f);
}

/**
 * Read .xlsx file to an array of arrays.
 *
 * @param f Blob type representing the content of the file
 * @param callback function to call after obtaining the result
 */
export function readXlsxToAoa(f, callback) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        const data = new Uint8Array(ev.target.result);
        const workbook = XLSX.read(data, { cellDates: true, type: 'array' });
        const sheet_name_list = workbook.SheetNames;
        const obs = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
            header: 1,
        });

        callback(obs);
    };
    reader.readAsArrayBuffer(f);
}
