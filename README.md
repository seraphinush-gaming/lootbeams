<p align="center">
<a href="#">
<img src="https://github.com/seraphinush-gaming/pastebin/blob/master/logo_ttb_trans.png?raw=true" width="200" height="200" alt="tera-toolbox, logo by Foglio" />
</a>
</p>

# lootbeams [![paypal](https://img.shields.io/badge/paypal-donate-333333.svg?colorA=253B80&colorB=333333)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=B7QQJZV9L5P2J&source=url) [![paypal.me](https://img.shields.io/badge/paypal.me-donate-333333.svg?colorA=169BD7&colorB=333333)](https://www.paypal.me/seraphinush)
tera-toolbox module to "erect a glistening shaft of light that penetrates the heavens"
```
Support seraph via paypal donations, thanks in advance !
```

## Auto-update guide
- Create a folder called `lootbeams` in `tera-toolbox/mods` and download >> [`module.json`](https://raw.githubusercontent.com/seraphinush-gaming/lootbeams/master/module.json) << (right-click this link and save link as..) into the folder

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
  - "C"lear rendered lootbeams
- __`status`__
  - Send module "s"tatus

## Info
- Original author : [Some-AV-Popo](https://github.com/Some-AV-Popo)
- Config file can be configured via editors such as Notepad

## Changelog
<details>

    1.09
    - Added settings-migrator support
    1.08
    - Removed `tera-game-state` usage
    1.07
    - Added hot-reload support
    1.06
    - Updated for caali-proxy-nextgen
    1.05
    - Removed `Command` require()
    - Removed `tera-game-state` require()
    - Updated to `mod.command`
    - Updated to `mod.game`
    - Updated to `S_SPAWN_NPC.9.def`
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