function throw_if_invalid_mode(mode) {
    const valid = ["normal", "doors"];
    if (valid.indexOf(mode) === -1) {
        throw Error(`Invalid mode: ${mode}. Valid modes are: ` + valid.join(", "));
    }
}

function game_data(mode) {
    throw_if_invalid_mode(mode);

    const dungeon_keys = {
        normal: {
            Eastern: { keys: 0, bigkey: true  },
            Desert:  { keys: 1, bigkey: true  },
            Hera:    { keys: 1, bigkey: true  },
            PoD:     { keys: 6, bigkey: true  },
            Swamp:   { keys: 1, bigkey: true  },
            Skull:   { keys: 3, bigkey: true  },
            Thieves: { keys: 1, bigkey: true  },
            Ice:     { keys: 2, bigkey: true  },
            Mire:    { keys: 3, bigkey: true  },
            TRock:   { keys: 4, bigkey: true  },
            Castle:  { keys: 1, bigkey: false },
            Aga:     { keys: 2, bigkey: false },
            GT:      { keys: 4, bigkey: true  },
        },

        doors: {
            Eastern: { keys: 0, bigkey: true  },
            Desert:  { keys: 0, bigkey: true  },
            Hera:    { keys: 0, bigkey: true  },
            PoD:     { keys: 0, bigkey: true  },
            Swamp:   { keys: 0, bigkey: true  },
            Skull:   { keys: 0, bigkey: true  },
            Thieves: { keys: 0, bigkey: true  },
            Ice:     { keys: 0, bigkey: true  },
            Mire:    { keys: 0, bigkey: true  },
            TRock:   { keys: 0, bigkey: true  },
            Castle:  { keys: 0, bigkey: true  },
            Aga:     { keys: 0, bigkey: true  },
            GT:      { keys: 0, bigkey: true  },
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
            { door: "WOODS HOLE",       world: "light", x: 1888, y: 1302 },
            { door: "JACKS HOUSE",      world: "light", x: 3359, y: 612  },
            { door: "TREE HOLE",        world: "light", x: 2970, y: 716  },
            { door: "HILLS UPPER",      world: "light", x: 3555, y: 1480 },
            { door: "HILLS LOWER",      world: "light", x: 3555, y: 1900 },
            { door: "KAK FORTUNE",      world: "light", x: 1875, y: 3216 },
            { door: "SANC ROCKS",       world: "light", x: 3906, y: 2930 },
            { door: "GRAVE HOLE",       world: "light", x: 5195, y: 2930 },
            { door: "GRAVE LEDGE",      world: "light", x: 5650, y: 2747 },
            { door: "KINGS TOMB",       world: "light", x: 6030, y: 2969 },
            { door: "RIVER HOLE",       world: "light", x: 6419, y: 3099 },
            { door: "WITCH",            world: "light", x: 8008, y: 3333 },
            { door: "WATERFALL",        world: "light", x: 9150, y: 1341 },
            { door: "KAK HOLE",         world: "light", x: 234,  y: 4258 },
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
            { door: "CASTLE HOLE",      world: "light", x: 5951, y: 4154 },
            { door: "HOME ROCKS",       world: "light", x: 4727, y: 6523 },
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

            { task: "ether",            world: "light", x: 4193, y: 140  },
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

            { task: "catfish",          world: "dark",  x: 9175, y: 1491 },
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
            ["boots", "glove", "flippers", "pearl", "sword"],
        ],

        item_sets: {
            "bow": ["bow", "bow_silvers"],
            "boomerang": ["blue_boom", "red_boom", "red_blue_boom"],
            "hookshot": ["hookshot"],
            "bombs": ["bombs"],
            "powder": ["mushroom", "powder", "mushroom_powder"],
            "fire_rod": ["fire_rod"],
            "ice_rod": ["ice_rod"],
            "bombos": ["bombos"],
            "ether": ["ether"],
            "quake": ["quake"],
            "lamp": ["lamp"],
            "hammer": ["hammer"],
            "flute": ["shovel", "flute", "shovel_flute"],
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

        choices: {
            default: {
                Eastern: [
                    {
                        name: "Entrance",
                        paths: [
                            "Up",
                        ],
                    },
                ],
                Desert: [
                    {
                        name: "Final",
                        paths: [
                            "Up",
                        ],
                    },
                    {
                        name: "Popos",
                        paths: [
                            "Up",
                        ],
                    },
                ],
                Hera: [
                    {
                        name: "Tower",
                        paths: [
                            "Entrance Up",
                            "Entrance Left",
                            "Entrance Right",
                            "2F Up",
                            "2F Down",
                            "BigChest Left",
                            "BigChest Right",
                            "4F Left",
                            "4F Right",
                            "Moldorm",
                        ],
                    },
                ],
                PoD: [
                    {
                        name: "Entrance",
                        paths: [
                            "Left",
                            "Middle",
                            "Right",
                        ],
                    },
                ],
                Swamp: [
                    {
                        name: "Entrance",
                        paths: [
                            "Up",
                        ],
                    },
                ],
                Thieves: [
                    {
                        name: "Entrance",
                        paths: [
                            "Southeast Left",
                            "Northwest Right",
                            "BigKey Up",
                            "Shutter",
                        ],
                    },
                    {
                        name: "Maiden",
                        paths: [
                            "Up",
                            "Left 1",
                            "Left 2",
                        ],
                    },
                ],
                Skull: [
                    {
                        name: "Final",
                        paths: [
                            "Up",
                        ],
                    },
                    {
                        name: "BigChest",
                        paths: [
                            "Left",
                            "Down",
                        ],
                    },
                    {
                        name: "Statue Switch",
                        paths: [
                            "Left",
                        ],
                    },
                    {
                        name: "Star Drop",
                        paths: [
                            "Right",
                        ],
                    },
                    {
                        name: "Firebar Drop",
                        paths: [
                            "Up",
                            "Right",
                        ],
                    },
                    {
                        name: "Mummy Drop",
                        paths: [
                            "Up",
                            "Shutter",
                        ],
                    },
                ],
                Ice: [
                    {
                        name: "Entrance",
                        paths: [
                            "Up",
                        ],
                    },
                ],
                Mire: [
                    {
                        name: "Entrance",
                        paths: [
                            "Up",
                        ],
                    },
                ],
                TRock: [
                    {
                        name: "Front",
                        paths: [
                            "Up",
                        ],
                    },
                    {
                        name: "Eye Wall",
                        paths: [
                            "Right",
                        ],
                    },
                    {
                        name: "BigChest",
                        paths: [
                            "Up 1",
                            "Up 2",
                            "Left",
                        ],
                    },
                    {
                        name: "Laser Bridge",
                        paths: [
                            "Up",
                        ],
                    },
                ],
                Castle: [
                    {
                        name: "Left Entrance",
                        paths: [
                            "Up",
                            "Right 1",
                            "Right 2",
                        ],
                    },
                    {
                        name: "Middle Entrance",
                        paths: [
                            "Up",
                            "Left 1",
                            "Left 2",
                            "Right",
                        ],
                    },
                    {
                        name: "Right Entrance",
                        paths: [
                            "Up 1",
                            "Up 2",
                            "Left",
                        ],
                    },
                    {
                        name: "Sewer Drop",
                        paths: [
                            "Up",
                            "Down",
                        ],
                    },
                ],
                Aga: [
                    {
                        name: "Entrance",
                        paths: [
                            "Up",
                        ],
                    },
                ],
                GT: [
                    {
                        name: "Entrance",
                        paths: [
                            "Left",
                            "Middle",
                            "Right",
                        ],
                    },
                ],
            },

            random: [
                {
                    name: "Red Carpet Hall",
                    paths: [
                        "Left",
                        "Down 1",
                        "Down 2",
                    ],
                },
                {
                    name: "Royal Tee",
                    paths: [
                        "Up",
                        "Left",
                        "Right",
                    ],
                },
                {
                    name: "Nice View",
                    paths: [
                        "Left",
                        "Right",
                        "Down",
                    ],
                },
                {
                    name: "Eyegore BigChest",
                    paths: [
                        "Up",
                        "Left",
                        "Right",
                    ],
                },
                {
                    name: "Bones & Hint",
                    paths: [
                        "Left",
                        "Right 1",
                        "Right 2",
                        "Down",
                    ],
                },
                {
                    name: "Gloomy Drops & Mimic Warps",
                    paths: [
                        "Up 1",
                        "Chest Stairs",
                        "Up 2",
                        "Down",
                        "Drop Stairs",
                        "Warp Stairs",
                        "Mimics Up",
                    ],
                },
                {
                    name: "Beetle Arena",
                    paths: [
                        "Up 1",
                        "Up 2",
                        "Right",
                        "Down 1",
                        "Down 2",
                    ],
                },
                {
                    name: "Whack-a-Mole Ledge",
                    paths: [
                        "Up",
                        "Left 1",
                        "Left 2",
                        "Down",
                    ],
                },
                {
                    name: "Hammer Jump",
                    paths: [
                        "Up 1",
                        "Up 2",
                        "Left",
                        "Down 1",
                        "Down 2",
                    ],
                },
                {
                    name: "Water Bubble Hall",
                    paths: [
                        "Up",
                        "Left 1",
                        "Left 2",
                    ],
                },
                {
                    name: "Hammer Drain",
                    paths: [
                        "Left 1",
                        "Left 2",
                        "Right",
                    ],
                },
                {
                    name: "Wet BigChest",
                    paths: [
                        "Up",
                        "Left 1",
                        "Left 2",
                        "Right",
                        "Down",
                    ],
                },
                {
                    name: "Crystal Drain",
                    paths: [
                        "Left",
                        "Right 1",
                        "Right 2",
                    ],
                },
                {
                    name: "Wet Drops",
                    paths: [
                        "Upper Stairs",
                        "Lower Stairs",
                        "Right 1",
                        "Right 2",
                    ],
                },
                {
                    name: "Statue Shutters Stairs",
                    paths: [
                        "Up 1",
                        "Up 2",
                        "Mid Stairs",
                        "Down",
                    ],
                },
                {
                    name: "Diver Drain",
                    paths: [
                        "Up",
                        "Stairs 1",
                        "Stairs 2",
                        "Chest Stairs",
                    ],
                },
                {
                    name: "Garbage Disposal",
                    paths: [
                        "Up 1",
                        "Up 2",
                        "Left 1",
                        "Left 2",
                        "Down",
                    ],
                },
                {
                    name: "Hellway",
                    paths: [
                        "Up",
                        "Right 1",
                        "Right 2",
                    ],
                },
                {
                    name: "Switch Cross & Conveyor Drop",
                    paths: [
                        "Left Stairs",
                        "Cross Right",
                        "Cross Down",
                        "Conveyor",
                    ],
                },
                {
                    name: "Cold Tower",
                    paths: [
                        "Cross Right",
                        "Cross Down",
                        "Hint Hall Right",
                        "Hint Hall Down",
                        "BigChest Stairs",
                        "BigChest Right",
                        "Basement Stairs",
                        "Basement Right",
                        "Basement Down",
                    ],
                },
                {
                    name: "Cold Spike Chest",
                    paths: [
                        "Stairs 1",
                        "Stairs 2",
                        "Left",
                    ],
                },
                {
                    name: "Green Hub",
                    paths: [
                        "Blue Up",
                        "Up 2",
                        "Left 1",
                        "Left 2",
                        "Blue Right",
                        "Right 2",
                        "Right 3",
                        "Down",
                    ],
                },
                {
                    name: "Slug Cross",
                    paths: [
                        "Up",
                        "Right",
                        "Down 1",
                        "Down 2",
                    ],
                },
                {
                    name: "Green Spike Chest",
                    paths: [
                        "Up",
                        "Left 1",
                        "Left 2",
                        "Down",
                    ],
                },
                {
                    name: "Tiles & Torches",
                    paths: [
                        "Up",
                        "Right 1",
                        "Right 2",
                        "Down 1",
                        "Down 2",
                    ],
                },
                {
                    name: "Wizrobe Warps",
                    paths: [
                        "Cutscene Stairs",
                        "Slugs Up",
                        "Slugs Stairs",
                        "Spikeway Up",
                        "Spikeway Down",
                        "Wizrobes Up",
                        "Wizrobes Right",
                    ],
                },
                {
                    name: "Green BigChest",
                    paths: [
                        "Blue Up",
                        "Blue Left",
                        "Bridge Left",
                        "Free Left",
                    ],
                },
                {
                    name: "Wood Bridges",
                    paths: [
                        "Up",
                        "Down 1",
                        "Down 2",
                    ],
                },
                {
                    name: "Cane Hub",
                    paths: [
                        "Up 1",
                        "Up 2",
                        "Right 1",
                        "Right 2",
                        "Down 1",
                        "Down 2",
                    ],
                },
                {
                    name: "Rocky Pipes",
                    paths: [
                        "Up",
                        "Left 1",
                        "Left 2",
                    ],
                },
                {
                    name: "Lava Pipes",
                    paths: [
                        "Left",
                        "Right",
                        "Down",
                    ],
                },
                {
                    name: "Red Mail BigChest",
                    paths: [
                        "Up 1",
                        "Up 2",
                        "Left",
                        "Right",
                        "BigChest Stairs",
                        "Down",
                    ],
                },
                {
                    name: "Hookway",
                    paths: [
                        "Up",
                        "Right",
                        "Down",
                    ],
                },
                {
                    name: "Excessive Warps",
                    paths: [
                        "Crystals Up",
                        "Caged Left",
                        "Endpoint Right",
                    ],
                },
                {
                    name: "Mummy Hall",
                    paths: [
                        "Up",
                        "Left",
                        "Down",
                    ],
                },
                {
                    name: "Invisible Floor Hub",
                    paths: [
                        "Up 1",
                        "Up 2",
                        "Left",
                        "Shutter",
                    ],
                },
                {
                    name: "Final Moldorm",
                    paths: [
                        "Up",
                        "Ledge Stairs",
                        "Pit Stairs",
                        "Left",
                    ],
                },
            ],
        },
    };
}
