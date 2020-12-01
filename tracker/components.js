Vue.component("tracker-main", {
    computed: {
        game() {
            return this.$root.game;
        },
        connector_dungeons() {
            return this.$root.game.dungeons.filter(dungeon => dungeon.parts);
        },
    },
    methods: {
        toggle_dungeon_interior_modal() {
            this.$root.toggle_dungeon_interior_modal();
        },
    },
    template: `
        <div class="tracker layer noselect"
                @click.middle="toggle_dungeon_interior_modal">
            <assign-room-modal />
            <unassign-door-modal class="cover full-cover" />
            <dungeon-interior-modal />
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
                </div>
                <div class="other-rooms-column tracker-column">
                    <room-group :rooms="game.special_rooms" />
                    <room-group :rooms="game.holes" />
                </div>
                <div class="other-rooms-column tracker-column">
                    <room-group :rooms="game.multi_rooms" />
                </div>
                <div class="filler-column tracker-column"></div>
                <div class="items-column tracker-column">
                    <item-tracker />
                    <notes-box />
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
            return this.$root.modal.door;
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
        door() {
            return this.$root.modal.door;
        },
        room_name() {
            const room = this.$root.door_to_room(this.door);
            return room.name;
        },
    },
    methods: {
        close() {
            this.$root.close_modal();
        },
        unassign() {
            this.$root.unassign_click(this.door);
        },
    },
    template: `
        <div v-if="is_open" class="cover full-cover">
            <div class="backdrop" @click="close"></div>
            <div class="cover-box">
                <p><b>{{ room_name }}</b></p>
                <p>at</p>
                <p><b>{{ door }}</b></p>
                <p class="unassign-button" @dblclick="unassign">Unassign</p>
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
            return this.$root.game.markers.filter(marker => marker.world === this.world);
        },
        door_markers() {
            return this.markers.filter(marker => marker.door);
        },
        task_markers() {
            return this.markers.filter(marker => marker.task);
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
                @click.right="clear">
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
            const door = this.marker.door;
            const room = this.$root.door_to_room(door);
            const cleared = this.$root.door_is_cleared(door);
            const status_class =
                !room ? "door-marker-unassigned" :
                cleared ? "door-marker-cleared" :
                room.type === "dungeon" ? "door-marker-dungeon" :
                room.parts ? "door-marker-connector" :
                "door-marker-generic";

            return [
                status_class,
                this.focused ? "door-marker-focused" : null,
            ];
        },
        text() {
            const room = this.$root.door_to_room(this.marker.door);
            if (!room) {
                return "";
            }
            let result = room.short;
            if (room.parts) {
                result += "\n" + room.part;
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
            return this.$root.room_instance(dungeon);
        },
    },
    template: `
        <table class="dungeon-table stripe-table">
            <tbody>
                <tr v-for="dungeon of dungeons" class="dungeon-row" :key="dungeon.name">
                    <td>
                        <dungeon-interior-summary :dungeon="dungeon" />
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

Vue.component("dungeon-smallkeys", {
    props: ["dungeon"],
    computed: {
        count() {
            return this.$root.dungeon_small_keys(this.dungeon);
        },
        max() {
            return this.dungeon.keys;
        },
    },
    methods: {
        key_classes(i) {
            return i > this.count ? "icon-inactive" : null;
        },
        key_style(i) {
            return {
                "visibility" : i <= this.max ? "visible" : "hidden",
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
            <div v-for="i of 6"
                    class="dungeon-smallkey-icon"
                    :class="key_classes(i)"
                    style="background-image: url(images/icons/smallkey.png)"
                    :style="key_style(i)">
            </div>
        </div>
    `,
});

Vue.component("dungeon-interior-summary", {
    props: ["dungeon"],
    computed: {
    },
    methods: {
        open() {
            this.$root.open_dungeon_interior_modal(this.dungeon);
        },
    },
    template: `
        <div class="dungeon-interior-summary"
                @click="open">
            ???
        </div>
    `,
});

Vue.component("connector-set", {
    props: ["connectors"],
    computed: {
        rows() {
            result = [];
            for (const connector of this.connectors) {
                result.push({ header: true, room: connector });
                for (const room of this.$root.room_instances(connector)) {
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
                            <room-label class="connector-label" :room="row.room" :text="row.room.roomset" />
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
    props: ["rooms"],
    computed: {
        room_instances() {
            return this.rooms.map(room => this.$root.room_instance(room));
        },
    },
    template: `
        <table class="room-table">
            <tbody>
                <tr v-for="room of rooms" class="room-row" :key="room.roomset">
                    <td>
                        <room-label :room="room" :text="room.roomset" />
                    </td>
                    <td>
                        <room-group-boxes :room="room" />
                    </td>
                </tr>
            </tbody>
        </table>
    `,
});

Vue.component("room-label", {
    props: ["room", "text"],
    computed: {
        rooms() {
            return this.$root.room_instances(this.room);
        },
        classes() {
            const cleared = this.rooms.every(room => this.$root.room_is_cleared(room));
            return cleared ? "text-strike" : null;
        },
    },
    template: `
        <div class="label room-label" :class="classes">
            {{ text }}
        </div>
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
        part() {
            return this.$root.part_symbol(this.room.part) || "";
        },
    },
    template: `
        <div v-if="room"
                class="label room-part-label"
                :class="classes">
            {{ part }}
        </div>
    `,
});

Vue.component("room-group-boxes", {
    props: ["room"],
    computed: {
        single_instance() {
            if (this.room.count) {
                return null;
            } else {
                return this.$root.room_instance(this.room);
            }
        },
        box_rows() {
            const instances = this.$root.room_instances(this.room);
            const result = [];
            const per_row = 4;
            for (let i = 0; i < instances.length; i += per_row) {
                result.push(instances.slice(i, i + per_row));
            }
            return result;
        },
    },
    template: `
        <div>
            <template v-if="single_instance">
                <room-box :room="single_instance" />
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
        door() {
            return this.$root.room_to_door(this.room);
        },
        text() {
            return !this.door ? "" :
                this.small ? "✓" :
                this.door;
        },
        classes() {
            const assigned = this.$root.room_to_door(this.room);
            const cleared = this.$root.room_is_cleared(this.room);
            const main =
                (cleared && this.small) ? "text-muted" :
                cleared ? "text-strike" :
                !assigned ? "text-unassigned" :
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
            if (this.door) {
                this.$root.toggle_door_cleared(this.door);
            }
        },
    },
    template: `
        <div v-if="room" class="room-box"
                :class="classes"
                @click="click"
                @click.right="clear">
            <span v-if="!door">&nbsp;</span>
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

Vue.component("notes-box", {
    computed: {
        notes: {
            get() {
                return this.$root.notes;
            },
            set(text) {
                this.$root.set_notes(text);
            },
        },
    },
    template: `
        <textarea class="notes" v-model="notes">
        </textarea>
    `,
});

Vue.component("dungeon-interior-modal", {
    computed: {
        is_open() {
            return this.$root.modal.dungeon_interior;
        },
        dungeon() {
            return this.$root.modal.dungeon;
        },
        choices() {
            return this.$root.dungeon_choices(this.dungeon);
        },
    },
    template: `
        <div v-if="is_open" class="cover dungeon-interior-overlay">
            <div class="dungeon-toolbox-column dungeon-interior-column">
                <div class="dungeon-interior-name">
                    {{ dungeon.name }}
                </div>
            </div>
            <div class="dungeon-choices-column dungeon-interior-column">
                <div v-for="choice of choices" class="dungeon-choice">
                    <div class="dungeon-choice-name">{{ choice.name }}</div>
                    <ul class="dungeon-paths">
                        <li v-for="path of choice.paths" :key="path">
                            {{ path }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `,
});
