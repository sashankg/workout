import { useLoaderData as useLoaderDataInternal } from "react-router-dom"
export default function useLoaderData<T extends () => Promise<unknown>>() {
  return useLoaderDataInternal() as Awaited<ReturnType<T>>
}
