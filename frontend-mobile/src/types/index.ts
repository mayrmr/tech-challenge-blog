export type Perfil = "professor" | "aluno";

export interface User {
  _id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  createdAt?: string;
  updatedAt?: string;
}

export interface Anexo {
  nome: string;
  caminho: string;
}

export interface Post {
  _id: string;
  titulo: string;
  conteudo: string;
  autor: string;
  anexo?: Anexo | null;
  criadoPor?: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  texto: string;
  post: string;
  autor: string;
  usuarioId: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}
