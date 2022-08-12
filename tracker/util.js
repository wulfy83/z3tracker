function hex(n) {
    return n.toString(16).toUpperCase();
}

function bit(flags, bit) {
    return (flags & (1 << bit)) !== 0;
}

function subarray(array, start, length) {
    return array.slice(start, start + length);
}
