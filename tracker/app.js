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
        coupled_entrances: true,
        door_mapping: {},
        room_mapping: {},
        cleared_doors: {},
        cleared_rooms: {},
        cleared_tasks: {},
        dungeon_cleared: {},
        dungeon_reward: {},
        dungeon_bigkey: {},
        dungeon_keys: {},
        dungeon_interior: {
            last_opened_dungeon: null,
            rooms: {},
        },
        items: {
        },
        notes: "",
        autotrack: {
            enabled: false,
            status: "",
        },
    };
}

function load_tracker() {
    const json = localStorage.getItem("dev_tracker_data");
    return json ? JSON.parse(json) : null;
}

function save_tracker(tracker) {
    const json = JSON.stringify(tracker);
    localStorage.setItem("dev_tracker_data", json);
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
        game() {
            return game_data(this.tracker.mode);
        },

        notes() {
            return this.tracker.notes;
        },

        track_interiors() {
            return this.tracker.mode === "doors";
        },
    },

    methods: {
        reset() {
            this.tracker = {
                ...blank_tracker(),
                mode: this.tracker.mode,
            };
        },

        set_mode(mode) {
            throw_if_invalid_mode(mode);
            this.tracker.mode = mode;
        },

        set_coupled_entrances(coupled) {
            this.tracker.coupled_entrances = coupled;
        },

        part_symbol(part) {
            const part_symbols = {
                L: "🡨",
                R: "🡪",
                U: "🡩",
                D: "🡫",
            };
            return part_symbols[part] || part;
        },

        room_name(room, part) {
            if (part) {
                return room.roomset + " " + this.part_symbol(part);
            } else {
                return room.roomset;
            }
        },

        room_instance(room, part) {
            return {
                ...room,
                part,
                name: this.room_name(room, part),
            };
        },

        room_instances(room) {
            const parts =
                room.parts ? room.parts :
                room.count ? [...Array(room.count).keys()] :
                [null];
            return parts.map(part => this.room_instance(room, part));
        },

        door_to_room(door_name) {
            return this.tracker.door_mapping[door_name];
        },

        room_to_door(room) {
            return this.tracker.room_mapping[room.name];
        },

        assign_door(door_name, room) {
            this.$set(this.tracker.door_mapping, door_name, { ...room });
            if (this.tracker.coupled_entrances) {
                this.$set(this.tracker.room_mapping, room.name, door_name);
                if (room.auto_clear) {
                    this.$set(this.tracker.cleared_doors, door_name, true);
                    this.$set(this.tracker.cleared_rooms, room.name, true);
                }
            }
        },

        assign_room(room, door_name) {
            this.$set(this.tracker.room_mapping, room.name, door_name);
            if (this.tracker.coupled_entrances) {
                this.$set(this.tracker.door_mapping, door_name, { ...room });
                if (room.auto_clear) {
                    this.$set(this.tracker.cleared_doors, door_name, true);
                    this.$set(this.tracker.cleared_rooms, room.name, true);
                }
            }
        },

        unassign_door(door_name) {
            const room = this.door_to_room(door_name);
            this.$delete(this.tracker.door_mapping, door_name);
            this.$delete(this.tracker.cleared_doors, door_name);
            if (this.tracker.coupled_entrances) {
                this.$delete(this.tracker.room_mapping, room.name);
                this.$delete(this.tracker.cleared_rooms, room.name);
            }
        },

        unassign_room(room) {
            const door_name = this.room_to_door(room);
            this.$delete(this.tracker.room_mapping, room.name);
            this.$delete(this.tracker.cleared_rooms, room.name);
            if (this.tracker.coupled_entrances) {
                this.$delete(this.tracker.door_mapping, door_name);
                this.$delete(this.tracker.cleared_doors, door_name);
            }
        },

        unassign_door_click(door_name) {
            this.unassign_door(door_name);
            this.close_modal();
        },

        unassign_room_click(room) {
            this.unassign_room(room);
            this.close_modal();
        },

        toggle_door_cleared(door_name) {
            const room = this.door_to_room(door_name);
            if (room) {
                const cleared = !this.tracker.cleared_doors[door_name];
                this.$set(this.tracker.cleared_doors, door_name, cleared);
                if (this.tracker.coupled_entrances) {
                    this.$set(this.tracker.cleared_rooms, room.name, cleared);
                }
            }
        },

        toggle_room_cleared(room) {
            const door_name = this.room_to_door(room);
            if (door_name) {
                const cleared = !this.tracker.cleared_rooms[room.name];
                this.$set(this.tracker.cleared_rooms, room.name, cleared);
                if (this.tracker.coupled_entrances) {
                    this.$set(this.tracker.cleared_doors, door_name, cleared);
                }
            }
        },

        toggle_task_cleared(task) {
            const cleared = !this.tracker.cleared_tasks[task];
            this.$set(this.tracker.cleared_tasks, task, cleared);
        },

        door_is_cleared(door_name) {
            return this.tracker.cleared_doors[door_name];
        },

        room_is_cleared(room) {
            return this.tracker.cleared_rooms[room.name];
        },

        task_is_cleared(task) {
            return this.tracker.cleared_tasks[task];
        },

        set_notes(notes) {
            this.tracker.notes = notes;
        },

        close_modal() {
            this.modal = {};
        },

        open_modal(modal) {
            this.modal = { ...modal };
        },

        door_marker_click(door_name) {
            const room = this.door_to_room(door_name);
            if (this.modal.assign_room) {
                if (!room || !this.tracker.coupled_entrances) {
                    this.assign_room(this.modal.room, door_name);
                    this.close_modal();
                }
            } else if (room) {
                this.open_modal({ unassign_door: true, door_name });
            } else {
                this.open_modal({assign_door: true, door_name });
            }
        },

        room_click(room) {
            const door_name = this.room_to_door(room);
            if (this.modal.assign_door) {
                if (!door_name || !this.tracker.coupled_entrances) {
                    this.assign_door(this.modal.door_name, room);
                    this.close_modal();
                }
            } else if (door_name) {
                this.open_modal({ unassign_room: true, room: { ... room } });
            } else {
                this.open_modal({ assign_room: true, room: { ...room } });
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

        open_dungeon_interior_modal(dungeon) {
            dungeon = { ...dungeon };
            this.tracker.dungeon_interior.last_opened_dungeon = dungeon;
            this.open_modal({ dungeon_interior: true, dungeon });
        },

        toggle_dungeon_interior_modal() {
            if (this.modal.dungeon_interior) {
                this.close_modal();
            } else if (this.tracker.dungeon_interior.last_opened_dungeon) {
                this.open_dungeon_interior_modal(this.tracker.dungeon_interior.last_opened_dungeon);
            }
        },

        dungeon_interior_rooms(dungeon) {
            return this.tracker.dungeon_interior.rooms[dungeon] || [];
        },

        dungeon_interior_add_room(dungeon, room) {
            const rooms = this.tracker.dungeon_interior.rooms;
            if (!rooms[dungeon]) {
                this.$set(this.tracker.dungeon_interior.rooms, dungeon, []);
            }
            const existing = rooms[dungeon].find(r => r.dungeon === room.dungeon && r.name === room.name);
            if (!existing) {
                this.$set(this.tracker.dungeon_interior.rooms, dungeon, rooms[dungeon].concat([room]));
            }
        },

        dungeon_interior_remove_room(dungeon, i) {
            const new_rooms = [...this.tracker.dungeon_interior.rooms[dungeon]];
            new_rooms.splice(i, 1);
            this.tracker.dungeon_interior.rooms[dungeon] = new_rooms;
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

            for (const marker of Object.values(this.game.markers)) {
                if (marker.world != world) {
                    continue;
                }
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
            log(adjust(x), adjust(y));
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

        autotrack_update(data) {
            this.set_autotrack_status("Working");
            log(data);

            if (data.items) {
                this.tracker.items = data.items;
            }
            if (data.big_keys) {
                this.tracker.dungeon_bigkey = data.big_keys;
            }
            if (data.keys) {
                this.tracker.dungeon_keys = data.keys;
            }
        },
    },
});

function reset() {
    app.reset();
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

function coupled_on() {
    app.set_coupled_entrances(true);
}

function coupled_off() {
    app.set_coupled_entrances(false);
}

function autotrack_enable() {
    app.set_autotrack_enabled(true);
}

function autotrack_disable() {
    app.set_autotrack_enabled(false);
}

function log(message) {
    if (DEBUG) {
        console.log(message);
    }
}
