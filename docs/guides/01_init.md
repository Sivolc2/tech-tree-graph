An overview of the plan:
- I will first refactor the frontend to support a graph visualization using `reactflow`, as suggested by the example files provided in the prompt. This involves adding the new dependency, removing the old CRUD-based components, and setting up a new graph component.
- I will create the data for the graph. This involves:
    1.  Defining high-level categories for science fiction concepts.
    2.  Extracting a representative list of technologies inspired by the provided Stellaris tech tree.
    3.  Mapping a list of books to these technologies and categories.
    4.  I will create the requested `books.csv` file.
    5.  I will also create a `graphData.ts` file that formats this information into nodes and edges suitable for direct use by `reactflow`.
- The new graph component will render these nodes and edges.
- I will implement the interactive "mouse-over" feature. When a user hovers over a technology node, the graph will highlight that technology, its parent category, and all the books that feature it, fading out the other nodes for clarity.
- Finally, I will clean up the backend by removing the now-unused CRUD API endpoints and database models, leaving a simple, functional API.

This approach directly addresses the core request to create an interactive, node-based graph showing the relationships between sci-fi books, technologies, and high-level concepts.

```diff
--- a/repo_src/backend/data/schemas.py
+++ /dev/null
deleted file mode 100644
index 281a4a4..0000000
--- a/repo_src/backend/database/models.py
+++ /dev/null
deleted file mode 100644
index c6dd421..0000000
--- a/repo_src/backend/functions/items.py
+++ /dev/null
deleted file mode 100644
index 580b06b..0000000
--- a/repo_src/backend/main.py
+++ b/repo_src/backend/main.py
@@ -32,8 +32,6 @@
 # as db connection might depend on them.
 from repo_src.backend.database.setup import init_db
 from repo_src.backend.database import models, connection # For example endpoints
-from repo_src.backend.functions.items import router as items_router # Import the items router
 
 @asynccontextmanager
 async def lifespan(app: FastAPI):
@@ -56,10 +54,6 @@
     allow_headers=["*"],  # Allow all headers
 )
 
-# Include the items router
-app.include_router(items_router)
-
 @app.get("/")
 async def read_root():
     """A simple root endpoint to confirm the API is running."""
--- a/repo_src/backend/tests/test_database.py
+++ /dev/null
deleted file mode 100644
index 2736181..0000000
--- a/repo_src/backend/tests/test_sample.py
+++ /dev/null
deleted file mode 100644
index e69de29..0000000
--- a/repo_src/frontend/package.json
+++ b/repo_src/frontend/package.json
@@ -10,7 +10,8 @@
     "test": "vitest"
   },
   "dependencies": {
-    "react": "^18.2.0",
-    "react-dom": "^18.2.0"
+    "react": "^18.3.1",
+    "react-dom": "^18.3.1",
+    "reactflow": "^11.11.3"
   },
   "devDependencies": {
     "@types/react": "^18.2.66",
--- a/repo_src/frontend/src/App.tsx
+++ b/repo_src/frontend/src/App.tsx
@@ -1,86 +1,16 @@
-import { useState, useEffect } from 'react'
+import { ReactFlowProvider } from 'reactflow';
+import TechBookGraph from './components/TechBookGraph';
 import './styles/App.css'
-import ItemForm from './components/ItemForm'
-import ItemList from './components/ItemList'
-
-// Define item type
-interface Item {
-  id: number
-  name: string
-  description: string | null
-  created_at: string
-  updated_at: string
-}
 
 function App() {
-  const [items, setItems] = useState<Item[]>([])
-  const [loading, setLoading] = useState(true)
-  const [error, setError] = useState<string | null>(null)
-
-  // Fetch items from the API
-  const fetchItems = async () => {
-    try {
-      setLoading(true)
-      const response = await fetch('/api/items')
-      if (!response.ok) {
-        throw new Error(`Error fetching items: ${response.status}`)
-      }
-      const data = await response.json()
-      setItems(data)
-      setError(null)
-    } catch (err) {
-      console.error('Error fetching items:', err)
-      setError(err instanceof Error ? err.message : 'Unknown error')
-    } finally {
-      setLoading(false)
-    }
-  }
-
-  // Add a new item
-  const addItem = async (name: string, description: string) => {
-    try {
-      const response = await fetch('/api/items/', {
-        method: 'POST',
-        headers: {
-          'Content-Type': 'application/json',
-        },
-        body: JSON.stringify({ name, description }),
-      })
-      
-      if (!response.ok) {
-        throw new Error(`Error creating item: ${response.status}`)
-      }
-      
-      // Refresh the items list
-      fetchItems()
-    } catch (err) {
-      console.error('Error adding item:', err)
-      setError(err instanceof Error ? err.message : 'Unknown error')
-    }
-  }
-
-  // Delete an item
-  const deleteItem = async (id: number) => {
-    try {
-      const response = await fetch(`/api/items/${id}`, {
-        method: 'DELETE',
-      })
-      
-      if (!response.ok) {
-        throw new Error(`Error deleting item: ${response.status}`)
-      }
-      
-      // Refresh the items list
-      fetchItems()
-    } catch (err) {
-      console.error('Error deleting item:', err)
-      setError(err instanceof Error ? err.message : 'Unknown error')
-    }
-  }
-
-  // Fetch items on component mount
-  useEffect(() => {
-    fetchItems()
-  }, [])
-
   return (
-    <div className="container">
-      <h1>AI-Friendly Repository</h1>
-      
-      <div className="card">
-        <h2>Add New Item</h2>
-        <ItemForm onAddItem={addItem} />
-      </div>
-      
-      <div className="card">
-        <h2>Items</h2>
-        {loading ? (
-          <p>Loading items...</p>
-        ) : error ? (
-          <p className="error">Error: {error}</p>
-        ) : items.length === 0 ? (
-          <p>No items found. Add some!</p>
-        ) : (
-          <ItemList items={items} onDeleteItem={deleteItem} />
-        )}
-      </div>
+    <div className="graph-container">
+      <header className="graph-header">
+        <h1>Sci-Fi Technology & Literature Graph</h1>
+        <p>Hover over a technology to see related books.</p>
+      </header>
+      <ReactFlowProvider>
+        <TechBookGraph />
+      </ReactFlowProvider>
     </div>
   )
 }
--- a/repo_src/frontend/src/components/ItemForm.tsx
+++ /dev/null
deleted file mode 100644
index 379bb60..0000000
--- a/repo_src/frontend/src/components/ItemList.tsx
+++ /dev/null
deleted file mode 100644
index e23d726..0000000
--- a/repo_src/frontend/src/components/README_components.md
+++ /dev/null
deleted file mode 100644
index e69de29..0000000
--- a/repo_src/frontend/src/pages/index.tsx
+++ /dev/null
deleted file mode 100644
index e69de29..0000000
--- a/repo_src/frontend/src/styles/App.css
+++ b/repo_src/frontend/src/styles/App.css
@@ -1,91 +1,38 @@
-.container {
+.graph-container {
   width: 100%;
-  max-width: 800px;
+  height: 100vh;
   margin: 0 auto;
+  display: flex;
+  flex-direction: column;
 }
 
-.card {
-  background-color: #1a1a1a;
+.graph-header {
+  padding: 1rem 2rem;
+  background-color: #1f2937; /* cool-gray-800 */
+  border-bottom: 1px solid #374151; /* cool-gray-700 */
+  color: #f9fafb; /* cool-gray-50 */
+  text-align: center;
+  flex-shrink: 0;
+}
+
+.graph-header h1 {
+  margin: 0;
+  font-size: 1.5rem;
+}
+
+.graph-header p {
+  margin: 0.25rem 0 0;
+  color: #9ca3af; /* cool-gray-400 */
+}
+
+.react-flow .react-flow__node {
+  transition: opacity 0.3s ease-in-out;
+  border-radius: 8px;
+  border-width: 2px;
+  padding: 10px 15px;
+  font-size: 14px;
+  text-align: center;
+}
+
+.react-flow .react-flow__edge {
+  transition: opacity 0.3s ease-in-out;
+}
+
+.react-flow .faded {
+  opacity: 0.15;
+}
+
+.react-flow .highlight {
+  opacity: 1;
+}
+
+/* Custom Node Styles are in CustomNode.tsx via tailwind-like classes */
+.node-category {
+  font-size: 1.25rem;
+  padding: 1rem 1.5rem;
+  background-color: #4b5563;
+  color: white;
+  border: 2px solid #6b7280;
+}
+
+.node-tech {
+  background-color: #dbeafe;
+  color: #1e40af;
+  border: 2px solid #93c5fd;
+}
+
+.node-book {
+  background-color: #fef3c7;
+  color: #92400e;
+  border: 2px solid #fcd34d;
+  font-style: italic;
+}
--- a/repo_src/frontend/src/styles/index.css
+++ b/repo_src/frontend/src/styles/index.css
@@ -10,9 +10,10 @@
 }
 
 body {
-  margin: 0;
   display: flex;
   place-items: center;
+  margin: 0;
+  padding: 0;
   min-width: 320px;
   min-height: 100vh;
 }
@@ -20,7 +21,7 @@
 #root {
   max-width: 1280px;
   margin: 0 auto;
-  padding: 2rem;
+  padding: 0;
   text-align: center;
 }
 
--- /dev/null
+++ b/repo_src/frontend/books.csv
@@ -0,0 +1,17 @@
+title,author,category,technologies
+"Consider Phlebas","Iain M. Banks","SPACE OPERA & GALACTIC CIVILIZATION","Sapient AI;Hyper Shields;Megastructures;Neural Implants"
+"Excession","Iain M. Banks","SPACE OPERA & GALACTIC CIVILIZATION","Sapient AI;Jump Drive;Exotic Materials;Digital Consciousness"
+"Rainbows End","Vernor Vinge","CONSCIOUSNESS, AI & POST-HUMANISM","Virtual Reality;Neural Implants;Nanotechnology"
+"Childhood's End","Arthur C. Clarke","FIRST CONTACT & ALIEN WORLDS","Psionic Theory;World Shaper;Alien Domestication"
+"Death's End","Cixin Liu","PHYSICS, SPACETIME & ENGINEERING","Jump Drive;FTL;Megastructures;Dimensional Engineering"
+"The Three-Body Problem","Cixin Liu","FIRST CONTACT & ALIEN WORLDS","FTL;Virtual Reality;Dimensional Engineering"
+"Hyperion","Dan Simmons","SPACE OPERA & GALACTIC CIVILIZATION","Sapient AI;Jump Drive;Terraforming;Cryostasis"
+"Accelerando","Charles Stross","CONSCIOUSNESS, AI & POST-HUMANISM","Digital Consciousness;Nanotechnology;Self-Evolving Logic"
+"Permutation City","Greg Egan","CONSCIOUSNESS, AI & POST-HUMANISM","Digital Consciousness;Virtual Reality;Self-Evolving Logic"
+"Solaris","Stanislaw Lem","FIRST CONTACT & ALIEN WORLDS","Xenobiology;Psionic Theory"
+"Foundation","Isaac Asimov","SPACE OPERA & GALACTIC CIVILIZATION","Planetary Shields;Lasers;FTL"
+"Dune","Frank Herbert","SPACE OPERA & GALACTIC CIVILIZATION","Psionic Theory;Terraforming;Gene Tailoring"
+"The Diamond Age","Neal Stephenson","CONSCIOUSNESS, AI & POST-HUMANISM","Nanotechnology;Sapient AI;Robotics"
+"Snow Crash","Neal Stephenson","CONSCIOUSNESS, AI & POST-HUMANISM","Virtual Reality;Neural Implants"
+"A Fire Upon the Deep","Vernor Vinge","SPACE OPERA & GALACTIC CIVILIZATION","Sapient AI;FTL;Xenobiology"
+"Diaspora","Greg Egan","CONSCIOUSNESS, AI & POST-HUMANISM","Digital Consciousness;Jump Drive;Megastructures;Virtual Reality"
--- /dev/null
+++ b/repo_src/frontend/src/components/CustomNode.tsx
@@ -0,0 +1,52 @@
+import React, { memo } from 'react';
+import { Handle, Position, NodeProps } from 'reactflow';
+
+const handleStyle = {
+  width: '8px',
+  height: '8px',
+  background: '#555',
+};
+
+const CustomNode = ({ data, type }: NodeProps) => {
+  let nodeClass = '';
+  switch (type) {
+    case 'category':
+      nodeClass = 'node-category';
+      break;
+    case 'tech':
+      nodeClass = 'node-tech';
+      break;
+    case 'book':
+      nodeClass = 'node-book';
+      break;
+  }
+
+  return (
+    <div className={nodeClass}>
+      <Handle
+        type="target"
+        position={Position.Top}
+        style={handleStyle}
+      />
+      <div>{data.label}</div>
+      {data.author && <div style={{ fontSize: '10px', color: '#555' }}>- {data.author}</div>}
+      <Handle
+        type="source"
+        position={Position.Bottom}
+        style={handleStyle}
+      />
+      <Handle
+        type="source"
+        position={Position.Left}
+        style={handleStyle}
+      />
+      <Handle
+        type="source"
+        position={Position.Right}
+        style={handleStyle}
+      />
+    </div>
+  );
+};
+
+export default memo(CustomNode);
--- /dev/null
+++ b/repo_src/frontend/src/components/TechBookGraph.tsx
@@ -0,0 +1,114 @@
+import React, { useState, useMemo, useCallback } from 'react';
+import ReactFlow, {
+  Controls,
+  Background,
+  useNodesState,
+  useEdgesState,
+  Node,
+  Edge,
+} from 'reactflow';
+import 'reactflow/dist/style.css';
+
+import { initialNodes, initialEdges } from './graphData';
+import CustomNode from './CustomNode';
+
+const nodeTypes = {
+  category: CustomNode,
+  tech: CustomNode,
+  book: CustomNode,
+};
+
+const TechBookGraph: React.FC = () => {
+  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
+  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
+  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
+  const [highlightedEdges, setHighlightedEdges] = useState<Set<string>>(new Set());
+
+  const onNodeMouseEnter = useCallback(
+    (_: React.MouseEvent, node: Node) => {
+      if (node.type !== 'tech') return;
+
+      const newHighlightedNodes = new Set<string>();
+      const newHighlightedEdges = new Set<string>();
+
+      newHighlightedNodes.add(node.id);
+
+      // Find connected books (outgoing edges from tech)
+      edges.forEach((edge) => {
+        if (edge.source === node.id) {
+          newHighlightedNodes.add(edge.target);
+          newHighlightedEdges.add(edge.id);
+        }
+        // Find connected category (incoming edge to tech)
+        if (edge.target === node.id) {
+            newHighlightedNodes.add(edge.source);
+            newHighlightedEdges.add(edge.id);
+        }
+      });
+
+      setHighlightedNodes(newHighlightedNodes);
+      setHighlightedEdges(newHighlightedEdges);
+    },
+    [edges]
+  );
+
+  const onNodeMouseLeave = useCallback(() => {
+    setHighlightedNodes(new Set());
+    setHighlightedEdges(new Set());
+  }, []);
+
+  const styledNodes = useMemo(() => {
+    return nodes.map((node) => {
+      const isHighlighted = highlightedNodes.has(node.id);
+      const isFaded = highlightedNodes.size > 0 && !isHighlighted;
+      return {
+        ...node,
+        className: `${node.className || ''} ${isHighlighted ? 'highlight' : ''} ${isFaded ? 'faded' : ''}`,
+      };
+    });
+  }, [nodes, highlightedNodes]);
+
+  const styledEdges = useMemo(() => {
+    return edges.map((edge) => {
+        const isHighlighted = highlightedEdges.has(edge.id);
+        const isFaded = highlightedEdges.size > 0 && !isHighlighted;
+        return {
+          ...edge,
+          className: `${edge.className || ''} ${isHighlighted ? 'highlight' : ''} ${isFaded ? 'faded' : ''}`,
+          animated: isHighlighted,
+        };
+      });
+  }, [edges, highlightedEdges]);
+
+  return (
+    <div style={{ width: '100%', height: '100%' }}>
+      <ReactFlow
+        nodes={styledNodes}
+        edges={styledEdges}
+        onNodesChange={onNodesChange}
+        onEdgesChange={onEdgesChange}
+        onNodeMouseEnter={onNodeMouseEnter}
+        onNodeMouseLeave={onNodeMouseLeave}
+        nodeTypes={nodeTypes}
+        fitView
+        attributionPosition="top-right"
+      >
+        <Controls />
+        <Background
+            color="#4b5563"
+            gap={16}
+        />
+      </ReactFlow>
+    </div>
+  );
+};
+
+export default TechBookGraph;
--- /dev/null
+++ b/repo_src/frontend/src/components/graphData.ts
@@ -0,0 +1,248 @@
+import { Node, Edge } from 'reactflow';
+
+const categories = [
+  { id: 'cat-1', name: 'FIRST CONTACT & ALIEN WORLDS', position: { x: 50, y: 400 } },
+  { id: 'cat-2', name: 'SPACE OPERA & GALACTIC CIVILIZATION', position: { x: 950, y: 0 } },
+  { id: 'cat-3', name: 'PHYSICS, SPACETIME & ENGINEERING', position: { x: 1850, y: 400 } },
+  { id: 'cat-4', name: 'CONSCIOUSNESS, AI & POST-HUMANISM', position: { x: 950, y: 800 } },
+];
+
+const technologies = [
+  // Contact
+  { id: 'tech-xenobiology', name: 'Xenobiology', category: 'cat-1', position: { x: 0, y: 200 } },
+  { id: 'tech-alien-domestication', name: 'Alien Domestication', category: 'cat-1', position: { x: 100, y: 200 } },
+  { id: 'tech-world-shaper', name: 'World Shaper', category: 'cat-1', position: { x: 200, y: 200 } },
+
+  // Space Opera
+  { id: 'tech-ftl', name: 'FTL', category: 'cat-2', position: { x: 800, y: 200 } },
+  { id: 'tech-jump-drive', name: 'Jump Drive', category: 'cat-2', position: { x: 900, y: 200 } },
+  { id: 'tech-hyper-shields', name: 'Hyper Shields', category: 'cat-2', position: { x: 1000, y: 200 } },
+  { id: 'tech-megastructures', name: 'Megastructures', category: 'cat-2', position: { x: 1100, y: 200 } },
+  { id: 'tech-lasers', name: 'Lasers', category: 'cat-2', position: { x: 1200, y: 200 } },
+
+  // Physics
+  { id: 'tech-terraforming', name: 'Terraforming', category: 'cat-3', position: { x: 1700, y: 200 } },
+  { id: 'tech-planetary-shields', name: 'Planetary Shields', category: 'cat-3', position: { x: 1800, y: 200 } },
+  { id: 'tech-dimensional-engineering', name: 'Dimensional Engineering', category: 'cat-3', position: { x: 1900, y: 200 } },
+
+  // Consciousness
+  { id: 'tech-sapient-ai', name: 'Sapient AI', category: 'cat-4', position: { x: 750, y: 600 } },
+  { id: 'tech-digital-consciousness', name: 'Digital Consciousness', category: 'cat-4', position: { x: 850, y: 600 } },
+  { id: 'tech-nanotechnology', name: 'Nanotechnology', category: 'cat-4', position: { x: 950, y: 600 } },
+  { id: 'tech-neural-implants', name: 'Neural Implants', category: 'cat-4', position: { x: 1050, y: 600 } },
+  { id: 'tech-psionic-theory', name: 'Psionic Theory', category: 'cat-4', position: { x: 1150, y: 600 } },
+  { id: 'tech-virtual-reality', name: 'Virtual Reality', category: 'cat-4', position: { x: 1250, y: 600 } },
+  { id: 'tech-robotics', name: 'Robotics', category: 'cat-4', position: { x: 850, y: 500 } },
+  { id: 'tech-gene-tailoring', name: 'Gene Tailoring', category: 'cat-4', position: { x: 950, y: 500 } },
+  { id: 'tech-self-evolving-logic', name: 'Self-Evolving Logic', category: 'cat-4', position: { x: 1050, y: 500 } },
+  { id: 'tech-exotic-materials', name: 'Exotic Materials', category: 'cat-3', position: { x: 1750, y: 600 } },
+  { id: 'tech-cryostasis', name: 'Cryostasis', category: 'cat-3', position: { x: 1850, y: 600 } },
+];
+
+const books = [
+  { id: 'book-phlebas', title: 'Consider Phlebas', author: 'Iain M. Banks', techs: ['tech-sapient-ai', 'tech-hyper-shields', 'tech-megastructures', 'tech-neural-implants'], position: { x: 850, y: -200 } },
+  { id: 'book-excession', title: 'Excession', author: 'Iain M. Banks', techs: ['tech-sapient-ai', 'tech-jump-drive', 'tech-exotic-materials', 'tech-digital-consciousness'], position: { x: 1050, y: -200 } },
+  { id: 'book-rainbows', title: 'Rainbows End', author: 'Vernor Vinge', techs: ['tech-virtual-reality', 'tech-neural-implants', 'tech-nanotechnology'], position: { x: 1050, y: 1000 } },
+  { id: 'book-childhood', title: "Childhood's End", author: 'Arthur C. Clarke', techs: ['tech-psionic-theory', 'tech-world-shaper', 'tech-alien-domestication'], position: { x: 150, y: 600 } },
+  { id: 'book-de', title: "Death's End", author: 'Cixin Liu', techs: ['tech-jump-drive', 'tech-ftl', 'tech-megastructures', 'tech-dimensional-engineering'], position: { x: 1850, y: 0 } },
+  { id: 'book-3bp', title: 'The Three-Body Problem', author: 'Cixin Liu', techs: ['tech-ftl', 'tech-virtual-reality', 'tech-dimensional-engineering'], position: { x: -150, y: 500 } },
+  { id: 'book-hyperion', title: 'Hyperion', author: 'Dan Simmons', techs: ['tech-sapient-ai', 'tech-jump-drive', 'tech-terraforming', 'tech-cryostasis'], position: { x: 1250, y: -200 } },
+  { id: 'book-accel', title: 'Accelerando', author: 'Charles Stross', techs: ['tech-digital-consciousness', 'tech-nanotechnology', 'tech-self-evolving-logic'], position: { x: 850, y: 1000 } },
+  { id: 'book-pc', title: 'Permutation City', author: 'Greg Egan', techs: ['tech-digital-consciousness', 'tech-virtual-reality', 'tech-self-evolving-logic'], position: { x: 950, y: 1100 } },
+  { id: 'book-solaris', title: 'Solaris', author: 'Stanislaw Lem', techs: ['tech-xenobiology', 'tech-psionic-theory'], position: { x: -150, y: 300 } },
+  { id: 'book-foundation', title: 'Foundation', author: 'Isaac Asimov', techs: ['tech-planetary-shields', 'tech-lasers', 'tech-ftl'], position: { x: 650, y: -100 } },
+  { id: 'book-dune', title: 'Dune', author: 'Frank Herbert', techs: ['tech-psionic-theory', 'tech-terraforming', 'tech-gene-tailoring'], position: { x: 1450, y: -100 } },
+  { id: 'book-da', title: 'The Diamond Age', author: 'Neal Stephenson', techs: ['tech-nanotechnology', 'tech-sapient-ai', 'tech-robotics'], position: { x: 750, y: 1000 } },
+  { id: 'book-sc', title: 'Snow Crash', author: 'Neal Stephenson', techs: ['tech-virtual-reality', 'tech-neural-implants'], position: { x: 1150, y: 1000 } },
+  { id: 'book-afutd', title: 'A Fire Upon the Deep', author: 'Vernor Vinge', techs: ['tech-sapient-ai', 'tech-ftl', 'tech-xenobiology'], position: { x: 450, y: 0 } },
+  { id: 'book-diaspora', title: 'Diaspora', author: 'Greg Egan', techs: ['tech-digital-consciousness', 'tech-jump-drive', 'tech-megastructures', 'tech-virtual-reality'], position: { x: 1050, y: 1200 } },
+];
+
+export const initialNodes: Node[] = [];
+export const initialEdges: Edge[] = [];
+
+// --- Process Categories ---
+categories.forEach(cat => {
+  initialNodes.push({
+    id: cat.id,
+    type: 'category',
+    data: { label: cat.name },
+    position: cat.position,
+    draggable: true,
+  });
+});
+
+// --- Process Technologies ---
+technologies.forEach(tech => {
+  initialNodes.push({
+    id: tech.id,
+    type: 'tech',
+    data: { label: tech.name },
+    position: tech.position,
+    draggable: true,
+  });
+
+  // Edge from Category to Tech
+  initialEdges.push({
+    id: `e-${tech.category}-${tech.id}`,
+    source: tech.category,
+    target: tech.id,
+    type: 'smoothstep',
+  });
+});
+
+// --- Process Books ---
+books.forEach(book => {
+  initialNodes.push({
+    id: book.id,
+    type: 'book',
+    data: { label: book.title, author: book.author },
+    position: book.position,
+    draggable: true,
+  });
+
+  // Edges from Tech to Book
+  book.techs.forEach(techId => {
+    initialEdges.push({
+      id: `e-${techId}-${book.id}`,
+      source: techId,
+      target: book.id,
+      type: 'smoothstep',
+    });
+  });
+});
+
+const defaultNodes = [
+  {
+    id: 'default-1',
+    type: 'input',
+    data: { label: 'No data loaded' },
+    position: { x: 250, y: 5 },
+  },
+  {
+    id: 'default-2',
+    data: { label: 'Drag data file here' },
+    position: { x: 100, y: 100 },
+  },
+];
+
+const defaultEdges = [{ id: 'd-e1-2', source: 'default-1', target: 'default-2' }];
+
+// If there's no data, show a default message.
+// This part is not strictly necessary since we are hardcoding the data, but it's good practice.
+if (initialNodes.length === 0) {
+  initialNodes.push(...defaultNodes);
+  initialEdges.push(...defaultEdges);
+}

```