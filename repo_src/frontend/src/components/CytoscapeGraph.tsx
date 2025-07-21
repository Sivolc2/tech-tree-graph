import React, { useEffect, useRef } from 'react';
// @ts-ignore - react-cytoscapejs doesn't have type definitions
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
// @ts-ignore - cytoscape-fcose doesn't have type definitions
import fcose from 'cytoscape-fcose';
import { elements } from './graphData';

// Register the fcose extension
cytoscape.use(fcose);

const CytoscapeGraph: React.FC = () => {
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    // A helper function to manage highlighting
    const highlightNeighborhood = (node: cytoscape.NodeSingular) => {
      const neighborhood = node.neighborhood().union(node);
      if (node.parent().length > 0) {
        neighborhood.union(node.parent());
      }
      
      cy.elements().addClass('faded');
      neighborhood.removeClass('faded').addClass('highlighted');

      // For compound parents, also highlight their children
      if (node.isParent()) {
        node.children().removeClass('faded').addClass('highlighted');
      }
    };

    const clearHighlight = () => {
      cy.elements().removeClass('faded highlighted');
    };

    // Events for technologies and books
    cy.on('mouseover', 'node[type="tech"], node[type="book"]', (e) => {
      highlightNeighborhood(e.target);
    });
    cy.on('mouseout', 'node[type="tech"], node[type="book"]', clearHighlight);

    // Events for categories (compound parents)
    cy.on('mouseover', 'node[type="category"]', (e) => {
      const neighborhood = e.target.union(e.target.descendants()).union(e.target.connectedEdges());
      cy.elements().addClass('faded');
      neighborhood.removeClass('faded').addClass('highlighted');
    });
    cy.on('mouseout', 'node[type="category"]', clearHighlight);

    // Handle tapping on nodes for mobile/touch
    cy.on('tap', 'node', (e) => {
      if (e.target.hasClass('highlighted') && !e.target.isParent()) {
        clearHighlight();
      } else {
        clearHighlight(); // Clear previous highlights
        if (e.target.isParent()) {
            const neighborhood = e.target.union(e.target.descendants()).union(e.target.connectedEdges());
            cy.elements().addClass('faded');
            neighborhood.removeClass('faded').addClass('highlighted');
        } else {
            highlightNeighborhood(e.target);
        }
      }
    });

    cy.on('tap', (e) => e.target === cy && clearHighlight());

    return () => {
      cy.off('mouseover').off('mouseout').off('tap');
    };
  }, []); // The effect should run only once

  const stylesheet: any[] = [
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '100px',
        'transition-property': 'background-color, border-color, opacity',
        'transition-duration': '0.3s',
      },
    },
    {
      selector: 'edge',
      style: {
        'width': 1.5,
        'line-color': '#241468', // Dark purple
        'target-arrow-color': '#241468',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'transition-property': 'line-color, target-arrow-color, opacity, width',
        'transition-duration': '0.3s',
      },
    },
    { 
      selector: 'node[type="category"]', 
      style: { 
        'background-color': '#0F084B', // Even darker blue/purple
        'background-opacity': 0.5,
        'border-width': 2,
        'border-color': '#922D50', // Magenta-ish
        'color': '#efefef', 
        'font-size': '20px', 
        'font-weight': 'bold', 
        'text-valign': 'top',
        'text-halign': 'center',
        'padding': '20px',
      } 
    },
    { 
      selector: 'node[type="tech"]', 
      style: { 
        'background-color': '#241468', // Purple
        'border-width': 2,
        'border-color': '#00f6ff', // Cyan
        'color': '#fff', 
        'font-size': '14px',
        'shape': 'hexagon',
        'width': '100px',
        'height': '80px',
      } 
    },
    { 
      selector: 'node[type="book"]', 
      style: { 
        'background-color': '#922D50', // Magenta/red
        'border-width': 2,
        'border-color': '#fefefe',
        'color': '#fff', 
        'shape': 'round-tag', 
        'font-size': '12px',
        'width': '120px',
        'height': '80px',
      } 
    },
    { 
      selector: '.faded', 
      style: { 
        'opacity': 0.1 
      } 
    },
    { 
      selector: '.highlighted', 
      style: { 
        'opacity': 1,
      } 
    },
    {
        selector: 'edge.highlighted',
        style: {
          'line-color': '#ffc700', // Gold/yellow highlight
          'target-arrow-color': '#ffc700',
          'width': 4,
          'z-index': 10,
        }
    },
    {
        selector: 'node.highlighted',
        style: {
            'border-width': '4px',
            'border-color': '#ffc700',
            'z-index': 10,
        }
    }
  ];

  return (
    <CytoscapeComponent
      elements={CytoscapeComponent.normalizeElements(elements)}
      style={{ width: '100%', height: '100%' }}
      // @ts-ignore
      layout={{
        name: 'fcose',
        // Quality options
        quality: 'proof',
        // Animation options
        animate: true,
        animationDuration: 1000,
        // Layout tweaking
        fit: true,
        padding: 50,
        // Node separation
        nodeRepulsion: 4500,
        idealEdgeLength: 100,
        // Nesting options for compound nodes
        nestingFactor: 1.2,
        // Forcing options
        gravity: 0.25,
        // Randomize node positions on init
        randomize: true,
      }}
      stylesheet={stylesheet}
      cy={(cy: cytoscape.Core) => { cyRef.current = cy; }}
    />
  );
};

export default CytoscapeGraph; 