import { PropsWithChildren, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Modal({ children }: PropsWithChildren) {
  const navigate = useNavigate()
  const location = useLocation()
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    // to show backdrop
    ref.current?.showModal()
  }, [])

  return <dialog
    className="modal"
    ref={ref}
    onSubmit={() => ref.current?.close()}
    onClose={
      () => {
        // checks if we navigated from outside the app
        if (location.key === 'default') {
          navigate('..', { replace: true });
        } else {
          navigate(-1);
        }
      }}>
    {children}
  </dialog>
}
