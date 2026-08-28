import { FiMenu } from "react-icons/fi";
import { useUiStore } from "../../store/useUiStore";

import { Breadcrumbs } from "../common/Breadcrumbs";

interface SidebarHeaderProps {
  title?: string;
  actions?: React.ReactNode;
}

const SidebarHeader = ({ title = "Dashboard", actions = null }: SidebarHeaderProps) => {
  const { toggleSidebar, breadcrumbs } = useUiStore();

  return (
    <header className="sticky top-0 z-30 h-16 bg-base-200 backdrop-blur border-b border-base-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="btn btn-square border-none bg-base-200 shadow-none text-base-content lg:hidden"
        >
          <FiMenu size={22} />
        </button>

        {breadcrumbs && breadcrumbs.length > 0 ? (
          <Breadcrumbs items={breadcrumbs} />
        ) : (
          <h1 className="text-xl font-bold">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions}
      </div>
    </header>
  );
};

export default SidebarHeader;
