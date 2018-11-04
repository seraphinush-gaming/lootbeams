// Version 1.05 r:03
'use strict';

const config = require('./config.js');

const MARKER = 369; // Diamond

module.exports = function Lootbeams(m) {

    // config
    let enable = config.enable,
        enableDungeon = config.dungeon.enable,
        enableIod = config.iod.enable,
        enableNpc = config.npc.enable;

    let markers = new Set(),
        myPlayerId = 0,
        myZone = 0;

    // command
    m.command.add('beams', {
        $none() {
            enable = !enable;
            showStatus();
        },
        dg() {
            enableDungeon = !enableDungeon;
            send(`Lootbeams in dungeons : ${enableDungeon ? 'En' : 'Dis'}abled`);
        },
        iod() { 
            enableIod = !enableIod;
            send(`Lootbeams on Island of Dawn : ${enableIod ? 'En' : 'Dis'}abled`);
        },
        npc() {
            enableNpc = !enableNpc;
            send(`Lootbeams for npc : ${enableNpc ? 'En' : 'Dis'}abled`);
        },
        c() {
            clear(); 
            send(`Cleared lootbeams.`);
        },
        s() { showStatus(); },
        $default() {
            send(`Invalid argument. usage : beams [dg|iod|npc|c|s]`);
        }
    });

    // mod.game
    m.game.on('enter_game', () => { 
        if (typeof m.game.me.playerId === 'bigint') {
            myPlayerId = BigInt(m.game.me.playerId);
        } else {
            myPlayerId = m.game.me.playerId;
        }
    });
    m.game.me.on('change_zone', (zone) => { markers.clear(); myZone = zone; });

    // code
    // if already marked do not double mark
    // if in blacklist, do not mark and/or do not render on island of dawn
    // if in whitelist, spawn lootbeam
    m.hook('S_SPAWN_DROPITEM', 6, (e) => {
        if (!enable || markers.has(e.gameId.toString())) return;
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

    // if zone-specific npc id matches, spawn lootbeam
    m.hook('S_SPAWN_NPC', 10, (e) => {
        if (!enable || !enableNpc || markers.has(e.gameId.toString())) return
        if (myZone in config.npc.zone) {
            for (i = 0, n = config.npc[myZone].length; i < n; i++) {
                if (e.templateId === config.npc[myZone].npc[i]) mark(e);
            }
        }
    });

    // if marked item/npc despawns, despawn lootbeam
    m.hook('S_DESPAWN_DROPITEM', 4, (e) => { 
        if (enable || markers.size > 0) unmark(e.gameId) });
    m.hook('S_DESPAWN_NPC', 3, (e) => {
        if (enable || markers.size > 0) unmark(e.gameId) });

    // helper
    function mark(e) {
        if (!markers.has(e.gameId.toString())) {
            markers.add(e.gameId.toString());
            e.gameId -= myPlayerId;
            e.loc.z -= 500;
            m.send('S_SPAWN_DROPITEM', 6, {
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
            m.send('S_DESPAWN_DROPITEM', 4, { gameId: gameId - myPlayerId });
        }
    }

    function clear() {
        markers.forEach((item) => { m.send('S_DESPAWN_DROPITEM', 4, { gameId: item - myPlayerId }); });
        markers.clear();
    }

    function send(msg) { m.command.message(`: ` + [...arguments].join('\n\t - ')); }

    function showStatus() { send(
        `${enable ? 'En' : 'Dis'}abled`,
        `Dungeon : ${enableDungeon ? 'En' : 'Dis'}abled`,
        `Island of Dawn : ${enableIod ? 'En' : 'Dis'}abled`,
        `Npc : ${enableNpc ? 'En' : 'Dis'}abled`);
    }

}