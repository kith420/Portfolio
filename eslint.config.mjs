import coreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...(Array.isArray(coreWebVitals) ? coreWebVitals : [coreWebVitals]),
  {
    ignores: [".next/**", "node_modules/**", "reference/**"],
  },
];

export default config;
