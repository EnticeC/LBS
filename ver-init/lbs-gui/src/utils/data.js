export function convertJsonData(original, originalColumns) {
    return original.map((o, index) => {
        const n = {};
        n['key'] = index;
        originalColumns.forEach((col, i) => {
            if (!col.children) {
                n[col.dataIndex] = o[col.title];
            } else {
                col.children.forEach(child => {
                    n[child.dataIndex] = o[child.title];
                });
            }
        });
        return n;
    });
}


/**
 * Convert array of objects with old keys to array of objects with new keys.
 */
export function convertArrayData(original, originalKeys, newKeys) {
    return original.map((o) => {
        const n = {};
        originalKeys.forEach((v, i) => {
            n[newKeys[i]] = o[v];
        });
        return n;
    });
}

/**
 * Check if the machine is capable to process job.
 *
 * @return 0 if the machine is capable; 1 if the operation is incompatible; 2 if
 * the calibre is incompatible; 3 if the length is incompatible; 4 if machine is
 * ``探伤A线'' and the job is not peeled
 */
export function capable(machine, job) {
    // Check if operation is ok
    if (
        !['TS1(A)', 'TS1(B)', 'TS1(C)', 'TS1(D)', 'TS1(E)'].includes(job.operation) &&
        !machine.op_abbrevs
            .split(',')
            .map((s) => s.trim())
            .includes(job.operation)
    )
        return 1;

    // Check if calibre is ok
    let size_ok = false;
    if (machine.calibre_min === undefined) size_ok = true;
    else size_ok = job.calibre >= machine.calibre_min && job.calibre <= machine.calibre_max;
    if (!size_ok) return 2;

    // Check if length is ok
    let length_ok = false;
    if (machine.length_min === undefined) length_ok = true;
    else length_ok = job.length >= machine.length_min && job.length <= machine.length_max;
    if (!length_ok) return 3;

    /* For A-line, only peeled steel can be produced */
    if (machine.name === '探伤A线' && !job.is_peeled) return 4;

    return 0;
}

/**
 * Check if job is produceable given machine set.
 *
 * @return 0 if the machine is capable; 1 if the operation is incompatible; 2 if
 * the calibre is incompatible; 3 if the length is incompatible; 4 if machine is
 * ``探伤A线'' and the job is not peeled
 */
export function jobProduceable(machines, job) {
    // const _machines = machines.map((m) => getMachineWithParams(m));
    const capabilities = machines.map((m) => capable(m, job));
    if (capabilities.includes(0)) return 0;
    return Math.max(...capabilities);
}
