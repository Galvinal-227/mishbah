import { useEffect } from 'react';

/**
 * Daftarkan keyboard shortcut global.
 * shortcut: { key: 'k', ctrl: true, shift: false, alt: false, meta: true, allowInInput: false }
 */
export function useKeyboardShortcut(shortcut, callback) {
  useEffect(() => {
    const {
      key,
      ctrl = false,
      shift = false,
      alt = false,
      meta = false,
      allowInInput = false,
    } = shortcut;

    const handler = (e) => {
      if (!allowInInput) {
        const target = e.target;
        const tag = target?.tagName?.toLowerCase();
        const isEditable =
          tag === 'input' ||
          tag === 'textarea' ||
          tag === 'select' ||
          target?.isContentEditable;
        if (isEditable && !e.ctrlKey && !e.metaKey) return;
      }

      const keyMatch = e.key?.toLowerCase() === key.toLowerCase();
      const ctrlMatch = ctrl ? e.ctrlKey || e.metaKey : true;
      const shiftMatch = shift ? e.shiftKey : true;
      const altMatch = alt ? e.altKey : true;
      const metaMatch = meta ? e.metaKey : true;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
        e.preventDefault();
        callback(e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcut, callback]);
}

export default useKeyboardShortcut;