const Storage = {
    PREFIX: "z3tracker",
    LIMIT: 10,

    ids() {
        return Object.keys(localStorage)
            .filter(key => key.startsWith(Storage.PREFIX + "_"))
            .map(key => parseInt(key.split("_")[1]))
            .sort((a, b) => a - b);
    },

    key(id) {
        return `${Storage.PREFIX}_${id}`;
    },

    init(defaults) {
        const ids = Storage.ids();
        if (ids.length === 0) {
            Storage.save({
                ...defaults,
                id: 0,
            });
        }
    },

    load(id) {
        const json = localStorage.getItem(Storage.key(id));
        if (json === null) {
            throw new Error("No stored tracker found with ID " + id);
        }
        return JSON.parse(json);
    },

    load_latest() {
        const ids = Storage.ids();
        const latest_id = ids[ids.length - 1];
        const json = localStorage.getItem(Storage.key(latest_id));
        return JSON.parse(json);
    },

    save(tracker) {
        const json = JSON.stringify(tracker);
        localStorage.setItem(Storage.key(tracker.id), json);
    },

    remove(id) {
        localStorage.removeItem(Storage.key(id));
    },

    create(defaults) {
        const ids = Storage.ids();
        while (ids.length >= Storage.LIMIT) {
            const oldest_id = ids.shift();
            Storage.remove(oldest_id);
        }
        const latest_id = ids[ids.length - 1];
        const next_id = parseInt(latest_id) + 1;
        const tracker = {
            ...defaults,
            id: next_id,
        };
        Storage.save(tracker);
        return tracker;
    },
};
