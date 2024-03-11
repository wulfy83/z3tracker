class AutoTrackException extends Error {
    constructor(message, should_disable) {
        super(message);
        this.should_disable = !!should_disable;
    }
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
            await this.ensure_z3r();
        } catch (error) {
            this.disconnect();
            throw error;
        }
    }

    async ensure_z3r() {
        if (FORCE_Z3R) {
            return;
        }

        try {
            const id_bytes = await this.get_address(0x7FC0, 16);
            const id_string = Array.from(id_bytes).map(c => String.fromCharCode(c)).join("");
            log("ROM ID: " + id_string);

            const is_z3r = id_bytes.every(c => c >= 32 && c <= 126) && (
                    id_string.startsWith("VT ") ||
                    id_string.startsWith("ER_") ||
                    id_string.startsWith("AP"));
            if (!is_z3r) {
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
        return this.get_address(0xF50000 + offset, length);
    }

    async get_save_ram(offset, length) {
        return this.get_address(0xF5F000 + offset, length);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function autotrack_main() {
    app.set_autotrack_status("Not Connected");
    const snes = new SnesSocket();

    while (true) {
        await sleep(500);

        if (!app.autotrack_is_enabled()) {
            snes.disconnect();
            continue;
        }

        try {
            await snes.ensure_ready();

            const module = await snes.get_work_ram(0x10, 1);
            if (module[0] === 0x1A) {
                app.done();
                continue;
            }
            if (module[0] <= 0x05 || module[0] === 0x14 || module[0] >= 0x1C) {
                app.set_autotrack_status("Not In Game");
                continue;
            }

            const buffer = await snes.get_save_ram(0, 0x500);
            app.autotrack_update(buffer);
        } catch (error) {
            app.set_autotrack_status(error.message);
            if (error.should_disable) {
                app.set_autotrack_enabled(false);
            }
        }
    }
}

autotrack_main();
