# Water levels problem

There is the landscape (sequence of positive numbers).
To the very left and to the very right of the landscape are infinite walls.
Then it begins to rain. Per hour one unit of rain falls on each segment of the landscape.

The program should evenly distribute the water and calculate the water levels for each segment after x number of hours of rain.

## Algorithm description

To solve the problem I used the Tree with all nodes as segments. The root is the maximum segment (by height) all others go in descendent order.

Let's separate the solution on 2 steps: build a tree, perform a tree walk to calculate water levels.

### How to build a tree

The structure of tree is

```ts
type Tree = {
    height: number; // height of corresponding segment
    index: number; // index of segment in landscape
    leftDeficit: number; // deficit of water for left subtree
    rightDeficit: number; // deficit of water for right subtree
    leftSquare: number; // square of left subtree (number of nodes there)
    rightSquare: number; // square of right subtree
    left: Tree | null; // left subtree
    right: Tree | null; // right subtree
    isLeftChild: boolean | null; // is current node the left of child (null for root)
};
```

Deficit is the amount of water needed for subtree to has the same height as parent node. It's used for calculations of water distribution.

For example, let's consider landscape `5, 1, 2, 10, 4, 8, 1, 6`. `10` (the root) has left deficit `(10 - 5) + (10 - 1) + (10 - 2) = 22` & right deficit `21`. `4` has both deficites as `0` because it's neighbours are higher. `2` has left deficit `1` & right deficit `0`.

We also store if the node is left child of parent or right. It's also used for distribution: water from parent prefer nearest cavities.

For example, in landscape mentioned above the part of tree looks like

```
    10
   /  \
 ...   8
      / \
     4   6
     ......
```

From root node `10` some amount of water is delegated to it's right child `8` to handle further distribution. But the water from `10` as our problem claims should go to neariest cavity (`4`), so we separate the water from parent, the water from node itself and decide the subtree that will get it.

So, let's build the tree. At first, we get the deficites for all segments. This task consists of 2: find the left deficites and right ones. Both are handled in the same manner (right is reversed left). There is stack usage for optimization purposes (O(1) complexity as each segment can go in and out only once). The stack is built by decreasing of heights of segments. It keeps the position (index) and height of segment. Initial value is `(Infinity, -1)` (infinite wall). Then we go through the landscape list and each element pops stack entries that have lower height. In the end the last element in stack is higher than current one and between them is cavity that can be filled with water to the level of current element height. The deficit is calculated as the sum of deficites of all popped nodes plus the differences in their heights multiplied on differences in indexes. Then we add current element in stack and continue. The complexity of such algorithm is O(N) (just one cycle, removing of element from stack is O(1)).

For example, we have the landscape `..., 7, 2, 3, 3, 5, ...`, the index for `7` is `i`. For `2` the last element in stack is `7` so it cannot pop anything => deficit is `0` => add `2` in stack. `3` can pop `2` from stack but cannot pop `7` => deficit is `0 + (3 - 2) * ((i + 2) - (i + 1)) = 1` => add `3` in stack. `3` pops `3` and deficit is `1 + (3 - 3) * 1 = 1` => add `3` in stack. `5` can pop `3` => deficit is `1 + (5 - 3) * ((i + 3) - i) = 7`.

We got the deficites, now we need to get the neighbours (the child nodes in tree). The method is the similar to previous one: we use the stack and pop from there all elements that have lower height than current one. But to find the neighbour we only need the last popped element - the neighbour (as the element with maximum height that still has lower height than current element). For left neighbours we use the same approach with reversing but the comparison is strict (to avoid circular dependencies for equal elements). The complexity is also O(N).

Then we get the maximum segment by height (it should have neighbours to avoid fails for landscapes with all segments with equal height). It'll be the root node. It looks like there is all data needed to build the tree so we take the root node and recursively build left and right subtree. The complexity is O(N).

### How to calculate the water levels in the tree

So we have parent node and children. We have water in parent node plus water from its' parent plus water in each subtree. There are 4 possible cases:

-   the amount of water is enough to make all segments the same height => we set this level to each node (with parents' included).

-   there is only one subtree and the amount of water is not enough (distribute all water there)

-   the amount of water is not enough. There are 3 subcases:

    -   current node is root one
        The water from node can be distributed equally to both subtrees. So, there are recursive calls for each subtree with half of current nodes' water as inflow.

    -   current node is left child
        The inflow from parents' node (if any) can be distributed only to right subtree (as in landscape it's closer to current nodes' parent). There are recursive calls for each subtree: for left the inflow is half of current node water and for right the inflow is current node inflow plus half of current node water.

    -   current node is right child
        The same as for previous case but for left subtree.

-   the amount of water is enough for just one subtree. There are 6 subcases (for root, left child, right child) but they are handled mostly in the same way as previous case. Only difference is that we set the height of current node to subtree that can get enough water. Then the recursive call for other subtree.

There is just walk through tree that has complexity O(N).

Then we just map the tree to an array (we know that every node in left subtree has lower index than parents' one in landscape so there is no need for sorting - O(N)) and subtract initial segment heights to get water levels.

## Algorithm computational complexity

The complexities can be simply added (`O(N) + O(N) = O(N), kO(N) = O(kN) = O(N) for k - const`) so as all parts of algorithm have complexities `O(N)` and are performed sequently we get the total complexity as `O(N)`.

## Proof of correctness

### Build the tree

#### getLeftDeficites

**Base**
`n = 0`. Deficites are empty (empty tree cannot have deficites).

**Inductive step**
`n = k` - correct deficites.

**Prove for `k + 1`**
`[h0, h1, h2, ..., hk]`
In such case deficites are deficites for `[h0, ..., h[k - 1]]` plus the deficit for `hk` as right elements cannot influence on deficite of segments from the left.

Deficites for first `k` elements are correct (according to our assumption). So, let's calculate the deficit for last element.

There are some cases:

-   nearest segment from the left has larger height -> there is no deficit because water cannot be distributed from lower height to larger one - in our algorithm in stack the last element is the segment element to the current one from the left, so, nothing can be popped and deficit is zero.
-   there are few segments from the left with lower height than the current one. We pop them until we get "the wall" - nearest segment that is higher. The whole cavity we got in such case can be filled in with water. The height of this zone with water will be the same as the height of current element (as lowest size of cavity) but there can be some segments on the bottom so to calculate the deficite correctly we should pay attention to this. All entries we removed from the stack are such segments, some of them also removed some other segments but it doesn't matter because they keep the info about this in their deficites. So we can sum all deficites the elements for which we removed from the stack on current step. But then we have water only enough to fill each such subzone to the height of segment that was its' "wall". But all such segments that deficites we use have lower heights than current one so, we need to add difference to fill the cavity fully. All deficites that we use in calculations on current step were calculated previously (by assumption they are correct).

```
#
#         #
# #       #
# #   #   #
# # # # # #
0 1 2 3 4 5
```

In stack there are `[-1, 0, 1, 3, 4]` (`3` keeps the deficit for `2`)

If to add deficit water for popped elements we'll get

```
#
#         #
# #       #
# # * #   #
# # # # # #
0 1 2 3 4 5
```

Now we need to calculate differences between each popped element and current one (and multiple by width of "zone" for each popped element).

#### getNeighbours

The mostly the same as **getDeficites**

#### buildTree

Tree we get keeps the structure of initial landscape (flatten tree is the same landscape). So, it can be used for water distribution with some checks for inflows, water deficites etc.

The method is simple recursion with all data that was calculated before.

### Calculate the water levels

**Base**.
`n = 0`. `tree = null` -> result = null (there cannot be any water in an empty landscape)
`n = 1`. There are no subtrees so all deficites are zeros. Water just stay on top of single segment.

**Inductive step**
Let's have non empty tree `T` with root node `N`. Left subtree is `L` and right is `R`. Algorithm is correct for all subtrees of `T`.

**Prove for `T`**

```
        N
       / \
      L   R
```

There are some cases:

-   `L` or `R` are empty subtrees - we leave empty one as is and provide all the water to other subtree (both cannot be empty, we covered this case in **Base** step).
-   the amount of water from `N` is not enough to cover deficites - we distribute water in equal proportions (as problem says).
-   the half of amount of water is enough to cover one of subtrees - distribute as much water as this subtree needs and all other is distributed to other subtree (according to problem water should be distributed equally but in this case there will be overflow so we calculated it and provided right amount of water).

Each such checks finishes either with alignment of heights either with recursive call (according our assumption the algorithm for all subtrees is correct).

(In case `N` is not a root node we have `income` and checks whether this amount of water should be distributed in one subtree or another, but nothing really changes).
