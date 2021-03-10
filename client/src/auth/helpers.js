import M from "materialize-css";

// const toastElement = document.querySelector(".toast");
// if (toastElement) {
//   const toastInstance = M.Toast.getInstance(toastElement);
//   toastInstance.dismiss();
// }
// or
// M.Toast.dismissAll();

export const myToaster = (msg, color, bg = "") => {
  M.Toast.dismissAll();
  return M.toast({
    html: `<span class="${color}-text">${msg}</span><button onClick={M.Toast.dismissAll()} class="btn-flat red-text toast-action">Undo</button>`,
    classes: "rounded",
  });
};
