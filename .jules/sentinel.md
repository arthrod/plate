## 2025-02-23 - Secure Defaults in Registry Templates
**Vulnerability:** AI API route templates included a fallback to a server-side environment variable (`AI_GATEWAY_API_KEY`) if the client didn't provide a key. This created an "Open Proxy" risk where anyone deploying the template (or the demo site itself) could have their quota abused by unauthenticated requests.
**Learning:** Convenience features in templates (like falling back to a demo key) can become critical vulnerabilities when users copy-paste code without understanding the implications.
**Prevention:** Ensure templates are "secure by default". Force users to explicitly configure authentication or keys rather than providing insecure fallbacks. Use comments to guide them to the secure path.
