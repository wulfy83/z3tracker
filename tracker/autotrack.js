class AutoTrackException extends Error {
    constructor(message, should_disable) {
        super(message);
        this.should_disable = !!should_disable;
    }
}

function hex(n) {
    return n.toString(16).toUpperCase();
}

class SnesSocket {
    constructor() {
        this.socket = null;
    }

    create_websocket() {
        const socket = new WebSocket("ws://localhost:8080");
        socket.binaryType = "arraybuffer";
        return new Promise((resolve, reject) => {
            socket.onopen = function () { resolve(socket) };
            socket.onclose = function () { reject(new AutoTrackException("Connection Failed")) };
        });
    }

    connected() {
        return !!(this.socket && this.socket.readyState === 1);
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
        this.socket = null;
    }

    send(opcode, ...operands) {
        var message = {
            Space: "SNES",
            Opcode: opcode,
        };
        if (operands.length > 0) {
            message.Operands = operands;
        }
        this.socket.send(JSON.stringify(message));
    }

    receive() {
        if (!this.connected()) {
            return Promise.reject(new AutoTrackException("Connection Closed"));
        }

        return new Promise((resolve, reject) => {
            this.socket.onmessage = function (event) { resolve(event.data) };
            this.socket.onclose = function () { reject(new AutoTrackException("Connection Closed")) };
            setTimeout(() => reject(new AutoTrackException("Receive Timeout")), 1000);
        });
    }

    async ensure_ready() {
        if (this.connected()) {
            return;
        }

        try {
            this.socket = await this.create_websocket();

            this.send("DeviceList");
            const device_list_response = await this.receive();
            const device = JSON.parse(device_list_response).Results[0];
            log("Device: " + device);

            this.send("Attach", device);
            this.send("Name", "z3tracker");
        } catch (error) {
            this.disconnect();
            throw error;
        }
    }

    async ensure_z3r() {
        try {
            this.send("Info");
            const info_response = await this.receive();
            log(info_response);
            const rom = JSON.parse(info_response).Results[2];
            if (!rom.startsWith("/z3r/")) {
                throw new AutoTrackException("Not a z3r ROM", true);
            }
        } catch (error) {
            this.disconnect();
            throw error;
        }
    }

    async get_address(address, length) {
        this.send("GetAddress", hex(address), hex(length));
        const response = await this.receive();
        return new Uint8Array(response);
    }

    async get_work_ram(offset, length) {
        return await this.get_address(0xF50000 + offset, length);
    }

    async get_save_ram(offset, length) {
        return await this.get_address(0xF5F000 + offset, length);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function parse_items(buffer) {
    const flags = buffer[0x4C];
    const boomerang =
        (flags & 0x40) ? 2 :
        (flags & 0x80) ? 1 :
        0;
    const powder = (flags & 0x10) ? 1 : 0;
    const mushroom = (flags & 0x20) ? 1 : 0;
    const shovel = (flags & 0x04) ? 1 : 0;
    const flute = (flags & 0x03) ? 1 : 0;

    const bow_flags = buffer[0x4E];
    const bow =
        (buffer[0x00] === 0) ? 0 :
        ((bow_flags & 0xC0) === 0xC0) ? 2 :
        (bow_flags & 0x80) ? 1 :
        0;

    let bottle_count = 0;
    for (let i = 0; i < 4; i++) {
        if (buffer[0x1C + i] !== 0) {
            bottle_count++;
        }
    }

    function nonzero(offset) {
        return (buffer[offset] !== 0) ? 1 : 0;
    }

    return {
        "boomerang": boomerang,
        "powder": powder,
        "mushroom": mushroom,
        "shovel": shovel,
        "flute": flute,
        "bow": bow,
        "bottle": bottle_count,
        "hookshot": nonzero(0x02),
        "bombs": nonzero(0x03),
        "fire_rod": nonzero(0x05),
        "ice_rod": nonzero(0x06),
        "bombos": nonzero(0x07),
        "ether": nonzero(0x08),
        "quake": nonzero(0x09),
        "lamp": nonzero(0x0A),
        "hammer": nonzero(0x0B),
        "bugnet": nonzero(0x0D),
        "book": nonzero(0x0E),
        "somaria": nonzero(0x10),
        "byrna": nonzero(0x11),
        "cape": nonzero(0x12),
        "mirror": (buffer[0x13] == 2) ? 1 : 0,
        "glove": buffer[0x14],
        "boots": nonzero(0x15),
        "flippers": nonzero(0x16),
        "pearl": nonzero(0x17),
        "sword": buffer[0x19],
    };
}

function parse_keys(buffer) {
    const key_index = [
        ["Eastern", 2],
        ["Desert", 3],
        ["Hera", 10],
        ["PoD", 6],
        ["Swamp", 5],
        ["Skull", 8],
        ["Thieves", 11],
        ["Ice", 9],
        ["Mire", 7],
        ["TRock", 12],
        ["Castle", 1],
        ["Aga", 4],
        ["GT", 13],
    ];

    const keys = {};
    for (const [dungeon, i] of key_index) {
        keys[dungeon] = buffer[i];
    }
    return keys;
}

function bit(flags, bit) {
    return (flags & (1 << bit)) ? 1 : 0;
}

function parse_dungeon_items(flags1, flags2) {
    return {
        "GT":      bit(flags1, 2),
        "TRock":   bit(flags1, 3),
        "Thieves": bit(flags1, 4),
        "Hera":    bit(flags1, 5),
        "Ice":     bit(flags1, 6),
        "Skull":   bit(flags1, 7),

        "Mire":    bit(flags2, 0),
        "PoD":     bit(flags2, 1),
        "Swamp":   bit(flags2, 2),
        "Aga":     bit(flags2, 3),
        "Desert":  bit(flags2, 4),
        "Eastern": bit(flags2, 5),
        "Castle":  bit(flags2, 6) | bit(flags2, 7),
    };
}

async function autotrack_read(snes) {
    item_buffer = await snes.get_save_ram(0x340, 0x50);
    const items = parse_items(item_buffer);
    const compasses = parse_dungeon_items(item_buffer[0x24], item_buffer[0x25]);
    const big_keys = parse_dungeon_items(item_buffer[0x26], item_buffer[0x27]);
    const maps = parse_dungeon_items(item_buffer[0x28], item_buffer[0x29]);

    key_buffer = await snes.get_save_ram(0x4E0, 14);
    const keys = parse_keys(key_buffer);

    return { items, big_keys, keys, maps, compasses };
}

async function autotrack_main() {
    app.set_autotrack_status("Not Connected");
    let snes = new SnesSocket();

    while (true) {
        await sleep(1000);

        if (app.autotrack_is_enabled()) {
            try {
                await snes.ensure_ready();
                await snes.ensure_z3r();

                const module = await snes.get_work_ram(0x10, 1);
                if (module[0] <= 5) {
                    app.set_autotrack_status("Not In Game");
                    continue;
                }

                const data = await autotrack_read(snes);
                app.autotrack_update(data);
            } catch (error) {
                app.set_autotrack_status(error.message);
                if (error.should_disable) {
                    app.set_autotrack_enabled(false);
                }
            }
        } else {
            snes.disconnect();
        }
    }
}

autotrack_main();
