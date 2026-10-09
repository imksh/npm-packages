"use client";

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {children}
    </div>
  );
};

export default PublicLayout;
