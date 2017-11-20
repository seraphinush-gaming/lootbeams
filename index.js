const MARKER = 369, // Diamond

  SHINY = [
    369, 91116, 55658, 91166, 91114, 91118, 91177, 91113, 91119, 91188, 57000,
    91115, 91117, 98260, 98263, 98262, 98264, 98261
  ],

  BLACKLIST = [
    // Strongboxes
    139113, 166718, 169107, 169886, 169887, 169888, 169889, 169890, 169891,
    // Motes
    649, 703, 8000, 8001, 8002, 8003, 8004, 8005, 8008, 8009, 8010, 8011,
    8012, 8013, 8014, 8015, 8016, 8017, 8018, 8019, 8020, 8021, 8022, 8023, 8025,
    46701, MARKER,  ...SHINY
  ]

const Command = require('command')

module.exports = function Lootbeams(dispatch) {
  const command = Command(dispatch)

  let pid, markers,
      enabled = true

  command.add('beams', () => {
    if (enabled = !enabled) {}
    else clear()
    command.message('Loot beams ' + (enabled? 'on.' : 'off.'), 'Lootbeams')
  })

  command.add('clearbeams', clear)

  dispatch.hook('S_LOGIN', 4, event => {
    pid = event.playerId
    markers = []
  })

  dispatch.hook('S_SPAWN_DROPITEM', 2, event => {
    if (!enabled || BLACKLIST.includes(event.item)) return
    markers.push(event.id)
    event.id -= pid
    event.z -= 500  // Bury it balls-deep
    event.item = MARKER
    dispatch.toClient('S_SPAWN_DROPITEM', 2, event)
  })

  dispatch.hook('S_DESPAWN_DROPITEM', 1, event => {
    if (!enabled) return
    // Do I even need to check? Client seems to ignore non-existant despawns ...
    // God damn uint64s, includes and indexOf seems to fail
    for (let i = 0; i < markers.length; i++) {
      if (event.id.equals(markers[i])) {
        markers.splice(i, 1)
        dispatch.toClient('S_DESPAWN_DROPITEM', 1, {id: event.id - pid})
        break
      }
    }
  })

  dispatch.hook('S_LOAD_TOPO', 1, () => {markers = []})

  function clear() {
    for (let id of markers) dispatch.toClient('S_DESPAWN_DROPITEM', 1, {id: id - pid})
    markers = []
  }
}
