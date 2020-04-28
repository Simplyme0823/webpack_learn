function total(n) {
    let a = 1, b = 1
    for (let i = 0; i < n; i++) {
        [a, b] = [b, (a + b) % 1000000007]
    }
    return a;
}
console.log(total(9))