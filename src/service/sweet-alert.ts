import Swal from "sweetalert2";

export const Toast = Swal.mixin({
  toast: true,
  position: "top",
  timer: 3000,
  showConfirmButton: false,
});

export const Modal = Swal.mixin({
  inputPlaceholder: "Aa",
  showCancelButton: true,
  showCloseButton: true,
});
