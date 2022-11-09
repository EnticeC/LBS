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
