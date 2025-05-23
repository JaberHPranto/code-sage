export interface IProject {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  repoUrl: string;
  deletedAt: Date | null;
}

export interface DocType {
  id: string;
  level: number;
  title: string;
  content: string;
  children: DocType[];
}
