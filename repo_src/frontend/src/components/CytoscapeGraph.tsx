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

    const handleMouseOver = (e: any) => {
      const targetNode = e.target;
      const neighborhood = targetNode.neighborhood();

      cy.elements().not(neighborhood).not(targetNode).addClass('faded');
      targetNode.addClass('highlighted');
      neighborhood.addClass('highlighted');
    };

    const handleMouseOut = () => {
      cy.elements().removeClass('faded highlighted');
    };

    cy.on('mouseover', 'node[type="tech"]', handleMouseOver);
    cy.on('mouseout', 'node[type="tech"]', handleMouseOut);

    return () => {
      cy.off('mouseover', 'node[type="tech"]', handleMouseOver);
      cy.off('mouseout', 'node[type="tech"]', handleMouseOut);
    };
  }, []);

  const stylesheet: any[] = [
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'color': '#fff',
        'text-outline-width': 2,
        'text-outline-color': '#888',
        'font-size': '12px',
        'text-wrap': 'wrap',
        'transition-property': 'opacity',
        'transition-duration': '0.3s',
        'width': '60px',
        'height': '60px',
      },
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'transition-property': 'line-color, target-arrow-color, opacity',
        'transition-duration': '0.3s',
      },
    },
    { 
      selector: 'node[type="category"]', 
      style: { 
        'background-color': '#4b5563', 
        'color': 'white', 
        'text-outline-color': '#6b7280', 
        'font-size': '16px', 
        'font-weight': 'bold', 
        'shape': 'round-rectangle', 
        'width': '120px', 
        'height': '80px', 
        'padding': '15px' 
      } 
    },
    { 
      selector: 'node[type="tech"]', 
      style: { 
        'background-color': '#dbeafe', 
        'color': '#1e40af', 
        'text-outline-color': '#93c5fd', 
        'shape': 'ellipse',
        'width': '80px',
        'height': '60px',
      } 
    },
    { 
      selector: 'node[type="book"]', 
      style: { 
        'background-color': '#fef3c7', 
        'color': '#92400e', 
        'text-outline-color': '#fcd34d', 
        'shape': 'round-tag', 
        'font-style': 'italic',
        'width': '100px',
        'height': '70px',
      } 
    },
    { 
      selector: '.faded', 
      style: { 
        'opacity': 0.15 
      } 
    },
    { 
      selector: '.highlighted', 
      style: { 
        'opacity': 1 
      } 
    },
    {
        selector: 'edge.highlighted',
        style: {
          'line-color': '#fcd34d',
          'target-arrow-color': '#fcd34d',
          'width': 3,
        }
    },
    {
        selector: 'node.highlighted',
        style: {
            'border-width': '3px',
            'border-color': '#fcd34d',
        }
    }
  ];

  return (
    <CytoscapeComponent
      elements={CytoscapeComponent.normalizeElements(elements)}
      style={{ width: '100%', height: '100%' }}
      layout={{
        name: 'fcose',
        animate: true,
        fit: true,
        padding: 50,
        randomize: true,
      }}
      stylesheet={stylesheet}
      cy={(cy: cytoscape.Core) => { cyRef.current = cy; }}
    />
  );
};

export default CytoscapeGraph; 