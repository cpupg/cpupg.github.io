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
      { text: "主页", link: "/" },
      { text: "学习笔记", link: "/notebook/" },
      { text: "技术文章", link: "/blog/" },
      { text: "面试", link: "/interview/" },
    ],

    sidebar: {
      "/notebook/": [
        {
          text: "学习笔记",
          items: [
            {
              text: "gradle",
              collapsed: true,
              items: [
                { text: "新手上路", link: "/notebook/gradle/" },
              ],
            },
          ],
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
          items: [
            { text: "java", link: "/interview/java" },
            { text: "rocketmq", link: "/interview/rocketmq" },
            { text: "数据库", link: "/interview/数据库" },
            { text: "mybatis", link: "/interview/mybatis" },
            { text: "spring", link: "/interview/spring" },
            { text: "分布式", link: "/interview/分布式" },
            { text: "zookeeper", link: "/interview/zookeeper" },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/cpupg" }],
  },
});
