
// Import lightbox plugin
import lightbox from "vitepress-plugin-lightbox";

// Import Pages
import ctf_ctftime from './pages/ctf/ctftime.json'
import ctf_cmdchallenge from './pages/ctf/cmdchallenge.json';
import ctf_overthewire from './pages/ctf/overthewire.json';
import ctf_promptriddle from './pages/ctf/promptriddle.json'
import ctf_randoms from './pages/ctf/randoms.json'
import ctf_root_me from './pages/ctf/root_me.json'
import ctf_suninatas from './pages/ctf/suninatas.json'
import ctf_webhacking_kr from './pages/ctf/webhacking_kr.json'
import ctf_hackmyvm from './pages/ctf/hackmyvm.json'

import pentest_htb from './pages/pentest/htb.json'
import pentest_vulnhub from './pages/pentest/vulnhub.json'
import pentest_hackmyvm from './pages/pentest/hackmyvm.json'
import pentest_sherlocks from './pages/soc/sherlocks.json'

// https://vitepress.dev/reference/site-config
import { defineConfig } from "vitepress";

export default defineConfig({
    title: "WoyAg's Blog",
    description: "A personal cybersecurity blog documenting raw notes, findings, and learning experiences. Exported from Obsidian as an evolving knowledge base.",
    srcDir: "src",
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
                text: "CTF",
                items: [
                    ...ctf_ctftime, 
                    ...ctf_cmdchallenge,
                    ...ctf_overthewire,
                    ...ctf_promptriddle,
                    ...ctf_randoms,
                    ...ctf_root_me,
                    ...ctf_suninatas,
                    ...ctf_webhacking_kr,
                    ...ctf_hackmyvm,
                ],
            },
            {
                text: "Offensive Security",
                items: [
                    {
                        text: "HackTheBox",
                        collapsed: true,
                        items: [...pentest_htb],
                    },
                    {
                        text: "VulnHub",
                        collapsed: true,
                        items: [...pentest_vulnhub],
                    },
                    {
                        text: "HackMyVM",
                        collapsed: false,
                        items: [...pentest_hackmyvm],
                    },
                ],
            },
            {
                text: "Defensive Security",
                items: [
                    {
                        text: "Sherlocks",
                        collapsed: true,
                        items: [...pentest_sherlocks],
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
    markdown: {
        config: (md) => {
            // Use lightbox plugin
            md.use(lightbox, {});
        },
    },
});
