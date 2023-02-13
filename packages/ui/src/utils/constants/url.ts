const { REACT_APP_ENV: APP_ENV } = process.env;

const getUrl = (env: string | undefined) => {
  switch (env) {
    case "development":
      return "http://localhost:3000";
    case "staging":
      return "https://dev-gigchain.vercel.app";
    case "production":
      return "https://gigchain.vercel.app";
    default:
      return "http://localhost:3000";
  }
}

export const APP_URL = getUrl(APP_ENV);