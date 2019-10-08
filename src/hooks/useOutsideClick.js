import { useEffect } from 'react';

/**
 * Informs if a click outside the selected ref is done.
 * @param {React.reference} selectedRef - Reference to the component
 * @param {func} callback - A callback function to run if user clicked outside the component
 * @param {React.reference} excludedRef - Second reference to another component to be excluded from
 */
const useOutsideClick = (selectedRef, callback, excludedRef) => {
  const handleOutsideClick = event => {
    if (
      selectedRef.current &&
      !selectedRef.current.contains(event.target) &&
      (!excludedRef || (excludedRef.current && !excludedRef.current.contains(event.target)))
    ) {
      callback(event);
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('mousedown', handleOutsideClick);
      }
    };
    // eslint-disable-next-line
  }, []);
};

export default useOutsideClick;
