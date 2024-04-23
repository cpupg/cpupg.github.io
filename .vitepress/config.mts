import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "cpupg的个人博客",
  description: "cpupg@github的个人博客",
  srcDir: "docs",
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "主页", link: "/" },
      { text: "学习笔记", link: "/notebook/" },
      { text: "技术文章", link: "/blog/" },
      { text: "面试", link: "/interview/" },
    ],

    sidebar: {
      "/notebook/": [
        {
          text: "学习笔记",
          items: [],
        },
      ],
      "/blog/": [
        {
          text: "技术文章",
          items: [],
        },
      ],
      "/interview/": [
        {
          text: "面试",
          items: [],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
