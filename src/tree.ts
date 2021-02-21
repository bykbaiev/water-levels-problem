import { Segment } from './model';

type Tree = {
    height: number;
    index: number;
    waterLeft: number;
    waterRight: number;
    leftSquare: number;
    rightSquare: number;
    left: Tree | null;
    right: Tree | null;
    isLeft: boolean | null;
};

type TreeData = Omit<
    Tree,
    'left' | 'right' | 'leftSquare' | 'rightSquare' | 'isLeft'
>;

const reverse = <T>(arr: Array<T>): Array<T> => {
    return arr.reduce((accum, item) => [item, ...accum], []);
};

const getMaxLeftNeighbourIndices = (arr: Array<number>): Array<number> => {
    return arr.reduce(
        (accum, height, index) => {
            const indices = [...accum.indices, accum.maxIndex];

            if (accum.maxHeight <= height) {
                return {
                    indices,
                    maxHeight: height,
                    maxIndex: index,
                };
            }

            return {
                ...accum,
                indices,
            };
        },
        { indices: [], maxIndex: -1, maxHeight: -1 }
    ).indices;
};

const getMaxRightNeighbourIndices = (arr: Array<number>): Array<number> =>
    reverse(
        getMaxLeftNeighbourIndices(reverse(arr)).map((index) =>
            index === -1 ? -1 : arr.length - index - 1
        )
    );

const getLeftDeficites = (arr: Array<number>): Array<number> => {
    let stack = [[Infinity, -1]] as Array<[number, number]>;

    return arr.reduce((accum, height, index) => {
        const popped: Array<[number, number]> = [];

        while (height >= stack[stack.length - 1][0]) {
            popped.unshift(<[number, number]>stack.pop());
        }

        const deficit = popped.reduce((def, [h, i], j) => {
            if (j === 0) {
                return (
                    def +
                    accum[i] +
                    (height - h) * (i - stack[stack.length - 1][1])
                );
            }

            return def + accum[i] + (height - h) * (i - popped[j - 1][1]);
        }, 0);

        stack.push([height, index]);

        return [...accum, deficit];
    }, []);
};

const getRightDeficites = (arr: Array<number>): Array<number> =>
    reverse(getLeftDeficites(reverse(arr)));

const getNeighours = (
    arr: Array<number>,
    compare: (curr: number, prev: number) => boolean
): Array<number> => {
    const stack: Array<[number, number]> = [[Infinity, -1]];

    return arr.reduce((accum, item, index) => {
        let popped: [number, number] | null = null;

        while (compare(item, stack[stack.length - 1][0])) {
            popped = <[number, number]>stack.pop();
        }

        stack.push([item, index]);

        return [...accum, popped ? popped[1] : -1];
    }, []);
};

const getLeftNeighbours = (arr: Array<number>) =>
    getNeighours(arr, (curr, prev) => curr >= prev);

const getRightNeigbours = (arr: Array<number>) =>
    reverse(
        getNeighours(reverse(arr), (curr, prev) => curr > prev).map((index) =>
            index === -1 ? -1 : arr.length - index - 1
        )
    );

const toTree = (
    items: Array<TreeData>,
    isLeft: boolean | null
): Tree | null => {
    if (items.length === 0) {
        return null;
    }

    if (items.length === 1) {
        const [single] = items;
        return {
            ...single,
            isLeft,
            left: null,
            right: null,
            leftSquare: 0,
            rightSquare: 0,
        };
    }

    // const heights = items.map(({ height }) => height);

    // const leftNeighbours = getLeftNeighbours(heights);
    // const rightNeighbours = getRightNeigbours(heights);

    const maxIndex = items.reduce(
        (accum, item, index) => {
            if (item.height > accum.height) {
                return {
                    index,
                    height: item.height,
                };
            }

            return accum;
        },
        { index: -1, height: -1 }
    ).index;
    const max = items[maxIndex];

    return {
        ...max,
        isLeft,
        left: toTree(items.slice(0, maxIndex), true),
        right: toTree(items.slice(maxIndex + 1), false),
        leftSquare: maxIndex,
        rightSquare: items.length - maxIndex - 1,
    };
};

const treeToArray = (
    tree: Tree | null
): Array<{ height: number; index: number }> => {
    if (!tree) {
        return [];
    }

    return [
        { height: tree.height, index: tree.index },
        ...treeToArray(tree.left),
        ...treeToArray(tree.right),
    ].sort((left, right) => left.index - right.index);
};

const buildTree = (landscape: Array<number>): Tree => {
    const maxLeft = getMaxLeftNeighbourIndices(landscape);
    const maxRight = getMaxRightNeighbourIndices(landscape);

    const lefts = getLeftDeficites(landscape);
    const rights = getRightDeficites(landscape);

    return <Tree>toTree(
        landscape.map((height, index) => ({
            height,
            waterLeft: lefts[index],
            waterRight: rights[index],
            index,
        })),
        null
    );
};

const setHeight = (tree: Tree | null, height: number): Tree | null => {
    if (!tree) {
        return tree;
    }

    return {
        ...tree,
        height,
        left: setHeight(<Tree>tree.left, height),
        right: setHeight(<Tree>tree.right, height),
    };
};

const fillWithWater = (tree: Tree | null, inflow: number): Tree | null => {
    if (!tree) {
        return null;
    }

    if (inflow >= tree.waterLeft + tree.waterRight) {
        return setHeight(
            tree,
            tree.height +
                (inflow - tree.waterLeft - tree.waterRight) /
                    (tree.leftSquare + tree.rightSquare + 1)
        );
    }

    if (tree.waterLeft >= inflow / 2 && tree.waterRight >= inflow / 2) {
        return {
            ...tree,
            left: fillWithWater(tree.left, inflow / 2),
            right: fillWithWater(tree.right, inflow / 2),
        };
    }

    if (tree.waterLeft < inflow / 2) {
        return {
            ...tree,
            left: setHeight(tree.left, tree.height),
            right: fillWithWater(tree.right, inflow - tree.waterLeft),
        };
    }

    return {
        ...tree,
        left: fillWithWater(tree.left, inflow - tree.waterRight),
        right: setHeight(tree.right, tree.height),
    };
};

const fillWithWater1 = (
    tree: Tree | null,
    inflow: number,
    time: number
): Tree | null => {
    if (!tree) {
        return null;
    }

    const totalInflow = time + inflow;

    const waterAddedLeft = tree.leftSquare * time;
    const waterAddedRight = tree.rightSquare * time;

    const isLeft = tree.isLeft === true;
    const isRight = tree.isLeft === false;
    const isRoot = !tree.isLeft && !isRight;

    const isEnoughForRoot =
        isRoot &&
        time + waterAddedLeft + waterAddedRight >=
            tree.waterLeft + tree.waterRight;

    const isEnoughForLeftChild =
        isLeft &&
        time + waterAddedLeft + waterAddedRight >=
            tree.waterLeft + (tree.waterRight - inflow);

    const isEnoughForRightChild =
        isRight &&
        time + waterAddedLeft + waterAddedRight >=
            tree.waterLeft - inflow + tree.waterRight;

    // ENOUGH FOR BOTH SUBTREES

    if (isEnoughForRoot || isEnoughForLeftChild || isEnoughForRightChild) {
        return setHeight(
            tree,
            tree.height +
                (totalInflow +
                    waterAddedRight +
                    waterAddedLeft -
                    tree.waterLeft -
                    tree.waterRight) /
                    (tree.leftSquare + tree.rightSquare + 1)
        );
    }

    // NOT ENOUGH

    if (
        isRoot &&
        tree.waterLeft - waterAddedLeft >= time / 2 &&
        tree.waterRight - waterAddedRight >= time / 2
    ) {
        return {
            ...tree,
            left: fillWithWater1(tree.left, time / 2, time),
            right: fillWithWater1(tree.right, time / 2, time),
        };
    }

    if (
        isLeft &&
        tree.waterLeft - waterAddedLeft >= time / 2 &&
        tree.waterRight - inflow - waterAddedRight >= time / 2
    ) {
        return {
            ...tree,
            left: fillWithWater1(tree.left, time / 2, time),
            right: fillWithWater1(tree.right, inflow + time / 2, time),
        };
    }

    if (
        isRight &&
        tree.waterLeft - inflow - waterAddedLeft >= time / 2 &&
        tree.waterRight - waterAddedRight >= time / 2
    ) {
        return {
            ...tree,
            left: fillWithWater1(tree.left, inflow + time / 2, time),
            right: fillWithWater1(tree.right, time / 2, time),
        };
    }

    // IT'S ENOUGH FOR ONE SUBTREE

    if (isRoot && tree.waterLeft - waterAddedLeft < time / 2) {
        return {
            ...tree,
            left: setHeight(tree.left, tree.height),
            right: fillWithWater1(
                tree.right,
                time - (tree.waterLeft - waterAddedLeft),
                time
            ),
        };
    }

    if (isRoot && tree.waterRight - waterAddedRight < time / 2) {
        return {
            ...tree,
            left: fillWithWater1(
                tree.left,
                time - (tree.waterRight - waterAddedRight),
                time
            ),
            right: setHeight(tree.right, tree.height),
        };
    }

    if (isLeft && tree.waterLeft - waterAddedLeft < time / 2) {
        return {
            ...tree,
            left: setHeight(tree.left, tree.height),
            right: fillWithWater1(
                tree.right,
                totalInflow - (tree.waterLeft - waterAddedLeft),
                time
            ),
        };
    }

    if (isLeft && tree.waterRight - (inflow + waterAddedRight) < time / 2) {
        return {
            ...tree,
            left: fillWithWater1(
                tree.left,
                totalInflow - (tree.waterRight - waterAddedRight),
                time
            ),
            right: setHeight(tree.right, tree.height),
        };
    }

    if (isRight && tree.waterRight - waterAddedRight < time / 2) {
        return {
            ...tree,
            right: setHeight(tree.right, tree.height),
            left: fillWithWater1(
                tree.left,
                totalInflow - (tree.waterRight - waterAddedRight),
                time
            ),
        };
    }

    return {
        ...tree,
        left: setHeight(tree.left, tree.height),
        right: fillWithWater1(
            tree.left,
            totalInflow - (tree.waterLeft - waterAddedLeft),
            time
        ),
    };
};

export const getTreeWaterLevels = (
    landscape: Array<number>,
    time: number
): Array<number> => {
    if (landscape.length === 0) {
        return [];
    }

    const tree = buildTree(landscape);

    const withWater = fillWithWater1(tree, 0, time);

    return treeToArray(withWater).map(
        ({ height, index }) => height - landscape[index]
    );
};
