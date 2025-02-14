import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "cpupg的个人博客",
  description: "cpupg@github的个人博客",
  srcDir: "docs",
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    search: {
      provider: "local",
    },
    outline: {
      level: [1, 6],
      label: "目录",
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "笔记", link: "/notebook/gradle/" },
      { text: "文章", link: "/article/" },
    ],

    sidebar: {
      "/notebook/": [
        {
          text: "gradle",
          collapsed: true,
          items: [{ text: "hello world", link: "/notebook/gradle/" }],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/cpupg" }],
  },
});
