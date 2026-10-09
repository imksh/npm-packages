const appConfig = {
  app: {
    name: "React App",
    logo: "./logo.png",
    shortName: "React",
    description: "A React application built with @imksh/create",
    version: "1.0.0",
    author: "Karan Sharma",
  },

  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
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