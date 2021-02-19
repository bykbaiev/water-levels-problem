import { Segment } from './model';

const subtract = (a: number, b: number) => Number((a - b).toFixed(5));

const WATER_PER_TIME = 1;

const getWhole = (landscape: Array<Segment>): number => {
    return landscape.reduce(
        (accum: number, { height, water }: Segment) => accum + height + water,
        0
    );
};

const howMuch = (landscape: Array<Segment>, targetHeight: number): number => {
    return subtract(targetHeight * landscape.length, getWhole(landscape));
};

const spreadWaterLevel = (landscape: Array<Segment>): Array<Segment> => {
    if (landscape.length < 2) {
        return landscape;
    }

    const max = Math.max(...landscape.map(({ height }) => height));

    const square = max * landscape.length;

    const whole = getWhole(landscape);

    if (square <= whole) {
        const level = whole / landscape.length;

        return landscape.map(({ height }) => ({
            height,
            water: subtract(level, height),
        }));
    }

    const highestSegments = landscape.filter(
        ({ height }) => height === max
    );

    const maxWaterLevel = Math.max(
        ...highestSegments.map(({ water }) => water)
    );

    const index = landscape.findIndex(
        ({ height, water }) => height === max && water === maxWaterLevel
    );

    const maxSegment = landscape[index];

    const left = landscape.slice(0, index);

    const right = landscape.slice(index + 1);

    const leftNeeded = howMuch(left, max);

    const rightNeeded = howMuch(right, max);

    const halfOfWater = maxWaterLevel / 2;

    if (leftNeeded >= halfOfWater && rightNeeded >= halfOfWater) {
        return [
            ...spreadWaterLevel(
                left.map((v, i) =>
                    i === left.length - 1
                        ? { height: v.height, water: v.water + halfOfWater }
                        : v
                )
            ),
            { height: maxSegment.height, water: 0 },
            ...spreadWaterLevel(
                right.map((v, i) =>
                    i === 0
                        ? { height: v.height, water: v.water + halfOfWater }
                        : v
                )
            ),
        ];
    }

    if (leftNeeded < halfOfWater) {
        return [
            ...spreadWaterLevel(
                left.map((v, i) =>
                    i === left.length - 1
                        ? { height: v.height, water: v.water + leftNeeded }
                        : v
                )
            ),
            { height: maxSegment.height, water: 0 },
            ...spreadWaterLevel(
                right.map((v, i) =>
                    i === 0
                        ? {
                              height: v.height,
                              water: subtract(v.water + maxWaterLevel, leftNeeded),
                          }
                        : v
                )
            ),
        ];
    }

    return [
        ...spreadWaterLevel(
            left.map((v, i) =>
                i === left.length - 1
                    ? {
                          height: v.height,
                          water: subtract(v.water + maxWaterLevel, rightNeeded),
                      }
                    : v
            )
        ),
        { height: maxSegment.height, water: 0 },
        ...spreadWaterLevel(
            right.map((v, i) =>
                i === 0 ? { height: v.height, water: v.water + rightNeeded } : v
            )
        ),
    ];
};

export const getWaterLevels = (landscape: Array<Segment>, time: number): Array<Segment> => {
    const diff = time * WATER_PER_TIME;
    return spreadWaterLevel(
        landscape.map(({ height, water }) => ({ height, water: water + diff }))
    );
};
