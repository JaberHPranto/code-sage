type DocData = {
  id: string;
  title: string;
  description: string;
  subchapters: DocData[];
};

export type StructuredDoc = {
  id: string;
  title: string;
  items: {
    id: string;
    title: string;
    content: string;
  }[];
};

export function getStructuredDocs(docs: DocData[]): StructuredDoc[] {
  const structuredDocs = docs.map((doc) => {
    return {
      id: doc.id,
      title: doc.title,
      items: doc.subchapters.map((subchapter) => {
        return {
          id: subchapter.id,
          title: subchapter.title,
          content: subchapter.description,
        };
      }),
    };
  });

  return structuredDocs;
}

// console.log(getStructuredDocs(docsData));
