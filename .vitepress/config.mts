import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "WoyAg's Blog",
    srcDir: "src",
    description:
        "A personal cybersecurity blog documenting raw notes, findings, and learning experiences. Exported from Obsidian as an evolving knowledge base.",
    cleanUrls: true,
    lastUpdated: true,
    sitemap: {
        hostname: "https://xhacka.github.io",
    },
    themeConfig: {
        search: {
            provider: "local",
        },
        nav: [
            { text: "Blog", link: "/" },
            { text: "Cheatsheets", link: "/cheatsheets" },
        ],
        sidebar: [
            {
                text: "CTFs",
                collapsed: false,
                items: [],
            },
            {
                text: "Pentest",
                items: [
                    {
                        text: "HackTheBox",
                        collapsed: true,
                        items: [
                            {
                                text: "Machines",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Linux",
                                        collapsed: true,
                                        items: [
                                            {
                                                text: "Easy",
                                                collapsed: true,
                                                items: [
                                                    {
                                                        text: "Alert",
                                                        link: "/pentest/htb/machines/linux/easy/alert.md",
                                                    },
                                                    {
                                                        text: "Broker",
                                                        link: "/pentest/htb/machines/linux/easy/broker.md",
                                                    },
                                                    {
                                                        text: "Cap",
                                                        link: "/pentest/htb/machines/linux/easy/cap.md",
                                                    },
                                                    {
                                                        text: "GoodGames",
                                                        link: "/pentest/htb/machines/linux/easy/goodgames.md",
                                                    },
                                                    {
                                                        text: "GreenHorn",
                                                        link: "/pentest/htb/machines/linux/easy/greenhorn.md",
                                                    },
                                                    {
                                                        text: "Lame",
                                                        link: "/pentest/htb/machines/linux/easy/lame.md",
                                                    },
                                                    {
                                                        text: "Late",
                                                        link: "/pentest/htb/machines/linux/easy/late.md",
                                                    },
                                                    {
                                                        text: "LinkVortex",
                                                        link: "/pentest/htb/machines/linux/easy/linkvortex.md",
                                                    },
                                                    {
                                                        text: "MetaTwo",
                                                        link: "/pentest/htb/machines/linux/easy/metatwo.md",
                                                    },
                                                    {
                                                        text: "Nocturnal",
                                                        link: "/pentest/htb/machines/linux/easy/nocturnal.md",
                                                    },
                                                    {
                                                        text: "OpenSource",
                                                        link: "/pentest/htb/machines/linux/easy/opensource.md",
                                                    },
                                                    {
                                                        text: "Pandora",
                                                        link: "/pentest/htb/machines/linux/easy/pandora.md",
                                                    },
                                                    {
                                                        text: "Paper",
                                                        link: "/pentest/htb/machines/linux/easy/paper.md",
                                                    },
                                                    {
                                                        text: "PermX",
                                                        link: "/pentest/htb/machines/linux/easy/permx.md",
                                                    },
                                                    {
                                                        text: "Photobomb",
                                                        link: "/pentest/htb/machines/linux/easy/photobomb.md",
                                                    },
                                                    {
                                                        text: "Planning",
                                                        link: "/pentest/htb/machines/linux/easy/planning.md",
                                                    },
                                                    {
                                                        text: "Precious",
                                                        link: "/pentest/htb/machines/linux/easy/precious.md",
                                                    },
                                                    {
                                                        text: "Previse",
                                                        link: "/pentest/htb/machines/linux/easy/previse.md",
                                                    },
                                                    {
                                                        text: "RedPanda",
                                                        link: "/pentest/htb/machines/linux/easy/redpanda.md",
                                                    },
                                                    {
                                                        text: "Shoppy",
                                                        link: "/pentest/htb/machines/linux/easy/shoppy.md",
                                                    },
                                                    {
                                                        text: "Soccer",
                                                        link: "/pentest/htb/machines/linux/easy/soccer.md",
                                                    },
                                                    {
                                                        text: "Stocker",
                                                        link: "/pentest/htb/machines/linux/easy/stocker.md",
                                                    },
                                                    {
                                                        text: "Trick",
                                                        link: "/pentest/htb/machines/linux/easy/trick.md",
                                                    },
                                                    {
                                                        text: "TwoMillion",
                                                        link: "/pentest/htb/machines/linux/easy/twomillion.md",
                                                    },
                                                    {
                                                        text: "UnderPass",
                                                        link: "/pentest/htb/machines/linux/easy/underpass.md",
                                                    },
                                                    {
                                                        text: "Usage",
                                                        link: "/pentest/htb/machines/linux/easy/usage.md",
                                                    },
                                                    {
                                                        text: "Wifinetic",
                                                        link: "/pentest/htb/machines/linux/easy/wifinetic.md",
                                                    },
                                                ],
                                            },
                                            {
                                                text: "Medium",
                                                collapsed: true,
                                                items: [
                                                    {
                                                        text: "Backend",
                                                        link: "/pentest/htb/machines/linux/medium/backend.md",
                                                    },
                                                    {
                                                        text: "BroScience",
                                                        link: "/pentest/htb/machines/linux/medium/broscience.md",
                                                    },
                                                    {
                                                        text: "Clicker",
                                                        link: "/pentest/htb/machines/linux/medium/clicker.md",
                                                    },
                                                    {
                                                        text: "Cronos",
                                                        link: "/pentest/htb/machines/linux/medium/cronos.md",
                                                    },
                                                    {
                                                        text: "Environment",
                                                        link: "/pentest/htb/machines/linux/medium/environment.md",
                                                    },
                                                    {
                                                        text: "Epsilon",
                                                        link: "/pentest/htb/machines/linux/medium/epsilon.md",
                                                    },
                                                    {
                                                        text: "Forgot",
                                                        link: "/pentest/htb/machines/linux/medium/forgot.md",
                                                    },
                                                    {
                                                        text: "IClean",
                                                        link: "/pentest/htb/machines/linux/medium/iclean.md",
                                                    },
                                                    {
                                                        text: "Interface",
                                                        link: "/pentest/htb/machines/linux/medium/interface.md",
                                                    },
                                                    {
                                                        text: "Jupiter",
                                                        link: "/pentest/htb/machines/linux/medium/jupiter.md",
                                                    },
                                                    {
                                                        text: "Noter",
                                                        link: "/pentest/htb/machines/linux/medium/noter.md",
                                                    },
                                                    {
                                                        text: "Poison",
                                                        link: "/pentest/htb/machines/linux/medium/poison.md",
                                                    },
                                                    {
                                                        text: "Ransom",
                                                        link: "/pentest/htb/machines/linux/medium/ransom.md",
                                                    },
                                                    {
                                                        text: "Strutted",
                                                        link: "/pentest/htb/machines/linux/medium/strutted.md",
                                                    },
                                                    {
                                                        text: "Unrested",
                                                        link: "/pentest/htb/machines/linux/medium/unrested.md",
                                                    },
                                                ],
                                            },
                                            {
                                                text: "Hard",
                                                collapsed: true,
                                                items: [
                                                    {
                                                        text: "Zipper",
                                                        link: "/pentest/htb/machines/linux/hard/zipper.md",
                                                    },
                                                ],
                                            },
                                            {
                                                text: "Insane",
                                                collapsed: true,
                                                items: [
                                                    {
                                                        text: "Skyfall",
                                                        link: "/pentest/htb/machines/linux/insane/skyfall.md",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        text: "Windows",
                                        collapsed: true,
                                        items: [
                                            {
                                                text: "Easy",
                                                collapsed: true,
                                                items: [
                                                    {
                                                        text: "Bounty",
                                                        link: "/pentest/htb/machines/windows/easy/bounty.md",
                                                    },
                                                    {
                                                        text: "BountyHunter",
                                                        link: "/pentest/htb/machines/windows/easy/bountyhunter.md",
                                                    },
                                                    {
                                                        text: "Heal",
                                                        link: "/pentest/htb/machines/windows/easy/heal.md",
                                                    },
                                                    {
                                                        text: "Health",
                                                        link: "/pentest/htb/machines/windows/easy/health.md",
                                                    },
                                                    {
                                                        text: "Return",
                                                        link: "/pentest/htb/machines/windows/easy/return.md",
                                                    },
                                                    {
                                                        text: "Support",
                                                        link: "/pentest/htb/machines/windows/easy/support.md",
                                                    },
                                                    {
                                                        text: "Timelapse",
                                                        link: "/pentest/htb/machines/windows/easy/timelapse.md",
                                                    },
                                                ],
                                            },
                                            {
                                                text: "Medium",
                                                collapsed: true,
                                                items: [
                                                    {
                                                        text: "Administrator",
                                                        link: "/pentest/htb/machines/windows/medium/administrator.md",
                                                    },
                                                    {
                                                        text: "Certified",
                                                        link: "/pentest/htb/machines/windows/medium/certified.md",
                                                    },
                                                    {
                                                        text: "Compiled",
                                                        link: "/pentest/htb/machines/windows/medium/compiled.md",
                                                    },
                                                    {
                                                        text: "Escape",
                                                        link: "/pentest/htb/machines/windows/medium/escape.md",
                                                    },
                                                    {
                                                        text: "Monteverde",
                                                        link: "/pentest/htb/machines/windows/medium/monteverde.md",
                                                    },
                                                    {
                                                        text: "Resolute",
                                                        link: "/pentest/htb/machines/windows/medium/resolute.md",
                                                    },
                                                ],
                                            },
                                            {
                                                text: "Hard",
                                                collapsed: true,
                                                items: [
                                                    {
                                                        text: "Acute",
                                                        link: "/pentest/htb/machines/windows/hard/acute.md",
                                                    },
                                                    {
                                                        text: "Vintage",
                                                        link: "/pentest/htb/machines/windows/hard/vintage.md",
                                                    },
                                                ],
                                            },
                                            {
                                                text: "Insane",
                                                collapsed: true,
                                                items: [
                                                    {
                                                        text: "Mist",
                                                        link: "/pentest/htb/machines/windows/Insane/mist.md",
                                                    },
                                                    {
                                                        text: "Perspective",
                                                        link: "/pentest/htb/machines/windows/insane/perspective.md",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                text: "Season 1",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Agile",
                                        link: "/pentest/htb/season1/agile.md",
                                    },
                                    {
                                        text: "Busqueda",
                                        link: "/pentest/htb/season1/busqueda.md",
                                    },
                                    {
                                        text: "Cerberus - NOPE",
                                        link: "/pentest/htb/season1/cerberus.md",
                                    },
                                    {
                                        text: "Coder - NOPE",
                                        link: "/pentest/htb/season1/coder.md",
                                    },
                                    {
                                        text: "Format",
                                        link: "/pentest/htb/season1/format.md",
                                    },
                                    {
                                        text: "Inject",
                                        link: "/pentest/htb/season1/inject.md",
                                    },
                                    {
                                        text: "Mailroom - NOPE",
                                        link: "/pentest/htb/season1/mailroom.md",
                                    },
                                    {
                                        text: "MonitorsTwo - NOPE",
                                        link: "/pentest/htb/season1/monitorstwo.md",
                                    },
                                    {
                                        text: "OnlyForYou",
                                        link: "/pentest/htb/season1/onlyforyou.md",
                                    },
                                    {
                                        text: "PC",
                                        link: "/pentest/htb/season1/pc.md",
                                    },
                                    {
                                        text: "Snoopy",
                                        link: "/pentest/htb/season1/snoopy.md",
                                    },
                                    {
                                        text: "Socket",
                                        link: "/pentest/htb/season1/socket.md",
                                    },
                                ],
                            },
                            {
                                text: "Season 2",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Authority",
                                        link: "/pentest/htb/season2/authority.md",
                                    },
                                    {
                                        text: "Bookworm - NOPE",
                                        link: "/pentest/htb/season2/bookworm.md",
                                    },
                                    {
                                        text: "CozyHosting",
                                        link: "/pentest/htb/season2/cozyhosting.md",
                                    },
                                    {
                                        text: "Cybermonday",
                                        link: "/pentest/htb/season2/cybermonday.md",
                                    },
                                    {
                                        text: "Download",
                                        link: "/pentest/htb/season2/download.md",
                                    },
                                    {
                                        text: "Gofer - NOPE",
                                        link: "/pentest/htb/season2/gofer.md",
                                    },
                                    {
                                        text: "Intentions",
                                        link: "/pentest/htb/season2/intentions.md",
                                    },
                                    {
                                        text: "Keeper",
                                        link: "/pentest/htb/season2/keeper.md",
                                    },
                                    {
                                        text: "Pilgrimage - NOPE",
                                        link: "/pentest/htb/season2/pilgrimage.md",
                                    },
                                    {
                                        text: "Rebound",
                                        link: "/pentest/htb/season2/rebound.md",
                                    },
                                    {
                                        text: "RegistryTwo - NOPE",
                                        link: "/pentest/htb/season2/registrytwo.md",
                                    },
                                    {
                                        text: "Sandworm",
                                        link: "/pentest/htb/season2/sandworm.md",
                                    },
                                    {
                                        text: "Sau - NOPE",
                                        link: "/pentest/htb/season2/sau.md",
                                    },
                                    {
                                        text: "Zipping",
                                        link: "/pentest/htb/season2/zipping.md",
                                    },
                                ],
                            },
                            {
                                text: "Season 3",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Analytics",
                                        link: "/pentest/htb/season3/analytics.md",
                                    },
                                    {
                                        text: "Appsanity",
                                        link: "/pentest/htb/season3/appsanity.md",
                                    },
                                    {
                                        text: "Codify",
                                        link: "/pentest/htb/season3/codify.md",
                                    },
                                    {
                                        text: "Devvortex",
                                        link: "/pentest/htb/season3/devvortex.md",
                                    },
                                    {
                                        text: "Drive - NOPE",
                                        link: "/pentest/htb/season3/drive.md",
                                    },
                                    {
                                        text: "Hospital",
                                        link: "/pentest/htb/season3/hospital.md",
                                    },
                                    {
                                        text: "Manager",
                                        link: "/pentest/htb/season3/manager.md",
                                    },
                                    {
                                        text: "Napper - NOPE",
                                        link: "/pentest/htb/season3/napper.md",
                                    },
                                    {
                                        text: "Surveillance",
                                        link: "/pentest/htb/season3/surveillance.md",
                                    },
                                    {
                                        text: "Visual - NOPE",
                                        link: "/pentest/htb/season3/visual.md",
                                    },
                                ],
                            },
                            {
                                text: "Season 4",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Bizness - NOPE",
                                        link: "/pentest/htb/season4/bizness.md",
                                    },
                                    {
                                        text: "Crafty",
                                        link: "/pentest/htb/season4/crafty.md",
                                    },
                                    {
                                        text: "FormulaX",
                                        link: "/pentest/htb/season4/formulax.md",
                                    },
                                    {
                                        text: "Headless",
                                        link: "/pentest/htb/season4/headless.md",
                                    },
                                    {
                                        text: "Jab",
                                        link: "/pentest/htb/season4/jab.md",
                                    },
                                    {
                                        text: "Monitored - NOPE",
                                        link: "/pentest/htb/season4/monitored.md",
                                    },
                                    {
                                        text: "Office",
                                        link: "/pentest/htb/season4/office.md",
                                    },
                                    {
                                        text: "Perfection",
                                        link: "/pentest/htb/season4/perfection.md",
                                    },
                                    {
                                        text: "Pov - NOPE",
                                        link: "/pentest/htb/season4/pov.md",
                                    },
                                    {
                                        text: "WifineticTwo",
                                        link: "/pentest/htb/season4/wifinetictwo.md",
                                    },
                                ],
                            },
                            {
                                text: "Season 5",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Axlle",
                                        link: "/pentest/htb/season5/axlle.md",
                                    },
                                    {
                                        text: "Blazorized",
                                        link: "/pentest/htb/season5/blazorized.md",
                                    },
                                    {
                                        text: "Blurry",
                                        link: "/pentest/htb/season5/blurry.md",
                                    },
                                    {
                                        text: "BoardLight",
                                        link: "/pentest/htb/season5/boardlight.md",
                                    },
                                    {
                                        text: "Editorial",
                                        link: "/pentest/htb/season5/editorial.md",
                                    },
                                    {
                                        text: "Freelancer",
                                        link: "/pentest/htb/season5/freelancer.md",
                                    },
                                    {
                                        text: "Ghost",
                                        link: "/pentest/htb/season5/ghost.md",
                                    },
                                    {
                                        text: "Intuition",
                                        link: "/pentest/htb/season5/intuition.md",
                                    },
                                    {
                                        text: "MagicGardens",
                                        link: "/pentest/htb/season5/magicgardens.md",
                                    },
                                    {
                                        text: "Mailing",
                                        link: "/pentest/htb/season5/mailing.md",
                                    },
                                    {
                                        text: "Runner",
                                        link: "/pentest/htb/season5/runner.md",
                                    },
                                    {
                                        text: "SolarLab",
                                        link: "/pentest/htb/season5/solarlab.md",
                                    },
                                ],
                            },
                            {
                                text: "Season 6",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Caption",
                                        link: "/pentest/htb/season6/caption.md",
                                    },
                                    {
                                        text: "Chemistry",
                                        link: "/pentest/htb/season6/chemistry.md",
                                    },
                                    {
                                        text: "Cicada",
                                        link: "/pentest/htb/season6/cicada.md",
                                    },
                                    {
                                        text: "Infiltrator",
                                        link: "/pentest/htb/season6/infiltrator.md",
                                    },
                                    {
                                        text: "Instant",
                                        link: "/pentest/htb/season6/instant.md",
                                    },
                                    {
                                        text: "Lantern",
                                        link: "/pentest/htb/season6/lantern.md",
                                    },
                                    {
                                        text: "MonitorsThree",
                                        link: "/pentest/htb/season6/monitorsthree.md",
                                    },
                                    {
                                        text: "Resource",
                                        link: "/pentest/htb/season6/resource.md",
                                    },
                                    {
                                        text: "Sea",
                                        link: "/pentest/htb/season6/sea.md",
                                    },
                                    {
                                        text: "Sightless",
                                        link: "/pentest/htb/season6/sightless.md",
                                    },
                                    {
                                        text: "Trickster",
                                        link: "/pentest/htb/season6/trickster.md",
                                    },
                                    {
                                        text: "University",
                                        link: "/pentest/htb/season6/university.md",
                                    },
                                    {
                                        text: "Yummy",
                                        link: "/pentest/htb/season6/yummy.md",
                                    },
                                ],
                            },
                            {
                                text: "Season 7",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Backfire",
                                        link: "/pentest/htb/season7/backfire.md",
                                    },
                                    {
                                        text: "BigBang",
                                        link: "/pentest/htb/season7/bigbang.md",
                                    },
                                    {
                                        text: "Cat",
                                        link: "/pentest/htb/season7/cat.md",
                                    },
                                    {
                                        text: "Checker",
                                        link: "/pentest/htb/season7/checker.md",
                                    },
                                    {
                                        text: "Code",
                                        link: "/pentest/htb/season7/code.md",
                                    },
                                    {
                                        text: "Cypher",
                                        link: "/pentest/htb/season7/cypher.md",
                                    },
                                    {
                                        text: "DarkCorp",
                                        link: "/pentest/htb/season7/darkcorp.md",
                                    },
                                    {
                                        text: "Dog",
                                        link: "/pentest/htb/season7/dog.md",
                                    },
                                    {
                                        text: "EscapeTwo",
                                        link: "/pentest/htb/season7/escapetwo.md",
                                    },
                                    {
                                        text: "Haze",
                                        link: "/pentest/htb/season7/haze.md",
                                    },
                                    {
                                        text: "TheFrizz",
                                        link: "/pentest/htb/season7/thefrizz.md",
                                    },
                                    {
                                        text: "Titanic",
                                        link: "/pentest/htb/season7/titanic.md",
                                    },
                                    {
                                        text: "WhiteRabbit",
                                        link: "/pentest/htb/season7/whiterabbit.md",
                                    },
                                ],
                            },
                            {
                                text: "Season 8",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Artificial",
                                        link: "/pentest/htb/season8/artificial.md",
                                    },
                                    {
                                        text: "Certificate",
                                        link: "/pentest/htb/season8/certificate.md",
                                    },
                                    {
                                        text: "Editor",
                                        link: "/pentest/htb/season8/editor.md",
                                    },
                                    {
                                        text: "Era",
                                        link: "/pentest/htb/season8/era.md",
                                    },
                                    {
                                        text: "Fluffy",
                                        link: "/pentest/htb/season8/fluffy.md",
                                    },
                                    {
                                        text: "Mirage",
                                        link: "/pentest/htb/season8/mirage.md",
                                    },
                                    {
                                        text: "Outbound",
                                        link: "/pentest/htb/season8/outbound.md",
                                    },
                                    {
                                        text: "Puppy",
                                        link: "/pentest/htb/season8/puppy.md",
                                    },
                                    {
                                        text: "RustyKey",
                                        link: "/pentest/htb/season8/rustykey.md",
                                    },
                                    {
                                        text: "Sorcery",
                                        link: "/pentest/htb/season8/sorcery.md",
                                    },
                                    {
                                        text: "TombWatcher",
                                        link: "/pentest/htb/season8/tombwatcher.md",
                                    },
                                    {
                                        text: "Voleur",
                                        link: "/pentest/htb/season8/voleur.md",
                                    },
                                    {
                                        text: "Cobblestone - NOPE",
                                        link: "/pentest/htb/season8/cobblestone.md",
                                    },
                                ],
                            },
                            {
                                text: "Sherlocks",
                                collapsed: true,
                                link: "/pentest/htb/sherlocks/index.md",
                            },
                        ],
                    },
                    {
                        text: "VulnHub",
                        collapsed: true,
                        items: [
                            {
                                text: "Kioprtix",
                                link: "/pentest/kioprtix/index.md",
                                items: [
                                    {
                                        text: "Level 2",
                                        link: "/pentest/kioptrix/2.md",
                                    },
                                    {
                                        text: "Level 3",
                                        link: "/pentest/kioptrix/3.md",
                                    },
                                    {
                                        text: "Level 4",
                                        link: "/pentest/kioptrix/4.md",
                                    },
                                ],
                            },
                            {
                                text: "The Planets",
                                link: "/pentest/the_planets/index.md",
                                items: [
                                    {
                                        text: "Earth",
                                        link: "/pentest/the_planets/earth.md",
                                    },
                                    {
                                        text: "Mercury",
                                        link: "/pentest/the_planets/mercury.md",
                                    },
                                    {
                                        text: "Venus",
                                        link: "/pentest/the_planets/venus.md",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        text: "HackMyVM",
                        collapsed: false,
                        items: [],
                    },
                ],
            },
        ],
        socialLinks: [
            {
                icon: "github",
                link: "https://github.com/xHacka/xhacka.github.io",
            },
        ],
    },
});
