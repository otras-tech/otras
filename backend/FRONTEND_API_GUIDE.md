# 📖 Frontend API Consumption Guide (OTRAS Backend)

**Version:** 1.0  
**Target Audience:** Frontend Developers (React/Next.js/Mobile)  
**Status:** Production OpenAPI 3.0 Standard Enabled

---

## 🚀 1. Accessing the Documentation
The backend automatically provides a lived-synced documentation portal based on the real source code.

*   **URL:** `http://localhost:4000/api/docs` (Local)
*   **Alternative Spec (JSON):** `http://localhost:4000/api/docs-json` (Useful for automated tools)

> [!TIP]
> Use the JSON spec URL with automated tools like **Swagger Codegen** or **OpenAPI Generator** to generate full TypeScript SDKs instantly.

---

## 🔐 2. Handling Authentication (JWT)
Most endpoints are protected by `JwtAuthGuard`. 

1.  **Obtain Token**: Use the `/api/v1/auth/login` endpoint.
2.  **Authorize in Swagger**: 
    *   Click the **"Authorize"** button at the top right of the Swagger UI.
    *   Paste your `accessToken` into the value field.
    *   Click "Authorize" and then "Close".
3.  **Automatic Inclusion**: Swagger will now automatically include the `Authorization: Bearer <token>` header in all subsequent "Try it out" requests.

---

## 🛠️ 3. How to Use the Endpoints
For every endpoint, you can see two critical sections:

### A. Request Schema
Check the **"Request body"** section to see:
*   **Required Fields**: Marked with a red asterisk.
*   **Data Types**: Strings, Numbers, Booleans, or nested Objects.
*   **Constraints**: (e.g., `minLength`, `maxAmount`, `email` format).

### B. Response Schema
Check the **"Responses"** -> **"200 OK"** section to see:
*   **Success Status**: All our successful responses are wrapped in a standard structure:
    ```json
    {
      "success": true,
      "data": { ... your requested data ... }
    }
    ```
*   **Error Statuses**: 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found).

---

## ⚡ 4. Recommended Frontend Workflow
Instead of manually typing every API call, we recommend the following automated approach:

### Option A: Manual Typing (Not Recommended for Scale)
Manual mapping of the Swagger DTOs to TypeScript interfaces in your `src/types/api.ts`.

### Option B: Swagger TypeScript API (Recommended)
Run this command in your frontend root to generate all models and API calls instantly:
```bash
npx swagger-typescript-api -p http://localhost:4000/api/docs-json -o ./src/api -n myApi.ts
```

### Option C: React Query + Hey-API
For high-performance state management:
```bash
npx @hey-api/openapi-ts -i http://localhost:4000/api/docs-json -o src/client
```

---

## 🚦 5. Pagination Standard
All list endpoints (e.g., `/users`, `/payments`) support cursor-based pagination for high performance:
*   **Query Params**: `cursor` (ID of last item) and `take` (limit).
*   **Response**: Includes `nextCursor` and `hasNextPage` booleans.
*   **Hard Cap**: The backend enforces a maximum of 100 items per request to ensure UI responsiveness.

---
*End of Guide*
