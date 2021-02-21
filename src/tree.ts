type Tree = {
    height: number;
    index: number;
    leftDeficit: number;
    rightDeficit: number;
    leftSquare: number;
    rightSquare: number;
    left: Tree | null;
    right: Tree | null;
    isLeftChild: boolean | null;
};

type TreeData = Omit<
    Tree,
    'left' | 'right' | 'leftSquare' | 'rightSquare' | 'isLeftChild'
>;

const PER_HOUR = 1;

// O(N)
const reverse = <T>(arr: Array<T>): Array<T> => {
    return arr.reduce((accum, item) => [item, ...accum], []);
};

type IndexedHeight = {
    height: number;
    index: number;
};

type Square = {
    square: number;
    index: number;
};

// O(N)
const getLeftDeficites = (landscape: Array<number>): Array<number> => {
    const stack: Array<IndexedHeight> = [{ height: Infinity, index: -1 }];

    return landscape.reduce((deficites, height, index) => {
        const popped: Array<IndexedHeight> = [];

        while (height >= stack[stack.length - 1].height) {
            popped.unshift(<IndexedHeight>stack.pop());
        }

        const deficit = popped.reduce((accum, { height: h, index: i }, j) => {
            const left = j === 0 ? stack[stack.length - 1] : popped[j - 1];
            const diffInLevels = (height - h) * (i - left.index);

            return accum + deficites[i] + diffInLevels;
        }, 0);

        stack.push({ height, index });

        return [...deficites, deficit];
    }, []);
};

const getRightDeficites = (landscape: Array<number>): Array<number> =>
    reverse(getLeftDeficites(reverse(landscape)));

// O(N)
const getNeighours = (
    landscape: Array<number>,
    compare: (curr: number, prev: number) => boolean
): Array<Square> => {
    const stack: Array<IndexedHeight> = [{ height: Infinity, index: -1 }];

    return landscape.reduce((neighbours, height, index) => {
        let popped: IndexedHeight | null = null;

        while (compare(height, stack[stack.length - 1].height)) {
            popped = <IndexedHeight>stack.pop();
        }

        const neighbour = popped
            ? {
                  index: popped.index,
                  square: index - stack[stack.length - 1].index - 1,
              }
            : { index: -1, square: 0 };

        stack.push({ height, index });

        return [...neighbours, neighbour];
    }, []);
};

const getLeftNeighbours = (landscape: Array<number>) =>
    getNeighours(landscape, (curr, prev) => curr >= prev);

const getRightNeigbours = (landscape: Array<number>) =>
    reverse(
        getNeighours(reverse(landscape), (curr, prev) => curr > prev).map(
            (neighbour) =>
                neighbour.index === -1
                    ? neighbour
                    : {
                          ...neighbour,
                          index: landscape.length - neighbour.index - 1,
                      }
        )
    );

// O(N) - just walking through the Tree
const toTree = (
    landscape: Array<TreeData>,
    leftNeighbours: Array<Square>,
    rightNeighbours: Array<Square>,
    index: number,
    isLeftChild: boolean | null
): Tree | null => {
    if (landscape.length === 0 || index === -1) {
        return null;
    }

    if (landscape.length === 1) {
        const [single] = landscape;
        return {
            ...single,
            isLeftChild,
            left: null,
            right: null,
            leftSquare: 0,
            rightSquare: 0,
        };
    }

    const leftNeighbour = leftNeighbours[index];
    const rightNeighbour = rightNeighbours[index];

    return {
        ...landscape[index],
        isLeftChild,
        leftSquare: leftNeighbour?.square || 0,
        rightSquare: rightNeighbour?.square || 0,
        left: toTree(
            landscape,
            leftNeighbours,
            rightNeighbours,
            leftNeighbour?.index ?? -1,
            true
        ),
        right: toTree(
            landscape,
            leftNeighbours,
            rightNeighbours,
            rightNeighbour?.index ?? -1,
            false
        ),
    };
};

// O(N)
const treeToArray = (tree: Tree | null): Array<number> => {
    if (!tree) {
        return [];
    }

    return [...treeToArray(tree.left), tree.height, ...treeToArray(tree.right)];
};

// O(N)
const buildTree = (landscape: Array<number>): Tree => {
    if (landscape.length === 1) {
        const emptyNeighbours = [{ index: -1, square: 0 }];

        return <Tree>toTree(
            landscape.map((height, index) => ({
                height,
                leftDeficit: 0,
                rightDeficit: 0,
                index,
            })),
            emptyNeighbours,
            emptyNeighbours,
            0,
            null
        );
    }

    const lefts = getLeftDeficites(landscape);
    const rights = getRightDeficites(landscape);

    const leftNeighbours = getLeftNeighbours(landscape);
    const rightNeighbours = getRightNeigbours(landscape);

    const { index } = landscape.reduce(
        (accum, height, index) => {
            const leftNeighbourIndex = leftNeighbours[index].index;
            const rightNeighbourIndex = rightNeighbours[index].index;
            if (
                height >= accum.height &&
                (leftNeighbourIndex !== -1 || rightNeighbourIndex !== -1)
            ) {
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
            leftDeficit: lefts[index],
            rightDeficit: rights[index],
            index,
        })),
        leftNeighbours,
        rightNeighbours,
        index,
        null
    );
};

// O(N)
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

// O(N)
const distributeWater = (
    tree: Tree | null,
    inflow: number,
    time: number
): Tree | null => {
    if (!tree) {
        return null;
    }

    const waterLevel = time * PER_HOUR;
    const totalInflow = waterLevel + inflow;

    const waterAddedLeft = tree.leftSquare * waterLevel;
    const waterAddedRight = tree.rightSquare * waterLevel;

    const isLeft = tree.isLeftChild === true;
    const isRight = tree.isLeftChild === false;
    const isRoot = !tree.isLeftChild && !isRight;

    const extraWater =
        waterLevel +
        waterAddedLeft +
        waterAddedRight +
        inflow -
        tree.leftDeficit -
        tree.rightDeficit;

    // ENOUGH FOR BOTH SUBTREES

    if (extraWater >= 0) {
        return setHeight(
            tree,
            tree.height + extraWater / (tree.leftSquare + tree.rightSquare + 1)
        );
    }

    const halfWaterLevel = waterLevel / 2;

    // ONE SUBTREE IS EMPTY

    if (!tree.left) {
        return {
            ...tree,
            left: null,
            right: distributeWater(tree.right, waterLevel + inflow, time),
        };
    }

    if (!tree.right) {
        return {
            ...tree,
            left: distributeWater(tree.left, waterLevel + inflow, time),
            right: null,
        };
    }

    // NOT ENOUGH

    const leftDeficitAfterRain =
        tree.leftDeficit - waterAddedLeft - halfWaterLevel;
    const rightDeficitAfterRain =
        tree.rightDeficit - waterAddedRight - halfWaterLevel;

    if (isRoot && leftDeficitAfterRain >= 0 && rightDeficitAfterRain >= 0) {
        return {
            ...tree,
            left: distributeWater(tree.left, halfWaterLevel, time),
            right: distributeWater(tree.right, halfWaterLevel, time),
        };
    }

    if (
        isLeft &&
        leftDeficitAfterRain >= 0 &&
        rightDeficitAfterRain - inflow >= 0
    ) {
        return {
            ...tree,
            left: distributeWater(tree.left, halfWaterLevel, time),
            right: distributeWater(tree.right, inflow + halfWaterLevel, time),
        };
    }

    if (
        isRight &&
        leftDeficitAfterRain - inflow >= 0 &&
        rightDeficitAfterRain >= 0
    ) {
        return {
            ...tree,
            left: distributeWater(tree.left, inflow + halfWaterLevel, time),
            right: distributeWater(tree.right, halfWaterLevel, time),
        };
    }

    // IT'S ENOUGH FOR ONE SUBTREE

    if (isRoot && leftDeficitAfterRain < 0) {
        return {
            ...tree,
            left: setHeight(tree.left, tree.height),
            right: distributeWater(
                tree.right,
                waterLevel - (tree.leftDeficit - waterAddedLeft),
                time
            ),
        };
    }

    if (isRoot && rightDeficitAfterRain < 0) {
        return {
            ...tree,
            left: distributeWater(
                tree.left,
                waterLevel - (tree.rightDeficit - waterAddedRight),
                time
            ),
            right: setHeight(tree.right, tree.height),
        };
    }

    if (isLeft && leftDeficitAfterRain < 0) {
        return {
            ...tree,
            left: setHeight(tree.left, tree.height),
            right: distributeWater(
                tree.right,
                totalInflow - (tree.leftDeficit - waterAddedLeft),
                time
            ),
        };
    }

    if (isLeft && rightDeficitAfterRain - inflow < 0) {
        return {
            ...tree,
            left: distributeWater(
                tree.left,
                totalInflow - (tree.rightDeficit - waterAddedRight),
                time
            ),
            right: setHeight(tree.right, tree.height),
        };
    }

    if (isRight && rightDeficitAfterRain < 0) {
        return {
            ...tree,
            right: setHeight(tree.right, tree.height),
            left: distributeWater(
                tree.left,
                totalInflow - (tree.rightDeficit - waterAddedRight),
                time
            ),
        };
    }

    return {
        ...tree,
        left: setHeight(tree.left, tree.height),
        right: distributeWater(
            tree.left,
            totalInflow - (tree.leftDeficit - waterAddedLeft),
            time
        ),
    };
};

// O(N)
export const getWaterLevels = (
    landscape: Array<number>,
    time: number
): Array<number> => {
    if (landscape.length === 0) {
        return [];
    }

    const tree = buildTree(landscape);

    const landscapeAfterRain = distributeWater(tree, 0, time);

    return treeToArray(landscapeAfterRain).map(
        (height, index) => height - landscape[index]
    );
};
