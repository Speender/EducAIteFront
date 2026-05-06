export const TOAST_EVENT = "SHOW_SUCCESS_TOAST";

export function dispatchSuccessToast(message: string) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message } }));
}
