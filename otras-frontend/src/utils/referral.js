/**
 * Referral Handling Utility
 * Manages the storage and retrieval of referral codes.
 */

const REFERRAL_KEY = 'referralCode';

export const referralUtil = {
  /**
   * Captures the referral code from the URL and stores it.
   * If a referral code exists in the URL, it overrides the stored one.
   */
  captureFromUrl: () => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem(REFERRAL_KEY, ref.toUpperCase());
      return ref.toUpperCase();
    }
    return null;
  },

  /**
   * Retrieves the stored referral code.
   */
  getStoredCode: () => {
    return localStorage.getItem(REFERRAL_KEY);
  },

  /**
   * Sets the referral code manually.
   */
  setStoredCode: (code) => {
    if (code) {
      localStorage.setItem(REFERRAL_KEY, code.toUpperCase());
    } else {
      localStorage.removeItem(REFERRAL_KEY);
    }
  },

  /**
   * Clears the stored referral code.
   */
  clearStoredCode: () => {
    localStorage.removeItem(REFERRAL_KEY);
  }
};
