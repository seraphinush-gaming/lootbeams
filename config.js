module.exports = {
    enable: true,
    blacklist: [
        649, // Speed Mote
        703, // Dreamstorm : Oneiric Mote
        7214, // Scroll of Resurrection
        8000, 8001, 8002, 8003, 8004, 8005, // Various HP and MP Motes
        8008, 8009, 8010, 8011, 8012, 8013, 8014, 8015, 8016, 8017, 8018, 8019, 8020, 8021, 8022, // Arun's Vitae I-XV Mote
        8023, // Arun's Tear Mote
        91344, // Fashion Coupon
        139113, 166718, 213026, // 행운의 상자 (K TERA)
        169886, 169887, 169888, 169889, 169890, 169891, // Locked ???? Strongbox
    ],
    dungeon: {
        enable: true,
        zone: [
            9031, // Ace Dungeon : Akasha's Trial
            9032, // Ace Dungeon : Baracos' Trial
            9055, // Ravenous Gorge
            9126, // Pit of Petrax
            9766, // Shattered Fleet
            9860, // Kalivan's Challenge
        ]
    },
    iod: {
        enable: true,
        whitelist: [
            399, // Semi-Enigmatic Scroll
            8025, // Keening Dawn Mote
            48003, // Complete Crystalbind
            70000, // Complete Crystalbind
        ],
        zone: 13, // Do not change
    },
    npc: {
        enable: true,
        zone: {
            9025: [7021], // Balder's Temple, Jar
            9830: [3000400], // Celestial Arena, Tasty Watermelon
        }
    }
}