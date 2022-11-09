import { ipcRenderer } from 'electron';
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

/**
  There is a bug when reading xlsx dates involving time zones. When reading 
  xlsx into sheet, there will be a loss (43s in China (GMT+8)); when converting
  sheet to xlsx, there will be an excess.
*/
function correctTimeSheet(sheet, offset) {
    Object.values(sheet).forEach((cell) => {
        if (cell.z === 'yyyy-MM-dd HH:mm:ss') {
            cell.v += offset / (24 * 3600);
        }
    });
}

/**
 * Write array of objects to .xlsx file. The header row are those given in the
 * argument ``headers''
 *
 * @param obs array of objects to write to .xlsx file
 * @param fname path of the .xlsx file
 * @param headers the intended headers of the result table
 */
export function downloadJsonToXlsx(obs, fname, headers) {
    // if (obs.length === 0) return;
    let obs1 = obs;
    if (headers) {
        obs1 = obs.map((ob) => {
            const ob1 = {};
            for (const header of headers) {
                ob1[header] = ob[header];
            }
            return ob1;
        });
    }
    const sheet = XLSX.utils.json_to_sheet(obs1, {
        dateNF: 'yyyy-MM-dd HH:mm:ss',
    });
    correctTimeSheet(sheet, -43);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Sheet-1');

    ipcRenderer.invoke('dialog-save-xlsx', fname).then((result) => {
        if (!result.canceled) {
            XLSX.writeFile(book, result.filePath);
        }
    });
}

/**
 * Write schedule plan to .xlsx file. The header row are those given in the
 * argument ``headers''. A sheet will be created for each machine, containing
 * the schedule on it.
 *
 * @param obs array of objects to write to .xlsx file
 * @param fname path of the .xlsx file
 * @param headers the intended headers of the result table
 */
export function downloadScheduleToXlsx(schedule, fname, headers) {
    // if (obs.length === 0) return;

    let obs1 = schedule;
    if (headers) {
        obs1 = schedule.map((ob) => {
            const ob1 = {};
            for (const header of headers) {
                ob1[header] = ob[header];
            }
            return ob1;
        });
    }

    const machineScheduleMap = new Map();
    obs1.forEach((s) => {
        const m = s['预定生产设备名称'];
        if (machineScheduleMap.has(m)) {
            machineScheduleMap.get(m).push(s);
        } else {
            machineScheduleMap.set(m, [s]);
        }
    });

    const book = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(obs1, {
        dateNF: 'yyyy-MM-dd HH:mm:ss',
    });
    correctTimeSheet(sheet, -43);
    XLSX.utils.book_append_sheet(book, sheet, '全部');

    machineScheduleMap.forEach((v, k) => {
        const sheet = XLSX.utils.json_to_sheet(v, {
            dateNF: 'yyyy-MM-dd HH:mm:ss',
        });
        correctTimeSheet(sheet, -43);
        XLSX.utils.book_append_sheet(book, sheet, k);
    });

    ipcRenderer.invoke('dialog-save-xlsx', fname).then((result) => {
        if (!result.canceled) {
            XLSX.writeFile(book, result.filePath);
        }
    });
}
