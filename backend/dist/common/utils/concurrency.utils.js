"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitConcurrency = limitConcurrency;
exports.pMap = pMap;
async function limitConcurrency(tasks, limit) {
    const results = [];
    const executing = [];
    for (let i = 0; i < tasks.length; i++) {
        const p = tasks[i]().then((result) => {
            results[i] = result;
        });
        executing.push(p);
        if (executing.length >= limit) {
            await Promise.race(executing);
            for (let j = executing.length - 1; j >= 0; j--) {
            }
        }
    }
    await Promise.all(executing);
    return results;
}
async function pMap(items, mapper, concurrency) {
    const results = new Array(items.length);
    let index = 0;
    const worker = async () => {
        while (index < items.length) {
            const i = index++;
            results[i] = await mapper(items[i], i);
        }
    };
    const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker);
    await Promise.all(workers);
    return results;
}
//# sourceMappingURL=concurrency.utils.js.map