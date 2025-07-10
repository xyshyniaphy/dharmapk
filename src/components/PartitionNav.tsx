import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { Node as MindMapNode } from '../types';
import './PartitionNav.css';

interface PartitionNavProps {
  mindMapData: MindMapNode;
  hoveredNodeData: d3.HierarchyPointNode<MindMapNode> | null;
}

const PartitionNav: React.FC<PartitionNavProps> = ({ mindMapData, hoveredNodeData }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (mindMapData && svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const width = 300;
      const height = svg.node()?.clientHeight || 400;
      const margin = { top: 10, right: 10, bottom: 10, left: 10 };

      const partitionLayout = d3.partition<MindMapNode>()
        .size([height - margin.top - margin.bottom, width - margin.left - margin.right])
        .padding(1);

      const root = partitionLayout(d3.hierarchy<MindMapNode>(mindMapData)
        .sum(() => 1)); // Each node has a value of 1

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      // Filter for non-leaf nodes as per the original requirement
      const nodes = root.descendants().filter(d => d.children && d.children.length > 0) as d3.HierarchyRectangularNode<MindMapNode>[];

      const node = g.selectAll('g')
        .data(nodes)
        .join('g')
        .attr('transform', d => `translate(${d.y0},${d.x0})`);

      node.append('rect')
        .attr('width', d => d.y1 - d.y0)
        .attr('height', d => d.x1 - d.x0)
        .attr('fill', 'none')
        .attr('stroke', '#ccc');

      // Add a title for tooltips on hover
      node.append('title')
        .text(d => `${d.ancestors().map(n => n.data.text).reverse().join(" / ")}\nValue: ${d.value}`);

      // Add labels, filtering for cells that are large enough
      node.filter(d => (d.y1 - d.y0) > 40) // Only show text if the cell is wide enough
        .append('text')
        .attr('x', 5)
        .attr('y', 15)
        .text(d => d.data.text)
        .attr('fill', 'black')
        .style('font-size', '12px');

      if (hoveredNodeData) {
        const hoveredAncestors = new Set(hoveredNodeData.ancestors().map(n => n.data.id));
        node.selectAll<SVGRectElement, d3.HierarchyRectangularNode<MindMapNode>>('rect')
          .attr('fill', d => hoveredAncestors.has(d.data.id) ? 'rgba(49, 130, 206, 0.3)' : 'none');
      }
    }
  }, [mindMapData, hoveredNodeData]);

  return (
    <div className="partition-nav-container">
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  );
};

export default PartitionNav;
