## 2024-05-23 - [Input Validation for Registry Templates]
**Vulnerability:** Registry template API routes (`apps/www/src/registry/app/api/ai/...`) lacked input validation, potentially causing runtime errors or resource exhaustion if invalid payloads were sent.
**Learning:** Even "template" code distributed via a registry is critical security infrastructure, as users copy-paste it into their production apps. Validating input at the earliest boundary (API route handler) is essential.
**Prevention:** Always use a validation library like `zod` to parse and validate `req.json()` before accessing properties, especially in code intended for distribution.
