import { useEffect } from 'react';

export const useClickOutside = (
    ref: React.RefObject<HTMLDivElement>,
    hide: React.Dispatch<React.SetStateAction<boolean>>,
): void => {
    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (ref.current && !ref.current.contains(<HTMLDivElement>event.target)) {
                hide(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, hide]);
};
