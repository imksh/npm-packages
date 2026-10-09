const appConfig = {
  app: {
    name: "My App",
    logo: "./logo.png",
    shortName: "App",
    description: "A React application built with @imksh/create",
    version: "1.0.0",
    author: "",
  },

  api: {
    baseURL: import.meta.env.VITE_API_URL,
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
  },
};

export default appConfig;