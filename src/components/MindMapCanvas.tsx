import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import * as d3 from 'd3';
import { mindMapDataAtom } from '../state/mindMapStore';
import type { Node as MindMapNode } from '../types';
import NavigationPanel from './NavigationPanel';
import './MindMapCanvas.css';

function MindMapCanvas(): React.ReactElement {
  const svgRef = useRef<SVGSVGElement>(null);
  const mindMapData = useAtomValue(mindMapDataAtom);
  const [pinnedNode, setPinnedNode] = useState<d3.HierarchyPointNode<MindMapNode> | null>(null);
  const [hoveredPath, setHoveredPath] = useState<string[]>([]);

  const clearAllHighlights = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('.node').classed('dimmed', false).classed('highlighted', false);
    svg.selectAll('.link').classed('dimmed', false).classed('highlighted', false);
  }, []);

  const applyHighlight = useCallback((d: d3.HierarchyPointNode<MindMapNode>) => {
    const svg = d3.select(svgRef.current);
    const highlightedNodes = new Set();
    
    d.ancestors().forEach(node => highlightedNodes.add(node));
    if (d.children) {
      d.descendants().forEach(node => highlightedNodes.add(node));
    }
    
    svg.selectAll('.node')
      .classed('highlighted', (node: any) => highlightedNodes.has(node))
      .classed('dimmed', (node: any) => !highlightedNodes.has(node));
      
    svg.selectAll('.link')
      .classed('highlighted', (link: any) => highlightedNodes.has(link.source) && highlightedNodes.has(link.target))
      .classed('dimmed', (link: any) => !highlightedNodes.has(link.source) || !highlightedNodes.has(link.target));
  }, []);

  const handleMouseOver = useCallback((_event: MouseEvent, d: any) => {
    if (pinnedNode || d.depth === 0) return;
    applyHighlight(d);
    const path = d.ancestors().map((node: any) => node.data.text).reverse();
    setHoveredPath(path.slice(0, -1));
  }, [pinnedNode, applyHighlight]);

  const handleMouseOut = useCallback(() => {
    if (pinnedNode) return;
    clearAllHighlights();
    setHoveredPath([]);
  }, [pinnedNode, clearAllHighlights]);

  const handleNodeClick = useCallback((_event: MouseEvent, d: any) => {
    if (d.depth === 0) return;

    if (pinnedNode === d) {
      setPinnedNode(null);
      clearAllHighlights();
    } else {
      setPinnedNode(d);
      applyHighlight(d);
    }
  }, [pinnedNode, applyHighlight, clearAllHighlights]);

  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();
    setPinnedNode(null);
    clearAllHighlights();
  }, [clearAllHighlights]);

  useEffect(() => {
    if (mindMapData && svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.on('contextmenu', handleContextMenu);
      svg.selectAll('*').remove(); // Clear previous render

      const height = svgRef.current.clientHeight;
      
      const root = d3.hierarchy(mindMapData);

      // Custom layout logic with dynamic row height for leaf nodes
      const baseNodeHeight = 40; // Base height for a single-line node
      const lineHeight = 15;    // Additional height for each extra line
      const nodeWidth = 220;    // Horizontal spacing between depth levels

      let maxDepth = 0;
      root.each(d => {
        if (d.depth > maxDepth) {
          maxDepth = d.depth;
        }
      });

      const leaves = root.leaves();
      let currentX = 0;

      leaves.forEach(leaf => {
        const numLines = leaf.data.text.split('\n').length;
        const nodeHeight = baseNodeHeight + (numLines - 1) * lineHeight;
        
        // Assign position, centering the node within its allocated space
        (leaf as any).x = currentX + nodeHeight / 2;
        (leaf as any).y = maxDepth * nodeWidth;
        
        // Move the starting point for the next node
        currentX += nodeHeight;
      });

      const layoutHeight = currentX;
      const yOffset = (height - layoutHeight) / 2;

      // Apply the vertical offset to all nodes to center the layout
      root.each(d => {
        if (!isNaN((d as any).x)) {
          (d as any).x += yOffset;
        }
      });

      root.eachAfter(node => {
        if (node.children) {
          (node as any).x = d3.mean(node.children, d => (d as any).x);
          (node as any).y = node.depth * nodeWidth;
        }
      });

      const g = svg.append('g');

      // Links
      g.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal()
          .x(d => (d as any).y)
          .y(d => (d as any).x) as any
        );

      // Nodes
      const node = g.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', d => `node ${d.children ? 'node--internal' : 'node--leaf'}`)
        .attr('transform', d => `translate(${(d as any).y},${(d as any).x})`)
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .on('click', handleNodeClick)
        .style('cursor', d => d.depth === 0 ? 'default' : 'pointer');

      node.append('circle').attr('r', 10);

      node.append('text')
        .attr('x', d => d.children ? -13 : 13)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .each(function(d) {
          const text = d3.select(this);
          const lines = d.data.text.split('\n');
          text.text(null);
          for (let i = 0; i < lines.length; i++) {
            text.append('tspan')
              .attr('x', d.children ? -13 : 13)
              .attr('dy', i === 0 ? '0.35em' : '1.2em')
              .text(lines[i]);
          }
        });

      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 3])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      svg.call(zoom);
      svg.call(zoom.transform, d3.zoomIdentity.translate(100, yOffset > 0 ? yOffset : 0));
    }
  }, [mindMapData, handleContextMenu, handleMouseOver, handleMouseOut, handleNodeClick, applyHighlight, clearAllHighlights]);

  if (!mindMapData) {
    return <div>Loading mind map...</div>;
  }

  return (
    <div className="mind-map-container">
      <NavigationPanel path={hoveredPath} />
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  );
}

export default MindMapCanvas;
