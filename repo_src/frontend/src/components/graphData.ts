import cytoscape from 'cytoscape';

const categories = [
  { id: 'cat-1', name: 'FIRST CONTACT\n& ALIEN WORLDS' },
  { id: 'cat-2', name: 'SPACE OPERA\n& GALACTIC CIVILIZATION' },
  { id: 'cat-3', name: 'PHYSICS, SPACETIME\n& ENGINEERING' },
  { id: 'cat-4', name: 'CONSCIOUSNESS, AI\n& POST-HUMANISM' },
];

const technologies = [
  // --- CATEGORY 1: FIRST CONTACT & ALIEN WORLDS ---
  { id: 'tech-xenobiology', name: 'Xenobiology', category: 'cat-1' },
  { id: 'tech-protomolecule', name: 'Protomolecule', category: 'cat-1' },
  { id: 'tech-sentient-ocean', name: 'Sentient Ocean', category: 'cat-1' },
  { id: 'tech-overlords', name: 'Benevolent Overlords', category: 'cat-1' },
  { id: 'tech-neutron-star-life', name: 'Neutron Star Life', category: 'cat-1' },
  { id: 'tech-group-minds', name: 'Group Minds', category: 'cat-1' },
  { id: 'tech-convergent-evolution', name: 'Convergent Evolution', category: 'cat-1' },
  { id: 'tech-astrophage', name: 'Astrophage', category: 'cat-1' },
  { id: 'tech-uplift-virus', name: 'Uplift Virus', category: 'cat-1' },
  { id: 'tech-babel-fish', name: 'Babel Fish', category: 'cat-1' },

  // --- CATEGORY 2: SPACE OPERA & GALACTIC CIVILIZATION ---
  { id: 'tech-ftl', name: 'FTL Travel', category: 'cat-2' },
  { id: 'tech-farcasters', name: 'Farcasters', category: 'cat-2' },
  { id: 'tech-psychohistory', name: 'Psychohistory', category: 'cat-2' },
  { id: 'tech-galactic-empire', name: 'Galactic Empire', category: 'cat-2' },
  { id: 'tech-inhibitors', name: 'Inhibitor Plague', category: 'cat-2' },
  { id: 'tech-variable-physics', name: 'Variable Physics Zones', category: 'cat-2' },
  { id: 'tech-station-politics', name: 'Inter-Station Politics', category: 'cat-2' },
  { id: 'tech-ansible', name: 'Ansible', category: 'cat-2' },
  { id: 'tech-zero-g-combat', name: 'Zero-G Combat', category: 'cat-2' },
  { id: 'tech-lunar-colony', name: 'Lunar Colony', category: 'cat-2' },
  { id: 'tech-vogon-tech', name: 'Vogon Tech', category: 'cat-2' },

  // --- CATEGORY 3: PHYSICS, SPACETIME & ENGINEERING ---
  { id: 'tech-terraforming', name: 'Terraforming', category: 'cat-3' },
  { id: 'tech-megastructures', name: 'Megastructures', category: 'cat-3' },
  { id: 'tech-dimensional-engineering', name: 'Dimensional Engineering', category: 'cat-3' },
  { id: 'tech-sophons', name: 'Sophons', category: 'cat-3' },
  { id: 'tech-cryosleep', name: 'Cryosleep', category: 'cat-3' },
  { id: 'tech-epstein-drive', name: 'Epstein Drive', category: 'cat-3' },
  { id: 'tech-neutronium-matter', name: 'Neutronium Matter', category: 'cat-3' },
  { id: 'tech-relativistic-warfare', name: 'Relativistic Warfare', category: 'cat-3' },
  { id: 'tech-temporal-weapon', name: 'Temporal Weaponry', category: 'cat-3' },
  { id: 'tech-stillsuits', name: 'Stillsuits', category: 'cat-3' },
  { id: 'tech-hyper-shields', name: 'Hyper Shields', category: 'cat-3' },
  { id: 'tech-planetary-shields', name: 'Planetary Shields', category: 'cat-3' },
  { id: 'tech-jump-drive', name: 'Jump Drives', category: 'cat-3' },
  { id: 'tech-bussard-ramjet', name: 'Bussard Ramjet', category: 'cat-3' },
  { id: 'tech-time-dilation', name: 'Time Dilation', category: 'cat-3' },
  { id: 'tech-quantum-graph-theory', name: 'Quantum Graph Theory', category: 'cat-3' },
  { id: 'tech-novacene-physics', name: 'Novacene Physics', category: 'cat-3' },
  { id: 'tech-habitat-engineering', name: 'Habitat Engineering', category: 'cat-3' },
  { id: 'tech-physics-as-interface', name: 'Physics as an Interface', category: 'cat-3' },
  { id: 'tech-arrow-of-time', name: 'Arrow of Time', category: 'cat-3' },
  { id: 'tech-doctor-device', name: 'Molecular Disruption Device', category: 'cat-3' },
  { id: 'tech-mass-driver', name: 'Mass Driver Catapult', category: 'cat-3' },
  { id: 'tech-improbability-drive', name: 'Infinite Improbability Drive', category: 'cat-3' },

  // --- CATEGORY 4: CONSCIOUSNESS, AI & POST-HUMANISM ---
  { id: 'tech-sapient-ai', name: 'Sapient AI', category: 'cat-4' },
  { id: 'tech-digital-consciousness', name: 'Digital Consciousness', category: 'cat-4' },
  { id: 'tech-nanotechnology', name: 'Nanotechnology', category: 'cat-4' },
  { id: 'tech-neural-implants', name: 'Neural Implants', category: 'cat-4' },
  { id: 'tech-psionic-theory', name: 'Psionic Theory', category: 'cat-4' },
  { id: 'tech-virtual-reality', name: 'Virtual Reality', category: 'cat-4' },
  { id: 'tech-gene-tailoring', name: 'Gene Tailoring', category: 'cat-4' },
  { id: 'tech-imago-machine', name: 'Imago Machine', category: 'cat-4' },
  { id: 'tech-cruciform', name: 'Cruciform Resurrection', category: 'cat-4' },
  { id: 'tech-culture-minds', name: 'The Culture Minds', category: 'cat-4' },
  { id: 'tech-gothic-tech', name: 'Gothic Tech', category: 'cat-4' },
  { id: 'tech-dust-theory', name: 'Dust Theory', category: 'cat-4' },
  { id: 'tech-singularity', name: 'The Singularity', category: 'cat-4' },
  { id: 'tech-the-polis', name: 'The Polis', category: 'cat-4' },
  { id: 'tech-matter-compilers', name: 'Matter Compilers', category: 'cat-4' },
  { id: 'tech-von-neumann-probes', name: 'Von Neumann Probes', category: 'cat-4' },
  { id: 'tech-sapir-whorf', name: 'Sapir-Whorf Hypothesis', category: 'cat-4' },
  { id: 'tech-nonlinear-time', name: 'Non-Linear Time Perception', category: 'cat-4' },
  { id: 'tech-antimemetics', name: 'Antimemetics', category: 'cat-4' },
  { id: 'tech-info-hazards', name: 'Information Hazards', category: 'cat-4' },
  { id: 'tech-entropy-and-will', name: 'Entropy & Free Will', category: 'cat-4' },
  { id: 'tech-emergent-ai', name: 'Emergent AI', category: 'cat-4' },
  { id: 'tech-hypnopaedia', name: 'Hypnopaedia', category: 'cat-4' },
  { id: 'tech-soma', name: 'Soma', category: 'cat-4' },
  { id: 'tech-bokanovsky-process', name: 'Bokanovsky Process', category: 'cat-4' },
];

const books = [
  // Classics
  { id: 'book-dune', title: 'Dune', author: 'Frank Herbert', techs: ['tech-psionic-theory', 'tech-terraforming', 'tech-gene-tailoring', 'tech-stillsuits'] },
  { id: 'book-foundation', title: 'Foundation', author: 'Isaac Asimov', techs: ['tech-psychohistory', 'tech-galactic-empire', 'tech-planetary-shields', 'tech-ftl'] },
  { id: 'book-solaris', title: 'Solaris', author: 'Stanislaw Lem', techs: ['tech-sentient-ocean', 'tech-xenobiology', 'tech-psionic-theory'] },
  { id: 'book-childhood', title: "Childhood's End", author: 'Arthur C. Clarke', techs: ['tech-overlords', 'tech-psionic-theory', 'tech-convergent-evolution'] },
  { id: 'book-moon-mistress', title: 'The Moon is a Harsh Mistress', author: 'Robert A. Heinlein', techs: ['tech-mass-driver', 'tech-emergent-ai', 'tech-lunar-colony'] },
  { id: 'book-brave-new-world', title: 'Brave New World', author: 'Aldous Huxley', techs: ['tech-bokanovsky-process', 'tech-hypnopaedia', 'tech-soma', 'tech-gene-tailoring'] },
  { id: 'book-hitchhikers-guide', title: "The Hitchhiker's Guide to the Galaxy", author: 'Douglas Adams', techs: ['tech-improbability-drive', 'tech-babel-fish', 'tech-vogon-tech'] },

  // Modern Epics
  { id: 'book-hyperion', title: 'Hyperion', author: 'Dan Simmons', techs: ['tech-farcasters', 'tech-cruciform', 'tech-temporal-weapon', 'tech-sapient-ai'] },
  { id: 'book-3bp', title: 'The Three-Body Problem', author: 'Cixin Liu', techs: ['tech-sophons', 'tech-virtual-reality', 'tech-dimensional-engineering', 'tech-ftl'] },
  { id: 'book-afutd', title: 'A Fire Upon the Deep', author: 'Vernor Vinge', techs: ['tech-variable-physics', 'tech-group-minds', 'tech-sapient-ai', 'tech-ftl'] },
  { id: 'book-revelation', title: 'Revelation Space', author: 'Alastair Reynolds', techs: ['tech-inhibitors', 'tech-gothic-tech', 'tech-cryosleep', 'tech-relativistic-warfare'] },
  { id: 'book-leviathan', title: 'Leviathan Wakes', author: 'James S.A. Corey', techs: ['tech-protomolecule', 'tech-epstein-drive', 'tech-station-politics'] },
  { id: 'book-children-of-time', title: 'Children of Time', author: 'Adrian Tchaikovsky', techs: ['tech-uplift-virus', 'tech-convergent-evolution', 'tech-terraforming'] },
  { id: 'book-memory-empire', title: 'A Memory Called Empire', author: 'Arkady Martine', techs: ['tech-imago-machine', 'tech-galactic-empire', 'tech-station-politics'] },

  // Post-Human & Consciousness
  { id: 'book-phlebas', title: 'Consider Phlebas', author: 'Iain M. Banks', techs: ['tech-culture-minds', 'tech-sapient-ai', 'tech-megastructures', 'tech-hyper-shields'] },
  { id: 'book-da', title: 'The Diamond Age', author: 'Neal Stephenson', techs: ['tech-nanotechnology', 'tech-matter-compilers', 'tech-sapient-ai', 'tech-virtual-reality'] },
  { id: 'book-snow-crash', title: 'Snow Crash', author: 'Neal Stephenson', techs: ['tech-virtual-reality', 'tech-neural-implants', 'tech-nanotechnology'] },
  { id: 'book-accel', title: 'Accelerando', author: 'Charles Stross', techs: ['tech-singularity', 'tech-digital-consciousness', 'tech-nanotechnology'] },
  { id: 'book-pc', title: 'Permutation City', author: 'Greg Egan', techs: ['tech-digital-consciousness', 'tech-dust-theory', 'tech-virtual-reality'] },
  { id: 'book-diaspora', title: 'Diaspora', author: 'Greg Egan', techs: ['tech-the-polis', 'tech-digital-consciousness', 'tech-jump-drive', 'tech-dimensional-engineering'] },
  { id: 'book-we-are-bob', title: 'We Are Legion (We Are Bob)', author: 'Dennis E. Taylor', techs: ['tech-von-neumann-probes', 'tech-digital-consciousness', 'tech-terraforming'] },

  // Hard Physics & Xenobiology
  { id: 'book-dragons-egg', title: 'Dragon\'s Egg', author: 'Robert L. Forward', techs: ['tech-neutron-star-life', 'tech-neutronium-matter', 'tech-relativistic-warfare', 'tech-xenobiology'] },
  { id: 'book-project-hail-mary', title: 'Project Hail Mary', author: 'Andy Weir', techs: ['tech-astrophage', 'tech-xenobiology', 'tech-epstein-drive'] },
  { id: 'book-the-martian', title: 'The Martian', author: 'Andy Weir', techs: ['tech-habitat-engineering', 'tech-terraforming', 'tech-epstein-drive'] },
  { id: 'book-tau-zero', title: 'Tau Zero', author: 'Poul Anderson', techs: ['tech-bussard-ramjet', 'tech-time-dilation', 'tech-relativistic-warfare'] },
  { id: 'book-schilds-ladder', title: 'Schild\'s Ladder', author: 'Greg Egan', techs: ['tech-quantum-graph-theory', 'tech-novacene-physics', 'tech-the-polis'] },

  // Conceptual & Military SF
  { id: 'book-fine-structure', title: 'Fine Structure', author: 'Sam Hughes', techs: ['tech-physics-as-interface', 'tech-sapient-ai', 'tech-virtual-reality'] },
  { id: 'book-stories-of-your-life', title: 'Stories of Your Life', author: 'Ted Chiang', techs: ['tech-sapir-whorf', 'tech-nonlinear-time', 'tech-xenobiology'] },
  { id: 'book-exhalation', title: 'Exhalation', author: 'Ted Chiang', techs: ['tech-entropy-and-will', 'tech-arrow-of-time', 'tech-digital-consciousness'] },
  { id: 'book-antimemetics', title: 'There Is No Antimemetics Division', author: 'qntm', techs: ['tech-antimemetics', 'tech-info-hazards', 'tech-psionic-theory'] },
  { id: 'book-enders-game', title: 'Ender\'s Game', author: 'Orson Scott Card', techs: ['tech-ansible', 'tech-doctor-device', 'tech-zero-g-combat', 'tech-relativistic-warfare'] },
];

export const elements: cytoscape.ElementDefinition[] = [];

// --- Process Categories as regular nodes ---
categories.forEach(cat => {
  elements.push({
    group: 'nodes',
    data: { id: cat.id, label: cat.name, type: 'category' }
  });
});

// --- Process Technologies as regular nodes ---
technologies.forEach(tech => {
  elements.push({
    group: 'nodes',
    data: { id: tech.id, label: tech.name, type: 'tech' }
  });

  // Add edge from Category to Tech
  elements.push({
    group: 'edges',
    data: {
      id: `e-${tech.category}-${tech.id}`,
      source: tech.category,
      target: tech.id,
    }
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