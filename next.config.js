/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The encrypted resume is read from disk at request time, so it has to be
  // shipped with the route that serves it.
  outputFileTracingIncludes: {
    "/resume/file": ["./private/resume.pdf.enc"],
  },
  // The sections live on the home page as anchors; these let a clean path like
  // kith14.com/work land on its section. Temporary, so a section can become a
  // real page later without browsers holding on to the old redirect.
  async redirects() {
    const sections = {
      experience: "exp",
      competitions: "comp",
      work: "work",
      projects: "work",
      skills: "skills",
      contact: "contact",
    };
    return Object.entries(sections).map(([path, id]) => ({
      source: `/${path}`,
      destination: `/#${id}`,
      permanent: false,
    }));
  },
};

module.exports = nextConfig;
