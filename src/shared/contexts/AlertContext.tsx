import React, { createContext, useContext, useState, useCallback } from 'react';
import Alert from '@/shared/components/Alert';

interface AlertOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  customButtons?: Array<{
    text: string;
    onClick: () => void;
    className?: string;
  }>;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  closeAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [alertOptions, setAlertOptions] = useState<AlertOptions>({
    message: '',
  });

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertOptions(options);
    setIsOpen(true);
  }, []);

  const closeAlert = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}
      <Alert
        open={isOpen}
        onClose={closeAlert}
        title={alertOptions.title}
        message={alertOptions.message}
        confirmText={alertOptions.confirmText}
        cancelText={alertOptions.cancelText}
        onConfirm={alertOptions.onConfirm}
        onCancel={alertOptions.onCancel}
        customButtons={alertOptions.customButtons}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
