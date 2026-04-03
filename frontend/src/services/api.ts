const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.adscroll360.com';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API request failed: ${response.statusText}`);
    }

    return response.json();
}

export const api = {
    login: async (credentials: any) => fetchWithAuth('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),

    tasks: {
        list: async () => fetchWithAuth('/api/tasks'),
        create: async (data: any) => fetchWithAuth('/api/tasks', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        updateStatus: async (id: string, status: string) => fetchWithAuth(`/api/tasks/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        })
    },

    companies: {
        list: async () => fetchWithAuth('/api/companies'),
        create: async (data: any) => fetchWithAuth('/api/companies', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        analytics: async () => fetchWithAuth('/api/companies/analytics')
    },

    users: {
        create: async (data: any) => fetchWithAuth('/api/users', {
            method: 'POST',
            body: JSON.stringify(data)
        })
    },

    stripe: {
        createCheckout: async (planType: string) => fetchWithAuth('/api/stripe/create-checkout', {
            method: 'POST',
            body: JSON.stringify({ planType })
        })
    }
};
