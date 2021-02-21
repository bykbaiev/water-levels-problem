export default [
    {
        landscape: [4, 1, 5, 2, 4, 9, 8, 7, 6, 8],
        time: 1,
        result: [0, 2.5, 0, 2.5, 0.5, 0, 0.375, 1.375, 2.375, 0.375],
    },
    {
        landscape: [1, 2, 3, 4, 1],
        time: 1,
        result: [2.16667, 1.16667, 0.16667, 0, 1.5],
    },
    {
        landscape: [1, 2, 3, 4, 1],
        time: 2,
        result: [3.2, 2.2, 1.2, 0.2, 3.2],
    },
    {
        landscape: [4, 1, 5, 2, 4, 9, 8, 7, 6, 8],
        time: 2,
        result: [1.8, 4.8, 0.8, 3.8, 1.8, 0, 1, 2, 3, 1],
    },
    {
        landscape: [3, 1, 6, 4, 8, 9],
        time: 1,
        result: [1, 3, 0, 2, 0, 0],
    },
    {
        landscape: [3, 1, 6, 4, 8, 9],
        time: 2,
        result: [3.5, 5.5, 0.5, 2.5, 0, 0],
    },
    {
        landscape: [3, 1, 6, 4, 8, 9],
        time: 3,
        result: [5, 7, 2, 4, 0, 0],
    },
] as Array<{ landscape: Array<number>; time: number; result: Array<number> }>;
