import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import type { Node as MindMapNode } from '../types';
import './PartitionNav.css';

interface PartitionNavProps {
  mindMapData: MindMapNode;
  hoveredNodeData: d3.HierarchyPointNode<MindMapNode> | null;
}

const PartitionNav: React.FC<PartitionNavProps> = ({ mindMapData, hoveredNodeData }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    if (mindMapData && svgRef.current && containerRef.current && width > 0) {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const { clientHeight: height } = containerRef.current;
      const margin = { top: 10, right: 10, bottom: 10, left: 10 };

      const partitionLayout = d3.partition<MindMapNode>()
        .size([height - margin.top - margin.bottom, width - margin.left - margin.right])
        .padding(1);

      const root = partitionLayout(d3.hierarchy<MindMapNode>(mindMapData)
        .sum(() => 1));

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

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

      node.append('title')
        .text(d => `${d.ancestors().map(n => n.data.text).reverse().join(" / ")}\nValue: ${d.value}`);

      node.each(function(d) {
        const group = d3.select(this);
        const cellWidth = d.y1 - d.y0;
        const cellHeight = d.x1 - d.x0;

        const isParentOfLeaf = d.children && d.children.some(child => !child.children);

        if (isParentOfLeaf) { // Horizontal text for parents of leaf nodes, aligned left
          group.append('text')
            .attr('x', 5) // Left padding
            .attr('y', cellHeight / 2)
            .attr('text-anchor', 'start')
            .attr('dominant-baseline', 'middle')
            .text(d.data.text)
            .style('font-size', '12px')
            .attr('fill', 'black');
        } else { // Vertical text for other nodes, aligned top
          const text = group.append('text')
            .attr('transform', `translate(${cellWidth / 2}, 15)`) // Top padding
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .attr('fill', 'black');

          const words = d.data.text.split('').map((char, i) => ({ char, i }));
          const lineHeight = 1.2;
          
          text.selectAll('tspan')
            .data(words)
            .join('tspan')
            .attr('x', 0)
            .attr('dy', (word, i) => i === 0 ? '0' : `${lineHeight}em`)
            .text(d => d.char);
        }
      });

      const allNodes = g.selectAll('g');
      const allRects = allNodes.selectAll('rect');
      const allTexts = allNodes.selectAll('text');

      if (hoveredNodeData && !hoveredNodeData.children) { // Only apply rules for leaf nodes
        const hoveredAncestors = new Set(hoveredNodeData.ancestors().map(n => n.data.id));
        
        allRects.attr('fill', d => hoveredAncestors.has((d as any).data.id) ? 'lightgreen' : 'none');
        allTexts.style('visibility', d => hoveredAncestors.has((d as any).data.id) ? 'visible' : 'hidden');

      } else {
        allRects.attr('fill', 'none');
        allTexts.style('visibility', 'visible');
      }
    }
  }, [mindMapData, hoveredNodeData, width]);

  return (
    <div
      ref={containerRef}
      className="partition-nav-container"
    >
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  );
};

export default PartitionNav;
