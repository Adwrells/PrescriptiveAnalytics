
const fs = require('fs');

const solveKnapsack = (items, capacity) => {
    const n = items.length;
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
    const pathTrace = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(false));

    for (let i = 1; i <= n; i++) {
        const item = items[i - 1];
        for (let w = 0; w <= capacity; w++) {
            if (item.weight <= w) {
                const includeValue = item.value + dp[i - 1][w - item.weight];
                const excludeValue = dp[i - 1][w];

                if (includeValue > excludeValue) {
                    dp[i][w] = includeValue;
                    pathTrace[i][w] = true;
                } else {
                    dp[i][w] = excludeValue;
                    pathTrace[i][w] = false;
                }
            } else {
                dp[i][w] = dp[i - 1][w];
                pathTrace[i][w] = false;
            }
        }
    }

    return dp[n][capacity];
};

const items = [
    { id: 1, weight: 12, value: 60 },
    { id: 2, weight: 20, value: 100 },
    { id: 3, weight: 15, value: 75 },
    { id: 4, weight: 10, value: 45 },
    { id: 5, weight: 18, value: 80 },
    { id: 6, weight: 25, value: 110 },
    { id: 7, weight: 9, value: 40 },
    { id: 8, weight: 30, value: 150 }
];

const capacity = 70;
const result = solveKnapsack(items, capacity);

const items149 = [
    ...items.slice(0, 7),
    { id: 8, weight: 30, value: 149 }
];
const result149 = solveKnapsack(items149, capacity);

const output = `Result with 150: ${result}\nResult with 149: ${result149}`;
fs.writeFileSync('output.txt', output);
