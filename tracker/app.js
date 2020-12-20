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
        last_dungeon_interior: null,
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

        room_mapping() {
            const result = {};
            for (const [door, room] of Object.entries(this.tracker.door_mapping)) {
                result[room.name] = door;
            }
            return result;
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

        door_to_room(door) {
            return this.tracker.door_mapping[door];
        },

        room_to_door(room) {
            return this.room_mapping[room.name];
        },

        assign_door(door, room) {
            this.$set(this.tracker.door_mapping, door, { ...room });
            if (room.auto_clear) {
                this.$set(this.tracker.cleared_doors, door, true);
            }
        },

        unassign_door(door) {
            this.$delete(this.tracker.door_mapping, door);
            this.$delete(this.tracker.cleared_doors, door);
        },

        unassign_click(door) {
            this.unassign_door(door);
            this.close_modal();
        },

        toggle_door_cleared(door) {
            if (this.door_to_room(door)) {
                const cleared = !this.tracker.cleared_doors[door];
                this.$set(this.tracker.cleared_doors, door, cleared);
            }
        },

        door_is_cleared(door) {
            return this.tracker.cleared_doors[door];
        },

        toggle_task_cleared(task) {
            const cleared = !this.tracker.cleared_tasks[task];
            this.$set(this.tracker.cleared_tasks, task, cleared);
        },

        task_is_cleared(task) {
            return this.tracker.cleared_tasks[task];
        },

        room_is_cleared(room) {
            const door = this.room_to_door(room);
            return door && this.door_is_cleared(door);
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

        room_click(room) {
            const door = this.room_to_door(room);
            if (this.modal.assign_door) {
                if (door) {
                    return;
                }
                this.assign_door(this.modal.door, room);
                this.close_modal();
            } else if (door) {
                this.open_modal({ unassign_door: true, door });
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
            this.last_dungeon_interior = dungeon;
            this.open_modal({ dungeon_interior: true, dungeon });
        },

        toggle_dungeon_interior_modal() {
            if (this.modal.dungeon_interior) {
                this.close_modal();
            } else if (this.last_dungeon_interior) {
                this.open_dungeon_interior_modal(this.last_dungeon_interior);
            }
        },

        dungeon_choices(dungeon) {
            return this.game.choices.default[dungeon.name];
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

        door_marker_click(door) {
            const room = this.door_to_room(door);
            if (this.modal.assign_room) {
                if (!room) {
                    this.assign_door(door, this.modal.room);
                    this.close_modal();
                }
            } else if (room) {
                this.open_modal({ unassign_door: true, door });
            } else {
                this.open_modal({assign_door: true, door });
            }
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

function mode_doors() {
    app.set_mode("doors");
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
