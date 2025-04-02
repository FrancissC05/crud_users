export interface JwtPayload {
    id: number; 
    username: string;
    email?: string;
    roles: {
        id: number;
        name: string;
        permissions?: string[];
    }[];
    iat?: number;
    exp?: number;
}