import cytoscape from 'cytoscape';

const categories = [
  { id: 'cat-1', name: 'FIRST CONTACT\n& ALIEN WORLDS' },
  { id: 'cat-2', name: 'SPACE OPERA\n& GALACTIC CIVILIZATION' },
  { id: 'cat-3', name: 'PHYSICS, SPACETIME\n& ENGINEERING' },
  { id: 'cat-4', name: 'CONSCIOUSNESS, AI\n& POST-HUMANISM' },
];

const technologies = [
  // Contact
  { id: 'tech-xenobiology', name: 'Xenobiology', category: 'cat-1' },
  { id: 'tech-alien-domestication', name: 'Alien Domestication', category: 'cat-1' },
  { id: 'tech-world-shaper', name: 'World Shaper', category: 'cat-1' },

  // Space Opera
  { id: 'tech-ftl', name: 'FTL', category: 'cat-2' },
  { id: 'tech-jump-drive', name: 'Jump Drive', category: 'cat-2' },
  { id: 'tech-hyper-shields', name: 'Hyper Shields', category: 'cat-2' },
  { id: 'tech-megastructures', name: 'Megastructures', category: 'cat-2' },
  { id: 'tech-lasers', name: 'Lasers', category: 'cat-2' },

  // Physics
  { id: 'tech-terraforming', name: 'Terraforming', category: 'cat-3' },
  { id: 'tech-planetary-shields', name: 'Planetary Shields', category: 'cat-3' },
  { id: 'tech-dimensional-engineering', name: 'Dimensional Engineering', category: 'cat-3' },

  // Consciousness
  { id: 'tech-sapient-ai', name: 'Sapient AI', category: 'cat-4' },
  { id: 'tech-digital-consciousness', name: 'Digital Consciousness', category: 'cat-4' },
  { id: 'tech-nanotechnology', name: 'Nanotechnology', category: 'cat-4' },
  { id: 'tech-neural-implants', name: 'Neural Implants', category: 'cat-4' },
  { id: 'tech-psionic-theory', name: 'Psionic Theory', category: 'cat-4' },
  { id: 'tech-virtual-reality', name: 'Virtual Reality', category: 'cat-4' },
  { id: 'tech-robotics', name: 'Robotics', category: 'cat-4' },
  { id: 'tech-gene-tailoring', name: 'Gene Tailoring', category: 'cat-4' },
  { id: 'tech-self-evolving-logic', name: 'Self-Evolving Logic', category: 'cat-4' },
  { id: 'tech-exotic-materials', name: 'Exotic Materials', category: 'cat-3' },
  { id: 'tech-cryostasis', name: 'Cryostasis', category: 'cat-3' },
];

const books = [
  { id: 'book-phlebas', title: 'Consider Phlebas', author: 'Iain M. Banks', techs: ['tech-sapient-ai', 'tech-hyper-shields', 'tech-megastructures', 'tech-neural-implants'] },
  { id: 'book-excession', title: 'Excession', author: 'Iain M. Banks', techs: ['tech-sapient-ai', 'tech-jump-drive', 'tech-exotic-materials', 'tech-digital-consciousness'] },
  { id: 'book-rainbows', title: 'Rainbows End', author: 'Vernor Vinge', techs: ['tech-virtual-reality', 'tech-neural-implants', 'tech-nanotechnology'] },
  { id: 'book-childhood', title: "Childhood's End", author: 'Arthur C. Clarke', techs: ['tech-psionic-theory', 'tech-world-shaper', 'tech-alien-domestication'] },
  { id: 'book-de', title: "Death's End", author: 'Cixin Liu', techs: ['tech-jump-drive', 'tech-ftl', 'tech-megastructures', 'tech-dimensional-engineering'] },
  { id: 'book-3bp', title: 'The Three-Body Problem', author: 'Cixin Liu', techs: ['tech-ftl', 'tech-virtual-reality', 'tech-dimensional-engineering'] },
  { id: 'book-hyperion', title: 'Hyperion', author: 'Dan Simmons', techs: ['tech-sapient-ai', 'tech-jump-drive', 'tech-terraforming', 'tech-cryostasis'] },
  { id: 'book-accel', title: 'Accelerando', author: 'Charles Stross', techs: ['tech-digital-consciousness', 'tech-nanotechnology', 'tech-self-evolving-logic'] },
  { id: 'book-pc', title: 'Permutation City', author: 'Greg Egan', techs: ['tech-digital-consciousness', 'tech-virtual-reality', 'tech-self-evolving-logic'] },
  { id: 'book-solaris', title: 'Solaris', author: 'Stanislaw Lem', techs: ['tech-xenobiology', 'tech-psionic-theory'] },
  { id: 'book-foundation', title: 'Foundation', author: 'Isaac Asimov', techs: ['tech-planetary-shields', 'tech-lasers', 'tech-ftl'] },
  { id: 'book-dune', title: 'Dune', author: 'Frank Herbert', techs: ['tech-psionic-theory', 'tech-terraforming', 'tech-gene-tailoring'] },
  { id: 'book-da', title: 'The Diamond Age', author: 'Neal Stephenson', techs: ['tech-nanotechnology', 'tech-sapient-ai', 'tech-robotics'] },
  { id: 'book-sc', title: 'Snow Crash', author: 'Neal Stephenson', techs: ['tech-virtual-reality', 'tech-neural-implants'] },
  { id: 'book-afutd', title: 'A Fire Upon the Deep', author: 'Vernor Vinge', techs: ['tech-sapient-ai', 'tech-ftl', 'tech-xenobiology'] },
  { id: 'book-diaspora', title: 'Diaspora', author: 'Greg Egan', techs: ['tech-digital-consciousness', 'tech-jump-drive', 'tech-megastructures', 'tech-virtual-reality'] },
];

export const elements: cytoscape.ElementDefinition[] = [];

// --- Process Categories ---
categories.forEach(cat => {
  elements.push({
    group: 'nodes',
    data: { id: cat.id, label: cat.name, type: 'category' }
  });
});

// --- Process Technologies as child nodes ---
technologies.forEach(tech => {
  elements.push({
    group: 'nodes',
    data: { id: tech.id, label: tech.name, type: 'tech', parent: tech.category } // Set parent
  });
});

// --- Process Books and their edges to technologies ---
books.forEach(book => {
  elements.push({
    group: 'nodes',
    data: { id: book.id, label: `${book.title}\n- ${book.author}`, type: 'book' }
  });

  book.techs.forEach(techId => {
    elements.push({
      group: 'edges',
      data: {
        id: `e-${techId}-${book.id}`,
        source: techId,
        target: book.id,
      }
    });
  });
}); 