function throw_if_invalid_mode(mode) {
    const valid = ["normal", "pots", "doors"];
    if (valid.indexOf(mode) === -1) {
        throw Error(`Invalid mode: ${mode}. Valid modes are: ` + valid.join(", "));
    }
}

function game_data(mode) {
    throw_if_invalid_mode(mode);

    const dungeon_keys = {
        normal: {
            Eastern: { keys: 0, bigkey: true,  map: true,  compass: true  },
            Desert:  { keys: 1, bigkey: true,  map: true,  compass: true  },
            Hera:    { keys: 1, bigkey: true,  map: true,  compass: true  },
            PoD:     { keys: 6, bigkey: true,  map: true,  compass: true  },
            Swamp:   { keys: 1, bigkey: true,  map: true,  compass: true  },
            Skull:   { keys: 3, bigkey: true,  map: true,  compass: true  },
            Thieves: { keys: 1, bigkey: true,  map: true,  compass: true  },
            Ice:     { keys: 2, bigkey: true,  map: true,  compass: true  },
            Mire:    { keys: 3, bigkey: true,  map: true,  compass: true  },
            TRock:   { keys: 4, bigkey: true,  map: true,  compass: true  },
            Castle:  { keys: 1, bigkey: false, map: true,  compass: false },
            Aga:     { keys: 2, bigkey: false, map: false, compass: false },
            GT:      { keys: 4, bigkey: true,  map: true,  compass: true  },
        },

        pots: {
            Eastern: { keys: 2, bigkey: true,  map: true,  compass: true  },
            Desert:  { keys: 4, bigkey: true,  map: true,  compass: true  },
            Hera:    { keys: 1, bigkey: true,  map: true,  compass: true  },
            PoD:     { keys: 6, bigkey: true,  map: true,  compass: true  },
            Swamp:   { keys: 6, bigkey: true,  map: true,  compass: true  },
            Skull:   { keys: 5, bigkey: true,  map: true,  compass: true  },
            Thieves: { keys: 3, bigkey: true,  map: true,  compass: true  },
            Ice:     { keys: 6, bigkey: true,  map: true,  compass: true  },
            Mire:    { keys: 6, bigkey: true,  map: true,  compass: true  },
            TRock:   { keys: 6, bigkey: true,  map: true,  compass: true  },
            Castle:  { keys: 4, bigkey: true,  map: true,  compass: false },
            Aga:     { keys: 4, bigkey: false, map: false, compass: false },
            GT:      { keys: 8, bigkey: true,  map: true,  compass: true  },
        },

        doors: {
            Eastern: { keys: 100, bigkey: true, map: true, compass: true  },
            Desert:  { keys: 100, bigkey: true, map: true, compass: true  },
            Hera:    { keys: 100, bigkey: true, map: true, compass: true  },
            PoD:     { keys: 100, bigkey: true, map: true, compass: true  },
            Swamp:   { keys: 100, bigkey: true, map: true, compass: true  },
            Skull:   { keys: 100, bigkey: true, map: true, compass: true  },
            Thieves: { keys: 100, bigkey: true, map: true, compass: true  },
            Ice:     { keys: 100, bigkey: true, map: true, compass: true  },
            Mire:    { keys: 100, bigkey: true, map: true, compass: true  },
            TRock:   { keys: 100, bigkey: true, map: true, compass: true  },
            Castle:  { keys: 100, bigkey: true, map: true, compass: true  },
            Aga:     { keys: 100, bigkey: true, map: true, compass: true  },
            GT:      { keys: 100, bigkey: true, map: true, compass: true  },
        },
    };

    const dungeons_base = [
        { name: "Eastern", reward: true,  short: "Eas" },
        { name: "Desert",  reward: true,  short: "Des", parts: ["L", "Mid", "R", "Fin"] },
        { name: "Hera",    reward: true,  short: "Her" },
        { name: "PoD",     reward: true,  short: "PoD" },
        { name: "Swamp",   reward: true,  short: "Swm" },
        { name: "Skull",   reward: true,  short: "Sku" },
        { name: "Thieves", reward: true,  short: "Thv" },
        { name: "Ice",     reward: true,  short: "Ice" },
        { name: "Mire",    reward: true,  short: "Mir" },
        { name: "TRock",   reward: true,  short: "TR",  parts: ["Fro", "Eye", "Big", "Las"] },
        { name: "Castle",  reward: false, short: "Cas", parts: ["L", "Mid", "R", "Sew"] },
        { name: "Aga",     reward: false, short: "Aga" },
        { name: "GT",      reward: false, short: "GT"  },
    ];

    const dungeons = dungeons_base.map(dungeon => ({
        ...dungeon,
        ...dungeon_keys[mode][dungeon.name],
        roomset: dungeon.name,
        type: "dungeon",
    }));

    return {
        worlds: ["light", "dark"],

        dungeons,

        markers: [
            { door: "WOODS LOG",        world: "light", x: 1849, y: 190  },
            { door: "WOODS HOLE EXIT",  world: "light", x: 1888, y: 1680, hole_exit: true },
            { door: "WOODS HOLE",       world: "light", x: 1888, y: 1302 },
            { door: "JACKS HOUSE",      world: "light", x: 3359, y: 612  },
            { door: "TREE HOLE EXIT",   world: "light", x: 3298, y: 190,  hole_exit: true },
            { door: "TREE HOLE",        world: "light", x: 2970, y: 716  },
            { door: "HILLS UPPER",      world: "light", x: 3555, y: 1480 },
            { door: "HILLS LOWER",      world: "light", x: 3555, y: 1900 },
            { door: "KAK FORTUNE",      world: "light", x: 1875, y: 3216 },
            { door: "SANC ROCKS",       world: "light", x: 3906, y: 2930 },
            { door: "GRAVE HOLE",       world: "light", x: 5195, y: 2930 },
            { door: "GRAVE LEDGE",      world: "light", x: 5650, y: 2747 },
            { door: "KINGS TOMB",       world: "light", x: 6030, y: 2969 },
            { door: "RIVER HOLE",       world: "light", x: 6419, y: 3099 },
            { door: "RIVER HOLE EXIT",  world: "light", x: 6667, y: 2702, hole_exit: true },
            { door: "WITCH",            world: "light", x: 8008, y: 3333 },
            { door: "WATERFALL",        world: "light", x: 9150, y: 1341 },
            { door: "KAK HOLE",         world: "light", x: 234,  y: 4258 },
            { door: "KAK HOLE EXIT",    world: "light", x: 620,  y: 4258, hole_exit: true },
            { door: "BLIND HOUSE",      world: "light", x: 1168, y: 4193 },
            { door: "ELDER LEFT",       world: "light", x: 1523, y: 4193 },
            { door: "ELDER RIGHT",      world: "light", x: 1884, y: 4193 },
            { door: "SNITCH LEFT",      world: "light", x: 508,  y: 4661 },
            { door: "SNITCH RIGHT",     world: "light", x: 2070, y: 4818 },
            { door: "SWEEP LADY",       world: "light", x: 977,  y: 5404 },
            { door: "SICK HOUSE",       world: "light", x: 1562, y: 5365 },
            { door: "GRASSMAN",         world: "light", x: 2031, y: 5326 },
            { door: "KAK SEALED",       world: "light", x: 273,  y: 5951 },
            { door: "KAK SHOP",         world: "light", x: 1094, y: 5833 },
            { door: "TAVERN",           world: "light", x: 1602, y: 5951 },
            { door: "SMITH",            world: "light", x: 3047, y: 5300 },
            { door: "SMITH HOLE EXIT",  world: "light", x: 2860, y: 5680, hole_exit: true },
            { door: "SMITH HOLE",       world: "light", x: 3242, y: 5680 },
            { door: "LIBRARY",          world: "light", x: 1562, y: 6576 },
            { door: "BROS RIGHT",       world: "light", x: 1425, y: 7161 },
            { door: "KAK GAMBLE",       world: "light", x: 2148, y: 7005 },
            { door: "MAZE",             world: "light", x: 1063, y: 7161 },
            { door: "45",               world: "light", x: 2656, y: 8255 },
            { door: "CASTLE LEFT",      world: "light", x: 4492, y: 3880 },
            { door: "CASTLE BACK",      world: "light", x: 5000, y: 3997 },
            { door: "CASTLE RIGHT",     world: "light", x: 5508, y: 3880 },
            { door: "CASTLE FRONT",     world: "light", x: 5000, y: 4388 },
            { door: "CASTLE HOLE EXIT", world: "light", x: 5508, y: 4298, hole_exit: true },
            { door: "CASTLE HOLE",      world: "light", x: 5951, y: 4154 },
            { door: "HOME ROCKS",       world: "light", x: 4727, y: 6523 },
            { door: "HOME",             world: "light",  x: 5469, y: 6888 },
            { door: "HOME SOUTH",       world: "light", x: 5964, y: 7786 },
            { door: "LAKE FORTUNE",     world: "light", x: 6484, y: 8021 },
            { door: "LAKE SHOP",        world: "light", x: 7266, y: 7669 },
            { door: "LAKE ISLAND",      world: "light", x: 7930, y: 8529 },
            { door: "PRE EASTERN",      world: "light", x: 8242, y: 6458 },
            { door: "EAST HIDEOUT",     world: "light", x: 8099, y: 4531 },
            { door: "FLUTE 5",          world: "light", x: 9790, y: 7005 },
            { door: "EASTERN",          world: "light", x: 9583, y: 3880 },
            { door: "DAM",              world: "light", x: 4688, y: 9349 },
            { door: "MOLDORM",          world: "light", x: 6523, y: 9388 },
            { door: "MALL LEFT",        world: "light", x: 8862, y: 7630 },
            { door: "MALL RIGHT",       world: "light", x: 9218, y: 7630 },
            { door: "MALL LOWER",       world: "light", x: 9023, y: 7990 },
            { door: "DESERT BACK",      world: "light", x: 742,  y: 7669 },
            { door: "DESERT LEFT",      world: "light", x: 352,  y: 7943 },
            { door: "DESERT FRONT",     world: "light", x: 742,  y: 8060 },
            { door: "DESERT RIGHT",     world: "light", x: 1120, y: 7943 },
            { door: "DESERT CHECKER",   world: "light", x: 1758, y: 7773 },
            { door: "DESERT CAVE",      world: "light", x: 1992, y: 8255 },
            { door: "CANYON OPEN",      world: "light", x: 2773, y: 8919 },
            { door: "CANYON ROCK",      world: "light", x: 3125, y: 9570 },
            { door: "HERA",             world: "light", x: 5599, y: 326  },
            { door: "SPEC ROCK",        world: "light", x: 4900, y: 1029 },
            { door: "WDM LEDGE L",      world: "light", x: 4510, y: 1380 },
            { door: "WDM LEDGE R",      world: "light", x: 4900, y: 1458 },
            { door: "WDM EXIT",         world: "light", x: 3960, y: 1380 },
            { door: "WDM OLDMAN BACK",  world: "light", x: 5352, y: 1615 },
            { door: "WDM OLDMAN FRONT", world: "light", x: 4492, y: 2240 },
            { door: "WDM ENTER",        world: "light", x: 4062, y: 1888 },
            { door: "EDM SUMMIT",       world: "light", x: 8594, y: 550  },
            { door: "EDM LEDGE LEFT",   world: "light", x: 7695, y: 930  },
            { door: "EDM LEDGE RIGHT",  world: "light", x: 8395, y: 930  },
            { door: "EDM LEDGE MID",    world: "light", x: 8045, y: 1060 },
            { door: "EDM LOWER LEFT",   world: "light", x: 7695, y: 1285 },
            { door: "EDM ROCKBLOCKED",  world: "light", x: 8045, y: 1410 },
            { door: "EDM DOUBLE LEFT",  world: "light", x: 8395, y: 1570 },
            { door: "EDM DOUBLE RIGHT", world: "light", x: 8760, y: 1570 },
            { door: "EDM LOWER RIGHT",  world: "light", x: 8633, y: 2161 },

            { door: "SKULL",            world: "dark",  x: 391,  y: 495  },
            { door: "DARK JACKS",       world: "dark",  x: 3359, y: 560  },
            { door: "DARK HILLS UPPER", world: "dark",  x: 3555, y: 1480 },
            { door: "DARK HILLS LOWER", world: "dark",  x: 3555, y: 1900 },
            { door: "OUTCAST FORTUNE",  world: "dark",  x: 1875, y: 3216 },
            { door: "DARK CHURCH",      world: "dark",  x: 4609, y: 2747 },
            { door: "BEE SHOP",         world: "dark",  x: 3320, y: 4583 },
            { door: "DARK WITCH",       world: "dark",  x: 8047, y: 3372 },
            { door: "THIEVES",          world: "dark",  x: 1250, y: 4857 },
            { door: "CHEST GAME",       world: "dark",  x: 508,  y: 4661 },
            { door: "C SHAPED",         world: "dark",  x: 2070, y: 4818 },
            { door: "OUTCAST SEALED",   world: "dark",  x: 1094, y: 5833 },
            { door: "OUTCAST PEGHOUSE", world: "dark",  x: 2031, y: 5326 },
            { door: "PEG CAVE",         world: "dark",  x: 3164, y: 6042 },
            { door: "ARCHERY",          world: "dark",  x: 2148, y: 7005 },
            { door: "BOMB SHOP ROCKS",  world: "dark",  x: 4727, y: 6523 },
            { door: "BOMB SHOP",        world: "dark",  x: 5469, y: 6888 },
            { door: "HYPE",             world: "dark",  x: 5977, y: 7786 },
            { door: "PYRAMID HOLE",     world: "dark",  x: 4974, y: 4076 },
            { door: "PYRAMID EXIT",     world: "dark",  x: 4298, y: 4857, hole_exit: true },
            { door: "PYRAMID SEALED",   world: "dark",  x: 4688, y: 4857 },
            { door: "DARK LAKE SHOP",   world: "dark",  x: 6484, y: 8021 },
            { door: "ICE",              world: "dark",  x: 7969, y: 8633 },
            { door: "PRE POD",          world: "dark",  x: 8242, y: 6458 },
            { door: "POD HINT",         world: "dark",  x: 8490, y: 5013 },
            { door: "DARK FLUTE 5",     world: "dark",  x: 9790, y: 7005 },
            { door: "POD",              world: "dark",  x: 9583, y: 3919 },
            { door: "SWAMP",            world: "dark",  x: 4688, y: 9349 },
            { door: "DARK MALL LEFT",   world: "dark",  x: 8862, y: 7630 },
            { door: "DARK MALL RIGHT",  world: "dark",  x: 9218, y: 7630 },
            { door: "DARK MALL LOWER",  world: "dark",  x: 9023, y: 7990 },
            { door: "MIRE LEFT",        world: "dark",  x: 352,  y: 8008 },
            { door: "MIRE",             world: "dark",  x: 742,  y: 8047 },
            { door: "MIRE RIGHT",       world: "dark",  x: 1120, y: 8008 },
            { door: "MIRE CAVE",        world: "dark",  x: 1992, y: 8255 },
            { door: "GT",               world: "dark",  x: 5625, y: 190  },
            { door: "DARK WDM LEDGE",   world: "dark",  x: 5742, y: 1458 },
            { door: "DARK WDM BOTTOM",  world: "dark",  x: 4062, y: 1888 },
            { door: "DARK EDM FLOAT",   world: "dark",  x: 8008, y: 190  },
            { door: "DARK EDM ROCK",    world: "dark",  x: 8210, y: 570  },
            { door: "DARK EDM SUMMIT",  world: "dark",  x: 8594, y: 550  },
            { door: "DARK EDM DOUB L",  world: "dark",  x: 8395, y: 1570 },
            { door: "DARK EDM DOUB R",  world: "dark",  x: 8760, y: 1570 },
            { door: "SAFETY LEDGE",     world: "dark",  x: 8045, y: 1060 },
            { door: "DARK LEDGE LEFT",  world: "dark",  x: 7695, y: 930  },
            { door: "DARK LEDGE RIGHT", world: "dark",  x: 8395, y: 930  },
            { door: "TURTLE ROCK",      world: "dark",  x: 9414, y: 794  },

            { task: "pedestal",         world: "light", x: 404,  y: 456  },
            { task: "ether",            world: "light", x: 4193, y: 140  },
            { task: "spectacle rock",   world: "light", x: 5053, y: 614  },
            { task: "floating island",  world: "light", x: 8105, y: 228  },
            { task: "zora",             world: "light", x: 9667, y: 1404 },
            { task: "zora ledge",       world: "light", x: 9667, y: 1720 },
            { task: "bottle merchant",  world: "light", x: 947,  y: 4632 },
            { task: "race game",        world: "light", x: 298,  y: 6965 },
            { task: "shovel",           world: "light", x: 3000, y: 6702 },
            { task: "hylia island",     world: "light", x: 7228, y: 8298 },
            { task: "hobo",             world: "light", x: 7105, y: 6947 },
            { task: "desert ledge",     world: "light", x: 246,  y: 9158 },
            { task: "bombos",           world: "light", x: 2210, y: 9228 },
            { task: "flooded item",     world: "light", x: 4320, y: 9316 },

            { task: "bumper ledge",     world: "dark",  x: 3158, y: 1500 },
            { task: "catfish",          world: "dark",  x: 9175, y: 1491 },
            { task: "pyramid",          world: "dark",  x: 5772, y: 4509 },
            { task: "digging game",     world: "dark",  x: 509,  y: 6965 },
            { task: "stumpy",           world: "dark",  x: 3088, y: 6807 },
            { task: "smith",            world: "dark",  x: 1456, y: 6561 },
            { task: "purple chest",     world: "dark",  x: 3035, y: 5228 },
        ],

        connectors: [
            [
                { roomset: "DM Ascent",      short: "DMa", parts: ["L", "R"] },
                { roomset: "DM Descent",     short: "DMd", parts: ["L", "R"] },
                { roomset: "Bumper",         short: "Bmp", parts: ["U", "D"] },
            ],

            [
                { roomset: "Brothers",       short: "Bro", parts: ["L", "R"] },
                { roomset: "Elder",          short: "Eld", parts: ["L", "R"] },
                { roomset: "Fairy Ascent",   short: "Fai", parts: ["U", "D"] },
            ],

            [
                { roomset: "Hookshot Cave",  short: "Hok", parts: ["L", "R"] },
                { roomset: "Spiral",         short: "Spi", parts: ["U", "D"] },
                { roomset: "Super Bunny",    short: "Bun", parts: ["U", "D"] },
            ],

            [
                { roomset: "Old Man's Home", short: "Old", parts: ["L", "R"] },
                { roomset: "Spectacle Rock", short: "Spc", parts: ["U", "Mid", "D"] },
                { roomset: "Paradox Cave",   short: "Par", parts: ["U", "Mid", "D"] },
            ],
        ],

        holes: [
            { roomset: "Bat",   short: "Bat" },
            { roomset: "Fairy", short: "F", auto_clear: true },
            { roomset: "Ganon", short: "Gan" },
            { roomset: "Jacks", short: "Jac" },
            { roomset: "Thief", short: "Thf" },
            { roomset: "Uncle", short: "Unc" },
            { roomset: "Well",  short: "Wel" },
        ],

        special_rooms: [
            { roomset: "Bomb",    short: "Bom" },
            { roomset: "House",   short: "Hus" },
            { roomset: "Kid",     short: "Kid" },
            { roomset: "Library", short: "Lib" },
            { roomset: "Mimic",   short: "Mim" },
            { roomset: "Potion",  short: "Pot" },
            { roomset: "Saha",    short: "Sah" },
            { roomset: "Spike",   short: "Spk" },
            { roomset: "Smiths",  short: "Smi" },
        ],

        multi_rooms: [
            { roomset: "5 Item", short: "5 i", count: 3,   auto_clear: true },
            { roomset: "2 Item", short: "2 i", count: 3,   auto_clear: true },
            { roomset: "1 Item", short: "1 i", count: 12,  auto_clear: true },
            { roomset: "Dam",    short: "Dam", count: 1,   auto_clear: true },
            { roomset: "Hint",   short: "Hin", count: 6,   auto_clear: true },
            { roomset: "Other",  short: "Oth", count: 35,  auto_clear: true },
        ],

        items: [
            ["bow", "boomerang", "hookshot", "bombs", "powder"],
            ["fire_rod", "ice_rod", "bombos", "ether", "quake"],
            ["lamp", "hammer", "flute", "bugnet", "book"],
            ["bottle", "somaria", "byrna", "cape", "mirror"],
            [],
            ["boots", "glove", "flippers", "pearl", "sword", "shovel", "mushroom"],
        ],

        item_sets: {
            "bow": ["bow", "bow_silvers"],
            "boomerang": ["blue_boom", "red_boom"],
            "hookshot": ["hookshot"],
            "bombs": ["bombs"],
            "powder": ["powder"],
            "mushroom": ["mushroom"],
            "fire_rod": ["fire_rod"],
            "ice_rod": ["ice_rod"],
            "bombos": ["bombos"],
            "ether": ["ether"],
            "quake": ["quake"],
            "lamp": ["lamp"],
            "hammer": ["hammer"],
            "flute": ["flute"],
            "shovel": ["shovel"],
            "bugnet": ["bugnet"],
            "book": ["book"],
            "bottle": ["bottle1", "bottle2", "bottle3", "bottle4"],
            "somaria": ["somaria"],
            "byrna": ["byrna"],
            "cape": ["cape"],
            "mirror": ["mirror"],
            "boots": ["boots"],
            "glove": ["glove", "mitt"],
            "flippers": ["flippers"],
            "pearl": ["pearl"],
            "sword": ["sword1", "sword2", "sword3", "sword4"],
        },

        rewards: ["unknown", "crystal", "red_crystal", "pendant", "green_pendant"],

        dungeon_features: [
            "entrance_1",
            "entrance_2",
            "entrance_3",
            "entrance_4",
            "entrance_D",
            "crystal_switch",
            "red_peg",
            "blue_peg",
            "oneway_out",
            "oneway_in",
        ],

        dungeon_icons: [
            "bigkey",
            "smallkey",
            "sword",
            "bow",
            "red_boom",
            "hookshot",
            "bombs",
            "fire_rod",
            "ice_rod",
            "bombos",
            "lamp",
            "hammer",
            "somaria",
            "cape",
            "boots",
            "glove",
            "flippers",
        ],

        dungeon_rooms: [
            {
                dungeon: "Castle",
                name: "Front",
                paths: [
                    { name: "Up" },
                    { name: "Right" },
                    { name: "Down" },
                    { name: "Left 1" },
                    { name: "Left 2" },
                ],
            },
            {
                dungeon: "Castle",
                name: "Left",
                paths: [
                    { name: "Up" },
                    { name: "Right 1" },
                    { name: "Right 2" },
                    { name: "Down" },
                ],
            },
            {
                dungeon: "Castle",
                name: "Right",
                paths: [
                    { name: "Up 1" },
                    { name: "Up 2" },
                    { name: "Down" },
                    { name: "Left" },
                ],
            },
            {
                dungeon: "Castle",
                name: "Hall",
                paths: [
                    { name: "Down 1" },
                    { name: "Down 2" },
                    { name: "Left" },
                ],
            },
            {
                dungeon: "Castle",
                name: "T",
                paths: [
                    { name: "Up" },
                    { name: "Right" },
                    { name: "Left" },
                ],
            },
            {
                dungeon: "Castle",
                name: "Dungeon 1",
                paths: [
                    { name: "Up" },
                    { name: "Down 1" },
                    { name: "Down 2", oneway: "in" },
                ],
            },
            {
                dungeon: "Castle",
                name: "Dungeon 2",
                paths: [
                    { name: "Up" },
                    { name: "Right 1" },
                    { name: "Right 2" },
                ],
            },

            {
                dungeon: "Eastern",
                name: "T",
                paths: [
                    { name: "Right" },
                    { name: "Down" },
                    { name: "Left" },
                ],
            },
            {
                dungeon: "Eastern",
                name: "Hint",
                paths: [
                    { name: "Right 1" },
                    { name: "Right 2" },
                    { name: "Down" },
                    { name: "Left" },
                ],
            },
            {
                dungeon: "Eastern",
                name: "Big Chest",
                paths: [
                    { name: "Up" },
                    { name: "Right" },
                    { name: "Left" },
                ],
            },

            {
                dungeon: "Desert",
                name: "Front",
                paths: [
                    { name: "Up 1" },
                    { name: "Up 2" },
                    { name: "Up 3" },
                    { name: "Right" },
                    { name: "Down" },
                    { name: "Left" },
                ],
            },
            {
                dungeon: "Desert",
                name: "Map",
                paths: [
                    { name: "Right" },
                    { name: "Down 1" },
                    { name: "Down 2" },
                    { name: "Left" },
                ],
            },
            {
                dungeon: "Desert",
                name: "Compass",
                paths: [
                    { name: "Up 1" },
                    { name: "Up 2" },
                    { name: "Down" },
                    { name: "Left" },
                ],
            },

            {
                dungeon: "Hera",
                name: "Tower",
                paths: [
                    { name: "Ground Floor Back" },
                    { name: "Ground Floor Left" },
                    { name: "Ground Floor Right" },
                    { name: "2nd Floor Front" },
                    { name: "2nd Floor Back" },
                    { name: "Chest Floor Left" },
                    { name: "Chest Floor Right" },
                    { name: "4th Floor Left" },
                    { name: "4th Floor Right" },
                    { name: "Boss Stairs" },
                ],
            },

            {
                dungeon: "PoD",
                name: "Front",
                paths: [
                    { name: "Stairs 1" },
                    { name: "Up" },
                    { name: "Stairs 2" },
                    { name: "Down" },
                ],
            },
            {
                dungeon: "PoD",
                name: "Drops",
                paths: [
                    { name: "Up 1" },
                    { name: "Chest Stairs" },
                    { name: "Up 2" },
                    { name: "Down" },
                    { name: "Drop Stairs" },
                    { name: "Mimics" },
                ],
            },
            {
                dungeon: "PoD",
                name: "Arena",
                paths: [
                    { name: "Up 1" },
                    { name: "Up 2" },
                    { name: "Right" },
                    { name: "Down 1" },
                    { name: "Down 2" },
                ],
            },
            {
                dungeon: "PoD",
                name: "Map",
                paths: [
                    { name: "Up" },
                    { name: "Down" },
                    { name: "Left 1" },
                    { name: "Left 2" },
                ],
            },
            {
                dungeon: "PoD",
                name: "Back",
                paths: [
                    { name: "Stairs 1" },
                    { name: "Stairs 2" },
                    { name: "Down 1" },
                    { name: "Down 2" },
                    { name: "Left" },
                ],
            },

            {
                dungeon: "Swamp",
                name: "Key Hall",
                paths: [
                    { name: "Up" },
                    { name: "Left 1" },
                    { name: "Left 2" },
                ],
            },
            {
                dungeon: "Swamp",
                name: "Hammer Drain",
                paths: [
                    { name: "Right" },
                    { name: "Left 1" },
                    { name: "Left 2" },
                ],
            },
            {
                dungeon: "Swamp",
                name: "Big Chest",
                paths: [
                    { name: "Up" },
                    { name: "Right" },
                    { name: "Down" },
                    { name: "Left 1" },
                    { name: "Left 2" },
                ],
            },
            {
                dungeon: "Swamp",
                name: "Crystal Drain",
                paths: [
                    { name: "Right 1" },
                    { name: "Right 2" },
                    { name: "Left" },
                ],
            },
            {
                dungeon: "Swamp",
                name: "Drops",
                paths: [
                    { name: "Right 1" },
                    { name: "Right 2" },
                    { name: "Lower Stairs" },
                    { name: "Upper Stairs" },
                ],
            },
            {
                dungeon: "Swamp",
                name: "Back",
                paths: [
                    { name: "Left Stairs" },
                    { name: "Right Stairs" },
                    { name: "Front Stairs" },
                    { name: "Down" },
                ],
            },
            {
                dungeon: "Swamp",
                name: "Flooded Chests",
                paths: [
                    { name: "Up" },
                    { name: "Left Stairs" },
                    { name: "Right Stairs" },
                    { name: "Front Stairs" },
                ],
            },

            {
                dungeon: "Skull",
                name: "Big Chest",
                paths: [
                    { name: "Down 1" },
                    { name: "Down 2" },
                    { name: "Left" },
                ],
            },

            {
                dungeon: "Thieves",
                name: "Lobby 1",
                paths: [
                    { name: "Up 1" },
                    { name: "Up 2" },
                    { name: "Right", oneway: "in" },
                    { name: "Down" },
                ],
            },
            {
                dungeon: "Thieves",
                name: "Lobby 2",
                paths: [
                    { name: "Right 1" },
                    { name: "Right High" },
                    { name: "Right 3" },
                    { name: "Down 1" },
                    { name: "Down 2" },
                ],
            },
            {
                dungeon: "Thieves",
                name: "Lobby 3",
                paths: [
                    { name: "Up 1" },
                    { name: "Up 2" },
                    { name: "Down 1" },
                    { name: "Down 2" },
                    { name: "Left 1" },
                    { name: "Left High" },
                    { name: "Left 3" },
                ],
            },
            {
                dungeon: "Thieves",
                name: "Lobby 4",
                paths: [
                    { name: "Up 1" },
                    { name: "Up 2" },
                    { name: "Left High" },
                    { name: "Left Low" },
                ],
            },
            {
                dungeon: "Thieves",
                name: "Back",
                paths: [
                    { name: "Stairs" },
                    { name: "Up" },
                    { name: "Down" },
                    { name: "Left 1" },
                    { name: "Left 2" },
                ],
            },
            {
                dungeon: "Thieves",
                name: "Hellway",
                paths: [
                    { name: "Up" },
                    { name: "Right 1" },
                    { name: "Right 2" },
                ],
            },

            {
                dungeon: "Ice",
                name: "Conveyor Cross",
                paths: [
                    { name: "Upper Stairs" },
                    { name: "Cross Right" },
                    { name: "Cross Down" },
                    { name: "Lower Stairs" },
                ],
            },
            {
                dungeon: "Ice",
                name: "Tower",
                paths: [
                    { name: "Cross Right" },
                    { name: "Cross Down" },
                    { name: "Hint Hall Right" },
                    { name: "Hint Hall Down" },
                    { name: "BigChest Stairs" },
                    { name: "BigChest Right" },
                    { name: "Basement Stairs" },
                    { name: "Basement Right" },
                    { name: "Basement Down" },
                ],
            },
            {
                dungeon: "Ice",
                name: "Spike Chest",
                paths: [
                    { name: "Stairs 1" },
                    { name: "Stairs 2" },
                    { name: "Left" },
                ],
            },

            {
                dungeon: "Mire",
                name: "Hub",
                paths: [
                    { name: "Blue Up" },
                    { name: "Up 2" },
                    { name: "Blue Right" },
                    { name: "Right 2" },
                    { name: "Right 3" },
                    { name: "Down" },
                    { name: "Left 1" },
                    { name: "Left 2" },
                ],
            },
            {
                dungeon: "Mire",
                name: "Slug Cross",
                paths: [
                    { name: "Up" },
                    { name: "Right" },
                    { name: "Down 1" },
                    { name: "Down 2" },
                ],
            },
            {
                dungeon: "Mire",
                name: "Spike Chest",
                paths: [
                    { name: "Up" },
                    { name: "Down" },
                    { name: "Left 1" },
                    { name: "Left 2" },
                ],
            },
            {
                dungeon: "Mire",
                name: "Tile Room",
                paths: [
                    { name: "Up" },
                    { name: "Right 1" },
                    { name: "Right 2" },
                    { name: "Down 1" },
                    { name: "Down 2" },
                ],
            },
            {
                dungeon: "Mire",
                name: "Drops and Warps",
                paths: [
                    { name: "Cutscene Stairs" },
                    { name: "Slugs Up" },
                    { name: "Slugs Stairs" },
                    { name: "Spikeway Up" },
                    { name: "Spikeway Down" },
                    { name: "Wizrobes Up" },
                    { name: "Wizrobes Right" },
                ],
            },
            {
                dungeon: "Mire",
                name: "Big Chest",
                paths: [
                    { name: "Blue Up" },
                    { name: "Blue Left" },
                    { name: "Bridge Left" },
                    { name: "Lower Left" },
                ],
            },
            {
                dungeon: "Mire",
                name: "Bridges",
                paths: [
                    { name: "Stairs" },
                    { name: "Down 1" },
                    { name: "Down 2" },
                ],
            },

            {
                dungeon: "TRock",
                name: "Hub",
                paths: [
                    { name: "Up 1" },
                    { name: "Up 2" },
                    { name: "Right 1" },
                    { name: "Right 2" },
                    { name: "Down 1" },
                    { name: "Down 2" },
                ],
            },
            {
                dungeon: "TRock",
                name: "Rocky Pipes",
                paths: [
                    { name: "Stairs" },
                    { name: "Left 1", oneway: "in" },
                    { name: "Left 2" },
                ],
            },
            {
                dungeon: "TRock",
                name: "Lava Pipes",
                paths: [
                    { name: "Right" },
                    { name: "Down" },
                    { name: "Left" },
                ],
            },
            {
                dungeon: "TRock",
                name: "Big Chest",
                paths: [
                    { name: "Up 1" },
                    { name: "Up 2" },
                    { name: "Down" },
                    { name: "Left" },
                ],
            },

            {
                dungeon: "GT",
                name: "Big Chest",
                paths: [
                    { name: "Left Stairs" },
                    { name: "Right Stairs" },
                    { name: "Right" },
                    { name: "Big Chest Stairs" },
                    { name: "Down" },
                    { name: "Left" },
                ],
            },
            {
                dungeon: "GT",
                name: "Hookway",
                paths: [
                    { name: "Up" },
                    { name: "Right" },
                    { name: "Down" },
                ],
            },
            {
                dungeon: "GT",
                name: "Warps",
                paths: [
                    { name: "Up", oneway: "in" },
                    { name: "Left", oneway: "out" },
                    { name: "Right", oneway: "out" },
                ],
            },
            {
                dungeon: "GT",
                name: "Tile Room",
                paths: [
                    { name: "Up" },
                    { name: "Down" },
                    { name: "Left" },
                ],
            },
            {
                dungeon: "GT",
                name: "Invisible Floor",
                paths: [
                    { name: "Up 1" },
                    { name: "Up 2" },
                    { name: "Right", oneway: "in" },
                    { name: "Left" },
                ],
            },
            {
                dungeon: "GT",
                name: "Moldorm",
                paths: [
                    { name: "Up", oneway: "in" },
                    { name: "Ledge Stairs", oneway: "in" },
                    { name: "Pit Stairs", oneway: "out" },
                    { name: "Left", oneway: "out" },
                ],
            },
        ],
    };
}
