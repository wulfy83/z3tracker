window.oncontextmenu = event => event.preventDefault();

function get_config() {
    const map_size = 570;
    return {
        map_size,
        map_scale_factor: map_size / 10000,
        marker_hover_radius: 17,
    };
}

function blank_tracker() {
    return {
        mode: "normal",
        door_mapping: {},
        cleared_doors: {},
        cleared_tasks: {},
        dungeon_cleared: {},
        dungeon_reward: {},
        dungeon_bigkey: {},
        dungeon_keys: {},
        dungeon_map: {},
        dungeon_compass: {},
        items: {
        },
        save_buffer: new Array(0x500).fill(0),
        autotrack: {
            enabled: false,
            status: "",
        },
    };
}

function load_tracker() {
    const json = localStorage.getItem("tracker_data");
    return json ? JSON.parse(json) : null;
}

function save_tracker(tracker) {
    const json = JSON.stringify(tracker);
    localStorage.setItem("tracker_data", json);
}

var app = new Vue({
    el: "#tracker",
    template: `<tracker-main />`,
    data: {
        config: get_config(),
        tracker: load_tracker() || blank_tracker(),
        modal: {},
    },
    watch: {
        tracker: {
            deep: true,
            handler: save_tracker,
        },
    },

    computed: {
        room_mapping() {
            const result = {};
            for (const [door_name, room_name] of Object.entries(this.tracker.door_mapping)) {
                result[room_name] = door_name;
            }
            return result;
        },

        game() {
            return game_data(this.tracker.mode);
        },

        room_instances() {
            const roomsets = [
                ...this.game.dungeons,
                ...this.game.connectors.flat(),
                ...this.game.holes,
                ...this.game.special_rooms,
                ...this.game.multi_rooms,
            ];

            const result = {};
            for (const roomset of roomsets) {
                for (const part of this.roomset_parts(roomset)) {
                    const name = this.roomset_part_name(roomset, part);
                    result[name] = { ...roomset, part, name };
                }
            }
            return result;
        },
    },

    methods: {
        reset() {
            this.tracker = {
                ...blank_tracker(),
                mode: this.tracker.mode,
            };
        },

        set_vanilla_entrances() {
            if (Object.keys(this.tracker.door_mapping).length > 0) {
                throw Error("There are already entrance assignments");
            }
            for (const [door_name, room_name] of this.game.vanilla_entrances) {
                const room = this.room_instance(room_name);
                this.assign_door(door_name, room, "automated");
            }
        },

        set_mode(mode) {
            throw_if_invalid_mode(mode);
            this.tracker.mode = mode;
        },

        roomset_part_name(roomset, part) {
            return part ?
                roomset.roomset + " " + part :
                roomset.roomset;
        },

        roomset_parts(roomset) {
            return (
                roomset.parts ? roomset.parts :
                roomset.count ? [...Array(roomset.count).keys()].map(n => String(n + 1)) :
                [null]
            );
        },

        roomset_part_instances(roomset) {
            return this.roomset_parts(roomset).map(part => this.room_instance(this.roomset_part_name(roomset, part)));
        },

        room_instance(room_name) {
            return this.room_instances[room_name];
        },

        door_assignment(door_name) {
            const room_name = this.tracker.door_mapping[door_name];
            if (!room_name) {
                return null;
            }
            return this.room_instance(room_name);
        },

        room_assignment(room) {
            return this.room_mapping[room.name];
        },

        assign_door(door_name, room, automated) {
            this.$set(this.tracker.door_mapping, door_name, room.name);
            if (room.auto_clear === "always" || (room.auto_clear === "manual" && !automated)) {
                this.$set(this.tracker.cleared_doors, door_name, true);
            }
        },

        unassign_door(door_name) {
            this.$delete(this.tracker.door_mapping, door_name);
            this.$delete(this.tracker.cleared_doors, door_name);
        },

        unassign_room(room) {
            const door_name = this.room_assignment(room);
            this.unassign_door(door_name);
        },

        unassign_door_click(door_name) {
            this.unassign_door(door_name);
            this.close_modal();
        },

        toggle_door_cleared(door_name) {
            const room = this.door_assignment(door_name);
            if (room) {
                const cleared = !this.tracker.cleared_doors[door_name];
                this.$set(this.tracker.cleared_doors, door_name, cleared);
            }
        },

        toggle_room_cleared(room) {
            const door_name = this.room_assignment(room);
            if (door_name) {
                this.toggle_door_cleared(door_name);
            }
        },

        toggle_task_cleared(task) {
            const cleared = !this.task_is_cleared(task);
            this.$set(this.tracker.cleared_tasks, task, cleared);
        },

        door_is_cleared(door_name) {
            return this.tracker.cleared_doors[door_name];
        },

        room_is_cleared(room) {
            const door_name = this.room_assignment(room);
            return this.door_is_cleared(door_name);
        },

        task_is_cleared(task) {
            return this.tracker.cleared_tasks[task];
        },

        task_is_collected(marker) {
            const unchecked_counts = this.unchecked_counts(marker);
            const count = unchecked_counts.nonscoutable + unchecked_counts.scoutable;
            return count === 0;
        },

        close_modal() {
            this.modal = {};
        },

        open_modal(modal) {
            this.modal = { ...modal };
        },

        door_marker_click(door_name) {
            const assigned_room = this.door_assignment(door_name);
            if (this.modal.assign_room) {
                if (!assigned_room) {
                    this.assign_door(door_name, this.modal.room);
                    this.close_modal();
                }
            } else if (assigned_room) {
                this.open_modal({ unassign_door: true, door_name });
            } else {
                this.open_modal({ assign_door: true, door_name });
            }
        },

        room_click(room) {
            const assigned_door_name = this.room_assignment(room);
            if (this.modal.assign_door) {
                if (!assigned_door_name) {
                    this.assign_door(this.modal.door_name, room);
                    this.close_modal();
                }
            } else if (assigned_door_name) {
                this.open_modal({ unassign_door: true, door_name: assigned_door_name });
            } else {
                this.open_modal({ assign_room: true, room });
            }
        },

        item_icon(item) {
            if (item === "powder") {
                if (!this.tracker.items.powder && this.tracker.items.mushroom) {
                    return "mushroom";
                }
            }
            if (item === "flute") {
                if (!this.tracker.items.flute && this.tracker.items.shovel) {
                    return "shovel";
                }
            }

            const item_level = this.tracker.items[item] || 0;
            const index = Math.max(item_level - 1, 0);
            return this.game.item_sets[item][index];
        },

        item_found(item) {
            if (item === "powder") {
                if (!this.tracker.items.powder && this.tracker.items.mushroom) {
                    return 1;
                }
            }
            if (item === "flute") {
                if (!this.tracker.items.flute && this.tracker.items.shovel) {
                    return 1;
                }
            }

            return this.tracker.items[item];
        },

        increase_item(item) {
            const count = this.tracker.items[item] || 0;
            const max = this.game.item_sets[item].length;
            this.$set(this.tracker.items, item, Math.min(count + 1, max));
        },

        decrease_item(item) {
            const count = this.tracker.items[item] || 0;
            this.$set(this.tracker.items, item, Math.max(count - 1, 0));
        },

        toggle_dungeon_cleared(dungeon) {
            const cleared = !this.tracker.dungeon_cleared[dungeon.name];
            this.$set(this.tracker.dungeon_cleared, dungeon.name, cleared);
        },

        dungeon_is_cleared(dungeon) {
            return this.tracker.dungeon_cleared[dungeon.name];
        },

        dungeon_reward(dungeon) {
            const index = this.tracker.dungeon_reward[dungeon.name] || 0;
            return this.$root.game.rewards[index];
        },

        increase_reward(dungeon) {
            const index = this.tracker.dungeon_reward[dungeon.name] || 0;
            const num_rewards = this.game.rewards.length;
            const new_index = (index + 1) % num_rewards;
            this.$set(this.tracker.dungeon_reward, dungeon.name, new_index);
        },

        decrease_reward(dungeon) {
            const index = this.tracker.dungeon_reward[dungeon.name] || 0;
            const num_rewards = this.game.rewards.length;
            const new_index = (num_rewards + index - 1) % num_rewards;
            this.$set(this.tracker.dungeon_reward, dungeon.name, new_index);
        },

        bigkey_found(dungeon) {
            return this.tracker.dungeon_bigkey[dungeon.name];
        },

        add_bigkey(dungeon) {
            this.$set(this.tracker.dungeon_bigkey, dungeon.name, true);
        },

        remove_bigkey(dungeon) {
            this.$set(this.tracker.dungeon_bigkey, dungeon.name, false);
        },

        map_found(dungeon) {
            return this.tracker.dungeon_map[dungeon.name];
        },

        add_map(dungeon) {
            this.$set(this.tracker.dungeon_map, dungeon.name, true);
        },

        remove_map(dungeon) {
            this.$set(this.tracker.dungeon_map, dungeon.name, false);
        },

        compass_found(dungeon) {
            return this.tracker.dungeon_compass[dungeon.name];
        },

        add_compass(dungeon) {
            this.$set(this.tracker.dungeon_compass, dungeon.name, true);
        },

        remove_compass(dungeon) {
            this.$set(this.tracker.dungeon_compass, dungeon.name, false);
        },

        maximum_small_keys_unknown() {
            return this.tracker.mode === "doors";
        },

        dungeon_small_keys(dungeon) {
            return this.tracker.dungeon_keys[dungeon.name] || 0;
        },

        increase_keys(dungeon) {
            const count = this.tracker.dungeon_keys[dungeon.name] || 0;
            if (count < dungeon.keys) {
                this.$set(this.tracker.dungeon_keys, dungeon.name, count + 1);
            }
        },

        decrease_keys(dungeon) {
            const count = this.tracker.dungeon_keys[dungeon.name] || 0;
            if (count > 0) {
                this.$set(this.tracker.dungeon_keys, dungeon.name, count - 1);
            }
        },

        marker_is_enabled(marker, world) {
            return (
                (marker.world === world) &&
                (!marker.hole_exit || this.tracker.insanity)
            );
        },

        get_markers(world) {
            return this.game.markers.filter(marker => this.marker_is_enabled(marker, world));
        },

        adjusted_marker_coordinates(marker) {
            return [
                marker.x * this.config.map_scale_factor,
                marker.y * this.config.map_scale_factor,
            ];
        },

        distance_from_marker(marker, x, y) {
            const [marker_x, marker_y] = this.adjusted_marker_coordinates(marker);
            return Math.sqrt((marker_x - x)**2 + (marker_y - y)**2);
        },

        nearest_marker(world, x, y) {
            let nearest_marker = null;
            let nearest_distance = Infinity;

            for (const marker of this.get_markers(world)) {
                const distance = this.distance_from_marker(marker, x, y)
                if (distance < nearest_distance && distance < this.config.marker_hover_radius) {
                    nearest_marker = marker;
                    nearest_distance = distance;
                }
            }

            return nearest_marker;
        },

        log_coordinates(x, y) {
            const adjust = z => Math.round((z / this.config.map_size) * 10000);
            log(adjust(x) + ", " + adjust(y));
        },

        autotrack_is_enabled() {
            return this.tracker.autotrack.enabled;
        },

        set_autotrack_enabled(enabled) {
            this.tracker.autotrack.enabled = enabled;
        },

        set_autotrack_status(status) {
            log("Status: " + status);
            this.tracker.autotrack.status = status;
        },

        get_autotrack_status() {
            const status = this.tracker.autotrack.status;
            const enabled = this.tracker.autotrack.enabled;
            if (status === "Working" && !enabled) {
                return "Disabled";
            } else {
                return status;
            }
        },

        autotrack_update(save_buffer_part, offset) {
            this.set_autotrack_status("Working");

            const save_buffer = [...this.tracker.save_buffer];
            for (let i = 0; i < save_buffer_part.length; i++) {
                save_buffer[offset + i] = save_buffer_part[i];
            }
            this.tracker.save_buffer = save_buffer;

            const item_buffer = subarray(save_buffer, 0x340, 0x50);
            this.tracker.items = this.parse_items(item_buffer);
            this.tracker.dungeon_compass = this.parse_dungeon_items(item_buffer[0x24], item_buffer[0x25]);
            this.tracker.dungeon_bigkey = this.parse_dungeon_items(item_buffer[0x26], item_buffer[0x27]);
            this.tracker.dungeon_map = this.parse_dungeon_items(item_buffer[0x28], item_buffer[0x29]);

            const key_buffer = subarray(save_buffer, 0x4E0, 14);
            this.tracker.dungeon_keys = this.parse_keys(key_buffer);
        },

        parse_items(buffer) {
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
                "sword": (buffer[0x19] === 0xFF) ? 0 : buffer[0x19],
            };
        },

        parse_keys(buffer) {
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
        },

        parse_dungeon_items(flags1, flags2) {
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
        },

        unchecked_counts(object) {
            const checks = object.checks || [];
            const result = { nonscoutable: 0, nonscoutable_max: 0, scoutable: 0, scoutable_max: 0 };
            for (const check of checks) {
                const address = check[0];
                const bit_index = check[1];
                const scoutable = check[2] === "scoutable";
                if (scoutable) {
                    result.scoutable_max++;
                } else {
                    result.nonscoutable_max++;
                }
                if (!bit(this.tracker.save_buffer[address], bit_index)) {
                    if (scoutable) {
                        result.scoutable++;
                    } else {
                        result.nonscoutable++;
                    }
                }
            }
            return result;
        },
    },
});

function reset() {
    app.reset();
}

function vanilla_entrances() {
    app.set_vanilla_entrances();
}

function mode_normal() {
    app.set_mode("normal");
}

function mode_pots() {
    app.set_mode("pots");
}

function mode_doors() {
    app.set_mode("doors");
}

function log(message) {
    if (DEBUG) {
        console.log(message);
    }
}
