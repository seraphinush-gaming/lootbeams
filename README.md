# lootbeams
tera-proxy module to "erect a glistening shaft of light that penetrates the heavens"

## Dependency
- `Command` module
- `tera-game-state` module

## Usage
- __`beams`__
### Arguments
- __`iod`__
  - Toggle lootbeams on/off on Island of Dawn according to blacklist/whitelist
- __`dg`__
  - Toggle lootbeams on/off in dungeons according to config
- __`npc`__
  - Toggle lootbeams on/off for npcs according to config
- __`c`__
  - `C`lear rendered lootbeams
- __`s`__
  - Send module status

## Config
- __`enable`__
  - Initialize module on/off
  - Default is `true`
- __`blacklist`__
  - List of items to block from rendering
- __`iod`__
  - `enable` : Initialize lootbeams on Island of Dawn on/off
    - Default is `true`
  - `whitelist` : List of items to place lootbeams on Island of Dawn
- __`dungeon`__
  - `enable` : Initialize lootbeams in dungeons on/off
    - Default is `true`
  - `zone` : List of dungeons to place lootbeams underneath loot items
- __ `npc`__
  - `enable` : Initialize lootbeams for npcs on/off
    - Default is `true`
  - `zone` : List of zone:npc to place lootbeams underneath npcs

## Info
- Original author : [Some-AV-Popo](https://github.com/Some-AV-Popo)
- **Support seraph via paypal donations, thanks in advance : [paypal](https://www.paypal.me/seraphinush)**
- Config file can be configured via editors such as Notepad

## Changelog
<details>

    1.04
    - Removed font color bloat
    - Added `tera-game-state` dependency
    1.03
    - Updated module hook versions
    - Added hooks to S_SPAWN_NPC and S_DESPAWN_NPC
    - Removed commands `clearbeams`, `clear`
    - Added parameters `iod`, `dg`, `npc`, `c`, `s`
    - Refactored config file
    -- Added `enable`
    -- Added `blacklist`
    -- Added `iod`
    --- `enable`
    --- `whitelist`
    --- `zone
    -- Added `dungeon`
    --- `enable`
    --- `zone`
    -- Added `npc`
    --- `enable`
    --- `zone`
    1.01
    - Initial fork

</details>