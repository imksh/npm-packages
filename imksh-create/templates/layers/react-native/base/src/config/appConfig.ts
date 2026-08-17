const appConfig = {
  app: {
    name: "Mobile App",
    logo: "@assets/images/logo/logo.png",
    shortName: "Mobile App",
    description: "A mobile application built with @imksh/create",
    version: "1.0.0",
    author: "Karan Sharma",
  },

  api: {
    baseURL: process.env.EXPO_PUBLIC_API_URL,
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