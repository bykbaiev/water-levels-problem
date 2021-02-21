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
): Array<{ index: number; square: number }> => {
    const stack: Array<[number, number]> = [[Infinity, -1]];

    return arr.reduce((accum, item, index) => {
        let popped: [number, number] | null = null;

        while (compare(item, stack[stack.length - 1][0])) {
            popped = <[number, number]>stack.pop();
        }

        const neighbour = popped
            ? {
                  index: popped[1],
                  square: index - stack[stack.length - 1][1] - 1,
              }
            : { index: -1, square: 0 };

        stack.push([item, index]);

        return [...accum, neighbour];
    }, []);
};

const getLeftNeighbours = (arr: Array<number>) =>
    getNeighours(arr, (curr, prev) => curr >= prev);

const getRightNeigbours = (arr: Array<number>) =>
    reverse(
        getNeighours(
            reverse(arr),
            (curr, prev) => curr > prev
        ).map((neighbour) =>
            neighbour.index === -1
                ? neighbour
                : { ...neighbour, index: arr.length - neighbour.index - 1 }
        )
    );

const toTree = (
    items: Array<TreeData>,
    leftNeighbours: Array<{ index: number; square: number }>,
    rightNeighbours: Array<{ index: number; square: number }>,
    index: number,
    isLeft: boolean | null
): Tree | null => {
    if (items.length === 0 || index === -1) {
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

    return {
        ...items[index],
        isLeft,
        leftSquare: leftNeighbours[index]?.square || 0,
        rightSquare: rightNeighbours[index]?.square || 0,
        left: toTree(
            items,
            leftNeighbours,
            rightNeighbours,
            leftNeighbours[index].index,
            true
        ),
        right: toTree(
            items,
            leftNeighbours,
            rightNeighbours,
            rightNeighbours[index].index,
            false
        ),
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

// O(N) - ?
const buildTree = (landscape: Array<number>): Tree => {
    const lefts = getLeftDeficites(landscape);
    const rights = getRightDeficites(landscape);

    const leftNeighbours = getLeftNeighbours(landscape);
    const rightNeighbours = getRightNeigbours(landscape);

    const { index } = landscape.reduce(
        (accum, height, index) => {
            if (height > accum.height) {
                return {
                    index,
                    height,
                };
            }

            return accum;
        },
        { index: -1, height: -1 }
    );

    return <Tree>toTree(
        landscape.map((height, index) => ({
            height,
            waterLeft: lefts[index],
            waterRight: rights[index],
            index,
        })),
        leftNeighbours,
        rightNeighbours,
        index,
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
