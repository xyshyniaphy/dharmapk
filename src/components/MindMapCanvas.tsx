import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import * as d3 from 'd3';
import { mindMapDataAtom } from '../state/mindMapStore';
import type { Node as MindMapNode } from '../types';
import './MindMapCanvas.css';

function MindMapCanvas(): React.ReactElement {
  const svgRef = useRef<SVGSVGElement>(null);
  const mindMapData = useAtomValue(mindMapDataAtom);
  const [pinnedNode, setPinnedNode] = useState<d3.HierarchyPointNode<MindMapNode> | null>(null);

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

  const handleMouseOver = useCallback((event: MouseEvent, d: any) => {
    if (pinnedNode || d.depth === 0) return;
    applyHighlight(d);
  }, [pinnedNode, applyHighlight]);

  const handleMouseOut = useCallback(() => {
    if (pinnedNode) return;
    clearAllHighlights();
  }, [pinnedNode, clearAllHighlights]);

  const handleNodeClick = useCallback((event: MouseEvent, d: any) => {
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

      const width = svgRef.current.clientWidth;
      const height = svgRef.current.clientHeight;
      
      const root = d3.hierarchy(mindMapData);
      const treeLayout = d3.tree<MindMapNode>().size([height, width - 200]);
      treeLayout(root);

      const g = svg.append('g').attr('transform', 'translate(100,0)');

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
        .attr('transform', d => `translate(${d.y},${d.x})`)
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .on('click', handleNodeClick)
        .style('cursor', d => d.depth === 0 ? 'default' : 'pointer');

      node.append('circle').attr('r', 10);

      node.append('text')
        .attr('dy', '.35em')
        .attr('x', d => d.children ? -13 : 13)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.text);
    }
  }, [mindMapData, handleContextMenu, handleMouseOver, handleMouseOut, handleNodeClick, applyHighlight, clearAllHighlights]);

  if (!mindMapData) {
    return <div>Loading mind map...</div>;
  }

  return (
    <div className="mind-map-container">
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  );
}

export default MindMapCanvas;
