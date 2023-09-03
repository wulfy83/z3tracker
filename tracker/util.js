function hex(n) {
    return n.toString(16).toUpperCase();
}

function bit(flags, bit) {
    return (flags & (1 << bit)) !== 0;
}

function subarray(array, start, length) {
    return array.slice(start, start + length);
}

function frequencies(array) {
    const result = {};
    for (const element of array) {
        if (!result[element]) {
            result[element] = 0;
        }
        result[element]++;
    }
    return result;
}
