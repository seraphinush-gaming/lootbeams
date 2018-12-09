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
            showStatus();
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
        's': () => {
            showStatus();
        },
        '$default': () => {
            send(`Invalid argument. usage : beams [dg|iod|npc|c|s]`);
        }
    });

    // mod.game
    mod.game.on('enter_game', () => {
        myPlayerId = BigInt(mod.game.me.playerId);
    });

    mod.game.me.on('change_zone', (zone) => {
        markers.clear();
        myZone = zone;
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

    mod.hook('S_SPAWN_NPC', 10, (e) => {
        if (!enable || !enableNpc || markers.has(e.gameId.toString()))
            return;
        if (myZone in config.npc.zone) {
            for (i = 0, n = config.npc[myZone].length; i < n; i++) {
                if (e.templateId === config.npc[myZone].npc[i]) mark(e);
            }
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

    function unmark(gameId) {
        if (markers.has(gameId.toString())) {
            markers.delete(gameId.toString());
            mod.send('S_DESPAWN_DROPITEM', 4, {
                gameId: gameId - myPlayerId
            });
        }
    }

    function clear() {
        for (let item in markers) {
            mod.send('S_DESPAWN_DROPITEM', 4, {
                gameId: item - myPlayerId
            });
        }
        markers.clear();
    }

    function showStatus() {
        send(
            `${enable ? 'En' : 'Dis'}abled`,
            `Dungeon : ${enableDungeon ? 'En' : 'Dis'}abled`,
            `Island of Dawn : ${enableIod ? 'En' : 'Dis'}abled`,
            `Npc : ${enableNpc ? 'En' : 'Dis'}abled`
        );
    }

    function send(msg) { cmd.message(`: ` + [...arguments].join('\n\t - ')); }

}