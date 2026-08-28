const appConfig = {
  app: {
    name: "Electron App",
    logo: "./logo.png",
    shortName: "App",
    description: "An Electron application built with @imksh/create",
    version: "1.0.0",
    author: "imksh",
  },

  api: {
    baseURL: import.meta.env.VITE_API_URL as string,
    timeout: 30000,
  },

  routes: {
    home: "/",
    login: "/login",
    profile: "/profile",
  },

  pagination: {
    pageSize: 10,
  },

  github: {
    repository: "",
  },

  social: {
    website: "",
    linkedin: "",
    github: "",
    twitter: "",
  },

  features: {
    darkMode: true,
    notifications: true,
    sidebar: true,
    electron: true,
    customTitleBar: true,
  },

  electron: {
    tray: true,
    autoUpdater: false,
  },
} as const;

export type AppConfig = typeof appConfig;
export default appConfig;
