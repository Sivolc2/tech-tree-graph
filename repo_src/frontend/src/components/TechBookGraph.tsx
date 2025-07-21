import React, { useState, useMemo, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { initialNodes, initialEdges } from './graphData';
import CustomNode from './CustomNode';

const nodeTypes = {
  category: CustomNode,
  tech: CustomNode,
  book: CustomNode,
};

const TechBookGraph: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [highlightedEdges, setHighlightedEdges] = useState<Set<string>>(new Set());

  const onNodeMouseEnter = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type !== 'tech') return;

      const newHighlightedNodes = new Set<string>();
      const newHighlightedEdges = new Set<string>();

      newHighlightedNodes.add(node.id);

      // Find connected books (outgoing edges from tech)
      edges.forEach((edge) => {
        if (edge.source === node.id) {
          newHighlightedNodes.add(edge.target);
          newHighlightedEdges.add(edge.id);
        }
        // Find connected category (incoming edge to tech)
        if (edge.target === node.id) {
            newHighlightedNodes.add(edge.source);
            newHighlightedEdges.add(edge.id);
        }
      });

      setHighlightedNodes(newHighlightedNodes);
      setHighlightedEdges(newHighlightedEdges);
    },
    [edges]
  );

  const onNodeMouseLeave = useCallback(() => {
    setHighlightedNodes(new Set());
    setHighlightedEdges(new Set());
  }, []);

  const styledNodes = useMemo(() => {
    return nodes.map((node) => {
      const isHighlighted = highlightedNodes.has(node.id);
      const isFaded = highlightedNodes.size > 0 && !isHighlighted;
      return {
        ...node,
        className: `${node.className || ''} ${isHighlighted ? 'highlight' : ''} ${isFaded ? 'faded' : ''}`,
      };
    });
  }, [nodes, highlightedNodes]);

  const styledEdges = useMemo(() => {
    return edges.map((edge) => {
        const isHighlighted = highlightedEdges.has(edge.id);
        const isFaded = highlightedEdges.size > 0 && !isHighlighted;
        return {
          ...edge,
          className: `${edge.className || ''} ${isHighlighted ? 'highlight' : ''} ${isFaded ? 'faded' : ''}`,
          animated: isHighlighted,
        };
      });
  }, [edges, highlightedEdges]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
      >
        <Controls />
        <Background
            color="#4b5563"
            gap={16}
        />
      </ReactFlow>
    </div>
  );
};

export default TechBookGraph; 