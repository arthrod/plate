## 2024-05-23 - [Input Validation for Registry Templates]
**Vulnerability:** Registry template API routes (`apps/www/src/registry/app/api/ai/...`) lacked input validation, potentially causing runtime errors or resource exhaustion if invalid payloads were sent.
**Learning:** Even "template" code distributed via a registry is critical security infrastructure, as users copy-paste it into their production apps. Validating input at the earliest boundary (API route handler) is essential.
**Prevention:** Always use a validation library like `zod` to parse and validate `req.json()` before accessing properties, especially in code intended for distribution.
## 2024-05-23 - [Zod Version Consistency for Edge Runtime]
**Vulnerability:** Inconsistent `zod` versions between workspace root (v4) and apps (v3) caused Cloudflare Workers build failures due to runtime type mismatches.
**Learning:** Edge Runtime environments are highly sensitive to dependency version mismatches. Ensuring all workspace packages use aligned versions of core libraries like `zod`, `react`, etc., is critical for successful builds.
**Prevention:** Regularly audit workspace dependencies to ensure alignment with the root `package.json`, especially for libraries used in shared code or build scripts.
## 2024-05-23 - [Incompatible Zod Versions in Shared Code]
**Vulnerability:** Runtime Zod validation in `rehype-utils.ts` using schemas from `shadcn/registry` (Zod v3) caused CI failures when the application forced Zod v4, likely due to internal incompatibilities or mixed usage.
**Learning:** When consuming external libraries that export Zod schemas, be wary of version mismatches. If strict runtime validation is not critical for build-time tools, consider falling back to static type assertions to avoid fragility.
**Prevention:** Avoid calling `.parse()` or `.safeParse()` on schemas imported from dependencies with potential version conflicts. Use `z.infer<>` or manual type assertions instead.
