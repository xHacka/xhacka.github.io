
// Import lightbox plugin
import lightbox from "vitepress-plugin-lightbox";

// Import Pages
import pages_ctf from './pages/ctf.json'
import pages_htb from './pages/htb.json'
import pages_vulnhub from './pages/vulnhub.json'
import pages_hackmyvm from './pages/hackmyvm.json'
import pages_sherlocks from './pages/sherlocks.json'

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
                items: [...pages_ctf],
            },
            {
                text: "Offensive Security",
                items: [
                    {
                        text: "HackTheBox",
                        collapsed: true,
                        items: [...pages_htb],
                    },
                    {
                        text: "VulnHub",
                        collapsed: true,
                        items: [...pages_vulnhub],
                    },
                    {
                        text: "HackMyVM",
                        collapsed: false,
                        items: [...pages_hackmyvm],
                    },
                ],
            },
            {
                text: "Defensive Security",
                items: [
                    {
                        text: "Sherlocks",
                        collapsed: true,
                        items: [...pages_sherlocks],
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
