import FallbackLoading from '@/components/FallbackLoading';
import Footer from '@/components/layout/Footer';
import HorizontalNavBar from '@/components/layout/HorizontalNav/page';
import { useLayoutContext } from '@/context/useLayoutContext';
import { getHorizontalMenuItems } from '@/helpers/Manu';
import { toggleDocumentAttribute } from '@/utils/layout';
import { lazy, Suspense, useEffect } from 'react';
const TopNavigationBarPage = lazy(() => import('@/components/layout/TopNavigationBar/page'));
const HorizontalLayout = ({
  children
}) => {
  const menuItems = getHorizontalMenuItems();
  const {
    layoutOrientation,
    menu,
    horizontalMenu
  } = useLayoutContext();
  useEffect(() => {
    toggleDocumentAttribute('data-layout', layoutOrientation === 'vertical' ? '' : 'topnav');
    return () => {
      toggleDocumentAttribute('data-layout', layoutOrientation === 'vertical' ? '' : 'topnav', true);
    };
  });
  return <>
      <div className="wrapper">
        <Suspense fallback={<FallbackLoading />}>
          <TopNavigationBarPage />
        </Suspense>

        <Suspense fallback={<FallbackLoading />}>
              <HorizontalNavBar menuItems={menuItems} />      
        </Suspense>

        <div className="page-content">
          <div className="page-container">{children}</div>
          <Footer />
        </div>
      </div>
    </>;
};
export default HorizontalLayout;