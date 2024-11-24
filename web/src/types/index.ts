export type Course = {
  slug: string,
  name: string
}

export type Teacher = {
  name: string
  email: string
}

export type Partner = {
  id: string
  name: string
}

export enum ProjetStatus {
  "active",
  "disabled"
}

export enum ProjetStatusLabel {
  active = "Ativo",
  disabled = "Inativo"
}

export type Project = {
  courses: Course[],
  responsibles: Teacher[]
  name: string
  partner: Partner
  slug: string
  hours: number
  status: ProjetStatus
}

