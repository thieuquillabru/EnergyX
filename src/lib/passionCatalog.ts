import type { PassionItem } from '@/types';

export const PASSION_CATALOG: PassionItem[] = [
  // ── Sports ──────────────────────────────────────
  { id: 'course', name: 'Course à pied', emoji: '🏃', category: 'sports', keywords: ['running', 'jogging', 'footing', 'course', 'run'] },
  { id: 'musculation', name: 'Musculation', emoji: '💪', category: 'sports', keywords: ['musculation', 'musc', 'gym', 'bodybuilding', 'fitness', 'force', 'haltères'] },
  { id: 'natation', name: 'Natation', emoji: '🏊', category: 'sports', keywords: ['natation', 'nage', 'swimming', 'piscine'] },
  { id: 'cyclisme', name: 'Cyclisme', emoji: '🚴', category: 'sports', keywords: ['cyclisme', 'velo', 'bicycle', 'vélo', 'biking', 'mtb', 'route'] },
  { id: 'football', name: 'Football', emoji: '⚽', category: 'sports', keywords: ['football', 'soccer', 'foot'] },
  { id: 'basketball', name: 'Basketball', emoji: '🏀', category: 'sports', keywords: ['basketball', 'basket', 'bball'] },
  { id: 'tennis', name: 'Tennis', emoji: '🎾', category: 'sports', keywords: ['tennis', 'raquette'] },
  { id: 'yoga', name: 'Yoga', emoji: '🧘', category: 'sports', keywords: ['yoga', 'asana', 'vinyasa', 'hatha'] },
  { id: 'escalade', name: 'Escalade', emoji: '🧗', category: 'sports', keywords: ['escalade', 'climbing', 'grimpe', 'falaise'] },
  { id: 'marche', name: 'Randonnée', emoji: '🥾', category: 'sports', keywords: ['randonnee', 'randon', 'hiking', 'trek', 'trekking', 'marche', 'sentier'] },
  { id: 'surf', name: 'Surf', emoji: '🏄', category: 'sports', keywords: ['surf', 'surfing', 'planche', 'vague'] },
  { id: 'boxe', name: 'Boxe', emoji: '🥊', category: 'sports', keywords: ['boxe', 'boxing', 'combat'] },
  { id: 'ski', name: 'Ski', emoji: '⛷️', category: 'sports', keywords: ['ski', 'skiing', 'neige', 'piste'] },
  { id: 'danse', name: 'Danse', emoji: '💃', category: 'sports', keywords: ['danse', 'dance', 'ballet', 'salsa', 'hip-hop'] },
  { id: 'arts-martiaux', name: 'Arts martiaux', emoji: '🥋', category: 'sports', keywords: ['arts martiaux', 'martial', 'karate', 'judo', 'taekwondo', 'kung-fu'] },
  { id: 'rugby', name: 'Rugby', emoji: '🏉', category: 'sports', keywords: ['rugby'] },
  { id: 'volleyball', name: 'Volleyball', emoji: '🏐', category: 'sports', keywords: ['volley', 'volleyball', 'beach-volley'] },
  { id: 'golf', name: 'Golf', emoji: '⛳', category: 'sports', keywords: ['golf'] },
  { id: 'gymnastique', name: 'Gymnastique', emoji: '🤸', category: 'sports', keywords: ['gymnastique', 'gymnastics', 'trampoline'] },
  { id: 'aviron', name: 'Aviron', emoji: '🚣', category: 'sports', keywords: ['aviron', 'rowing', 'rame'] },
  { id: 'equitation', name: 'Équitation', emoji: '🏇', category: 'sports', keywords: ['equitation', 'cheval', 'horse', 'riding'] },
  { id: 'plongee', name: 'Plongée', emoji: '🤿', category: 'sports', keywords: ['plongee', 'plongée', 'diving', 'scuba', 'sous-marin'] },
  { id: 'badminton', name: 'Badminton', emoji: '🏸', category: 'sports', keywords: ['badminton', 'volant'] },
  { id: 'crossfit', name: 'CrossFit', emoji: '🏋️', category: 'sports', keywords: ['crossfit', 'cross', 'wod'] },

  // ── Art ──────────────────────────────────────────
  { id: 'peinture', name: 'Peinture', emoji: '🎨', category: 'art', keywords: ['peinture', 'painting', 'toile', 'pinceau', 'aquarelle', 'acrylique', 'huile'] },
  { id: 'dessin', name: 'Dessin', emoji: '✏️', category: 'art', keywords: ['dessin', 'drawing', 'croquis', 'sketch', 'crayon'] },
  { id: 'photographie', name: 'Photographie', emoji: '📷', category: 'art', keywords: ['photographie', 'photo', 'photography', 'camera', 'appareil', 'portrait', 'paysage'] },
  { id: 'sculpture', name: 'Sculpture', emoji: '🗿', category: 'art', keywords: ['sculpture', 'sculpting', 'argile', 'terre', 'bronze', 'marbre'] },
  { id: 'ceramique', name: 'Céramique', emoji: '🏺', category: 'art', keywords: ['ceramique', 'céramique', 'poterie', 'pottery', 'argile', 'tour'] },
  { id: 'calligraphie', name: 'Calligraphie', emoji: '🖋️', category: 'art', keywords: ['calligraphie', 'calligraphy', 'lettres', 'encre'] },
  { id: 'crochet', name: 'Crochet', emoji: '🧶', category: 'art', keywords: ['crochet', 'tricot', 'knit', 'knitting', 'laine', 'wool'] },
  { id: 'broderie', name: 'Broderie', emoji: '🪡', category: 'art', keywords: ['broderie', 'embroidery', 'fil', 'point'] },
  { id: 'origami', name: 'Origami', emoji: '🕊️', category: 'art', keywords: ['origami', 'papier', 'pliage', 'paper'] },
  { id: 'street-art', name: 'Street art', emoji: '🎭', category: 'art', keywords: ['street art', 'graffiti', 'fresque', 'murale', 'tag'] },
  { id: 'mosaique', name: 'Mosaïque', emoji: '🧩', category: 'art', keywords: ['mosaique', 'mosaïque', 'carrelage'] },
  { id: 'bande-dessinee', name: 'Bande dessinée', emoji: '💬', category: 'art', keywords: ['bd', 'bande dessinee', 'bande-dessinée', 'comics', 'manga', 'dessin anime'] },
  { id: 'theatre', name: 'Théâtre', emoji: '🎭', category: 'art', keywords: ['theatre', 'théâtre', 'theater', 'scene', 'comédie', 'pièce'] },
  { id: 'cinema', name: 'Cinéma', emoji: '🎬', category: 'art', keywords: ['cinema', 'cinéma', 'film', 'movie', 'realisation', 'réalisation'] },
  { id: 'couture', name: 'Couture', emoji: '🧵', category: 'art', keywords: ['couture', 'sewing', 'seam', 'tissu', 'patron'] },
  { id: 'tatouage', name: 'Tatouage', emoji: '💉', category: 'art', keywords: ['tatouage', 'tattoo', 'tattooing'] },

  // ── Music ────────────────────────────────────────
  { id: 'guitare', name: 'Guitare', emoji: '🎸', category: 'music', keywords: ['guitare', 'guitar', 'acoustique', 'electrique', 'électrique'] },
  { id: 'piano', name: 'Piano', emoji: '🎹', category: 'music', keywords: ['piano', 'clavier', 'piano', 'keyboard'] },
  { id: 'batterie', name: 'Batterie', emoji: '🥁', category: 'music', keywords: ['batterie', 'drums', 'percussion', 'battery'] },
  { id: 'chant', name: 'Chant', emoji: '🎤', category: 'music', keywords: ['chant', 'singing', 'voix', 'chorale', 'karaoke'] },
  { id: 'violon', name: 'Violon', emoji: '🎻', category: 'music', keywords: ['violon', 'violin', 'alto', 'violoncelle', 'cello'] },
  { id: 'flute', name: 'Flûte', emoji: '🪈', category: 'music', keywords: ['flute', 'flûte', 'flauta'] },
  { id: 'saxophone', name: 'Saxophone', emoji: '🎷', category: 'music', keywords: ['saxophone', 'sax'] },
  { id: 'basse', name: 'Basse', emoji: '🎸', category: 'music', keywords: ['basse', 'bass', 'basse électrique'] },
  { id: 'musique-electronique', name: 'Musique électronique', emoji: '🎧', category: 'music', keywords: ['electronic', 'électronique', 'dj', 'synthétiseur', 'synth', 'mao', 'production'] },
  { id: 'ukulele', name: 'Ukulélé', emoji: '🎶', category: 'music', keywords: ['ukulele', 'ukulélé'] },
  { id: 'harpe', name: 'Harpe', emoji: '🎵', category: 'music', keywords: ['harpe', 'harp'] },
  { id: 'musique-classique', name: 'Musique classique', emoji: '🎼', category: 'music', keywords: ['classique', 'classical', 'orchestre', 'symphonie', 'opera', 'opéra'] },
  { id: 'mixing', name: 'Mixage / DJ', emoji: '🎙️', category: 'music', keywords: ['mixing', 'mixage', 'dj', 'deejay', 'platine'] },

  // ── Reading ──────────────────────────────────────
  { id: 'romans', name: 'Romans', emoji: '📚', category: 'reading', keywords: ['roman', 'fiction', 'novel', 'roman', 'livre', 'lecture'] },
  { id: 'bd-litterature', name: 'BD / Manga', emoji: '📖', category: 'reading', keywords: ['bd', 'manga', 'comics', 'bande dessinee', 'bande-dessinée', 'graphic novel'] },
  { id: 'non-fiction', name: 'Non-fiction', emoji: '📗', category: 'reading', keywords: ['non-fiction', 'essai', 'biographie', 'histoire', 'documentaire'] },
  { id: 'polar', name: 'Polar / Thriller', emoji: '🔍', category: 'reading', keywords: ['polar', 'thriller', 'mystery', 'policier', 'suspense', 'detective'] },
  { id: 'science-fiction', name: 'Science-fiction', emoji: '🚀', category: 'reading', keywords: ['science-fiction', 'sf', 'sci-fi', 'fantastique', 'fantasy', 'fantasy'] },
  { id: 'developpement-personnel', name: 'Développement personnel', emoji: '💡', category: 'reading', keywords: ['developpement personnel', 'développement personnel', 'self-help', 'motivation', 'psychologie', 'growth'] },
  { id: 'philosophie', name: 'Philosophie', emoji: '🤔', category: 'reading', keywords: ['philosophie', 'philosophy', 'pensee', 'pensée'] },
  { id: 'histoire', name: 'Histoire', emoji: '🏛️', category: 'reading', keywords: ['histoire', 'history', 'civilisation'] },
  { id: 'poesie', name: 'Poésie', emoji: '📜', category: 'reading', keywords: ['poesie', 'poésie', 'poetry', 'vers', 'poeme', 'poème'] },
  { id: 'langues', name: 'Langues étrangères', emoji: '🌍', category: 'reading', keywords: ['langue', 'language', 'langues', 'traduction', 'vocabulaire'] },
  { id: 'economie', name: 'Économie / Business', emoji: '📊', category: 'reading', keywords: ['economie', 'économie', 'business', 'finance', 'entrepreneuriat', 'management'] },
  { id: 'science', name: 'Sciences', emoji: '🔬', category: 'reading', keywords: ['science', 'physique', 'chimie', 'biologie', 'mathematiques'] },

  // ── Gaming ───────────────────────────────────────
  { id: 'rpg', name: 'RPG / JdR', emoji: '⚔️', category: 'gaming', keywords: ['rpg', 'rpg', 'role', 'jdr', 'donjons', 'dragons', 'dnd'] },
  { id: 'fps', name: 'FPS / Tir', emoji: '🎯', category: 'gaming', keywords: ['fps', 'shooter', 'tir', 'combat', 'warzone', 'call of duty', 'counter-strike'] },
  { id: 'strategie', name: 'Stratégie', emoji: '♟️', category: 'gaming', keywords: ['strategie', 'stratégie', 'rts', 'turn-based', 'civilization', 'age of empires'] },
  { id: 'simulation', name: 'Simulation', emoji: '✈️', category: 'gaming', keywords: ['simulation', 'sim', 'flight', 'simcity', 'farming', 'construction'] },
  { id: 'sport-jeux', name: 'Jeux sportifs', emoji: '🏈', category: 'gaming', keywords: ['fifa', 'ea', 'nba', 'sport', 'madden', 'sportif'] },
  { id: 'plateforme', name: 'Plateformes', emoji: '🍄', category: 'gaming', keywords: ['plateforme', 'platformer', 'mario', 'metroidvania'] },
  { id: 'mmorpg', name: 'MMORPG', emoji: '🏰', category: 'gaming', keywords: ['mmo', 'mmorpg', 'wow', 'mmo', 'en ligne', 'multi-joueur'] },
  { id: 'jeux-indes', name: 'Jeux indépendants', emoji: '🎮', category: 'gaming', keywords: ['indie', 'independant', 'independent', 'itch.io', 'pixel art'] },
  { id: 'jeux-de-societe', name: 'Jeux de société', emoji: '🎲', category: 'gaming', keywords: ['jeux de societe', 'jeux de société', 'board games', 'plateau', 'monopoly', 'catan'] },
  { id: 'escape-game', name: 'Escape games', emoji: '🗝️', category: 'gaming', keywords: ['escape', 'escape game', 'enigme', 'énigme', 'puzzle'] },
  { id: 'echecs', name: 'Échecs', emoji: '♟️', category: 'gaming', keywords: ['echecs', 'échecs', 'chess'] },
  { id: 'speedrun', name: 'Speedrun', emoji: '⏱️', category: 'gaming', keywords: ['speedrun', 'speed', 'tas', 'any'] },
  { id: 'creation-jeux', name: 'Création de jeux', emoji: '🛠️', category: 'gaming', keywords: ['creation de jeux', 'création de jeux', 'game dev', 'unity', 'unreal', 'godot', 'rpg maker'] },

  // ── Coding ───────────────────────────────────────
  { id: 'web-dev', name: 'Développement web', emoji: '🌐', category: 'coding', keywords: ['web', 'html', 'css', 'javascript', 'frontend', 'front-end', 'react', 'next.js'] },
  { id: 'mobile', name: 'Développement mobile', emoji: '📱', category: 'coding', keywords: ['mobile', 'flutter', 'react native', 'swift', 'kotlin', 'android', 'ios'] },
  { id: 'backend', name: 'Backend / API', emoji: '⚙️', category: 'coding', keywords: ['backend', 'api', 'server', 'node', 'python', 'java', 'rest'] },
  { id: 'data-science', name: 'Data Science / IA', emoji: '🤖', category: 'coding', keywords: ['data science', 'ia', 'ai', 'machine learning', 'ml', 'deep learning', 'neural'] },
  { id: 'devops', name: 'DevOps', emoji: '🔧', category: 'coding', keywords: ['devops', 'docker', 'kubernetes', 'ci/cd', 'cloud', 'aws', 'azure'] },
  { id: 'cybersecurite', name: 'Cybersécurité', emoji: '🔒', category: 'coding', keywords: ['cybersecurite', 'cybersécurité', 'security', 'hacking', 'pentest', 'securite', 'sécurité'] },
  { id: 'bases-de-donnees', name: 'Bases de données', emoji: '🗃️', category: 'coding', keywords: ['database', 'sql', 'nosql', 'postgres', 'mongodb', 'mysql'] },
  { id: 'scripting', name: 'Scripting / Automatisation', emoji: '⚡', category: 'coding', keywords: ['scripting', 'automation', 'automatisation', 'bash', 'python', 'powershell'] },
  { id: 'gamedev', name: 'Game dev', emoji: '🕹️', category: 'coding', keywords: ['game dev', 'unity', 'unreal', 'godot', 'game engine', 'shader'] },
  { id: 'low-code', name: 'Low-code / No-code', emoji: '🧩', category: 'coding', keywords: ['low-code', 'no-code', 'bubble', 'webflow', 'zapier', 'make'] },

  // ── Cooking ───────────────────────────────────────
  { id: 'patisserie', name: 'Pâtisserie', emoji: '🧁', category: 'cooking', keywords: ['patisserie', 'pâtisserie', 'gateau', 'gâteau', 'dessert', 'baking', 'cookie', 'tarte'] },
  { id: 'cuisine-francaise', name: 'Cuisine française', emoji: '🥐', category: 'cooking', keywords: ['cuisine francaise', 'cuisine française', 'gastronomie', 'gourmet', 'haute cuisine'] },
  { id: 'cuisine-asiatique', name: 'Cuisine asiatique', emoji: '🍜', category: 'cooking', keywords: ['asiatique', 'asian', 'chinois', 'japonais', 'thai', 'sushi', 'ramen', 'wok'] },
  { id: 'cuisine-vegetarienne', name: 'Cuisine végétarienne', emoji: '🥗', category: 'cooking', keywords: ['vegetarien', 'végétarien', 'vegan', 'plant-based', 'vert'] },
  { id: 'barbecue', name: 'Barbecue', emoji: '🍖', category: 'cooking', keywords: ['barbecue', 'bbq', 'grill', 'grillade', 'viande'] },
  { id: 'boulangerie', name: 'Boulangerie', emoji: '🍞', category: 'cooking', keywords: ['boulangerie', 'pain', 'bread', 'levain', 'sourdough'] },
  { id: 'cocktails', name: 'Cocktails', emoji: '🍹', category: 'cooking', keywords: ['cocktail', 'mixologie', 'mixology', 'boisson', 'bar'] },
  { id: 'cuisine-italienne', name: 'Cuisine italienne', emoji: '🍕', category: 'cooking', keywords: ['italien', 'italian', 'pasta', 'pizza', 'risotto', 'lasagne'] },
  { id: 'cuisine-mexicaine', name: 'Cuisine mexicaine', emoji: '🌮', category: 'cooking', keywords: ['mexicain', 'mexicaine', 'tacos', 'burrito', 'quesadilla'] },
  { id: 'fermentation', name: 'Fermentation', emoji: '🫙', category: 'cooking', keywords: ['fermentation', 'kombucha', 'kimchi', 'kefir', 'yaourt'] },
  { id: 'food-prep', name: 'Meal prep', emoji: '🥡', category: 'cooking', keywords: ['meal prep', 'batch cooking', 'préparation', 'repas semaine'] },

  // ── Other ────────────────────────────────────────
  { id: 'jardinage', name: 'Jardinage', emoji: '🌱', category: 'other', keywords: ['jardinage', 'garden', 'plantes', 'plants', 'jardin', 'potager'] },
  { id: 'voyages', name: 'Voyages', emoji: '✈️', category: 'other', keywords: ['voyage', 'travel', 'trip', 'tourisme', 'tourism', 'decouverte', 'découverte'] },
  { id: 'meditation', name: 'Méditation', emoji: '🧘', category: 'other', keywords: ['meditation', 'mindfulness', 'pleine conscience', 'zen', 'relaxation'] },
  { id: 'astrologie', name: 'Astronomie', emoji: '🔭', category: 'other', keywords: ['astronomie', 'astronomy', 'astro', 'etoiles', 'étoiles', 'espace', 'space', 'planete'] },
  { id: 'echecs-loisir', name: 'Jeux de stratégie', emoji: '♟️', category: 'other', keywords: ['echecs', 'échecs', 'go', 'jeux de strategie', 'stratégie', 'strategie'] },
  { id: 'podcast', name: 'Podcasts', emoji: '🎙️', category: 'other', keywords: ['podcast', 'podcasts', 'audio', 'balado'] },
  { id: 'ecriture', name: 'Écriture', emoji: '✍️', category: 'other', keywords: ['ecriture', 'écriture', 'writing', 'roman', 'blog', 'journal'] },
  { id: 'volontariat', name: 'Bénévolat', emoji: '🤝', category: 'other', keywords: ['benevolat', 'bénévolat', 'volontariat', 'solidarite', 'solidarité', 'charity'] },
  { id: 'langues-parlees', name: 'Apprentissage des langues', emoji: '🗣️', category: 'other', keywords: ['langue', 'language', 'parler', 'speak', 'anglais', 'espagnol', 'linguistique'] },
  { id: 'photo-nature', name: 'Photographie nature', emoji: '📷', category: 'other', keywords: ['nature', 'photo nature', 'wildlife', 'faune', 'flore', 'paysage'] },
  { id: 'bricolage', name: 'Bricolage / DIY', emoji: '🔨', category: 'other', keywords: ['bricolage', 'diy', 'do it yourself', 'menuiserie', 'bois', 'construction'] },
  { id: 'observation-oiseaux', name: 'Ornithologie', emoji: '🐦', category: 'other', keywords: ['oiseaux', 'birds', 'birdwatching', 'ornithologie', 'observation'] },
  { id: 'mode', name: 'Mode / Stylisme', emoji: '👗', category: 'other', keywords: ['mode', 'fashion', 'style', 'stylisme', 'vetements', 'vêtements'] },
  { id: 'finance-perso', name: 'Finance personnelle', emoji: '💰', category: 'other', keywords: ['finance', 'investissement', 'bourse', 'epargne', 'épargne', 'crypto'] },
  { id: 'kineographie', name: 'Vidéos / YouTube', emoji: '📹', category: 'other', keywords: ['video', 'youtube', 'vlog', 'cinematique', 'cinématique', 'montage'] },
  { id: 'pet-animal', name: 'Animaux de compagnie', emoji: '🐾', category: 'other', keywords: ['animal', 'pet', 'chat', 'chien', 'dog', 'cat', 'compagnie'] },
  { id: 'recyclage', name: 'Écologie / Zéro déchet', emoji: '♻️', category: 'other', keywords: ['ecologie', 'écologie', 'zero dechet', 'zéro déchet', 'recyclage', 'environnement', 'environment', 'durable'] },
  { id: 'magie', name: 'Magie / Illusionnisme', emoji: '🎩', category: 'other', keywords: ['magie', 'magic', 'illusion', 'prestidigitation', 'tour', 'tricks'] },
];

/** Normalize a string: NFD → remove diacritics → lowercase */
export function normalize(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** Search passions by query (accent-insensitive) */
export function searchPassions(query: string): PassionItem[] {
  if (!query.trim()) return PASSION_CATALOG;
  const q = normalize(query);
  return PASSION_CATALOG.filter((p) => {
    if (normalize(p.name).includes(q)) return true;
    return p.keywords.some((k) => normalize(k).includes(q));
  });
}

/** Get passions grouped by category */
export function getPassionsGrouped(passions: PassionItem[]): Record<string, PassionItem[]> {
  return passions.reduce<Record<string, PassionItem[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});
}
