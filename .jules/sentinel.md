## 2024-05-23 - [SanitizeUrl Default Insecurity]
**Vulnerability:** The `sanitizeUrl` utility allowed potentially dangerous schemes (like `javascript:`) when no options were provided, because `allowedSchemes` was undefined by default.
**Learning:** Utility functions for security must be "secure by default". Relying on the caller to provide a whitelist is risky if the default behavior is to allow everything.
**Prevention:** Always set safe defaults for security-sensitive options. Use explicit "allow all" flags if necessary, rather than implicit "allow all if undefined".
