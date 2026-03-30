import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

export const useOtrCheck = () => {
    const { user } = useAuthStore();
    const [isOtrModalOpen, setIsOtrModalOpen] = useState(false);

    /**
     * Checks if the user has an OTR ID.
     * If not, it opens the OtrRequiredModal.
     * @returns boolean true if the user HAS OTR ID, false otherwise.
     */
    const checkOtr = useCallback(() => {
        if (!user || (!user.otrId && !localStorage.getItem('user_otr_generated'))) {
            setIsOtrModalOpen(true);
            return false;
        }
        return true;
    }, [user]);

    const closeOtrModal = () => setIsOtrModalOpen(false);

    return { 
        checkOtr, 
        isOtrModalOpen, 
        closeOtrModal 
    };
};
