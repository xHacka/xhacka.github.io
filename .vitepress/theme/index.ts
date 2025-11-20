import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import "./custom_containers.css";
import "./custom_title.css";

export default {
  extends: DefaultTheme,
  Layout,
};