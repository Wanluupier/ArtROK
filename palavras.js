'use strict';
// Palavras do jogo em PT (Brasil) | EN (EUA) | ES (Latinoamérica).
// Cada linha = a MESMA coisa nos 3 idiomas, adaptada (filmes com o título original em inglês americano,
// o título lançado no Brasil e o título lançado na América Latina).
const T = s => s.trim().split('\n').map(l => l.split('|').map(x => x.trim())).filter(r => r.length === 3);

const alimentos = T(`
Pizza|Pizza|Pizza
Hambúrguer|Hamburger|Hamburguesa
Cachorro-quente|Hot dog|Perro caliente
Batata frita|French fries|Papas fritas
Sorvete|Ice cream|Helado
Chocolate|Chocolate|Chocolate
Bolo|Cake|Pastel
Pão|Bread|Pan
Queijo|Cheese|Queso
Ovo|Egg|Huevo
Arroz|Rice|Arroz
Feijão|Beans|Frijoles
Espaguete|Spaghetti|Espagueti
Sushi|Sushi|Sushi
Taco|Taco|Taco
Maçã|Apple|Manzana
Banana|Banana|Banana
Laranja|Orange|Naranja
Morango|Strawberry|Fresa
Uva|Grapes|Uvas
Melancia|Watermelon|Sandía
Abacaxi|Pineapple|Piña
Limão|Lemon|Limón
Cereja|Cherry|Cereza
Pêssego|Peach|Durazno
Coco|Coconut|Coco
Abacate|Avocado|Aguacate
Tomate|Tomato|Tomate
Cenoura|Carrot|Zanahoria
Batata|Potato|Papa
Cebola|Onion|Cebolla
Alho|Garlic|Ajo
Milho|Corn|Maíz
Brócolis|Broccoli|Brócoli
Cogumelo|Mushroom|Champiñón
Pimenta|Chili pepper|Chile
Pipoca|Popcorn|Palomitas
Biscoito|Cookie|Galleta
Rosquinha|Donut|Donut
Panqueca|Pancake|Panqueque
Salsicha|Sausage|Salchicha
Presunto|Ham|Jamón
Camarão|Shrimp|Camarón
Leite|Milk|Leche
Café|Coffee|Café
Suco|Juice|Jugo
Mel|Honey|Miel
Manteiga|Butter|Mantequilla
Sanduíche|Sandwich|Sándwich
Salada|Salad|Ensalada
Sopa|Soup|Sopa
Picolé|Popsicle|Paleta
Algodão-doce|Cotton candy|Algodón de azúcar
Pirulito|Lollipop|Chupete
Chiclete|Chewing gum|Chicle
Amendoim|Peanut|Maní
Pepino|Cucumber|Pepino
Berinjela|Eggplant|Berenjena
Pera|Pear|Pera
Manga|Mango|Mango
Kiwi|Kiwi|Kiwi
`);

const gerais = T(`
Cadeira|Chair|Silla
Mesa|Table|Mesa
Cama|Bed|Cama
Sofá|Couch|Sofá
Lâmpada|Light bulb|Bombilla
Telefone|Phone|Teléfono
Computador|Computer|Computadora
Televisão|Television|Televisión
Relógio|Clock|Reloj
Chave|Key|Llave
Porta|Door|Puerta
Janela|Window|Ventana
Guarda-chuva|Umbrella|Paraguas
Óculos|Glasses|Lentes
Mochila|Backpack|Mochila
Livro|Book|Libro
Lápis|Pencil|Lápiz
Tesoura|Scissors|Tijeras
Bola|Ball|Pelota
Bicicleta|Bicycle|Bicicleta
Carro|Car|Carro
Avião|Airplane|Avión
Navio|Ship|Barco
Trem|Train|Tren
Ônibus|Bus|Autobús
Foguete|Rocket|Cohete
Violão|Guitar|Guitarra
Piano|Piano|Piano
Tambor|Drum|Tambor
Câmera|Camera|Cámara
Espelho|Mirror|Espejo
Vassoura|Broom|Escoba
Martelo|Hammer|Martillo
Faca|Knife|Cuchillo
Garfo|Fork|Tenedor
Colher|Spoon|Cuchara
Copo|Glass|Vaso
Xícara|Cup|Taza
Garrafa|Bottle|Botella
Panela|Pot|Olla
Geladeira|Refrigerator|Refrigerador
Ventilador|Fan|Ventilador
Chapéu|Hat|Sombrero
Camiseta|T-shirt|Camiseta
Sapato|Shoe|Zapato
Meia|Sock|Calcetín
Anel|Ring|Anillo
Coroa|Crown|Corona
Espada|Sword|Espada
Escudo|Shield|Escudo
Vela|Candle|Vela
Presente|Gift|Regalo
Balão|Balloon|Globo
Moeda|Coin|Moneda
Mapa|Map|Mapa
Bússola|Compass|Brújula
Lanterna|Flashlight|Linterna
Pá|Shovel|Pala
Escada|Ladder|Escalera
Ponte|Bridge|Puente
Castelo|Castle|Castillo
Barraca|Tent|Carpa
Casa|House|Casa
Sol|Sun|Sol
Lua|Moon|Luna
Estrela|Star|Estrella
Nuvem|Cloud|Nube
Arco-íris|Rainbow|Arcoíris
Vulcão|Volcano|Volcán
Montanha|Mountain|Montaña
Fogo|Fire|Fuego
`);

const verbos = T(`
Correr|Run|Correr
Pular|Jump|Saltar
Nadar|Swim|Nadar
Dormir|Sleep|Dormir
Comer|Eat|Comer
Beber|Drink|Beber
Chorar|Cry|Llorar
Rir|Laugh|Reír
Cantar|Sing|Cantar
Dançar|Dance|Bailar
Ler|Read|Leer
Escrever|Write|Escribir
Pintar|Paint|Pintar
Cozinhar|Cook|Cocinar
Pescar|Fish|Pescar
Voar|Fly|Volar
Dirigir|Drive|Manejar
Escalar|Climb|Escalar
Empurrar|Push|Empujar
Puxar|Pull|Jalar
Jogar|Play|Jugar
Chutar|Kick|Patear
Lançar|Throw|Lanzar
Pegar|Catch|Atrapar
Abraçar|Hug|Abrazar
Beijar|Kiss|Besar
Acenar|Wave|Saludar
Aplaudir|Clap|Aplaudir
Assobiar|Whistle|Silbar
Espirrar|Sneeze|Estornudar
Tossir|Cough|Toser
Bocejar|Yawn|Bostezar
Sonhar|Dream|Soñar
Pensar|Think|Pensar
Falar|Talk|Hablar
Ouvir|Listen|Escuchar
Cheirar|Smell|Oler
Cavar|Dig|Cavar
Cortar|Cut|Cortar
Quebrar|Break|Romper
Construir|Build|Construir
Lavar|Wash|Lavar
Varrer|Sweep|Barrer
Costurar|Sew|Coser
Esquiar|Ski|Esquiar
Surfar|Surf|Surfear
Patinar|Skate|Patinar
Remar|Row|Remar
Fotografiar|Take a photo|Fotografiar
Tomar banho|Take a shower|Bañarse
Escovar os dentes|Brush teeth|Cepillarse los dientes
Pentear|Comb|Peinar
Rezar|Pray|Rezar
Mergulhar|Dive|Bucear
Andar de bicicleta|Ride a bike|Andar en bicicleta
`).map(r => [r[0] === 'Fotografiar' ? 'Fotografar' : r[0], r[1], r[2]]);

const animais = T(`
Cachorro|Dog|Perro
Gato|Cat|Gato
Cavalo|Horse|Caballo
Vaca|Cow|Vaca
Porco|Pig|Cerdo
Ovelha|Sheep|Oveja
Galinha|Chicken|Gallina
Pato|Duck|Pato
Coelho|Rabbit|Conejo
Rato|Mouse|Ratón
Leão|Lion|León
Tigre|Tiger|Tigre
Elefante|Elephant|Elefante
Girafa|Giraffe|Jirafa
Zebra|Zebra|Cebra
Macaco|Monkey|Mono
Gorila|Gorilla|Gorila
Urso|Bear|Oso
Panda|Panda|Panda
Lobo|Wolf|Lobo
Raposa|Fox|Zorro
Veado|Deer|Venado
Canguru|Kangaroo|Canguro
Coala|Koala|Koala
Camelo|Camel|Camello
Hipopótamo|Hippo|Hipopótamo
Rinoceronte|Rhino|Rinoceronte
Crocodilo|Crocodile|Cocodrilo
Cobra|Snake|Serpiente
Tartaruga|Turtle|Tortuga
Sapo|Frog|Rana
Lagarto|Lizard|Lagarto
Peixe|Fish|Pez
Tubarão|Shark|Tiburón
Baleia|Whale|Ballena
Golfinho|Dolphin|Delfín
Polvo|Octopus|Pulpo
Caranguejo|Crab|Cangrejo
Estrela-do-mar|Starfish|Estrella de mar
Água-viva|Jellyfish|Medusa
Pinguim|Penguin|Pingüino
Coruja|Owl|Búho
Águia|Eagle|Águila
Papagaio|Parrot|Loro
Flamingo|Flamingo|Flamenco
Pavão|Peacock|Pavo real
Cisne|Swan|Cisne
Pombo|Pigeon|Paloma
Morcego|Bat|Murciélago
Borboleta|Butterfly|Mariposa
Abelha|Bee|Abeja
Formiga|Ant|Hormiga
Aranha|Spider|Araña
Caracol|Snail|Caracol
Minhoca|Worm|Lombriz
Joaninha|Ladybug|Mariquita
Esquilo|Squirrel|Ardilla
Ouriço|Hedgehog|Erizo
Preguiça|Sloth|Perezoso
Tatu|Armadillo|Armadillo
Tucano|Toucan|Tucán
Dinossauro|Dinosaur|Dinosaurio
`);

const bandeiras = T(`
Brasil|Brazil|Brasil
Argentina|Argentina|Argentina
Uruguai|Uruguay|Uruguay
Paraguai|Paraguay|Paraguay
Chile|Chile|Chile
Peru|Peru|Perú
Colômbia|Colombia|Colombia
Venezuela|Venezuela|Venezuela
Bolívia|Bolivia|Bolivia
Equador|Ecuador|Ecuador
México|Mexico|México
Cuba|Cuba|Cuba
Estados Unidos|United States|Estados Unidos
Canadá|Canada|Canadá
Reino Unido|United Kingdom|Reino Unido
Irlanda|Ireland|Irlanda
França|France|Francia
Espanha|Spain|España
Portugal|Portugal|Portugal
Itália|Italy|Italia
Alemanha|Germany|Alemania
Holanda|Netherlands|Países Bajos
Bélgica|Belgium|Bélgica
Suíça|Switzerland|Suiza
Áustria|Austria|Austria
Suécia|Sweden|Suecia
Noruega|Norway|Noruega
Dinamarca|Denmark|Dinamarca
Finlândia|Finland|Finlandia
Polônia|Poland|Polonia
Rússia|Russia|Rusia
Ucrânia|Ukraine|Ucrania
Grécia|Greece|Grecia
Turquia|Turkey|Turquía
Egito|Egypt|Egipto
África do Sul|South Africa|Sudáfrica
Nigéria|Nigeria|Nigeria
Marrocos|Morocco|Marruecos
Quênia|Kenya|Kenia
Angola|Angola|Angola
Israel|Israel|Israel
Arábia Saudita|Saudi Arabia|Arabia Saudita
Índia|India|India
China|China|China
Japão|Japan|Japón
Coreia do Sul|South Korea|Corea del Sur
Tailândia|Thailand|Tailandia
Vietnã|Vietnam|Vietnam
Indonésia|Indonesia|Indonesia
Filipinas|Philippines|Filipinas
Austrália|Australia|Australia
Nova Zelândia|New Zealand|Nueva Zelanda
Jamaica|Jamaica|Jamaica
Panamá|Panama|Panamá
Costa Rica|Costa Rica|Costa Rica
Haiti|Haiti|Haití
Islândia|Iceland|Islandia
Hungria|Hungary|Hungría
República Tcheca|Czech Republic|República Checa
Croácia|Croatia|Croacia
`);

// Animes: personagens (nomes próprios não mudam de idioma)
const animes = `Goku|Vegeta|Gohan|Piccolo|Trunks|Bulma|Kuririn|Freeza|Naruto|Sasuke|Sakura|Kakashi|Itachi|Gaara|Hinata|Jiraiya|Tsunade|Luffy|Zoro|Sanji|Nami|Usopp|Chopper|Nico Robin|Ace|Shanks|Trafalgar Law|Ichigo|Rukia|Eren|Mikasa|Levi|Armin|Tanjiro|Nezuko|Zenitsu|Inosuke|Rengoku|Gon|Killua|Kurapika|Light Yagami|Ryuk|Edward Elric|Alphonse|Saitama|Genos|Deku|Bakugo|Todoroki|All Might|Pikachu|Ash Ketchum|Sailor Moon|Totoro|Chihiro|Doraemon|Nobita|Shin-chan|Natsu|Lucy|Gojo|Itadori|Megumi|Sukuna|Rem|Emilia|Asuna|Kirito|Spike Spiegel|Lelouch|Anya Forger|Loid Forger|Yor Forger|Denji|Power|Makima|Pochita|Meliodas|Asta|Yuno|Vash|Violet Evergarden|Misaka|Kaneki|Gintoki|Mob|Senku|Yugi|Kaiba|Astro Boy|Candy Candy|Ranma|Inuyasha|Kagome|Sesshomaru|Shinji|Rei Ayanami|Asuka`
  .split('|').map(n => [n, n, n]);

const filmes = T(`
O Rei Leão|The Lion King|El rey león
Toy Story|Toy Story|Toy Story
Procurando Nemo|Finding Nemo|Buscando a Nemo
Frozen|Frozen|Frozen
Shrek|Shrek|Shrek
Titanic|Titanic|Titanic
Jurassic Park|Jurassic Park|Parque Jurásico
Harry Potter|Harry Potter|Harry Potter
Os Vingadores|The Avengers|Los Vengadores
Homem-Aranha|Spider-Man|Spider-Man
Batman|Batman|Batman
Coringa|Joker|Guasón
Pantera Negra|Black Panther|Pantera Negra
Homem de Ferro|Iron Man|Iron Man
Capitão América|Captain America|Capitán América
Thor|Thor|Thor
Aquaman|Aquaman|Aquaman
Mulher-Maravilha|Wonder Woman|La Mujer Maravilla
Star Wars|Star Wars|Star Wars
Matrix|The Matrix|Matrix
De Volta para o Futuro|Back to the Future|Volver al futuro
E.T.|E.T.|E.T.
Tubarão|Jaws|Tiburón
O Poderoso Chefão|The Godfather|El padrino
Forrest Gump|Forrest Gump|Forrest Gump
Gladiador|Gladiator|Gladiador
Avatar|Avatar|Avatar
Esqueceram de Mim|Home Alone|Mi pobre angelito
Os Caça-Fantasmas|Ghostbusters|Los cazafantasmas
Piratas do Caribe|Pirates of the Caribbean|Piratas del Caribe
O Senhor dos Anéis|The Lord of the Rings|El señor de los anillos
Jumanji|Jumanji|Jumanji
King Kong|King Kong|King Kong
Godzilla|Godzilla|Godzilla
Meu Malvado Favorito|Despicable Me|Mi villano favorito
Minions|Minions|Minions
Os Incríveis|The Incredibles|Los Increíbles
Monstros S.A.|Monsters, Inc.|Monsters, Inc.
Divertida Mente|Inside Out|Intensamente
Up|Up|Up
Ratatouille|Ratatouille|Ratatouille
WALL-E|WALL-E|WALL-E
Carros|Cars|Cars
Moana|Moana|Moana
Aladdin|Aladdin|Aladdín
A Bela e a Fera|Beauty and the Beast|La bella y la bestia
A Pequena Sereia|The Little Mermaid|La sirenita
Cinderela|Cinderella|La Cenicienta
Branca de Neve|Snow White|Blancanieves
Mulan|Mulan|Mulán
Kung Fu Panda|Kung Fu Panda|Kung Fu Panda
Madagascar|Madagascar|Madagascar
A Era do Gelo|Ice Age|La era de hielo
Como Treinar o seu Dragão|How to Train Your Dragon|Cómo entrenar a tu dragón
Coco|Coco|Coco
Encanto|Encanto|Encanto
Zootopia|Zootopia|Zootopia
Tarzan|Tarzan|Tarzán
Rocky|Rocky|Rocky
Os Goonies|The Goonies|Los Goonies
Psicose|Psycho|Psicosis
Clube da Luta|Fight Club|El club de la pelea
A Origem|Inception|El origen
Interestelar|Interstellar|Interestelar
O Exterminador do Futuro|The Terminator|Terminator
Alien|Alien|Alien
Barbie|Barbie|Barbie
Super Mario Bros.|The Super Mario Bros. Movie|Super Mario Bros.
`);

const IDX = { pt: 0, en: 1, es: 2 };
const THEMES = { alimentos, gerais, verbos, animais, bandeiras, animes, filmes };
function words(theme, lang) {
  const list = THEMES[theme]; const i = IDX[lang] === undefined ? 0 : IDX[lang];
  return list ? list.map(r => r[i]) : [];
}
module.exports = { words, THEME_IDS: Object.keys(THEMES) };
