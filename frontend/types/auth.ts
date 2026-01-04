// User type matching backend UserResponse
export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Auth request/response types
export interface SignupRequest {
    username: string;
    email: string;
    full_name: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface SignupResponse {
    user: User;
    token: TokenResponse;
}