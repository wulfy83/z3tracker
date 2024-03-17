Vue.component("tracker-main", {
    computed: {
        game() {
            return this.$root.game;
        },
        connector_dungeons() {
            return this.$root.game.dungeons.filter(dungeon => dungeon.parts);
        },
    },
    template: `
        <div class="tracker layer noselect">
            <assign-room-modal />
            <unassign-door-modal class="cover full-cover" />
            <div class="tracker-column-set">
                <connector-set v-for="(set, i) of game.connectors"
                        :connectors="set" :key="i" />
                <connector-set v-for="dungeon of connector_dungeons"
                        :connectors="[dungeon]" :key="dungeon.name" />
                <div class="filler-column tracker-column"></div>
                <div class="dungeon-column tracker-column">
                    <dungeon-table />
                </div>
            </div>
            <div class="tracker-column-set">
                <div class="maps tracker-column">
                    <map-part v-for="world of game.worlds"
                        :world="world" :key="world" />
                    <assign-door-modal />
                    <icon-marker-modal />
                </div>
                <div class="other-rooms-column tracker-column">
                    <room-group :roomsets="game.special_rooms" />
                    <room-group :roomsets="game.holes" />
                </div>
                <div class="other-rooms-column tracker-column">
                    <room-group :roomsets="game.multi_rooms" />
                </div>
                <div class="filler-column tracker-column"></div>
                <div class="items-column tracker-column">
                    <item-tracker />
                    <settings />
                    <warnings />
                </div>
            </div>
        </div>
    `,
});

Vue.component("assign-room-modal", {
    computed: {
        is_open() {
            return this.$root.modal.assign_room;
        },
        room_name() {
            return this.$root.modal.room.name;
        },
    },
    methods: {
        close() {
            this.$root.close_modal();
        },
    },
    template: `
        <div v-if="is_open" class="cover room-cover">
            <div class="backdrop" @click="close"></div>
            <div class="cover-box">
                <p>assigning room:</p>
                <p><b>{{ room_name }}</b></p>
            </div>
        </div>
    `,
});

Vue.component("assign-door-modal", {
    computed: {
        is_open() {
            return this.$root.modal.assign_door;
        },
        door_name() {
            return this.$root.modal.door_name;
        },
    },
    methods: {
        close() {
            this.$root.close_modal();
        },
    },
    template: `
        <div v-if="is_open" class="cover map-cover">
            <div class="backdrop" @click="close"></div>
            <div class="cover-box">
                <p>assigning door:</p>
                <p><b>{{ door_name }}</b></p>
            </div>
        </div>
    `,
});

Vue.component("unassign-door-modal", {
    computed: {
        is_open() {
            return this.$root.modal.unassign_door;
        },
        door_name() {
            return this.$root.modal.door_name;
        },
        room_name() {
            const room = this.$root.door_assignment(this.door_name);
            return room.name;
        },
    },
    methods: {
        close() {
            this.$root.close_modal();
        },
        unassign() {
            this.$root.unassign_door_click(this.door_name);
        },
    },
    template: `
        <div v-if="is_open" class="cover full-cover">
            <div class="backdrop" @click="close"></div>
            <div class="cover-box">
                <p><b>{{ room_name }}</b></p>
                <p>at</p>
                <p><b>{{ door_name }}</b></p>
                <p class="unassign-button" @dblclick="unassign">Unassign</p>
            </div>
        </div>
    `,
});

Vue.component("icon-marker-modal", {
    computed: {
        is_open() {
            return this.$root.modal.icon_marker;
        },
        icon_markers() {
            return this.$root.game.icon_markers;
        },
    },
    methods: {
        close() {
            this.$root.close_modal();
        },
        click_icon(icon) {
            this.$root.add_icon_marker(icon);
        },
        style(icon) {
            return {
                "background-image": `url(images/icons/${icon}.png)`,
            };
        },
    },
    template: `
        <div v-if="is_open" class="cover map-cover">
            <div class="backdrop" @click="close"></div>
            <div class="cover-box">
                <div v-for="row in icon_markers">
                    <div v-for="icon in row" class="item-icon" :style="style(icon)" @click="click_icon(icon)"></div>
                </div>
            </div>
        </div>
    `,
});

function event_coordinates(event) {
    const rect = event.target.getBoundingClientRect();
    return [
        event.pageX - rect.left,
        event.pageY - rect.top,
    ];
}

Vue.component("map-part", {
    props: ["world"],
    data: () => ({
        focused: null,
    }),
    computed: {
        style() {
            return {
                "background-image": `url(images/${this.world}_world.png)`,
            };
        },
        markers() {
            return this.$root.get_markers(this.world);
        },
        door_markers() {
            return this.markers.filter(marker => marker.door);
        },
        task_markers() {
            return this.markers.filter(marker => marker.task && !this.$root.task_is_collected(marker));
        },
        icon_markers() {
            return this.$root.get_icon_markers(this.world);
        },
    },
    methods: {
        mousemove(event) {
            const [x, y] = event_coordinates(event);
            this.focused = this.$root.nearest_marker(this.world, x, y);
        },
        mouseleave() {
            this.focused = null;
        },
        is_focused(marker) {
            return marker === this.focused;
        },
        click(event) {
            if (DEBUG) {
                const [x, y] = event_coordinates(event);
                this.$root.log_coordinates(x, y);
            }
            if (this.focused && this.focused.door) {
                this.$root.door_marker_click(this.focused.door);
            }
        },
        middle_click(event) {
            const [x, y] = event_coordinates(event);
            this.$root.map_middle_click(this.world, x, y);
        },
        clear() {
            if (!this.focused) {
                return;
            }
            if (this.focused.door) {
                this.$root.toggle_door_cleared(this.focused.door);
            } else if (this.focused.task) {
                this.$root.toggle_task_cleared(this.focused.task);
            }
        },
    },
    template: `
        <div class="map-part"
                :style="style"
                @mousemove="mousemove"
                @mouseenter="mousemove"
                @mouseleave="mouseleave"
                @click="click"
                @click.right="clear"
                @click.middle="middle_click">
            <icon-marker v-for="(marker, index) of icon_markers"
                    :marker="marker"
                    :key="index" />
            <door-marker v-for="marker of door_markers"
                    :marker="marker"
                    :focused="is_focused(marker)"
                    :key="marker.door" />
            <task-marker v-for="marker of task_markers"
                    :marker="marker"
                    :focused="is_focused(marker)"
                    :key="marker.task" />
        </div>
    `,
});

Vue.component("icon-marker", {
    props: ["marker"],
    computed: {
        style() {
            const [x, y] = this.$root.adjusted_marker_coordinates(this.marker);
            return {
                "background-image": `url(images/icons/${this.marker.icon}.png)`,
                left: `${Math.round(x)}px`,
                top:  `${Math.round(y)}px`,
            };
        },
    },
    template: `
        <div class="icon-marker" :style="style"></div>
    `,
});

Vue.component("door-marker", {
    props: ["marker", "focused"],
    computed: {
        style() {
            const [x, y] = this.$root.adjusted_marker_coordinates(this.marker);
            return {
                left: `${Math.round(x)}px`,
                top:  `${Math.round(y)}px`,
            };
        },
        classes() {
            const door_name = this.marker.door;
            const room = this.$root.door_assignment(door_name);
            const cleared = this.$root.door_is_cleared(door_name);
            const priority = this.$root.room_is_priority(room);
            const status_class =
                cleared ? "door-marker-cleared" :
                !room ? "door-marker-unassigned" :
                priority ? "door-marker-priority" :
                room.type === "dungeon" ? "door-marker-dungeon" :
                room.parts ? "door-marker-connector" :
                "door-marker-generic";

            return [
                status_class,
                this.focused ? "door-marker-focused" : null,
            ];
        },
        text() {
            const room = this.$root.door_assignment(this.marker.door);
            if (!room) {
                return "";
            }
            let result = room.short;
            if (room.part && !room.count) {
                const part_letters = {
                    "🡨": "L",
                    "🡪": "R",
                    "🡩": "U",
                    "🡫": "D",
                };
                const part = part_letters[room.part] || room.part;
                result += "\n" + part;
            }
            return result;
        },
    },
    template: `
        <div class="door-marker"
                :class="classes"
                :style="style"
            >{{ text }}</div>
    `,
});

Vue.component("task-marker", {
    props: ["marker", "focused"],
    computed: {
        style() {
            const [x, y] = this.$root.adjusted_marker_coordinates(this.marker);
            return {
                left: `${Math.round(x)}px`,
                top:  `${Math.round(y)}px`,
            };
        },
        classes() {
            const cleared = this.$root.task_is_cleared(this.marker.task);
            return [
                cleared ? "task-marker-cleared" : null,
                this.focused ? "task-marker-focused" : null,
            ];
        },
    },
    template: `
        <div class="task-marker"
                :class="classes"
                :style="style"
            ></div>
    `,
});

Vue.component("dungeon-table", {
    computed: {
        dungeons() {
            return this.$root.game.dungeons;
        },
    },
    methods: {
        instance(dungeon) {
            return this.$root.room_instance(dungeon.name);
        },
    },
    template: `
        <table class="dungeon-table stripe-table">
            <tbody>
                <tr v-for="dungeon of dungeons" class="dungeon-row" :key="dungeon.name">
                    <td>
                        <dungeon-unchecked :dungeon="dungeon" />
                    </td>
                    <td>
                        <dungeon-map :dungeon="dungeon" />
                    </td>
                    <td>
                        <dungeon-compass :dungeon="dungeon" />
                    </td>
                    <td>
                        <room-box v-if="!dungeon.parts" :room="instance(dungeon)" />
                    </td>
                    <td>
                        <dungeon-label :dungeon="dungeon" />
                    </td>
                    <td>
                        <dungeon-reward :dungeon="dungeon" />
                    </td>
                    <td>
                        <dungeon-bigkey :dungeon="dungeon" />
                    </td>
                    <td>
                        <dungeon-smallkeys :dungeon="dungeon" />
                    </td>
                </tr>
            </tbody>
        </table>
    `,
});

Vue.component("dungeon-label", {
    props: ["dungeon"],
    computed: {
        classes() {
            const cleared = this.$root.dungeon_is_cleared(this.dungeon);
            return cleared ? "text-strike" : null;
        },
    },
    methods: {
        toggle_clear() {
            this.$root.toggle_dungeon_cleared(this.dungeon);
        },
    },
    template: `
        <div class="label dungeon-label"
                :class="classes"
                @click.right="toggle_clear">
            {{ dungeon.name }}
        </div>
    `,
});

Vue.component("dungeon-reward", {
    props: ["dungeon"],
    computed: {
        style() {
            const reward_name = this.$root.dungeon_reward(this.dungeon);
            return {
                "background-image": `url(images/icons/${reward_name}.png)`,
                "visibility": this.dungeon.reward ? "visible" : "hidden",
            };
        },
    },
    methods: {
        increase() {
            if (this.dungeon.reward) {
                this.$root.increase_reward(this.dungeon);
            }
        },
        decrease() {
            if (this.dungeon.reward) {
                this.$root.decrease_reward(this.dungeon);
            }
        },
    },
    template: `
        <div class="dungeon-icon"
                :style="style"
                @click="increase"
                @click.right="decrease">
        </div>
    `,
});

Vue.component("dungeon-bigkey", {
    props: ["dungeon"],
    computed: {
        classes() {
            const found = this.$root.bigkey_found(this.dungeon)
            return !found ? "icon-inactive" : null;
        },
        style() {
            return {
                "visibility": this.dungeon.bigkey ? "visible" : "hidden",
            };
        },
    },
    methods: {
        add() {
            if (this.dungeon.bigkey) {
                this.$root.add_bigkey(this.dungeon);
            }
        },
        remove() {
            if (this.dungeon.bigkey) {
                this.$root.remove_bigkey(this.dungeon);
            }
        },
    },
    template: `
        <div class="dungeon-icon" :class="classes"
                style="background-image: url(images/icons/bigkey.png)"
                :style="style"
                @click="add"
                @click.right="remove">
        </div>
    `,
});

Vue.component("dungeon-map", {
    props: ["dungeon"],
    computed: {
        classes() {
            const found = this.$root.map_found(this.dungeon)
            return !found ? "icon-inactive" : null;
        },
        style() {
            return {
                "visibility": this.dungeon.map ? "visible" : "hidden",
            };
        },
    },
    methods: {
        add() {
            if (this.dungeon.map) {
                this.$root.add_map(this.dungeon);
            }
        },
        remove() {
            if (this.dungeon.map) {
                this.$root.remove_map(this.dungeon);
            }
        },
    },
    template: `
        <div class="dungeon-icon dungeon-map" :class="classes"
                style="background-image: url(images/icons/map.png)"
                :style="style"
                @click="add"
                @click.right="remove">
        </div>
    `,
});

Vue.component("dungeon-compass", {
    props: ["dungeon"],
    computed: {
        classes() {
            const found = this.$root.compass_found(this.dungeon)
            return !found ? "icon-inactive" : null;
        },
        style() {
            return {
                "visibility": this.dungeon.compass ? "visible" : "hidden",
            };
        },
    },
    methods: {
        add() {
            if (this.dungeon.compass) {
                this.$root.add_compass(this.dungeon);
            }
        },
        remove() {
            if (this.dungeon.compass) {
                this.$root.remove_compass(this.dungeon);
            }
        },
    },
    template: `
        <div class="dungeon-icon dungeon-compass" :class="classes"
                style="background-image: url(images/icons/compass.png)"
                :style="style"
                @click="add"
                @click.right="remove">
        </div>
    `,
});

Vue.component("dungeon-unchecked", {
    props: ["dungeon"],
    template: `
        <div class="dungeon-unchecked label">
            <unchecked-count :roomset="dungeon" />
        </div>
    `,
});

Vue.component("dungeon-smallkeys", {
    props: ["dungeon"],
    computed: {
        count() {
            return this.$root.dungeon_small_keys(this.dungeon);
        },
        max() {
            return this.dungeon.keys;
        },
        show_number() {
            return this.count > 8;
        },
    },
    methods: {
        key_classes(i) {
            return i > this.count ? "icon-inactive" : null;
        },
        key_style(i) {
            const visible_count = this.$root.maximum_small_keys_unknown() ?
                this.count :
                this.max;
            return {
                "visibility" : i <= visible_count ? "visible" : "hidden",
                "left": `${(i - 1) * 16}px`,
            };
        },
        increase() {
            this.$root.increase_keys(this.dungeon);
        },
        decrease() {
            this.$root.decrease_keys(this.dungeon);
        },
    },
    template: `
        <div class="dungeon-smallkeys"
                @click="increase"
                @click.right="decrease">
            <div v-if="show_number" class="label dungeon-smallkey-counter">
                {{ count }}
            </div>
            <template v-else>
                <div v-for="i of 8"
                        class="dungeon-smallkey-icon"
                        :class="key_classes(i)"
                        style="background-image: url(images/icons/smallkey.png)"
                        :style="key_style(i)">
                </div>
            </template>
        </div>
    `,
});

Vue.component("settings", {
    computed: {
        autotrack_enabled: {
            get() {
                return this.$root.autotrack_is_enabled();
            },
            set(enabled) {
                this.$root.set_autotrack_enabled(enabled);
            },
        },
        status() {
            return this.$root.get_autotrack_status();
        },
        status_style() {
            return {
                color: (this.status === "Working") ? "#00ff00" : "#ff0000",
            };
        },
    },
    template: `
        <div class="settings-container">
            <div class="settings">
                <p>
                    <input type="checkbox" id="autotrack_enabled" v-model="autotrack_enabled" />
                    <label for="autotrack_enabled">Enable Auto-Tracking</label>
                </p>
                <p>Status: <span :style="status_style">{{ status }}</span></p>
            </div>
        </div>
    `,
});

Vue.component("warnings", {
    computed: {
        warnings() {
            return this.$root.warnings();
        },
    },
    template: `
        <div class="warnings">
            <p v-if="warnings.length > 0">WARNING:</p>
            <p v-for="warning in warnings">
                {{ warning }}
            </p>
        </div>
    `,
});

Vue.component("connector-set", {
    props: ["connectors"],
    computed: {
        rows() {
            result = [];
            for (const connector of this.connectors) {
                result.push({ header: true, roomset: connector });
                for (const room of this.$root.roomset_part_instances(connector)) {
                    result.push({ part: true, room });
                }
                result.push({});
            }
            result.pop();
            return result;
        },
    },
    template: `
        <div class="connector-column">
            <table>
                <tbody>
                    <tr v-for="row of rows" class="room-row">
                        <td v-if="row.header"></td>
                        <td v-if="row.header">
                            <room-label class="connector-label" :roomset="row.roomset" :text="row.roomset.roomset" />
                        </td>
                        <td v-if="row.part">
                            <room-part-label :room="row.room" />
                        </td>
                        <td v-if="row.part">
                            <room-box :room="row.room" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
});

Vue.component("room-group", {
    props: ["roomsets"],
    template: `
        <table class="room-table">
            <tbody>
                <tr v-for="roomset of roomsets" class="room-row" :key="roomset.roomset">
                    <td>
                        <room-label :roomset="roomset" :text="roomset.roomset" />
                    </td>
                    <td>
                        <room-group-boxes :roomset="roomset" />
                    </td>
                </tr>
            </tbody>
        </table>
    `,
});

Vue.component("room-label", {
    props: ["roomset", "text"],
    computed: {
        room_parts() {
            return this.$root.roomset_part_instances(this.roomset);
        },
        classes() {
            const cleared = this.room_parts.every(room_part => this.$root.room_is_cleared(room_part));
            return cleared ? "text-strike" : null;
        },
    },
    template: `
        <div class="label room-label" :class="classes">
            {{ text }} <unchecked-count :roomset="roomset" />
        </div>
    `,
});

Vue.component("unchecked-count", {
    props: ["roomset"],
    computed: {
        counts() {
            return this.$root.unchecked_counts(this.roomset);
        },
        nonscoutable_exists() {
            return this.counts.nonscoutable.max > 0;
        },
        scoutable_exists() {
            return this.counts.scoutable.max > 0;
        },
        nonscoutable_class() {
            return this.counts.nonscoutable.unchecked > 0 ? "unchecked-nonscoutable" : "unchecked-zero";
        },
        scoutable_class() {
            return this.counts.scoutable.unchecked > 0 ? "unchecked-scoutable" : "unchecked-zero";
        },
    },
    template: `
        <span class="unchecked-counts">
            <span :class="nonscoutable_class" v-if="nonscoutable_exists">{{ counts.nonscoutable.unchecked }}</span>
            <span :class="scoutable_class" v-if="scoutable_exists">{{ counts.scoutable.unchecked }}</span>
        </span>
    `,
});


Vue.component("room-part-label", {
    props: ["room", "first"],
    computed: {
        classes() {
            const cleared = this.$root.room_is_cleared(this.room);
            return [
                cleared ? "text-muted" : null,
                this.first ? "room-part-label-first" : null,
            ];
        },
    },
    template: `
        <div v-if="room"
                class="label room-part-label"
                :class="classes">
            {{ this.room.part }}
        </div>
    `,
});

Vue.component("room-group-boxes", {
    props: ["roomset"],
    computed: {
        rooms() {
            return this.$root.roomset_part_instances(this.roomset);
        },
        single_instance() {
            return !this.roomset.count;
        },
        box_rows() {
            const result = [];
            const per_row = 4;
            for (let i = 0; i < this.rooms.length; i += per_row) {
                result.push(subarray(this.rooms, i, per_row));
            }
            return result;
        },
    },
    template: `
        <div>
            <template v-if="single_instance">
                <room-box :room="rooms[0]" />
            </template>
            <template v-else>
                <div v-for="(row, i) of box_rows" class="room-row" :key="i">
                    <room-box v-for="(r, j) of row" :room="r" :small="true" :key="j" />
                </div>
            </template>
        </div>
    `,
});

Vue.component("room-box", {
    props: ["room", "small"],
    computed: {
        door_name() {
            return this.$root.room_assignment(this.room);
        },
        text() {
            return !this.door_name ? "" :
                this.small ? "✓" :
                this.door_name;
        },
        classes() {
            const cleared = this.$root.room_is_cleared(this.room);
            const main =
                (cleared && this.small) ? "text-muted" :
                cleared ? "text-strike" :
                null;
            return [
                main,
                this.small ? "room-box-small" : null,
            ];
        }
    },
    methods: {
        click() {
            this.$root.room_click(this.room);
        },
        clear() {
            this.$root.toggle_room_cleared(this.room);
        },
    },
    template: `
        <div v-if="room" class="room-box"
                :class="classes"
                @click="click"
                @click.right="clear">
            <span v-if="!door_name">&nbsp;</span>
            <span v-else>{{ text }}</span>
        </div>
    `,
});

Vue.component("item-tracker", {
    computed: {
        rows() {
            return this.$root.game.items;
        },
    },
    template: `
        <div class="item-tracker">
            <div v-for="(row, i) of rows" class="item-row" :key="i">
                <item-icon v-for="item of row" :item="item" :key="item" />
            </div>
        </div>
    `,
});

Vue.component("item-icon", {
    props: ["item"],
    computed: {
        style() {
            const icon = this.$root.item_icon(this.item);
            return {
                "background-image": `url(images/icons/${icon}.png)`,
            };
        },
        classes() {
            return this.$root.item_found(this.item) ? null : "icon-inactive";
        },
    },
    methods: {
        increase() {
            this.$root.increase_item(this.item);
        },
        decrease() {
            this.$root.decrease_item(this.item);
        },
    },
    template: `
        <div class="item-icon"
                :class="classes"
                :style="style"
                @click="increase"
                @click.right="decrease">
        </div>
    `,
});
