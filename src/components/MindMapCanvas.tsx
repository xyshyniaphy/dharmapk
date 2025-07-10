import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import * as d3 from 'd3';
import { mindMapDataAtom } from '../state/mindMapStore';
import { settingsAtom } from '../state/settingsStore';
import type { Node as MindMapNode } from '../types';
import NavigationPanel from './NavigationPanel';
import './MindMapCanvas.css';

function MindMapCanvas(): React.ReactElement {
  const svgRef = useRef<SVGSVGElement>(null);
  const mindMapData = useAtomValue(mindMapDataAtom);
  const settings = useAtomValue(settingsAtom);
  const [pinnedNode, setPinnedNode] = useState<d3.HierarchyPointNode<MindMapNode> | null>(null);
  const [hoveredPath, setHoveredPath] = useState<string[]>([]);
  const [hoveredSiblings, setHoveredSiblings] = useState<string[]>([]);
  const [hoveredParent, setHoveredParent] = useState<string | null>(null);

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
    if (pinnedNode) return;

    if (!d.children) { // It's a leaf node
        const svg = d3.select(svgRef.current);
        
        // Get ancestors (path to root) and siblings
        const ancestors = d.ancestors();
        const ancestorSet = new Set(ancestors);
        const parent = d.parent;
        const siblings = parent ? parent.children || [] : [];

        // Determine which nodes should be visible (ancestors + siblings)
        const visibleNodes = new Set([...ancestors, ...siblings]);

        // Apply styles to all nodes
        svg.selectAll('.node')
            .classed('highlighted', (node: any) => node === d) // Bold text for hovered node
            .classed('dimmed', (node: any) => !visibleNodes.has(node));

        // Apply styles to all links
        svg.selectAll('.link')
            .classed('highlighted', (link: any) => ancestorSet.has(link.source) && ancestorSet.has(link.target))
            .classed('dimmed', (link: any) => !(ancestorSet.has(link.source) && ancestorSet.has(link.target)));

    } else { // It's an internal node
        if (d.depth === 0) return;
        applyHighlight(d);
    }
    
    const parent = d.parent;
    if (parent) {
        const grandParent = parent.parent;
        if (grandParent) {
            const grandParentPath = grandParent.ancestors().map((node: any) => node.data.text).reverse();
            setHoveredPath(grandParentPath);
            const siblings = grandParent.children?.map((node: any) => node.data.text) || [];
            setHoveredSiblings(siblings);
        } else {
            // Parent is a child of the root
            setHoveredPath([]);
            const root = d.ancestors().find((node: any) => node.depth === 0);
            if (root) {
                const siblings = root.children?.map((node: any) => node.data.text) || [];
                setHoveredSiblings(siblings);
            } else {
                setHoveredSiblings([]);
            }
        }
        setHoveredParent(parent.data.text);
    } else {
      setHoveredPath([]);
      setHoveredSiblings([]);
      setHoveredParent(null);
    }
  }, [pinnedNode, applyHighlight]);

  const handleMouseOut = useCallback(() => {
    if (pinnedNode) return;
    clearAllHighlights();
    setHoveredPath([]);
    setHoveredSiblings([]);
    setHoveredParent(null);
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
      const nodeWidth = settings.nodeColumnWidth;    // Horizontal spacing between depth levels

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
      const getLinkPath = (d: d3.Link<any, d3.HierarchyPointNode<MindMapNode>, d3.HierarchyPointNode<MindMapNode>>) => {
        const sourceY = (d.source as any).y;
        const sourceX = (d.source as any).x;
        const targetY = (d.target as any).y;
        const targetX = (d.target as any).x;

        switch (settings.lineType) {
          case 'straight':
            return `M${sourceY},${sourceX}L${targetY},${targetX}`;
          case 'right-angled':
            return `M${sourceY},${sourceX}H${sourceY + (targetY - sourceY) / 2}V${targetX}H${targetY}`;
          case 'rounded-angled':
            const cornerRadius = 10;
            const halfY = sourceY + (targetY - sourceY) / 2;
            const xDir = sourceX < targetX ? 1 : -1;
            const yDir = sourceY < targetY ? 1 : -1;
            return `M${sourceY},${sourceX} H${halfY - cornerRadius * yDir} A${cornerRadius},${cornerRadius} 0 0 ${yDir * xDir > 0 ? 1 : 0} ${halfY},${sourceX + cornerRadius * xDir} V${targetX - cornerRadius * xDir} A${cornerRadius},${cornerRadius} 0 0 ${yDir * xDir > 0 ? 0 : 1} ${halfY + cornerRadius * yDir},${targetX} H${targetY}`;
          case 'curved':
          default:
            const midY = sourceY + (targetY - sourceY) / 2;
            return `M${sourceY},${sourceX}C${midY},${sourceX} ${midY},${targetX} ${targetY},${targetX}`;
        }
      };

      g.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', getLinkPath as any);

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

          if (settings.verticalText && d.children) {
            text.style('text-anchor', 'middle');
            const originalText = lines.join('\n');
            const chars = originalText.split('');
            for (let i = 0; i < chars.length; i++) {
              text.append('tspan')
                .attr('x', d.children ? -13 : 13)
                .attr('dy', '1.2em')
                .text(chars[i]);
            }
          } else {
            for (let i = 0; i < lines.length; i++) {
              text.append('tspan')
                .attr('x', d.children ? -13 : 13)
                .attr('dy', i === 0 ? '0.35em' : '1.2em')
                .text(lines[i]);
            }
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
  }, [mindMapData, settings, handleContextMenu, handleMouseOver, handleMouseOut, handleNodeClick, applyHighlight, clearAllHighlights]);

  if (!mindMapData) {
    return <div>Loading mind map...</div>;
  }

  return (
    <div className="mind-map-container">
      <NavigationPanel path={hoveredPath} siblings={hoveredSiblings} parentNodeName={hoveredParent} />
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  );
}

export default MindMapCanvas;
