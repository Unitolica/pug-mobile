import { useParams } from "react-router-dom"

export default function CoursesDetailPage () {
  const { cslug } = useParams()
  if (!cslug) return null;

  return (
    <>
      <h1 className="text-red-500">Detalhe {cslug}</h1>
    </>
  )
}
