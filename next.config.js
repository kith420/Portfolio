/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The encrypted resume is read from disk at request time, so it has to be
  // shipped with the route that serves it.
  outputFileTracingIncludes: {
    "/resume/file": ["./private/resume.pdf.enc"],
  },
};

module.exports = nextConfig;
