export function range(start, end) {
    const arr = new Array(end - start);
    for (var i = start; i < end; i++) arr[i - start] = i;
    return arr;
}
