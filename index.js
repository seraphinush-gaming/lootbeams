'use strict';

const config = require('./config.js');

const MARKER = 369; // Diamond

module.exports = function Lootbeams(mod) {
    const cmd = mod.command || mod.require.command;

    // config
    let enable = config.enable,
        enableDungeon = config.dungeon.enable,
        enableIod = config.iod.enable,
        enableNpc = config.npc.enable;

    let markers = new Set(),
        myPlayerId = BigInt(0),
        myZone = 0;

    // command
    cmd.add('beams', {
        '$none': () => {
            enable = !enable;
            status();
        },
        'dg': () => {
            enableDungeon = !enableDungeon;
            send(`Lootbeams in dungeons : ${enableDungeon ? 'En' : 'Dis'}abled`);
        },
        'iod': () => {
            enableIod = !enableIod;
            send(`Lootbeams on Island of Dawn : ${enableIod ? 'En' : 'Dis'}abled`);
        },
        'npc': () => {
            enableNpc = !enableNpc;
            send(`Lootbeams for npc : ${enableNpc ? 'En' : 'Dis'}abled`);
        },
        'c': () => {
            clear();
            send(`Cleared lootbeams.`);
        },
        's': () => status(),
        '$default': () => send(`Invalid argument. usage : beams [dg|iod|npc|c|s]`)
    });

    // game state
    mod.hook('S_LOGIN', 12, { order: -10 }, (e) => myPlayerId = BigInt(e.playerId));

    mod.hook('S_LOAD_TOPO', 3, (e) => {
        markers.clear();
        myZone = e.zone;
    });

    // code
    mod.hook('S_SPAWN_DROPITEM', 6, (e) => {
        if (!enable || markers.has(e.gameId.toString()))
            return;
        else if (config.blacklist.includes(e.item)) {
            if (myZone === config.iod.zone) {
                return false;
            } else {
                return;
            }
        }
        else if ((enableDungeon && config.dungeon.zone.includes(myZone)) ||
            ((enableIod && myZone === config.iod.zone && config.iod.whitelist.includes(e.item))))
            mark(e);
    });

    mod.hook('S_SPAWN_NPC', 11, (e) => {
        if (!enable || !enableNpc || markers.has(e.gameId.toString()))
            return;
        if (myZone in config.npc.zone) {
            for (let i = 0, n = config.npc.zone[myZone].length; i < n; i++) {
                if (e.templateId === config.npc.zone[myZone][i])
                    mark(e);
            }
        } else if (config.npc.event.includes(e.templateId)) {
            mark(e);
            alert();
        }
    });

    mod.hook('S_DESPAWN_DROPITEM', 4, (e) => {
        if (enable || markers.size > 0)
            unmark(e.gameId);
    });

    mod.hook('S_DESPAWN_NPC', 3, (e) => {
        if (enable || markers.size > 0)
            unmark(e.gameId);
    });

    // helper
    function alert() {
        mod.send('S_DUNGEON_EVENT_MESSAGE', 2, {
            type: 31,
            chat: 0,
            channel: 27,
            message: "Event monster nearby !"
        });
    }

    function clear() {
        for (let item in markers) {
            mod.send('S_DESPAWN_DROPITEM', 4, {
                gameId: item - myPlayerId
            });
        }
        markers.clear();
    }

    function mark(e) {
        if (!markers.has(e.gameId.toString())) {
            markers.add(e.gameId.toString());
            e.gameId -= myPlayerId;
            e.loc.z -= 500;
            mod.send('S_SPAWN_DROPITEM', 6, {
                gameId: e.gameId,
                loc: e.loc,
                item: MARKER,
                amount: 1,
                expiry: Date.now() + 10000,
                explode: false,
                masterwork: false,
                enchant: 0,
                source: 0,
                debug: false,
                owners: []
            });
        }
    }

    function status() {
        send(
            `${enable ? 'En' : 'Dis'}abled`,
            `Dungeon : ${enableDungeon ? 'En' : 'Dis'}abled`,
            `Island of Dawn : ${enableIod ? 'En' : 'Dis'}abled`,
            `Npc : ${enableNpc ? 'En' : 'Dis'}abled`
        );
    }

    function unmark(gameId) {
        if (markers.has(gameId.toString())) {
            markers.delete(gameId.toString());
            mod.send('S_DESPAWN_DROPITEM', 4, {
                gameId: gameId - myPlayerId
            });
        }
    }

    function send(msg) { cmd.message(': ' + [...arguments].join('\n\t - ')); }

    // reload
    this.saveState = () => {
        let state = {
            enable: enable,
            enableDungeon: enableDungeon,
            enableIod: enableIod,
            enableNpc: enableNpc,
            myPlayerId: myPlayerId,
            myZone: myZone
        };
        return state;
    }

    this.loadState = (state) => {
        enable = state.enable;
        enableDungeon = state.enableDungeon;
        enableIod = state.enableIod;
        enableNpc = state.enableNpc;
        myPlayerId = myPlayerId;
        myZone = state.myZone;
        status();
    }

    this.destructor = () => {
        clear();
        cmd.remove('beams');
    }

}