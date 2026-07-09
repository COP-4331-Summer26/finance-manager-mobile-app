import { createContext, useContext, useState, useCallback, useRef } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const ConfirmContext = createContext(null);

// One <ConfirmModal /> lives here for the whole app. Any screen calls
// `const confirm = useConfirm(); await confirm({ title, message })`
// and gets back true/false. Mirrors the web app's single shared
// delete-confirmation modal.
export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ visible: false, title: '', message: '' });
  const resolver = useRef(null);

  const confirm = useCallback(({ title, message }) => {
    setState({ visible: true, title, message });
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    setState((s) => ({ ...s, visible: false }));
    resolver.current?.(true);
  };

  const handleCancel = () => {
    setState((s) => ({ ...s, visible: false }));
    resolver.current?.(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmModal
        visible={state.visible}
        title={state.title}
        message={state.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);
