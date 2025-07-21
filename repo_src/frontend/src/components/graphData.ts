import cytoscape from 'cytoscape';

const categories = [
  { id: 'cat-1', name: 'FIRST CONTACT & ALIEN WORLDS', position: { x: 50, y: 400 } },
  { id: 'cat-2', name: 'SPACE OPERA & GALACTIC CIVILIZATION', position: { x: 950, y: 0 } },
  { id: 'cat-3', name: 'PHYSICS, SPACETIME & ENGINEERING', position: { x: 1850, y: 400 } },
  { id: 'cat-4', name: 'CONSCIOUSNESS, AI & POST-HUMANISM', position: { x: 950, y: 800 } },
];

const technologies = [
  // Contact
  { id: 'tech-xenobiology', name: 'Xenobiology', category: 'cat-1', position: { x: 0, y: 200 } },
  { id: 'tech-alien-domestication', name: 'Alien Domestication', category: 'cat-1', position: { x: 100, y: 200 } },
  { id: 'tech-world-shaper', name: 'World Shaper', category: 'cat-1', position: { x: 200, y: 200 } },

  // Space Opera
  { id: 'tech-ftl', name: 'FTL', category: 'cat-2', position: { x: 800, y: 200 } },
  { id: 'tech-jump-drive', name: 'Jump Drive', category: 'cat-2', position: { x: 900, y: 200 } },
  { id: 'tech-hyper-shields', name: 'Hyper Shields', category: 'cat-2', position: { x: 1000, y: 200 } },
  { id: 'tech-megastructures', name: 'Megastructures', category: 'cat-2', position: { x: 1100, y: 200 } },
  { id: 'tech-lasers', name: 'Lasers', category: 'cat-2', position: { x: 1200, y: 200 } },

  // Physics
  { id: 'tech-terraforming', name: 'Terraforming', category: 'cat-3', position: { x: 1700, y: 200 } },
  { id: 'tech-planetary-shields', name: 'Planetary Shields', category: 'cat-3', position: { x: 1800, y: 200 } },
  { id: 'tech-dimensional-engineering', name: 'Dimensional Engineering', category: 'cat-3', position: { x: 1900, y: 200 } },

  // Consciousness
  { id: 'tech-sapient-ai', name: 'Sapient AI', category: 'cat-4', position: { x: 750, y: 600 } },
  { id: 'tech-digital-consciousness', name: 'Digital Consciousness', category: 'cat-4', position: { x: 850, y: 600 } },
  { id: 'tech-nanotechnology', name: 'Nanotechnology', category: 'cat-4', position: { x: 950, y: 600 } },
  { id: 'tech-neural-implants', name: 'Neural Implants', category: 'cat-4', position: { x: 1050, y: 600 } },
  { id: 'tech-psionic-theory', name: 'Psionic Theory', category: 'cat-4', position: { x: 1150, y: 600 } },
  { id: 'tech-virtual-reality', name: 'Virtual Reality', category: 'cat-4', position: { x: 1250, y: 600 } },
  { id: 'tech-robotics', name: 'Robotics', category: 'cat-4', position: { x: 850, y: 500 } },
  { id: 'tech-gene-tailoring', name: 'Gene Tailoring', category: 'cat-4', position: { x: 950, y: 500 } },
  { id: 'tech-self-evolving-logic', name: 'Self-Evolving Logic', category: 'cat-4', position: { x: 1050, y: 500 } },
  { id: 'tech-exotic-materials', name: 'Exotic Materials', category: 'cat-3', position: { x: 1750, y: 600 } },
  { id: 'tech-cryostasis', name: 'Cryostasis', category: 'cat-3', position: { x: 1850, y: 600 } },
];

const books = [
  { id: 'book-phlebas', title: 'Consider Phlebas', author: 'Iain M. Banks', techs: ['tech-sapient-ai', 'tech-hyper-shields', 'tech-megastructures', 'tech-neural-implants'], position: { x: 850, y: -200 } },
  { id: 'book-excession', title: 'Excession', author: 'Iain M. Banks', techs: ['tech-sapient-ai', 'tech-jump-drive', 'tech-exotic-materials', 'tech-digital-consciousness'], position: { x: 1050, y: -200 } },
  { id: 'book-rainbows', title: 'Rainbows End', author: 'Vernor Vinge', techs: ['tech-virtual-reality', 'tech-neural-implants', 'tech-nanotechnology'], position: { x: 1050, y: 1000 } },
  { id: 'book-childhood', title: "Childhood's End", author: 'Arthur C. Clarke', techs: ['tech-psionic-theory', 'tech-world-shaper', 'tech-alien-domestication'], position: { x: 150, y: 600 } },
  { id: 'book-de', title: "Death's End", author: 'Cixin Liu', techs: ['tech-jump-drive', 'tech-ftl', 'tech-megastructures', 'tech-dimensional-engineering'], position: { x: 1850, y: 0 } },
  { id: 'book-3bp', title: 'The Three-Body Problem', author: 'Cixin Liu', techs: ['tech-ftl', 'tech-virtual-reality', 'tech-dimensional-engineering'], position: { x: -150, y: 500 } },
  { id: 'book-hyperion', title: 'Hyperion', author: 'Dan Simmons', techs: ['tech-sapient-ai', 'tech-jump-drive', 'tech-terraforming', 'tech-cryostasis'], position: { x: 1250, y: -200 } },
  { id: 'book-accel', title: 'Accelerando', author: 'Charles Stross', techs: ['tech-digital-consciousness', 'tech-nanotechnology', 'tech-self-evolving-logic'], position: { x: 850, y: 1000 } },
  { id: 'book-pc', title: 'Permutation City', author: 'Greg Egan', techs: ['tech-digital-consciousness', 'tech-virtual-reality', 'tech-self-evolving-logic'], position: { x: 950, y: 1100 } },
  { id: 'book-solaris', title: 'Solaris', author: 'Stanislaw Lem', techs: ['tech-xenobiology', 'tech-psionic-theory'], position: { x: -150, y: 300 } },
  { id: 'book-foundation', title: 'Foundation', author: 'Isaac Asimov', techs: ['tech-planetary-shields', 'tech-lasers', 'tech-ftl'], position: { x: 650, y: -100 } },
  { id: 'book-dune', title: 'Dune', author: 'Frank Herbert', techs: ['tech-psionic-theory', 'tech-terraforming', 'tech-gene-tailoring'], position: { x: 1450, y: -100 } },
  { id: 'book-da', title: 'The Diamond Age', author: 'Neal Stephenson', techs: ['tech-nanotechnology', 'tech-sapient-ai', 'tech-robotics'], position: { x: 750, y: 1000 } },
  { id: 'book-sc', title: 'Snow Crash', author: 'Neal Stephenson', techs: ['tech-virtual-reality', 'tech-neural-implants'], position: { x: 1150, y: 1000 } },
  { id: 'book-afutd', title: 'A Fire Upon the Deep', author: 'Vernor Vinge', techs: ['tech-sapient-ai', 'tech-ftl', 'tech-xenobiology'], position: { x: 450, y: 0 } },
  { id: 'book-diaspora', title: 'Diaspora', author: 'Greg Egan', techs: ['tech-digital-consciousness', 'tech-jump-drive', 'tech-megastructures', 'tech-virtual-reality'], position: { x: 1050, y: 1200 } },
];

export const elements: cytoscape.ElementDefinition[] = [];

// --- Process Categories ---
categories.forEach(cat => {
  elements.push({
    group: 'nodes',
    data: { id: cat.id, label: cat.name, type: 'category' },
    position: cat.position
  });
});

// --- Process Technologies ---
technologies.forEach(tech => {
  elements.push({
    group: 'nodes',
    data: { id: tech.id, label: tech.name, type: 'tech' },
    position: tech.position
  });

  // Edge from Category to Tech
  elements.push({
    group: 'edges',
    data: {
      id: `e-${tech.category}-${tech.id}`,
      source: tech.category,
      target: tech.id,
    }
  });
});

// --- Process Books ---
books.forEach(book => {
  elements.push({
    group: 'nodes',
    data: { id: book.id, label: `${book.title}\n- ${book.author}`, type: 'book' },
    position: book.position
  });

  // Edges from Tech to Book
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