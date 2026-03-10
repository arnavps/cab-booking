export const clerkClient = {
    users: {
        getUser: async (id: string) => ({ id, emailAddresses: [] }),
        updateUser: async (id: string, data: any) => ({ id, ...data }),
    }
};
