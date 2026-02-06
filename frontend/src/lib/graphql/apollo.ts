import { useAuthStore } from '@/stores/auth';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { Observable } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { SetContextLink } from '@apollo/client/link/context';
import { toast } from 'sonner';

const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql",
})

const decodeBase64Url = (value: string) => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
    const padding = normalized.length % 4
    const padded = padding ? normalized + '='.repeat(4 - padding) : normalized

    return atob(padded)
}

const isTokenInvalid = (token: string) => {
    const parts = token.split('.')
    if (parts.length !== 3) return true

    try {
        const payload = JSON.parse(decodeBase64Url(parts[1])) as { exp?: number }
        if (!payload?.exp) return false
        return payload.exp * 1000 < Date.now()
    } catch {
        return true
    }
}

// Middleware to add the authorization header to each request
const authLink = new SetContextLink((prevContext, _) => {
    const token = useAuthStore.getState().token

    if (token && typeof window !== 'undefined' && isTokenInvalid(token)) {
        logoutAndRedirect()
        return {
            headers: {
                ...prevContext.headers,
                authorization: "",
            },
        }
    }

    return {
        headers: {
            ...prevContext.headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    }

})

const shouldLogoutFromErrors = (errors?: readonly { message?: string; extensions?: Record<string, unknown> }[]) => {
    return (errors || []).some((err) => {
        const message = (err.message || '').toLowerCase()
        const code = (err.extensions?.code || '').toString().toLowerCase()

        return (
            message.includes('not authenticated') ||
            message.includes('invalid token') ||
            code === 'unauthenticated'
        )
    })
}

const LOGOUT_TOAST_COOLDOWN_MS = 3000
const LOGOUT_REDIRECT_DELAY_MS = 3000
let lastLogoutToastAt = 0

const logoutAndRedirect = () => {
    const { isAuthenticated, logout } = useAuthStore.getState()

    if (!isAuthenticated) return
    logout()

    const now = Date.now()
    if (now - lastLogoutToastAt > LOGOUT_TOAST_COOLDOWN_MS) {
        lastLogoutToastAt = now
        toast.error('Sua sessão expirou. Entre novamente.')
    }

    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        const delay = now - lastLogoutToastAt <= LOGOUT_TOAST_COOLDOWN_MS
            ? LOGOUT_REDIRECT_DELAY_MS
            : 0
        window.setTimeout(() => {
            window.location.replace('/')
        }, delay)
    }
}

type ApolloLinkError = {
    graphQLErrors?: readonly { message?: string; extensions?: Record<string, unknown> }[]
    networkError?: { statusCode?: number } | null
}

const errorLink = onError((error) => {
    const { graphQLErrors, networkError } = error as ApolloLinkError
    const shouldLogout = shouldLogoutFromErrors(graphQLErrors)

    const hasUnauthorizedStatus =
        typeof (networkError as { statusCode?: number } | null)?.statusCode === 'number' &&
        (networkError as { statusCode?: number }).statusCode === 401

    if (shouldLogout || hasUnauthorizedStatus) {
        logoutAndRedirect()
    }
})

const responseLink = new ApolloLink((operation, forward) => {
    if (!forward) {
        return new Observable((observer) => {
            observer.complete()
        })
    }

    return new Observable((observer) => {
        const subscription = forward(operation).subscribe({
            next: (response) => {
                const shouldLogout = shouldLogoutFromErrors(response.errors)

                if (shouldLogout) {
                    logoutAndRedirect()
                }

                observer.next(response)
            },
            error: (err) => observer.error(err),
            complete: () => observer.complete(),
        })

        return () => subscription.unsubscribe()
    })
})

export const apolloClient = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, responseLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'all',
        },
        query: {
            errorPolicy: 'all',
        },
    },
})
