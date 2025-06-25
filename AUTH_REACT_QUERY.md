# React Query Authentication System

This project now uses React Query for efficient, shared authentication state management. The authentication state is loaded once and shared across all components.

## Key Components

### 1. `useAuth()` Hook

The main authentication hook that provides:

- User state (shared across all components)
- Loading state
- Login/logout functions
- Authentication status helpers

```tsx
import { useAuth } from "@/hooks/use-auth"

function MyComponent() {
  const { user, loading, isAuthenticated, isAdmin, login, logout } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please login</div>

  return <div>Welcome, {user.email}!</div>
}
```

### 2. Query Provider

Added to the root layout to provide React Query functionality:

```tsx
// In app/layout.tsx
<QueryProvider>
  <Navbar />
  {children}
  <Footer />
  <Toaster />
</QueryProvider>
```

### 3. AuthStateProvider (Optional)

For pages that need to wait for auth state before rendering:

```tsx
import { AuthStateProvider } from "@/components/auth/auth-state-provider"

function ProtectedPage() {
  return (
    <AuthStateProvider>
      <YourProtectedContent />
    </AuthStateProvider>
  )
}
```

## Benefits of React Query Implementation

1. **Single Source of Truth**: User state is fetched once and cached
2. **Automatic Refetching**: Smart refetching on window focus, reconnection
3. **Optimistic Updates**: Login/logout updates cache immediately
4. **Better Error Handling**: Proper error states and retry logic
5. **Performance**: No redundant API calls across components
6. **Background Updates**: Auth state stays fresh automatically

## Authentication Flow

1. User visits the app
2. React Query fetches user state from `/api/auth/me`
3. State is cached and shared across all components
4. Login/logout mutations update the cache immediately
5. All components using `useAuth()` react to state changes instantly

## Migration from useAuthSimple

All components have been updated to use the new `useAuth()` hook instead of `useAuthSimple()`. The API is nearly identical, but now powered by React Query for better performance and state management.

## Global Loading States

Use `useGlobalLoading()` or `useIsAppLoading()` for app-wide loading indicators:

```tsx
import { useIsAppLoading } from "@/hooks/use-global-loading"

function App() {
  const isLoading = useIsAppLoading()

  if (isLoading) {
    return <GlobalLoadingScreen />
  }

  return <YourApp />
}
```
