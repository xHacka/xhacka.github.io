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
        outline: "deep",
        sidebar: [
            {
                text: "CTFs",
                collapsed: false,
                items: [],
            },
            {
                text: "Pentest",
                collapsed: true,
                items: [
                    {
                        text: "HackTheBox",
                        collapsed: false,
                        items: [
                            {
                                text: "Machines",
                                collapsed: true,
                                items: [
                                    {
                                        text: "Linux",
                                        collapsed: false,
                                        items: [
                                            {
                                                text: "Easy",
                                                collapsed: false,
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
                                                collapsed: false,
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
                                                link: "/pentest/htb/machines/linux/hard/index.md",
                                                collapsed: false,
                                                items: [],
                                            },
                                            {
                                                text: "Insane",
                                                link: "/pentest/htb/machines/linux/insane/index.md",
                                                collapsed: false,
                                                items: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                text: "Season 1",
                                link: "/pentest/htb/season1/index.md",
                            },
                            {
                                text: "Season 2",
                                link: "/pentest/htb/season2/index.md",
                            },
                            {
                                text: "Season 3",
                                link: "/pentest/htb/season3/index.md",
                            },
                            {
                                text: "Season 4",
                                link: "/pentest/htb/season4/index.md",
                            },
                            {
                                text: "Season 5",
                                link: "/pentest/htb/season5/index.md",
                            },
                            {
                                text: "Season 6",
                                link: "/pentest/htb/season6/index.md",
                            },
                            {
                                text: "Season 7",
                                link: "/pentest/htb/season7/index.md",
                            },
                            {
                                text: "Season 8",
                                link: "/pentest/htb/season8/index.md",
                            },
                            {
                                text: "Sherlocks",
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
