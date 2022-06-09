import { useDocumentTitle } from "@mantine/hooks";
import { createContext, useState } from "react";

const DocumentTitleContext = createContext();

export const DocumentTitleProvider = ({ children }) => {
  const [title, setTitle] = useState({
    appTitle: "MoA Garage Information Management System",
    pageTitle: "",
  });

  useDocumentTitle(
    `${title.pageTitle ? title.pageTitle + " - " : ""}${title.appTitle}`
  );

  return (
    <DocumentTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </DocumentTitleContext.Provider>
  );
};

export default DocumentTitleContext;
