export interface User {
    userName: string;
    userEmail: string;
    auth0_user_id: string;
    registeredAt: Date;
    lastLogin: Date;
    mobile: string;
    status: string;
    dateOfBirth: Date;
    address: {
        city: string;
        street: string;
        num: number;
    };
}
