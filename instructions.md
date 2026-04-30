# Backend Instructions & Guidelines

This document outlines the standard practices, architectural patterns, and conventions used in this backend codebase. When contributing to or iterating on this project, please adhere to these guidelines.

## 1. Folder Structure

The project follows a localized, modular, and domain-driven folder architecture:
- **`src/`**: The root directory for all source code.
  - **`app.ts`**: Express application setup, global middlewares, and root routing.
  - **`server.ts`**: Application entry point, server bootstrap, database/socket initialization, and graceful shutdown handling.
  - **`app/modules/`**: Contains domain-specific modules (e.g., `auth`, `user`, `club`). Each module encapsulates its own routes, controllers, services, interfaces, and validations.
  - **`app/routes/index.ts`**: The centralized router that aggregates all module-level routes.
  - **`app/middlewares/`**: Global middlewares such as `globalErrorHandler.ts` and `notFound.ts`.
  - **`app/shared/`**: Common reusable utilities (e.g., `catchAsync.ts`, `sendResponse.ts`).
  - **`config/`**: Environment variable configurations.
  - **`helpers/`**: Helper files (like `jwtHelper.ts`, `prisma.ts`).
  - **`types/`**: Global type declarations.

## 2. Naming Conventions

- **Modules**: Module folders use `camelCase` and are typically named as singular nouns (e.g., `jobOffer`, `auth`).
- **File Names**: Files inside a module follow a structured pattern: `[moduleName].[type].ts`.
  - e.g., `user.controller.ts`, `user.service.ts`, `user.route.ts`, `user.validation.ts`, `user.interface.ts`.
- **Exports**: Major logic chunks (controllers, services, validations) are grouped into objects and exported with `PascalCase` names (e.g., `export const UserController = { ... }`).
- **Imports (ESM Requirement)**: Local file imports **MUST** include the `.js` extension (e.g., `import { UserService } from "./user.service.js";`).

## 3. Type Safety & Coding Standards

The codebase enforces strict type safety:
- **Interfaces First**: Always define TypeScript interfaces/types in `[moduleName].interface.ts` before implementing services or controllers.
- **Exact Type Validation**: Avoid `any`. Use specific interfaces for function parameters and return types.
- **Zod Validation**: Use Zod for runtime request body validation. Schemas in `[moduleName].validation.ts` should NOT include the `body: z.object` wrapper; the `validateRequest` middleware handles the structure.
- **Prisma Types**: Utilize Prisma's auto-generated types for database operations where possible.

## 4. Pathing

- **Base URL Imports**: `tsconfig.json` allows absolute imports starting from `src/` (e.g., `import config from "src/config/index.js";`).
- **IMPORTANT**: **Always append `.js`** to the end of relative and absolute local file imports.

## 5. Routing

- **Centralized Routing**: All module routes must be registered in `src/app/routes/index.ts` within the `moduleRoutes` array.
- **Base Endpoint**: The centralized `router` is mounted in `app.ts` under the base path `/api/v1`.

## 6. File Upload Handling

For endpoints requiring file uploads (e.g., images, documents):
- **Middleware**: Use `fileUploadHandler()` middleware in the route definition.
- **Payload**: Clients should send data as `multipart/form-data`.
- **Controller Logic**: 
  - If the payload includes a JSON-stringified `data` field, parse it: `req.body.data = JSON.parse(req.body.data)`.
  - Use `getSingleFilePath(req.files, 'image')` or `getMultipleFilesPath(req.files, 'image')` to extract file paths.
  - Assign extracted paths to the appropriate fields in `req.body.data` or `req.body`.

## 7. Searching, Filtering, and Pagination

For endpoints returning multiple records:
- **Pick Helper**: Use the `pick` helper to extract filterable fields and pagination options from `req.query`.
- **Constants**: Define `filterableFields` and `searchableFields` in `[moduleName].constant.ts`. Use `paginationFields` from a shared constant file or define it locally to include `['page', 'limit', 'sortBy', 'sortOrder']`.
- **Pagination Helper**: Use `paginationHelper.calculatePagination(options)` in the service layer to get `limit`, `page`, `skip`, `sortBy`, and `sortOrder`.
- **Response Structure**: Always return data wrapped in `IGenericResponse<T>` (defined in `src/types/common.ts`) which includes `meta` (total, page, limit) and `data`.

## 8. Development Workflow

To check for type errors:
```bash
npm run build
# or
npx tsc --noEmit
```

## 9. Creating a New Module (Generic Workflow)

To create a new module, follow these steps in order:

1.  **Create Module Directory**: `src/app/modules/[moduleName]`.
2.  **Define Interfaces**: Create `[moduleName].interface.ts`. Define all DTOs (Data Transfer Objects) and payloads.
3.  **Define Zod Validations**: Create `[moduleName].validation.ts`. Define schemas for create/update operations.
4.  **Implement Service Layer**: Create `[moduleName].service.ts`. Use the interfaces defined in step 2. Implement business logic and DB interactions.
5.  **Implement Controller Layer**: Create `[moduleName].controller.ts`. Use `catchAsync()` for error handling and `sendResponse()` for consistent API responses.
6.  **Define Routes**: Create `[moduleName].route.ts`. Use `auth()` middleware for protection and `validateRequest()` for Zod validation (unless using `formData` for file uploads).
7.  **Handle Files**: If the module requires file uploads, integrate `fileUploadHandler()` and update the controller to process `req.files`.
8.  **Register Route**: Add the new route to `src/app/routes/index.ts`.

Example Route Registration:
```typescript
import { NewModuleRouter } from "../modules/newModule/newModule.route.js";
const moduleRoutes = [
  { path: "/new-module", route: NewModuleRouter },
];
```

## 10. Admin & User Module Patterns

- **getMe**: All modules providing a "profile" should implement a `getMe` service that accepts a `JwtPayload` and returns the profile including relevant relations (e.g., `Player`, `Club`, `Coach`).
- **Admin Access**: Admin-only list views must implement searching (via `searchTerm` on `OR` conditions) and filtering (via exact matches on `AND` conditions).
