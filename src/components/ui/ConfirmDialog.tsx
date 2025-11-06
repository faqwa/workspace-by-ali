import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

/**
 * ConfirmDialog component for confirming destructive or important actions
 *
 * Usage:
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={() => {
 *     // Perform action
 *     setIsOpen(false);
 *   }}
 *   title="Delete Project?"
 *   message="This action cannot be undone. All data will be permanently deleted."
 *   variant="danger"
 * />
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  // Icon based on variant
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-error"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-warning"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        );
      case 'info':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-info"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
        );
    }
  };

  // Button classes based on variant
  const getConfirmButtonClasses = () => {
    switch (variant) {
      case 'danger':
        return 'btn bg-error hover:bg-error/90 text-white border-0';
      case 'warning':
        return 'btn bg-warning hover:bg-warning/90 text-white border-0';
      case 'info':
        return 'btn bg-[#22c55e] hover:bg-[#16a34a] text-white border-0';
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Dialog Panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-base-100 p-6 shadow-xl transition-all">
                {/* Icon and Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 mt-1">{getIcon()}</div>
                  <div className="flex-1">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-base-content"
                    >
                      {title}
                    </Dialog.Title>
                  </div>
                </div>

                {/* Message */}
                <Dialog.Description className="text-sm text-base-content/70 mb-6 pl-10">
                  {message}
                </Dialog.Description>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    className={getConfirmButtonClasses()}
                    onClick={handleConfirm}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Loading...
                      </>
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
