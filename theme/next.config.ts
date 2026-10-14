import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const nextConfig: NextConfig = {
  // The theme lives inside a workspace that contains other lockfiles; pin the
  // tracing root here so Next doesn't infer the home directory as the root
  // (which triggers the "multiple lockfiles" warning and mis-scoped tracing).
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
};

export default nextConfig;
