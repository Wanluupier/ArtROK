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
Pudim|Pudding|Flan
Lasanha|Lasagna|Lasaña
Macarrão|Noodles|Fideos
Frango|Fried chicken|Pollo frito
Bacon|Bacon|Tocino
Bife|Steak|Bistec
Churrasco|Barbecue|Parrillada
Pastel|Pastry|Empanada
Coxinha|Croquette|Croqueta
Torrada|Toast|Tostada
Waffle|Waffle|Waffle
Croissant|Croissant|Croissant
Cupcake|Cupcake|Cupcake
Torta|Pie|Tarta
Gelatina|Jelly|Gelatina
Iogurte|Yogurt|Yogur
Cereal|Cereal|Cereal
Aveia|Oatmeal|Avena
Granola|Granola|Granola
Nozes|Walnuts|Nueces
Castanha|Chestnut|Castaña
Amêndoa|Almond|Almendra
Uva-passa|Raisin|Pasa
Ameixa|Plum|Ciruela
Framboesa|Raspberry|Frambuesa
Mirtilo|Blueberry|Arándano
Mamão|Papaya|Papaya
Goiaba|Guava|Guayaba
Figo|Fig|Higo
Romã|Pomegranate|Granada
Tangerina|Tangerine|Mandarina
Alface|Lettuce|Lechuga
Repolho|Cabbage|Repollo
Abóbora|Pumpkin|Calabaza
Beterraba|Beet|Remolacha
Espinafre|Spinach|Espinaca
Pimentão|Bell pepper|Pimiento
Salame|Salami|Salami
Ketchup|Ketchup|Cátsup
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
Sabonete|Soap|Jabón
Toalha|Towel|Toalla
Escova|Brush|Cepillo
Pente|Comb|Peine
Travesseiro|Pillow|Almohada
Cobertor|Blanket|Cobija
Tapete|Rug|Alfombra
Cortina|Curtain|Cortina
Quadro|Painting|Cuadro
Vaso|Vase|Florero
Planta|Plant|Planta
Flor|Flower|Flor
Árvore|Tree|Árbol
Folha|Leaf|Hoja
Pedra|Rock|Roca
Praia|Beach|Playa
Ilha|Island|Isla
Rio|River|Río
Onda|Wave|Ola
Neve|Snow|Nieve
Chuva|Rain|Lluvia
Raio|Lightning|Rayo
Dado|Dice|Dado
Baralho|Deck of cards|Baraja
Controle|Controller|Control
Fone de ouvido|Headphones|Audífonos
Microfone|Microphone|Micrófono
Tesouro|Treasure|Tesoro
Balança|Scale|Balanza
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
Fotografar|Photograph|Fotografiar
Esfregar|Scrub|Frotar
Escovar|Brush|Cepillar
Pentear|Comb|Peinar
Rezar|Pray|Rezar
Mergulhar|Dive|Bucear
Pedalar|Pedal|Pedalear
Abrir|Open|Abrir
Fechar|Close|Cerrar
Chamar|Call|Llamar
Procurar|Search|Buscar
Esconder|Hide|Esconder
Carregar|Carry|Cargar
Levantar|Lift|Levantar
Sentar|Sit|Sentarse
Caminhar|Walk|Caminar
Girar|Spin|Girar
Rastejar|Crawl|Gatear
Tropeçar|Trip|Tropezar
Cair|Fall|Caer
Gritar|Scream|Gritar
Sussurrar|Whisper|Susurrar
Mastigar|Chew|Masticar
Engolir|Swallow|Tragar
Lamber|Lick|Lamer
Morder|Bite|Morder
Soprar|Blow|Soplar
Cuspir|Spit|Escupir
Piscar|Blink|Parpadear
Sorrir|Smile|Sonreír
Apontar|Point|Señalar
Tocar|Touch|Tocar
Entregar|Give|Dar
Lutar|Fight|Pelear
Plantar|Plant|Sembrar
Regar|Water|Regar
Desenhar|Draw|Dibujar
Apagar|Erase|Borrar
Medir|Measure|Medir
Misturar|Mix|Mezclar
Assar|Bake|Hornear
Fritar|Fry|Freír
Descascar|Peel|Pelar
Espremer|Squeeze|Exprimir
Amarrar|Tie|Atar
Dobrar|Fold|Doblar
Rasgar|Tear|Rasgar
Derreter|Melt|Derretir
Congelar|Freeze|Congelar
Ferver|Boil|Hervir
Brilhar|Shine|Brillar
Flutuar|Float|Flotar
`);

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
Hiena|Hyena|Hiena
Leopardo|Leopard|Leopardo
Onça|Jaguar|Jaguar
Guepardo|Cheetah|Guepardo
Bisão|Bison|Bisonte
Búfalo|Buffalo|Búfalo
Alce|Moose|Alce
Foca|Seal|Foca
Morsa|Walrus|Morsa
Orca|Orca|Orca
Lontra|Otter|Nutria
Castor|Beaver|Castor
Texugo|Badger|Tejón
Gambá|Opossum|Zarigüeya
Capivara|Capybara|Capibara
Lhama|Llama|Llama
Burro|Donkey|Burro
Cabra|Goat|Cabra
Peru|Turkey|Pavo
Ganso|Goose|Ganso
Beija-flor|Hummingbird|Colibrí
Falcão|Falcon|Halcón
Avestruz|Ostrich|Avestruz
Gaivota|Seagull|Gaviota
Pelicano|Pelican|Pelícano
Corvo|Crow|Cuervo
Mosquito|Mosquito|Mosquito
Mosca|Fly|Mosca
Gafanhoto|Grasshopper|Saltamontes
Escorpião|Scorpion|Escorpión
Centopeia|Centipede|Ciempiés
Vaga-lume|Firefly|Luciérnaga
Libélula|Dragonfly|Libélula
Cavalo-marinho|Seahorse|Caballito de mar
Lula|Squid|Calamar
Salmão|Salmon|Salmón
Arraia|Stingray|Mantarraya
Jacaré|Alligator|Caimán
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
Costa do Marfim|Ivory Coast|Costa de Marfil
Gana|Ghana|Ghana
Senegal|Senegal|Senegal
Camarões|Cameroon|Camerún
Argélia|Algeria|Argelia
Tunísia|Tunisia|Túnez
Etiópia|Ethiopia|Etiopía
Moçambique|Mozambique|Mozambique
Irã|Iran|Irán
Iraque|Iraq|Irak
Síria|Syria|Siria
Líbano|Lebanon|Líbano
Jordânia|Jordan|Jordania
Catar|Qatar|Catar
Emirados Árabes|United Arab Emirates|Emiratos Árabes
Paquistão|Pakistan|Pakistán
Bangladesh|Bangladesh|Bangladés
Nepal|Nepal|Nepal
Sri Lanka|Sri Lanka|Sri Lanka
Malásia|Malaysia|Malasia
Singapura|Singapore|Singapur
Camboja|Cambodia|Camboya
Mongólia|Mongolia|Mongolia
Cazaquistão|Kazakhstan|Kazajistán
Taiwan|Taiwan|Taiwán
Coreia do Norte|North Korea|Corea del Norte
Romênia|Romania|Rumania
Bulgária|Bulgaria|Bulgaria
Sérvia|Serbia|Serbia
Eslováquia|Slovakia|Eslovaquia
Eslovênia|Slovenia|Eslovenia
Lituânia|Lithuania|Lituania
Letônia|Latvia|Letonia
Estônia|Estonia|Estonia
Luxemburgo|Luxembourg|Luxemburgo
Honduras|Honduras|Honduras
Guatemala|Guatemala|Guatemala
El Salvador|El Salvador|El Salvador
Nicarágua|Nicaragua|Nicaragua
República Dominicana|Dominican Republic|República Dominicana
`);

// Animes: personagens (nomes próprios não mudam de idioma)
const animes = `Goku|Vegeta|Gohan|Piccolo|Trunks|Bulma|Kuririn|Freeza|Naruto|Sasuke|Sakura|Kakashi|Itachi|Gaara|Hinata|Jiraiya|Tsunade|Luffy|Zoro|Sanji|Nami|Usopp|Chopper|Nico Robin|Ace|Shanks|Trafalgar Law|Ichigo|Rukia|Eren|Mikasa|Levi|Armin|Tanjiro|Nezuko|Zenitsu|Inosuke|Rengoku|Gon|Killua|Kurapika|Light Yagami|Ryuk|Edward Elric|Alphonse|Saitama|Genos|Deku|Bakugo|Todoroki|All Might|Pikachu|Ash Ketchum|Sailor Moon|Totoro|Chihiro|Doraemon|Nobita|Shin-chan|Natsu|Lucy|Gojo|Itadori|Megumi|Sukuna|Rem|Emilia|Asuna|Kirito|Spike Spiegel|Lelouch|Anya Forger|Loid Forger|Yor Forger|Denji|Power|Makima|Pochita|Meliodas|Asta|Yuno|Vash|Violet Evergarden|Misaka|Kaneki|Gintoki|Mob|Senku|Yugi|Kaiba|Astro Boy|Candy Candy|Ranma|Inuyasha|Kagome|Sesshomaru|Shinji|Rei Ayanami|Asuka|Majin Boo|Cell|Yamcha|Tenshinhan|Mestre Kame|Chi-Chi|Videl|Goten|Broly|Beerus|Whis|Shikamaru|Rock Lee|Neji|Tenten|Orochimaru|Minato|Kushina|Obito|Madara|Pain|Konan|Kisame|Deidara|Sasori|Hidan|Kabuto|Boruto|Temari|Choji|Ino|Franky|Brook|Boa Hancock|Barba Branca|Barba Negra|Kaido|Big Mom|Crocodile|Mihawk|Buggy|Sabo|Vivi|Jinbe|Smoker|Byakuya|Renji|Aizen|Toshiro Hitsugaya|Kenpachi|Orihime|Uryu|Erwin|Hange|Reiner|Annie|Jean|Historia|Giyu|Shinobu|Muzan|Akaza|Mitsuri|Tengen|Hisoka|Leorio|Chrollo|Meruem|Roy Mustang|Winry|Riza Hawkeye|Uraraka|Iida|Shigaraki|Endeavor|Jotaro|Dio|Joseph Joestar|Giorno|Josuke|Nobara|Nanami|Yuta|Toji|Megumin|Aqua|Charizard|Eevee|Misty|Brock|Mewtwo|Jigglypuff|Snorlax|Meowth|Howl|Ponyo|Kiki|San|Haku|Seiya|Shiryu`
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
O Hobbit|The Hobbit|El hobbit
Homem-Formiga|Ant-Man|Ant-Man
Doutor Estranho|Doctor Strange|Doctor Strange
Guardiões da Galáxia|Guardians of the Galaxy|Guardianes de la galaxia
Deadpool|Deadpool|Deadpool
Logan|Logan|Logan
X-Men|X-Men|X-Men
Superman|Superman|Superman
Flash|The Flash|The Flash
Venom|Venom|Venom
Capitã Marvel|Captain Marvel|Capitana Marvel
Viúva Negra|Black Widow|Viuda Negra
Hulk|Hulk|Hulk
Esquadrão Suicida|Suicide Squad|Escuadrón suicida
Duro de Matar|Die Hard|Duro de matar
Missão: Impossível|Mission: Impossible|Misión: Imposible
Velozes e Furiosos|The Fast and the Furious|Rápidos y furiosos
Mad Max|Mad Max|Mad Max
Rambo|Rambo|Rambo
Indiana Jones|Indiana Jones|Indiana Jones
Top Gun|Top Gun|Top Gun
Oppenheimer|Oppenheimer|Oppenheimer
Parasita|Parasite|Parásitos
O Silêncio dos Inocentes|The Silence of the Lambs|El silencio de los inocentes
O Iluminado|The Shining|El resplandor
It: A Coisa|It|Eso
Invocação do Mal|The Conjuring|El conjuro
Atividade Paranormal|Paranormal Activity|Actividad paranormal
Premonição|Final Destination|Destino final
Jogos Mortais|Saw|El juego del miedo
Pânico|Scream|Scream
Halloween|Halloween|Halloween
Sexta-Feira 13|Friday the 13th|Viernes 13
O Exorcista|The Exorcist|El exorcista
Annabelle|Annabelle|Annabelle
Corra!|Get Out|¡Huye!
Coraline|Coraline|Coraline
O Estranho Mundo de Jack|The Nightmare Before Christmas|El extraño mundo de Jack
Noiva Cadáver|Corpse Bride|La novia cadáver
Beetlejuice|Beetlejuice|Beetlejuice
A Família Addams|The Addams Family|Los locos Addams
Edward Mãos de Tesoura|Edward Scissorhands|Eduardo Manostijeras
Charlie e a Fábrica de Chocolate|Charlie and the Chocolate Factory|Charlie y la fábrica de chocolate
Matilda|Matilda|Matilda
O Mágico de Oz|The Wizard of Oz|El mago de Oz
Alice no País das Maravilhas|Alice in Wonderland|Alicia en el país de las maravillas
Peter Pan|Peter Pan|Peter Pan
Pinóquio|Pinocchio|Pinocho
Dumbo|Dumbo|Dumbo
Bambi|Bambi|Bambi
Mogli|The Jungle Book|El libro de la selva
A Dama e o Vagabundo|Lady and the Tramp|La dama y el vagabundo
101 Dálmatas|101 Dalmatians|101 dálmatas
Os Aristogatas|The Aristocats|Los aristogatos
Enrolados|Tangled|Enredados
Valente|Brave|Valiente
Raya e o Último Dragão|Raya and the Last Dragon|Raya y el último dragón
Soul|Soul|Soul
Luca|Luca|Luca
Elementos|Elemental|Elementos
Lightyear|Lightyear|Lightyear
Detona Ralph|Wreck-It Ralph|¡Ralph el demoledor!
Operação Big Hero|Big Hero 6|Big Hero 6
Hércules|Hercules|Hércules
Pocahontas|Pocahontas|Pocahontas
O Corcunda de Notre Dame|The Hunchback of Notre Dame|El jorobado de Notre Dame
Lilo & Stitch|Lilo & Stitch|Lilo y Stitch
Gato de Botas|Puss in Boots|El gato con botas
Os Croods|The Croods|Los Croods
Hotel Transilvânia|Hotel Transylvania|Hotel Transilvania
Trolls|Trolls|Trolls
Sing|Sing|Sing
Pets: A Vida Secreta dos Bichos|The Secret Life of Pets|La vida secreta de tus mascotas
Bob Esponja|The SpongeBob Movie|Bob Esponja
Garfield|Garfield|Garfield
Scooby-Doo|Scooby-Doo|Scooby-Doo
Os Smurfs|The Smurfs|Los Pitufos
Tartarugas Ninja|Teenage Mutant Ninja Turtles|Tortugas Ninja
Power Rangers|Power Rangers|Power Rangers
Transformers|Transformers|Transformers
Círculo de Fogo|Pacific Rim|Titanes del Pacífico
Star Trek|Star Trek|Star Trek
Duna|Dune|Duna
Planeta dos Macacos|Planet of the Apes|El planeta de los simios
Independence Day|Independence Day|Día de la independencia
Homens de Preto|Men in Black|Hombres de negro
Predador|Predator|Depredador
RoboCop|RoboCop|RoboCop
Blade Runner|Blade Runner|Blade Runner
Gravidade|Gravity|Gravedad
Náufrago|Cast Away|Náufrago
A Lista de Schindler|Schindler's List|La lista de Schindler
O Resgate do Soldado Ryan|Saving Private Ryan|Rescatando al soldado Ryan
Coração Valente|Braveheart|Corazón valiente
300|300|300
Troia|Troy|Troya
Karatê Kid|The Karate Kid|Karate Kid
La La Land|La La Land|La La Land
O Rei do Show|The Greatest Showman|El gran showman
Mamma Mia!|Mamma Mia!|Mamma Mia!
Grease|Grease|Grease
Dirty Dancing|Dirty Dancing|Dirty Dancing
Uma Linda Mulher|Pretty Woman|Mujer bonita
Diário de uma Paixão|The Notebook|Diario de una pasión
Meninas Malvadas|Mean Girls|Chicas pesadas
O Máskara|The Mask|La máscara
Debi & Lóide|Dumb and Dumber|Tonto y retonto
O Show de Truman|The Truman Show|El show de Truman
Ilha do Medo|Shutter Island|La isla siniestra
Seven|Se7en|Seven
Cisne Negro|Black Swan|El cisne negro
Whiplash|Whiplash|Whiplash
O Lobo de Wall Street|The Wolf of Wall Street|El lobo de Wall Street
Django Livre|Django Unchained|Django sin cadenas
Kill Bill|Kill Bill|Kill Bill
Pulp Fiction|Pulp Fiction|Tiempos violentos
Um Sonho de Liberdade|The Shawshank Redemption|Sueño de fuga
Prenda-me se For Capaz|Catch Me If You Can|Atrápame si puedes
Crepúsculo|Twilight|Crepúsculo
Jogos Vorazes|The Hunger Games|Los juegos del hambre
Divergente|Divergent|Divergente
As Crônicas de Nárnia|The Chronicles of Narnia|Las crónicas de Narnia
Percy Jackson|Percy Jackson|Percy Jackson
Animais Fantásticos|Fantastic Beasts|Animales fantásticos
Hook|Hook|Hook
O Grinch|The Grinch|El Grinch
Elfo|Elf|Elf
Beethoven|Beethoven|Beethoven
Marley & Eu|Marley & Me|Marley y yo
Paddington|Paddington|Paddington
Stuart Little|Stuart Little|Stuart Little
A Viagem de Chihiro|Spirited Away|El viaje de Chihiro
`);

const IDX = { pt: 0, en: 1, es: 2 };
const THEMES = { alimentos, gerais, verbos, animais, bandeiras, animes, filmes };
function words(theme, lang) {
  const list = THEMES[theme]; const i = IDX[lang] === undefined ? 0 : IDX[lang];
  return list ? list.map(r => r[i]) : [];
}
module.exports = { words, THEME_IDS: Object.keys(THEMES) };
