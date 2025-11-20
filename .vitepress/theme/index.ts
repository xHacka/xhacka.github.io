import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import "./custom_containers.css";
import "./custom_title.css";
import googleAnalytics from "vitepress-plugin-google-analytics";

export default {
    ...DefaultTheme,
    ...Layout,
    enhanceApp: () => {
        googleAnalytics({
            id: "G-6XT8WV8JH8",
        });
    },
};
