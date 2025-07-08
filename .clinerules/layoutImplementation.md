
###  Project: Mind Map Auto-Layout Algorithm Specification

#### 1.0 Overview

This document specifies the requirements for an automatic layout algorithm that arranges hierarchical data into a specific left-to-right tree structure. The primary goal is to create a clean, organized, and aesthetically pleasing visualization where node positions are determined programmatically based on a set of fixed rules, particularly concerning horizontal alignment.

#### 2.0 General Layout Requirements

  * **2.1 Orientation**: The mind map will be rendered in a **left-to-right** orientation. The root node of the tree will be positioned at the top-left of the canvas.
  * **2.2 Structure**: The algorithm must render the data as a pure **tree**. Even if the underlying data could represent a network, the visualization will only display the primary parent-child hierarchical relationships.
  * **2.3 Data Source**: The layout will be generated from a hierarchical JSON object representing the tree structure.

#### 3.0 Node Rendering and Sizing

  * **3.1 Node Widths**:
      * **3.1.1 Leaf Nodes**: All leaf nodes (nodes with no children) must have a **fixed, equal width**. This width value (`leafWidth`) will be user-configurable.
      * **3.1.2 Non-Leaf Nodes**: All non-leaf (parent) nodes must have a **fixed, equal width**. This width value (`nodeWidth`) will also be user-configurable and is distinct from `leafWidth`.
  * **3.2 Node Height**: The height of each node must be **dynamic**. It will automatically adjust to vertically accommodate the text content contained within it.
  * **3.3 Text Wrapping**: If the text content of a node exceeds its specified fixed width, the text must **automatically wrap** onto subsequent lines within the node's visual boundary.

#### 4.0 Columnar Alignment and Positioning

The horizontal placement of nodes is governed by a strict columnar system.

  * **4.1 Column Determination**: The total number of available columns in the layout is determined by the deepest leaf node. If the depth of the deepest leaf is `N` (with the root at depth 0), the total number of columns will be `N + 1`.
  * **4.2 Leaf Node Alignment**: All leaf nodes, regardless of their actual depth in the data structure, **must be visually aligned in the rightmost column**.
  * **4.3 Non-Leaf Node Alignment**: All non-leaf nodes are positioned in a column corresponding to their **depth** in the tree structure (e.g., the root is in column 0, its children are in column 1, and so on).
  * **4.4 Bypass Columns**: The layout must automatically generate empty space ("bypass columns") for branches that are shorter than the deepest branch. This ensures that the rule of placing all leaf nodes in the rightmost column is maintained, creating a visually aligned right edge.
  * **4.5 Vertical Centering**: A non-leaf node should be positioned on the Y-axis such that it is **vertically centered** relative to the total vertical span of its direct children.
  * **4.6 Overlap Prevention**: The algorithm must ensure that no two nodes within the same column overlap vertically. A minimum vertical gap must be maintained between them.

#### 5.0 Connection Lines

  * **5.1 Default Line Style**: The default connector between a parent and child will be a **straight line**. It will connect the center-right edge of the parent node to the center-left edge of the child node.
  * **5.2 User-Selectable Styles**: The user must have the option to change the connection line style. The system should support other popular types, including:
      * **Elbow (Orthogonal)**: Lines with 90-degree bends.
      * **Curved (Bezier)**: Smooth, curved lines.

#### 6.0 Sample Data and Use Case

The following JSON data will be used as a reference case to validate the layout logic.

```json
{
  "name": "R",
  "children": [
    {
      "name": "A",
      "children": [
        {
          "name": "C",
          "children": []
        },
        {
          "name": "D",
          "children": []
        }
      ]
    },
    {
      "name": "B",
      "children": [
        {
          "name": "E",
          "children": []
        },
        {
          "name": "F",
          "children": [
            {
              "name": "G",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

**Expected Layout for Sample Data:**

  * **Deepest Path**: The path R -\> B -\> F -\> G has a maximum depth of 3 (G). Therefore, the layout will have 4 columns.
  * **Column 1**: Contains the root node `R`.
  * **Column 2**: Contains nodes `A` and `B`.
  * **Column 3**: Contains node `F`. For the subtree of `A`, this is a bypass column.
  * **Column 4 (Rightmost)**: Contains all leaf nodes: `C`, `D`, `E`, and `G`.
  
  
  
  
----------

Here is a detailed, step-by-step implementation plan for auto-layout algorithm.

This plan breaks the process into distinct phases: data preparation, coordinate calculation, and rendering.

***

### ## Phase 1: Data Pre-processing and Enrichment

The first step is not to calculate positions, but to traverse the raw JSON tree and enrich each node object with essential metadata. This is the foundation for the entire layout. You'll perform a **post-order traversal** (a type of depth-first search where you process children before the parent).

1.  **Find Absolute Max Depth:** First, perform a quick traversal to find the depth of the deepest leaf node in the entire tree. This value determines the total number of columns.
    * Let `absoluteMaxDepth` be the depth of the deepest leaf (e.g., for `R -> B -> F -> G`, the depth of G is 3).
    * The total number of columns will be `absoluteMaxDepth + 1`, which is 4.

2.  **Enrich Each Node:** Traverse the tree again. For each node, add the following properties:
    * `isLeaf`: A boolean flag (`true` if `children` is empty).
    * `depth`: The node's level in the tree (root is 0, its children are 1, etc.).
    * `parent`: A reference to its parent node object (null for the root).
    * `layout`: An object to hold all calculated layout values. Initialize it as `{}`.

This enriched data structure is the single source of truth for the rest of the algorithm.

***

### ## Phase 2: Horizontal Layout (X-Coordinate Calculation)

This phase places nodes into their correct columns and calculates their X-positions and widths. The core logic here is differentiating between leaf and non-leaf nodes.

1.  **Define Column Configuration:**
    * `leafWidth`: The width for all leaf nodes (user-configurable).
    * `nodeWidth`: The width for all other (non-leaf) nodes (user-configurable).
    * `columnGap`: The horizontal space between each column.

2.  **Determine Each Node's Column Index:**
    Traverse your enriched data. For each node, determine its final layout column:
    * If `node.isLeaf === true`, its column index is `absoluteMaxDepth`.
    * If `node.isLeaf === false`, its column index is its `node.depth`.

3.  **Calculate X-Coordinates:**
    Create an array `columnXPositions` that stores the starting X-coordinate for each column.
    * `columnXPositions[0] = 0`.
    * For subsequent columns, the X-position is the X-position of the previous column plus the width of the nodes in that column and the `columnGap`. Be mindful that column widths can vary.

    Now, iterate through each node and set its final `layout.x` and `layout.width`:
    * `node.layout.width = node.isLeaf ? leafWidth : nodeWidth;`
    * `node.layout.x = columnXPositions[node.layout.columnIndex];`

**Example Walkthrough:**
For the path `R -> A -> C`:
* `R`: `depth`=0, `isLeaf`=false. Column index = 0.
* `A`: `depth`=1, `isLeaf`=false. Column index = 1.
* `C`: `depth`=2, `isLeaf`=true. `absoluteMaxDepth`=3. Column index = 3.
This correctly places `R` in column 0, `A` in column 1, creates an empty space at column 2, and places `C` in column 3.

***

### ## Phase 3: Vertical Layout (Y-Coordinate Calculation)

This is the most critical phase. It positions nodes vertically to prevent overlaps and align parent nodes with the center of their respective children's block.

1.  **Define Vertical Spacing:**
    * `verticalGap`: The minimum vertical space between any two nodes in the same column.
    * `estimatedNodeHeight`: An initial height estimate for text wrapping. The final height will be determined by the browser during rendering, but you need a value to start with.

2.  **Perform a Post-Order Traversal for Layout:**
    This traversal calculates the `y` position for each node, starting from the leaves and moving up to the root.

    * **For a Leaf Node:**
        * The leaves are the simplest. You can lay them out sequentially from top to bottom in the rightmost column.
        * Keep a running `currentY` cursor, initialized to 0.
        * When you process a leaf, set `leaf.layout.y = currentY`.
        * Increment `currentY` by `estimatedNodeHeight + verticalGap`.

    * **For a Non-Leaf (Parent) Node:**
        * A parent's `y` position should be the vertical midpoint of the space occupied by its direct children.
        * After all of a parent's children have been processed (and thus have a `y` coordinate), find the `y` of the first child (`firstChild.layout.y`) and the last child (`lastChild.layout.y`).
        * The parent's `y` coordinate is then calculated to align with the center of its children's span.
        * `parent.layout.y = (firstChild.layout.y + lastChild.layout.y) / 2;`

    * **Handling Overlaps:** The simple centering approach above can cause nodes in the same column to overlap (e.g., nodes 'A' and 'B' might be too close). After the initial calculation, you must perform a final pass through each column to resolve overlaps.
        * For each column, sort the nodes by their `y` position.
        * Iterate through the sorted nodes and ensure that `node[i+1].layout.y` is at least `node[i].layout.y + estimatedNodeHeight + verticalGap`. If not, shift `node[i+1]` and all subsequent nodes down.

***

### ## Phase 4: Connection Line Calculation

With all node positions calculated, you can now define the start and end points for the connection lines.

1.  **Define Anchor Points:** For each node, calculate the coordinates of its input (left-center) and output (right-center) anchor points.
    * `inputAnchor = { x: node.layout.x, y: node.layout.y + node.layout.height / 2 }`
    * `outputAnchor = { x: node.layout.x + node.layout.width, y: node.layout.y + node.layout.height / 2 }`

2.  **Define Line Data:** Create a list of line objects. Each object represents a connection from a parent to a child and contains the necessary points.

    * **Straight Lines (Default):**
        * `{ start: parent.outputAnchor, end: child.inputAnchor }`

    * **Elbow/Orthogonal Lines:** These lines have sharp 90-degree bends. You need one intermediate point.
        * `midpointX = parent.outputAnchor.x + columnGap / 2`
        * `{ start: parent.outputAnchor, mid: { x: midpointX, y: child.inputAnchor.y }, end: child.inputAnchor }`
        * This can be drawn with an SVG `<path>` like `M start.x,start.y L mid.x,start.y L mid.x,end.y L end.x,end.y`.

    * **Curved (Bezier) Lines:** These require control points to define the curve.
        * `controlPoint1 = { x: parent.outputAnchor.x + columnGap / 2, y: parent.outputAnchor.y }`
        * `controlPoint2 = { x: child.inputAnchor.x - columnGap / 2, y: child.inputAnchor.y }`
        * This is drawn with an SVG `<path>` using the `C` command: `M start.x,start.y C cp1.x,cp1.y cp2.x,cp2.y end.x,end.y`.
