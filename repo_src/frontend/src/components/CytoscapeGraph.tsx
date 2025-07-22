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
      // Clear all existing classes first
      cy.elements().removeClass('faded highlighted');
      
      // Get all connected elements (neighborhood + the node itself)
      const neighborhood = node.neighborhood();
      const toHighlight = neighborhood.union(node);
      
      // Get everything that should be faded (everything NOT in toHighlight)
      const toFade = cy.elements().not(toHighlight);
      
      // Apply the classes
      toFade.addClass('faded');
      toHighlight.addClass('highlighted');
      
      // Double-check: ensure the original node is definitely highlighted
      node.addClass('highlighted').removeClass('faded');
    };

    const clearHighlight = () => {
      cy.elements().removeClass('faded highlighted');
    };

    // Events for all node types
    cy.on('mouseover', 'node', (e) => {
      highlightNeighborhood(e.target);
    });
    cy.on('mouseout', 'node', clearHighlight);

    // Handle tapping on nodes for mobile/touch
    cy.on('tap', 'node', (e) => {
      if (e.target.hasClass('highlighted')) {
        clearHighlight();
      } else {
        clearHighlight(); // Clear previous highlights
        highlightNeighborhood(e.target);
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
        'text-max-width': '120px',
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
        'border-width': 3,
        'border-color': '#922D50', // Magenta-ish
        'color': '#efefef', 
        'font-size': '18px', 
        'font-weight': 'bold', 
        'shape': 'round-rectangle',
        'width': '180px',
        'height': '120px',
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