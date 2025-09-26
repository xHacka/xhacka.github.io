import lightbox from "vitepress-plugin-lightbox";

// Pages
/// CTF
import ctf_ctftime from "./pages/ctf/ctftime.json";
import ctf_cmdchallenge from "./pages/ctf/cmdchallenge.json";
import ctf_overthewire from "./pages/ctf/overthewire.json";
import ctf_underthewire from "./pages/ctf/underthewire.json";
import ctf_promptriddle from "./pages/ctf/promptriddle.json";
import ctf_randoms from "./pages/ctf/randoms.json";
import ctf_root_me from "./pages/ctf/root_me.json";
import ctf_suninatas from "./pages/ctf/suninatas.json";
import ctf_webhacking_kr from "./pages/ctf/webhacking_kr.json";
import ctf_hackmyvm from "./pages/ctf/hackmyvm.json";

/// Red Team
import pentest_htb from "./pages/pentest/htb.json";
import pentest_vulnhub from "./pages/pentest/vulnhub.json";
import pentest_hackmyvm from "./pages/pentest/hackmyvm.json";

/// Blue Team
import soc_sherlocks from "./pages/soc/sherlocks.json";
import soc_kc_seven_cyber from "./pages/soc/kc_seven_cyber.json";

/// Cheatsheets
import cheatsheets_web from "./pages/cheatsheets/web.json";
import cheatsheets_linux from "./pages/cheatsheets/linux.json";
import cheatsheets_windows from "./pages/cheatsheets/windows.json";
import cheatsheets_etc from "./pages/cheatsheets/etc.json";

// https://vitepress.dev/reference/site-config
import { defineConfig } from "vitepress";
import { createLogger } from 'vite';

const logger = createLogger('warn');
const loggerWarn = logger.warn;
logger.warn = (msg, options) => {
  if (msg.includes('Some chunks are larger than')) { throw new Error(msg); }
  loggerWarn(msg, options);
};

export default defineConfig({
    title: "WoyAg's Blog",
    description:
        "A personal cybersecurity blog documenting raw notes, findings, and learning experiences. Exported from Obsidian as an evolving knowledge base.",
    srcDir: "src",
    cleanUrls: true,
    ignoreDeadLinks: "localhostLinks",
    lastUpdated: true,
    sitemap: {
        hostname: "https://xhacka.github.io",
    },
    themeConfig: {
        outline: "deep",
        search: {
            provider: "local",
        },
        nav: [
            {
                text: "Blog",
                link: "/",
            },
            {
                text: "Cheatsheets",
                link: "/cheatsheets/web/burp-sqli-cheatsheet",
            },
        ],
        sidebar: {
            "/": [
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
                            collapsed: true,
                            items: [...pentest_hackmyvm],
                        },
                    ],
                },
                {
                    text: "Defensive Security",
                    items: [...soc_sherlocks, ...soc_kc_seven_cyber],
                },
                {
                    text: "CTFs",
                    items: [
                        ...ctf_ctftime,
                        ...ctf_cmdchallenge,
                        ...ctf_overthewire,
                        ...ctf_underthewire,
                        ...ctf_promptriddle,
                        ...ctf_randoms,
                        ...ctf_root_me,
                        ...ctf_suninatas,
                        ...ctf_webhacking_kr,
                        ...ctf_hackmyvm,
                    ],
                },
            ],
            "/cheatsheets/": [
                ...cheatsheets_web,
                ...cheatsheets_linux,
                ...cheatsheets_windows,
                ...cheatsheets_etc,
            ],
        },
        socialLinks: [
            // {
            //     icon: "github",
            //     link: "https://github.com/xHacka/xhacka.github.io",
            // },
        ],
    },
    markdown: {
        config: (md) => {
            md.use(lightbox, {});
        },
    },
    build: {
        chunkSizeWarningLimit: 5124,
        sourcemap: false,
        minify: "esbuild",
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        if (id.includes("vue")) return "vendor-vue";
                        if (id.includes("recharts") || id.includes("chart")) return "vendor-charts";
                        return "vendor";
                    }
                },
            },
        },
    },
    customLogger: logger,
}); 