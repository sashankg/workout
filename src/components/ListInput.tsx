import { useEffect, useFormStatus, useRef } from 'react'
export default function ListInput({ }) {
  const ref = useRef<HTMLInputElement>()
  useEffect(() => {
    ref.current?.form?.addEventListener('formdata', (event) => {
      event.formData.append('exercise', { hello: 'world' })
    })
  }, [])
  return <div ref={ref}>
    <button type="button">Add</button>
  </div>
}
