import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Menu } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showHome?: boolean;
  showMenu?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  showHome = true,
  showMenu = true,
}) => {
  const navigate = useNavigate();

  // Opens the ProfileLayout sidebar via custom event
  const openProfileSidebar = () => {
    window.dispatchEvent(new CustomEvent('open-profile-sidebar'));
  };

  return (
    <div className="flex items-center gap-3 mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-100">
      {/* Back button */}
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
        </button>
      )}

      {/* Title + breadcrumb */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 text-[10px] md:text-xs text-gray-400 mb-0.5">
          {showHome && (
            <>
              <button
                onClick={() => navigate('/')}
                className="hover:text-gau-msa-primary transition-colors flex items-center space-x-1"
              >
                <Home className="h-3 w-3" />
                <span>Home</span>
              </button>
              <span>/</span>
            </>
          )}
          <span className="text-gray-500">{title}</span>
        </div>
        <h1 className="text-lg md:text-2xl font-bold text-gau-msa-primary truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs md:text-sm text-gray-500 mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>

      {/* Menu button — opens the ProfileLayout sidebar */}
      {showMenu && (
        <button
          onClick={openProfileSidebar}
          className="lg:hidden flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-gau-msa-primary text-white text-xs font-semibold active:scale-95 hover:bg-gau-msa-secondary transition-all flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
          <span>Menu</span>
        </button>
      )}
    </div>
  );
};

export default PageHeader;