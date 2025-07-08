
### \#\# 1. Version & Setup

Always use the latest stable release of D3.js, which is currently **v7.x**. This ensures you are using modern JavaScript standards and have access to the latest features and bug fixes.

  * **Installation**:
    ```bash
    npm install d3
    ```
  * **Importing**: D3 is modular. Instead of importing the entire library, import only the modules you need. This keeps your application bundle size smaller.
    ```javascript
    // Import specific modules you'll need for the mind map
    import * as d3 from 'd3'; // Or import specific modules
    import { select } from 'd3-selection';
    import { hierarchy, tree } from 'd3-hierarchy';
    import { linkHorizontal } from 'd3-shape';
    import { zoom } from 'd3-zoom';
    ```

-----

### \#\# 2. Code Style

Modern D3 embraces standard JavaScript (ES6+) and a functional style.

  * **Use `const` and `let`**: Avoid using `var`.
  * **Arrow Functions**: Use arrow functions for conciseness, especially in callbacks, but be mindful of how they handle `this`. In D3 event listeners, you might prefer a standard function to access the event target via `this`.
    ```javascript
    // Good: Arrow function for a simple mapping
    const textLabels = nodes.map(d => d.data.text);

    // Good: Standard function for an event listener
    node.on('click', function(event, d) {
      // 'this' refers to the DOM element that was clicked
      select(this).style('fill', 'red');
    });
    ```
  * **Method Chaining**: Continue to use D3's popular method chaining for selections, but break long chains onto new lines for readability.
    ```javascript
    // Readable chain
    node.append('text')
        .attr('x', 10)
        .attr('dy', '.35em')
        .text(d => d.data.text)
        .style('fill', '#333');
    ```

-----

### \#\# 3. Key Function Usage for Mind Map

This section covers the most critical D3 modules and functions for your project, updated for v7.

#### **Selections & Data Binding**

The `enter()` and `exit()` pattern is the core of D3. The syntax in v7 is explicit and slightly different from older versions. You must pass the data array to the `.data()` method.

  * **The Pattern**: The `.join()` method is a convenient shorthand for the enter-update-exit pattern. It's concise and highly recommended for most use cases.
    ```javascript
    // Modern .join() pattern (Recommended)
    g.selectAll('.node')
      .data(root.descendants())
      .join('g') // Handles enter, update, and exit in one go
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`);
    ```
  * **Explicit Pattern**: If you need more control over enter/update/exit, the classic pattern is still available.
    ```javascript
    // Explicit enter/update/exit
    const node = g.selectAll('.node').data(root.descendants());

    // Exit (remove old nodes)
    node.exit().remove();

    // Enter (add new nodes)
    const nodeEnter = node.enter().append('g')
        .attr('class', 'node');
    nodeEnter.append('circle').attr('r', 5);

    // Update (merge enter and update selections)
    const nodeUpdate = nodeEnter.merge(node);
    nodeUpdate.attr('transform', d => `translate(${d.y},${d.x})`);
    ```

#### **Hierarchy (`d3-hierarchy`)**

This is essential for processing your tree data.

1.  **`d3.hierarchy()`**: First, you must pass your JSON data into this function to create a D3-specific hierarchical structure. This new structure includes valuable methods and properties like `d.descendants()`, `d.links()`, `d.depth`, etc.
2.  **`d3.tree()`**: This is your layout generator. You define the size of the tree, and it calculates the `x` and `y` coordinates for each node.
    ```javascript
    // 1. Create the hierarchy from your parsed mind map data
    const root = d3.hierarchy(mindMapData);

    // 2. Create a tree layout generator
    // For a left-to-right tree, swap height and width
    const treeLayout = d3.tree().size([canvasHeight, canvasWidth]);

    // 3. Apply the layout to your hierarchy
    // This adds .x and .y properties to each node in 'root'
    treeLayout(root);
    ```

#### **Shapes & Links (`d3-shape`)**

To draw the connection lines (straight, elbow, or curved), you use shape generators.

  * **`d3.linkHorizontal()`**: This is perfect for a left-to-right tree layout. It generates the `d` attribute for an SVG `<path>` element.
    ```javascript
    // Create a link generator
    const linkGenerator = d3.linkHorizontal()
        .x(d => d.y) // Source and target x is the node's y-position
        .y(d => d.x); // Source and target y is the node's x-position

    // Use it to draw the links
    svg.selectAll('.link')
      .data(root.links())
      .join('path')
        .attr('class', 'link')
        .attr('d', linkGenerator)
        .style('fill', 'none')
        .style('stroke', '#ccc');
    ```

#### **Events**

Event listeners now receive two arguments: `(event, d)`.

  * `event`: The native event object (e.g., `MouseEvent`).
  * `d`: The datum bound to the element.

<!-- end list -->

```javascript
node.on('mouseover', (event, d) => {
  // You can access the datum directly
  console.log(`Hovered over node: ${d.data.text}`);

  // You can get the DOM element from the event
  const targetElement = event.currentTarget;
  d3.select(targetElement).select('circle').attr('r', 10);
});
```