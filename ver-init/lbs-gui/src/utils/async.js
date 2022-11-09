/* Helper function to async filter */
export async function filterAsync(arr, callback) {
    const fail = Symbol();
    return (await Promise.all(arr.map(async (v, i, a) => ((await callback(v, i, a)) ? v : fail)))).filter(
        (i) => i !== fail
    );
}

/* Helper function to async filter */
export async function forEachAsync(arr, callback) {
    await Promise.all(arr.map(async (v, i, a) => await callback(v, i, a)));
}
