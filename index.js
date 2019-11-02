'use strict';

const PPL_MARKER = 209904;  // Skill Advancement Tome IV

module.exports = function Lootbeams(mod) {

  const cmd = mod.command;
  let settings = mod.settings;

  let markers = new Set();
  let myPlayerId32 = 0;
  let myPlayerId64 = BigInt(0);
  let myZone = 0;

  // command
  cmd.add('beams', {
    '$none': () => {
      settings.enable = !settings.enable;
      send(`${settings.enable ? 'en' : 'dis'}abled`);
    },
    'add': {
      'blacklist': () => {
        // wip
      },
      'dungeon': () => {
        // wip
      },
      'npc': () => {
        // wip
      },
      '$default': () => {
        // wip
      }
    },
    'dg': () => {
      settings.dungeon.enable = !settings.dungeon.enable;
      send(`Lootbeams in dungeons : ${settings.dungeon.enable ? 'en' : 'dis'}abled`);
    },
    'iod': () => {
      settings.iod.enable = !settings.iod.enable;
      send(`Lootbeams on Island of Dawn : ${settings.iod.enable ? 'en' : 'dis'}abled`);
    },
    'npc': () => {
      settings.npc.enable = !settings.npc.enable;
      send(`Lootbeams for npc : ${settings.npc.enable ? 'en' : 'dis'}abled`);
    },
    'c': () => {
      clear();
    },
    'remove': {
      'blacklist': () => {
        // wip
      },
      'dungeon': () => {
        // wip
      },
      'npc': () => {
        // wip
      },
      '$default': () => {
        // wip
      }
    },
    'status': () => {
      send(
        `${settings.enable ? 'En' : 'Dis'}abled`,
        `Dungeon : ${settings.dungeon.enable}`,
        `Island of Dawn : ${settings.iod.enable}`,
        `Npc : ${settings.npc.enable}`
      );
    },
    '$default': () => {
      send(`Invalid argument. usage : beams [dg|iod|npc|c|status]`);
    }
  });

  // game state
  mod.game.on('enter_game', () => {
    myPlayerId32 = mod.game.me.playerId;
    myPlayerId64 = BigInt(mod.game.me.playerId);
  })

  mod.game.me.on('change_zone', (zone) => {
    markers.clear();
    myZone = zone;
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
        gameId: item - myPlayerId64
      });
    }
    markers.clear();
    send(`Cleared lootbeams.`);
  }

  function mark(e) {
    if (!markers.has(e.gameId.toString())) {
      markers.add(e.gameId.toString());
      e.gameId -= myPlayerId64;
      e.loc.z -= 100;
      mod.send('S_SPAWN_DROPITEM', 8, {
        gameId: e.gameId,
        loc: e.loc,
        item: PPL_MARKER,
        amount: 1,
        expiry: 10000,
        owners: [{ playerId: myPlayerId32 }],
        ownerName: ""
      });
    }
  }

  function unmark(gameId) {
    if (markers.has(gameId.toString())) {
      markers.delete(gameId.toString());
      mod.send('S_DESPAWN_DROPITEM', 4, {
        gameId: gameId - myPlayerId64
      });
    }
  }

  // code
  mod.hook('S_SPAWN_DROPITEM', 8, (e) => {
    if (settings.enable && !markers.has(e.gameId.toString())) {
      if (settings.blacklist.includes(e.item)) {
        return false;
      }
      if (settings.iod.enable && settings.iod.zone === myZone) {
        if (settings.iod.whitelist.includes(e.item)) {
          mark(e);
        }
      }
      else if (settings.dungeon.enable && settings.dungeon.zone.includes(myZone)) {
        mark(e);
      }
    }
  });

  mod.hook('S_DESPAWN_DROPITEM', 4, (e) => {
    if (settings.enable || markers.size > 0) {
      unmark(e.gameId);
    }
  });

  mod.hook('S_SPAWN_NPC', 11, (e) => {
    if (settings.enable && !markers.has(e.gameId.toString())) {
      if (myZone in settings.npc.zone) {
        for (let i = 0, n = settings.npc.zone[myZone].length; i < n; i++) {
          if (e.templateId === settings.npc.zone[myZone][i]) {
            mark(e);
          }
        }
      }
      else if (settings.npc.event.includes(e.templateId)) {
        mark(e);
        alert();
      }
    }
  });

  mod.hook('S_DESPAWN_NPC', 3, (e) => {
    if (settings.enable || markers.size > 0)
      unmark(e.gameId);
  });

  function send() { cmd.message(': ' + [...arguments].join('\n\t - ')); }

  // reload
  this.saveState = () => {
    let state = {
      myPlayerId32: myPlayerId32,
      myPlayerId64: myPlayerId64,
      myZone: myZone
    };
    return state;
  }

  this.loadState = (state) => {
    myPlayerId32 = myPlayerId32;
    myPlayerId64 = BigInt(myPlayerId64);
    myZone = state.myZone;
  }

  this.destructor = () => {
    clear();
    cmd.remove('beams');
  }

}