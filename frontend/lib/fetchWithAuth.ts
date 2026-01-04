const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchWithAuth(url: string, options: RequestInit = {}, requireAuth = true) {
    const headers = new Headers(options.headers || {});

    if ((options.method === 'POST' || options.method === 'PUT') && options.body && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }
    
    const requestOptions = {
        ...options,
        headers,
        credentials: 'include' as RequestCredentials, // Include cookies with the request
    };

    let response = await fetch(`${BASE_URL}${url}`, requestOptions);

    if (response.status === 401) {
        if (requireAuth) {
            const currentUrl = window.location.pathname + window.location.search + window.location.hash;
            window.location.href = `/auth/login?next=${encodeURIComponent(currentUrl)}`;
            throw new Error('Authentication required');
        } else {
            // For optional auth, just return the response without redirecting
            return response;
        }
    }

    return response;
}

const api = {
    get: (url: string, requireAuth = true) => fetchWithAuth(url, {}, requireAuth),

    post: (url: string, data?: any, requireAuth = true) => fetchWithAuth(url, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
    }, requireAuth),

    postFormData: (url: string, formData: FormData, requireAuth = true) => fetchWithAuth(url, {
        method: 'POST',
        body: formData,
    }, requireAuth),

    put: (url: string, data?: any, requireAuth = true) => fetchWithAuth(url, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
    }, requireAuth),

    delete: (url: string, requireAuth = true) => fetchWithAuth(url, {
        method: 'DELETE',
    }, requireAuth),
};

export default api;