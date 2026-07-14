

import Header from "../ui/Header";

const PublicLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default PublicLayout;
