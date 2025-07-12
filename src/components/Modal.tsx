import { PropsWithChildren, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";

export default function Modal({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    // to show backdrop
    ref.current?.showModal();
  }, []);

  const handleClose = () => {
    // checks if we navigated from outside the app
    if (location.key === "default") {
      navigate("..", { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <dialog
      ref={ref}
      onSubmit={(e) => {
        if (!e.defaultPrevented) {
          handleClose();
        }
        e.preventDefault();
      }}
      onClose={handleClose}
    >
      <button onClick={handleClose}>Close</button>
      {children}
    </dialog>
  );
}
