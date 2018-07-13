// Version 1.04 r:00

const Command = require('command')
const GameState = require('tera-game-state')

const config = require('./config.js')

const MARKER = 369 // Diamond

module.exports = function Lootbeams(d) {
    const command = Command(d)
    const game = GameState(d)

    // config
    let enable = config.enable,
        enableDungeon = config.dungeon.enable,
        enableIod = config.iod.enable,
        enableNpc = config.npc.enable

    let markers = new Set(),
        myPlayerId = 0,
        myZone = 0

    // command
    const PARAM = {
        dg: () => {
            enableDungeon = !enableDungeon
            send(`Lootbeams in dungeons : ${enableDungeon ? 'Enabled' : 'Disabled'}`)
        },
        iod: () => { 
            enableIod = !enableIod
            send(`Lootbeams on Island of Dawn : ${enableIod ? 'Enabled' : 'Disabled'}`)
        },
        npc: () => {
            enableNpc = !enableNpc
            send(`Lootbeams for npc : ${enableNpc ? 'Enabled' : 'Disabled'}`)
        },
        c: () => {
            clear(); send(`Cleared lootbeams.`)
        },
        s: () => { status() }
    }

    command.add(['beams'], (p) => {
        // toggle
        if (!p) { enable = !enable; status() }
        // arguments
        else if (p in PARAM) PARAM[p]()
        else send(`Invalid argument.`)
    })

    // code
    d.hook('S_LOGIN', 'raw', () => { myPlayerId = game.me.playerId })
    d.hook('S_LOAD_TOPO', 'raw', () => { markers.clear(); myZone = game.me.zone })

    // if already marked do not double mark
    // if in blacklist, do not render
    // if in whitelist, spawn lootbeam
    d.hook('S_SPAWN_DROPITEM', 6, (e) => {
        if (!enable || markers.has(e.gameId.toString())) return
        else if (config.blacklist.includes(e.item)) return false
        else if ((enableDungeon && config.dungeon.zone.includes(myZone)) || 
            ((enableIod && myZone === config.iod.zone && config.iod.whitelist.includes(e.item))))
            mark(e)
    })

    d.hook('S_SPAWN_NPC', 7, (e) => {
        if (!enable || !enableNpc || markers.has(e.gameId.toString())) return
        if (myZone in config.npc.zone) {
            for (i = 0, n = config.npc[myZone].length; i < n; i++) {
                if (e.templateId === config.npc[myZone].npc[i]) mark(e)
            }
        }
    })

    // if marked item/npc despawns, despawn lootbeam
    d.hook('S_DESPAWN_DROPITEM', 4, (e) => { 
        if (enable || markers.size > 0) unmark(e.gameId) })
    d.hook('S_DESPAWN_NPC', 3, (e) => {
        if (enable || markers.size > 0) unmark(e.gameId) })

    // helper
    function mark(e) {
        if (!markers.has(e.gameId.toString())) {
            markers.add(e.gameId.toString())
            e.gameId -= myPlayerId
            e.loc.z -= 500
            d.send('S_SPAWN_DROPITEM', 6, {
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
            })
        }
    }

    function unmark(gameId) {
        if (markers.has(gameId.toString())) {
            markers.delete(gameId.toString())
            d.send('S_DESPAWN_DROPITEM', 4, { gameId: gameId - myPlayerId })
        }
    }

    function clear() {
        markers.forEach((item) => { d.send('S_DESPAWN_DROPITEM', 4, { gameId: item - myPlayerId }) })
        markers.clear()
    }

    function send(msg) { command.message(`[lootbeams] : ` + [...arguments].join('\n\t - ')) }

    function status() { send(
        `${enable ? 'Enabled' : 'Disabled'}`,
        `Dungeon : ${enableDungeon ? 'Enabled'  : 'Disabled'}`,
        `Island of Dawn : ${enableIod ? 'Enabled' : 'Disabled'}`,
        `Npc : ${enableNpc ? 'Enabled' : 'Disabled'}`)
    }

}