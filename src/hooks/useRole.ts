import { useAppSelector } from 'store/store';

interface ReturnType {
    isWorker?: boolean;
    isManager?: boolean;
    isAdmin?: boolean;
    isStaff?: boolean;
}

export const useRole = (): ReturnType => {
    const { user } = useAppSelector((state) => state.user);

    return {
        isWorker: user?.is_worker,
        isManager: user?.is_staff,
        isAdmin: user?.is_superuser,
        isStaff: user?.is_staff || user?.is_superuser
    };
};
