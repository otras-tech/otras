/**
 * Dynamically loads a script by adding a script tag to the document head.
 * @param {string} src - The URL of the script to load.
 * @returns {Promise<void>} - Resolves when the script is loaded.
 */
export const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};
