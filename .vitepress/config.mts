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
      { text: "学习笔记", link: "/notebook/gradle/" },
      { text: "文章", link: "/article/ffmpeg" },
    ],

    sidebar: {
      "/notebook/": [
        {
          text: "gradle",
          collapsed: true,
          items: [{ text: "新手速成", link: "/notebook/gradle/" }],
        },
      ],
      "/article/": [
        {
          text: "ffmpeg",
          link: "/article/ffmpeg",
        },
        {
          text: "firefox",
          link: "/article/firefox",
        }
      ]
    },

    socialLinks: [{ icon: "github", link: "https://github.com/cpupg" }],
  },
});
