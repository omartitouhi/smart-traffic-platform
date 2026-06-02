"use client";

import { Toaster, toast } from "sonner";

export function ToastViewport() {
  return (
    <Toaster
      richColors
      position="top-right"
      toastOptions={{
        className: "font-sans",
      }}
    />
  );
}

export const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
};
