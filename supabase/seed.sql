-- =========================================================
-- SEED DATA — Mauritius Shifting Baseline
-- Run this after migrations to populate demo data
-- =========================================================

-- =========================================================
-- LOCATIONS
-- =========================================================

INSERT INTO public.locations (id, name, description, latitude, longitude) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Blue Bay Marine Park', 'A protected marine park on the southeast coast of Mauritius, known for its exceptional coral gardens.', -20.4527, 57.7176),
  ('11111111-0000-0000-0000-000000000002', 'Grand Baie', 'Popular resort town on the north coast with a large, shallow lagoon.', -20.0133, 57.5820),
  ('11111111-0000-0000-0000-000000000003', 'Trou aux Biches', 'A quiet village on the northwest coast, historically known for excellent fishing.', -20.0316, 57.5396),
  ('11111111-0000-0000-0000-000000000004', 'Mahébourg Lagoon', 'The historic lagoon in the southeast, site of the Battle of Grand Port (1810).', -20.4070, 57.7049),
  ('11111111-0000-0000-0000-000000000005', 'Flic en Flac', 'A village on the west coast with a long white sandy beach and diverse marine life.', -20.3086, 57.3633),
  ('11111111-0000-0000-0000-000000000006', 'Rodrigues — Port Mathurin', 'The capital of Rodrigues Island, the outer island of Mauritius, known for pristine waters.', -19.6767, 63.4197),
  ('11111111-0000-0000-0000-000000000007', 'Île aux Cerfs', 'A small island off the east coast, surrounded by turquoise lagoon.', -20.2748, 57.8107),
  ('11111111-0000-0000-0000-000000000008', 'Cap Malheureux', 'The northernmost tip of Mauritius, with views of Coin de Mire island.', -19.9948, 57.6151);

-- =========================================================
-- SPECIES CATALOG (30 Mauritian marine species)
-- =========================================================

INSERT INTO public.species (id, common_name_en, common_name_fr, common_name_mfe, scientific_name, species_type, description) VALUES
  -- Fish
  ('22222222-0000-0000-0000-000000000001', 'Parrotfish', 'Poisson perroquet', 'Pwason Kapab', 'Scarus spp.', 'fish', 'Colorful reef fish crucial for coral health; their feeding creates white sand beaches.'),
  ('22222222-0000-0000-0000-000000000002', 'Grouper', 'Mérou', 'Vieille', 'Epinephelus spp.', 'fish', 'Large predatory fish, indicator of reef health. Highly sought for fishing.'),
  ('22222222-0000-0000-0000-000000000003', 'Surgeonfish', 'Chirurgien', 'Pwason Sirizyen', 'Acanthurus spp.', 'fish', 'Common reef fish known for sharp spines near tail.'),
  ('22222222-0000-0000-0000-000000000004', 'Butterflyfish', 'Poisson papillon', 'Pwason Papyon', 'Chaetodon spp.', 'fish', 'Colorful reef fish, sensitive indicator of coral health. Numbers decline with bleaching.'),
  ('22222222-0000-0000-0000-000000000005', 'Snapper', 'Vivaneau', 'Bourzwa', 'Lutjanus spp.', 'fish', 'Important commercial fish. Red snapper was historically abundant in Mauritius waters.'),
  ('22222222-0000-0000-0000-000000000006', 'Napoleon Wrasse', 'Napoléon', 'Napoleyon', 'Cheilinus undulatus', 'fish', 'Large, distinctive reef fish now critically endangered due to overfishing.'),
  ('22222222-0000-0000-0000-000000000007', 'Barracuda', 'Barracuda', 'Barakida', 'Sphyraena spp.', 'fish', 'Powerful predatory fish. Schools were once common near the reef edge.'),
  ('22222222-0000-0000-0000-000000000008', 'Swordfish', 'Espadon', 'Lepee', 'Xiphias gladius', 'fish', 'Highly prized game fish. Once abundant in deep waters around Mauritius.'),
  ('22222222-0000-0000-0000-000000000009', 'Yellowfin Tuna', 'Thon à nageoires jaunes', 'Ton Zonn', 'Thunnus albacares', 'fish', 'Fast-swimming pelagic fish. Major commercial importance for Mauritius.'),
  ('22222222-0000-0000-0000-000000000010', 'Rabbitfish', 'Poisson lapin', 'Pwason Lapen', 'Siganus spp.', 'fish', 'Herbivorous reef fish, plays important role in controlling algae on reefs.'),
  ('22222222-0000-0000-0000-000000000011', 'Moray Eel', 'Murène', 'Miren', 'Gymnothorax spp.', 'fish', 'Nocturnal ambush predators that live in reef crevices.'),
  ('22222222-0000-0000-0000-000000000012', 'Octopus', 'Pieuvre', 'Piév', 'Octopus vulgaris', 'invertebrate', 'Important traditional fishing target in Mauritius, especially for women fishers in shallow lagoons.'),
  -- Coral
  ('22222222-0000-0000-0000-000000000013', 'Staghorn Coral', 'Corail cornu de cerf', 'Koray Bran', 'Acropora spp.', 'coral', 'Fast-growing branching coral, particularly vulnerable to bleaching. Major reef builder.'),
  ('22222222-0000-0000-0000-000000000014', 'Brain Coral', 'Corail cerveau', 'Koray Servo', 'Diploria spp.', 'coral', 'Massive coral with distinctive grooved surface resembling a brain. Long-lived.'),
  ('22222222-0000-0000-0000-000000000015', 'Table Coral', 'Corail table', 'Koray Latab', 'Acropora hyacinthus', 'coral', 'Flat table-like coral providing shelter for hundreds of fish species.'),
  ('22222222-0000-0000-0000-000000000016', 'Soft Coral', 'Corail mou', 'Koray Mo', 'Alcyonacea', 'coral', 'Flexible corals adding color to reef. Sensitive to water quality changes.'),
  -- Invertebrates
  ('22222222-0000-0000-0000-000000000017', 'Sea Cucumber', 'Concombre de mer', 'Konkonm Lamer', 'Holothuroidea', 'invertebrate', 'Important for sand cleaning. Heavily overfished for Asian market.'),
  ('22222222-0000-0000-0000-000000000018', 'Lobster', 'Homard', 'Sagren Lamer', 'Panulirus spp.', 'invertebrate', 'Spiny lobster once abundant in Mauritius waters. Population severely reduced by overfishing.'),
  ('22222222-0000-0000-0000-000000000019', 'Sea Urchin', 'Oursin', 'Oursin', 'Echinometra spp.', 'invertebrate', 'Grazer controlling algae on reefs. Population dynamics important indicator of reef health.'),
  ('22222222-0000-0000-0000-000000000020', 'Giant Clam', 'Bénitier géant', 'Benitye Zean', 'Tridacna maxima', 'invertebrate', 'Large bivalve once common on Mauritius reefs. Now rare due to collection.'),
  ('22222222-0000-0000-0000-000000000021', 'Starfish', 'Étoile de mer', 'Letwal Lamer', 'Linckia laevigata', 'invertebrate', 'Blue starfish common on sandy lagoon floors. Sensitive to water temperature.'),
  ('22222222-0000-0000-0000-000000000022', 'Crown of Thorns Starfish', 'Étoile de mer couronne d''épines', 'Letwal Lepin', 'Acanthaster planci', 'invertebrate', 'Coral predator. Outbreaks associated with nutrient pollution have damaged Mauritius reefs.'),
  -- Turtles & mammals
  ('22222222-0000-0000-0000-000000000023', 'Green Sea Turtle', 'Tortue verte', 'Torti Ver', 'Chelonia mydas', 'turtle', 'Once common nesting on Mauritius beaches. Now endangered, protected species.'),
  ('22222222-0000-0000-0000-000000000024', 'Hawksbill Turtle', 'Tortue imbriquée', 'Torti Bek Dilok', 'Eretmochelys imbricata', 'turtle', 'Critically endangered. Traditionally hunted in Mauritius for its shell.'),
  ('22222222-0000-0000-0000-000000000025', 'Spinner Dolphin', 'Dauphin longirostre', 'Marsouin', 'Stenella longirostris', 'mammal', 'Social dolphins common off the west coast of Mauritius. Under pressure from tourism boats.'),
  ('22222222-0000-0000-0000-000000000026', 'Humpback Whale', 'Baleine à bosse', 'Balen', 'Megaptera novaeangliae', 'mammal', 'Migratory whale seen seasonally in Mauritian waters. Rare today.'),
  ('22222222-0000-0000-0000-000000000027', 'Blue Marlin', 'Marlin bleu', 'Makrel Bleuz', 'Makaira nigricans', 'fish', 'Iconic game fish of the deep waters. Mauritius is famous for big game fishing.'),
  ('22222222-0000-0000-0000-000000000028', 'Manta Ray', 'Raie manta', 'Karanbol Manta', 'Manta birostris', 'fish', 'Magnificent filter-feeder. Increasingly rare in Mauritius waters.'),
  ('22222222-0000-0000-0000-000000000029', 'Reef Shark', 'Requin de récif', 'Reken Resif', 'Carcharhinus melanopterus', 'fish', 'Blacktip reef shark, indicator of healthy reef ecosystem. Numbers declining.'),
  ('22222222-0000-0000-0000-000000000030', 'Dugong', 'Dugong', 'Dugong', 'Dugong dugon', 'mammal', 'Herbivorous sea mammal. Historically present in Mauritius, now functionally extinct locally.');

-- =========================================================
-- SAMPLE TESTIMONIES (with published status for demo)
-- =========================================================

INSERT INTO public.testimonies (
  id, location_id, title, testimony_text,
  narrator_name, narrator_age, narrator_profession,
  year_of_memory, year_of_memory_end,
  language, status, collection_date
) VALUES
  (
    '33333333-0000-0000-0000-000000000001',
    '11111111-0000-0000-0000-000000000001',
    'The coral gardens of Blue Bay in my youth',
    'When I was a young boy in the 1960s, my father used to take me fishing at Blue Bay. The water was so clear you could see the bottom even in 6 meters of depth. The coral was everywhere — great towers of staghorn coral, brain corals the size of washing machines. We would see parrotfish in clouds, hundreds of them feeding on the coral. The colors were extraordinary. You could count fifty different species of fish in a single afternoon. We never had to go far from shore. My father said the sea was our garden and we just needed to harvest carefully. Now when I take my grandchildren, the coral is bleached white in many places and you have to go much further out to find fish.',
    'Marcel Durand', 78, 'fisherman',
    1965, 1975,
    'fr', 'published', '2024-03-15'
  ),
  (
    '33333333-0000-0000-0000-000000000002',
    '11111111-0000-0000-0000-000000000001',
    'Blue Bay in the 1990s — still beautiful but changing',
    'I started diving in Blue Bay in 1992 as a young instructor. The reef was still very rich compared to today. We regularly saw Napoleon Wrasse — sometimes three or four on a single dive. They were not afraid of divers because they had not been hunted yet. The coral coverage was maybe 60-70% of the bottom. There were still sections of beautiful table coral where hundreds of damselfish lived. The groupers were big and numerous. Over the decade I watched the Napoleon Wrasse disappear one by one as they became a target for restaurants. By 2000, we would be lucky to see one in a month.',
    'Priya Moonesamy', 55, 'diver',
    1992, 2000,
    'en', 'published', '2024-04-02'
  ),
  (
    '33333333-0000-0000-0000-000000000003',
    '11111111-0000-0000-0000-000000000002',
    'Grand Baie lagoon — a fisherman''s paradise in the 1950s',
    'Mo ti ena douz an kan mo finn koumans al lapek ek mo zak (I was twelve when I started fishing with my uncle). Dan Grand Baie, dan lane 1955, ti ena telma pwason ki zak mo ti kapav ranpli so bato dan de-trwa ler. Ti ena gro lingo, karang, bourzwa. Ti ena lomarr (lobster) anba bann ros partou. Me seki mo rapel pli bien, se le matin bann dauphin ti vini zwe devan bato nou — se kitsoz mo finn arrete war depi enn lontan.',
    'Jean-Noël Edouard', 83, 'fisherman',
    1955, 1960,
    'mfe', 'published', '2024-02-28'
  ),
  (
    '33333333-0000-0000-0000-000000000004',
    '11111111-0000-0000-0000-000000000005',
    'Flic en Flac — when turtles nested on the beach',
    'My grandmother told me that when she was young, in the 1930s and 1940s, sea turtles would come to nest on the beach at Flic en Flac every year. She said there were so many that the beach would look like it was moving on moonlit nights. She described the sound of their breathing as they hauled themselves up the sand. By the time I was born in 1960, this had already stopped. The turtles had been hunted too heavily for their meat and shells. I have never seen a turtle nest on a Mauritius beach in my lifetime. My children don''t know that sea turtles once called this beach home.',
    'Claudette Bérenger', 64, 'local_resident',
    1940, 1945,
    'en', 'published', '2024-05-10'
  ),
  (
    '33333333-0000-0000-0000-000000000005',
    '11111111-0000-0000-0000-000000000003',
    'Trou aux Biches — the groupers that are gone',
    'Je suis pêcheur comme mon père et mon grand-père. À Trou aux Biches dans les années 1970, les mérous étaient tellement nombreux que nous les voyions depuis notre bateau, leurs silhouettes sombres se déplaçant dans les fonds clairs. Mon père en capturait parfois de 30 à 40 kilos. Les vieilles (mérous) faisaient partie de notre quotidien. Aujourd''hui, après 40 ans de pêche, je peux compter sur les doigts d''une main les gros mérous que j''ai vus cette année. Ils se cachent dans les endroits les plus profonds et inaccessibles. Mes fils ne savent pas que les mérous couvraient autrefois ces fonds. Pour eux, un mérou de 5 kilos est une prise exceptionnelle.',
    'Gérard Saminaden', 67, 'fisherman',
    1970, 1980,
    'fr', 'published', '2024-03-28'
  );

-- =========================================================
-- SPECIES TAGS FOR SAMPLE TESTIMONIES
-- =========================================================

INSERT INTO public.testimony_species (testimony_id, species_id, presence, notes) VALUES
  -- Testimony 1: Blue Bay 1965-1975
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000013', 'abundant', 'Towers of staghorn coral everywhere'),
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000014', 'abundant', 'Brain corals the size of washing machines'),
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'abundant', 'Hundreds feeding in clouds'),
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000005', 'present', 'Common catch'),
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'present', 'Good sized groupers seen regularly'),
  -- Testimony 2: Blue Bay 1992-2000
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000006', 'rare', 'Disappeared by end of decade'),
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000015', 'present', '60-70% coral cover still'),
  ('33333333-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'present', 'Big groupers, numerous'),
  -- Testimony 3: Grand Baie 1955-1960
  ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000018', 'abundant', 'Lobsters under every rock'),
  ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000025', 'present', 'Dolphins played in front of the boat every morning'),
  ('33333333-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000005', 'abundant', 'Red snapper plentiful'),
  -- Testimony 4: Flic en Flac turtles
  ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000023', 'absent', 'Grandmother''s memory: abundant 1940s, gone by 1960s'),
  ('33333333-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000024', 'absent', 'Hawksbill turtles also mentioned in grandmother''s stories'),
  -- Testimony 5: Trou aux Biches groupers
  ('33333333-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000002', 'rare', 'Now nearly impossible to find, once abundant'),
  ('33333333-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000005', 'present', 'Snapper still seen but smaller');
