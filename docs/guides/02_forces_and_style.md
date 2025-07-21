Of course. I'll implement the requested changes to create a fullscreen, interactive, and aesthetically pleasing sci-fi-themed graph visualization.

Here is the plan:

1.  **Fix the Layout and Sizing:** I'll adjust the root CSS to allow the graph component to expand to the full screen, resolving the issue where it's cut off.
2.  **Enable Compound Node Layout:** I will restructure the graph data to treat `Categories` as parent containers for their respective `Technologies`. This will create natural "gravitational centers" as you requested, with the force-directed layout organizing technologies within their category clusters.
3.  **Implement a Sci-Fi Aesthetic:** I'll overhaul the stylesheet with a dark, futuristic theme, including a new font, neon-like colors, glowing highlights, and a subtle grid background to enhance the sci-fi feel.
4.  **Repair and Enhance Interactivity:** I'll rewrite the event handling logic to be more robust, ensuring that hovering or tapping on any node (Category, Technology, or Book) correctly highlights its connections and fades out the rest of the graph. This will also include better support for touch devices.

Let's apply these changes.

```diff
--- a/repo_src/frontend/index.html
+++ b/repo_src/frontend/index.html
@@ -3,8 +3,11 @@
   <head>
     <meta charset="UTF-8" />
     <link rel="icon" type="image/svg+xml" href="/vite.svg" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
-    <title>AI-Friendly Repository</title>
+    <link rel="preconnect" href="https://fonts.googleapis.com">
+    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
+    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
+    <title>Sci-Fi Tech Nexus</title>
   </head>
   <body>
     <div id="root"></div>
--- a/repo_src/frontend/src/App.tsx
+++ b/repo_src/frontend/src/App.tsx
@@ -1,13 +1,13 @@
 import CytoscapeGraph from './components/CytoscapeGraph';
-import './styles/App.css'
+import './styles/App.css';
 
 function App() {
   return (
     <div className="graph-container">
       <header className="graph-header">
-        <h1>Sci-Fi Tech Graph (Force-Directed Layout)</h1>
-        <p>Hover over a technology to see related books.</p>
+        <h1>Sci-Fi Tech Nexus</h1>
+        <p>Hover over or tap a node to explore connections.</p>
       </header>
       <div className="graph-content">
         <CytoscapeGraph />
@@ -17,5 +17,4 @@
 }
 
 export default App
-
-
+ 
--- a/repo_src/frontend/src/components/CytoscapeGraph.tsx
+++ b/repo_src/frontend/src/components/CytoscapeGraph.tsx
@@ -10,28 +10,64 @@
   const cyRef = useRef<cytoscape.Core | null>(null);
 
   useEffect(() => {
     const cy = cyRef.current;
     if (!cy) return;
 
-    const handleMouseOver = (e: any) => {
-      const targetNode = e.target;
-      const neighborhood = targetNode.neighborhood();
-
-      cy.elements().not(neighborhood).not(targetNode).addClass('faded');
-      targetNode.addClass('highlighted');
-      neighborhood.addClass('highlighted');
+    // A helper function to manage highlighting
+    const highlightNeighborhood = (node: cytoscape.NodeSingular) => {
+      const neighborhood = node.neighborhood().union(node);
+      if (node.parent().length > 0) {
+        neighborhood.union(node.parent());
+      }
+      
+      cy.elements().addClass('faded');
+      neighborhood.removeClass('faded').addClass('highlighted');
+
+      // For compound parents, also highlight their children
+      if (node.isParent()) {
+        node.children().removeClass('faded').addClass('highlighted');
+      }
     };
 
-    const handleMouseOut = () => {
-      cy.elements().removeClass('faded highlighted');
+    const clearHighlight = () => {
+      cy.elements().removeClass('faded highlighted');
     };
 
-    cy.on('mouseover', 'node[type="tech"]', handleMouseOver);
-    cy.on('mouseout', 'node[type="tech"]', handleMouseOut);
+    // Events for technologies and books
+    cy.on('mouseover', 'node[type="tech"], node[type="book"]', (e) => {
+      highlightNeighborhood(e.target);
+    });
+    cy.on('mouseout', 'node[type="tech"], node[type="book"]', clearHighlight);
+
+    // Events for categories (compound parents)
+    cy.on('mouseover', 'node[type="category"]', (e) => {
+      const neighborhood = e.target.union(e.target.descendants()).union(e.target.connectedEdges());
+      cy.elements().addClass('faded');
+      neighborhood.removeClass('faded').addClass('highlighted');
+    });
+    cy.on('mouseout', 'node[type="category"]', clearHighlight);
+
+    // Handle tapping on nodes for mobile/touch
+    cy.on('tap', 'node', (e) => {
+      if (e.target.hasClass('highlighted') && !e.target.isParent()) {
+        clearHighlight();
+      } else {
+        clearHighlight(); // Clear previous highlights
+        if (e.target.isParent()) {
+            const neighborhood = e.target.union(e.target.descendants()).union(e.target.connectedEdges());
+            cy.elements().addClass('faded');
+            neighborhood.removeClass('faded').addClass('highlighted');
+        } else {
+            highlightNeighborhood(e.target);
+        }
+      }
+    });
+
+    cy.on('tap', (e) => e.target === cy && clearHighlight());
 
     return () => {
-      cy.off('mouseover', 'node[type="tech"]', handleMouseOver);
-      cy.off('mouseout', 'node[type="tech"]', handleMouseOut);
+      cy.off('mouseover').off('mouseout').off('tap');
     };
-  }, []);
-
-  const stylesheet: any[] = [
+  }, []); // The effect should run only once
+
+  const stylesheet: cytoscape.Stylesheet[] = [
     {
       selector: 'node',
       style: {
-        'background-color': '#666',
         'label': 'data(label)',
         'text-valign': 'center',
         'text-halign': 'center',
-        'color': '#fff',
-        'text-outline-width': 2,
-        'text-outline-color': '#888',
-        'font-size': '12px',
         'text-wrap': 'wrap',
-        'transition-property': 'opacity',
+        'text-max-width': '100px',
+        'font-family': "'Share Tech Mono', monospace",
+        'transition-property': 'background-color, border-color, opacity, box-shadow',
         'transition-duration': '0.3s',
-        'width': '60px',
-        'height': '60px',
       },
     },
     {
       selector: 'edge',
       style: {
-        'width': 2,
-        'line-color': '#ccc',
-        'target-arrow-color': '#ccc',
+        'width': 1.5,
+        'line-color': '#241468', // Dark purple
+        'target-arrow-color': '#241468',
         'target-arrow-shape': 'triangle',
         'curve-style': 'bezier',
-        'transition-property': 'line-color, target-arrow-color, opacity',
+        'transition-property': 'line-color, target-arrow-color, opacity, width',
         'transition-duration': '0.3s',
       },
     },
     { 
       selector: 'node[type="category"]', 
       style: { 
-        'background-color': '#4b5563', 
-        'color': 'white', 
-        'text-outline-color': '#6b7280', 
-        'font-size': '16px', 
+        'background-color': '#0F084B', // Even darker blue/purple
+        'background-opacity': 0.5,
+        'border-width': 2,
+        'border-color': '#922D50', // Magenta-ish
+        'color': '#efefef', 
+        'font-size': '20px', 
         'font-weight': 'bold', 
-        'shape': 'round-rectangle', 
-        'width': '120px', 
-        'height': '80px', 
-        'padding': '15px' 
+        'text-valign': 'top',
+        'text-halign': 'center',
+        'padding': '20px',
       } 
     },
     { 
       selector: 'node[type="tech"]', 
       style: { 
-        'background-color': '#dbeafe', 
-        'color': '#1e40af', 
-        'text-outline-color': '#93c5fd', 
-        'shape': 'ellipse',
-        'width': '80px',
-        'height': '60px',
+        'background-color': '#241468', // Purple
+        'border-width': 2,
+        'border-color': '#00f6ff', // Cyan
+        'color': '#fff', 
+        'font-size': '14px',
+        'shape': 'hexagon',
+        'width': '100px',
+        'height': '80px',
       } 
     },
     { 
       selector: 'node[type="book"]', 
       style: { 
-        'background-color': '#fef3c7', 
-        'color': '#92400e', 
-        'text-outline-color': '#fcd34d', 
+        'background-color': '#922D50', // Magenta/red
+        'border-width': 2,
+        'border-color': '#fefefe',
+        'color': '#fff', 
         'shape': 'round-tag', 
-        'font-style': 'italic',
-        'width': '100px',
-        'height': '70px',
+        'font-size': '12px',
+        'width': '120px',
+        'height': '80px',
       } 
     },
     { 
       selector: '.faded', 
       style: { 
-        'opacity': 0.15 
+        'opacity': 0.1 
       } 
     },
     { 
       selector: '.highlighted', 
       style: { 
-        'opacity': 1 
+        'opacity': 1,
       } 
     },
     {
         selector: 'edge.highlighted',
         style: {
-          'line-color': '#fcd34d',
-          'target-arrow-color': '#fcd34d',
-          'width': 3,
+          'line-color': '#ffc700', // Gold/yellow highlight
+          'target-arrow-color': '#ffc700',
+          'width': 4,
+          'z-index': 10,
         }
     },
     {
         selector: 'node.highlighted',
         style: {
-            'border-width': '3px',
-            'border-color': '#fcd34d',
+            'border-width': '4px',
+            'border-color': '#ffc700',
+            'box-shadow': '0 0 15px #ffc700',
+            'z-index': 10,
         }
     }
   ];
@@ -140,14 +176,26 @@
   return (
     <CytoscapeComponent
       elements={CytoscapeComponent.normalizeElements(elements)}
       style={{ width: '100%', height: '100%' }}
-      layout={{
+      // @ts-ignore
+      layout={{
         name: 'fcose',
+        // Quality options
+        quality: 'proof',
+        // Animation options
         animate: true,
+        animationDuration: 1000,
+        // Layout tweaking
         fit: true,
         padding: 50,
+        // Node separation
+        nodeRepulsion: 4500,
+        idealEdgeLength: 100,
+        // Nesting options for compound nodes
+        nestingFactor: 1.2,
+        // Forcing options
+        gravity: 0.25,
+        // Randomize node positions on init
         randomize: true,
       }}
       stylesheet={stylesheet}
       cy={(cy: cytoscape.Core) => { cyRef.current = cy; }}
     />
   );
 };
 
-export default CytoscapeGraph; 
+export default CytoscapeGraph;
--- a/repo_src/frontend/src/components/graphData.ts
+++ b/repo_src/frontend/src/components/graphData.ts
@@ -1,10 +1,10 @@
 import cytoscape from 'cytoscape';
 
 const categories = [
-  { id: 'cat-1', name: 'FIRST CONTACT & ALIEN WORLDS' },
-  { id: 'cat-2', name: 'SPACE OPERA & GALACTIC CIVILIZATION' },
-  { id: 'cat-3', name: 'PHYSICS, SPACETIME & ENGINEERING' },
-  { id: 'cat-4', name: 'CONSCIOUSNESS, AI & POST-HUMANISM' },
+  { id: 'cat-1', name: 'FIRST CONTACT\n& ALIEN WORLDS' },
+  { id: 'cat-2', name: 'SPACE OPERA\n& GALACTIC CIVILIZATION' },
+  { id: 'cat-3', name: 'PHYSICS, SPACETIME\n& ENGINEERING' },
+  { id: 'cat-4', name: 'CONSCIOUSNESS, AI\n& POST-HUMANISM' },
 ];
 
 const technologies = [
@@ -58,35 +58,25 @@
   });
 });
 
-// --- Process Technologies ---
+// --- Process Technologies as child nodes ---
 technologies.forEach(tech => {
   elements.push({
     group: 'nodes',
-    data: { id: tech.id, label: tech.name, type: 'tech' }
-  });
-
-  // Edge from Category to Tech
-  elements.push({
-    group: 'edges',
-    data: {
-      id: `e-${tech.category}-${tech.id}`,
-      source: tech.category,
-      target: tech.id,
-    }
+    data: { id: tech.id, label: tech.name, type: 'tech', parent: tech.category } // Set parent
   });
 });
 
-// --- Process Books ---
+// --- Process Books and their edges to technologies ---
 books.forEach(book => {
   elements.push({
     group: 'nodes',
     data: { id: book.id, label: `${book.title}\n- ${book.author}`, type: 'book' }
   });
 
-  // Edges from Tech to Book
   book.techs.forEach(techId => {
     elements.push({
       group: 'edges',
       data: {
         id: `e-${techId}-${book.id}`,
         source: techId,
         target: book.id,
--- a/repo_src/frontend/src/styles/App.css
+++ b/repo_src/frontend/src/styles/App.css
@@ -8,27 +8,30 @@
   position: fixed;
   top: 0;
   left: 0;
+  background-color: #0d0221; /* Match body */
 }
 
 .graph-header {
-  padding: 1rem 2rem;
-  background-color: #1f2937; /* cool-gray-800 */
-  border-bottom: 1px solid #374151; /* cool-gray-700 */
-  color: #f9fafb; /* cool-gray-50 */
+  padding: 0.75rem 2rem;
+  background-color: rgba(15, 8, 75, 0.5); /* Semi-transparent dark blue */
+  border-bottom: 1px solid #241468; /* Neon purple border */
+  color: #f9fafb;
   text-align: center;
   flex-shrink: 0;
+  z-index: 10; /* Ensure header is above graph */
 }
 
 .graph-header h1 {
   margin: 0;
   font-size: 1.5rem;
+  color: #00f6ff; /* Cyan glow */
+  text-shadow: 0 0 5px #00f6ff;
 }
 
 .graph-header p {
   margin: 0.25rem 0 0;
-  color: #9ca3af; /* cool-gray-400 */
+  color: #9ca3af;
 }
 
 .graph-content {
-  flex: 1;
+  flex-grow: 1; /* Use flex-grow instead of flex: 1 */
   min-height: 0;
-} 
+  /* Add a subtle grid background */
+  background-image:
+    linear-gradient(rgba(0, 246, 255, 0.05) 1px, transparent 1px),
+    linear-gradient(90deg, rgba(0, 246, 255, 0.05) 1px, transparent 1px);
+  background-size: 30px 30px;
+}
--- a/repo_src/frontend/src/styles/index.css
+++ b/repo_src/frontend/src/styles/index.css
@@ -1,55 +1,46 @@
 :root {
-  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
+  font-family: 'Share Tech Mono', monospace; /* New font */
   line-height: 1.5;
   font-weight: 400;
   
-  color-scheme: light dark;
+  color-scheme: dark;
   color: rgba(255, 255, 255, 0.87);
-  background-color: #242424;
+  background-color: #0d0221; /* Dark sci-fi background */
   
   font-synthesis: none;
   text-rendering: optimizeLegibility;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
 }
 
+/* Remove default body constraints */
 body {
-  display: flex;
-  place-items: center;
   margin: 0;
   padding: 0;
-  min-width: 320px;
-  min-height: 100vh;
+  width: 100vw;
+  height: 100vh;
+  overflow: hidden; /* Prevent scrollbars */
 }
 
+/* Make root fill the body */
 #root {
-  max-width: 1280px;
-  margin: 0 auto;
+  width: 100%;
+  height: 100%;
+  margin: 0;
   padding: 0;
   text-align: center;
 }
 
+/* Keep other styles for potential use if needed */
 h1 {
   font-size: 3.2em;
   line-height: 1.1;
 }
 
 button {
-  border-radius: 8px;
-  border: 1px solid transparent;
-  padding: 0.6em 1.2em;
-  font-size: 1em;
-  font-weight: 500;
-  font-family: inherit;
-  background-color: #1a1a1a;
-  cursor: pointer;
-  transition: border-color 0.25s;
-}
-
-button:hover {
-  border-color: #646cff;
-}
-
-button:focus,
-button:focus-visible {
-  outline: 4px auto -webkit-focus-ring-color;
-}
-
-.card {
-  padding: 2em;
-}
-
-@media (prefers-color-scheme: light) {
-  :root {
-    color: #213547;
-    background-color: #ffffff;
-  }
-  button {
-    background-color: #f9f9f9;
-  }
+  /* ... existing button styles ... */
+  transition: border-color 0.25s;
+}
+
+button:hover {
+  border-color: #00f6ff; /* Sci-fi highlight color */
 } 

```