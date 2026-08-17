import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useLayoutContext } from '@/context/useLayoutContext';
import useViewPort from '@/hooks/useViewPort';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const LeftSideBarToggle = () => {
  const {
    menu: {
      size
    },
    changeMenu: {
      size: changeMenuSize
    },
    toggleBackdrop,
    horizontalMenu,
    layoutOrientation
  } = useLayoutContext();
  const pathname = useLocation();
  const {
    width
  } = useViewPort();
  const handleMenuSize = () => {
    if (size === 'full') {
      toggleBackdrop();
    } else if (size === 'condensed' || size === 'fullscreen' || size === 'sm-hover-active') {
      changeMenuSize('default');
    } else if (size === 'default') {
      changeMenuSize('sm-hover');
    } else {
      changeMenuSize('default');
    }
  };

  //   if (size == 'full') {
  //     toggleBackdrop()
  //   } else if (size == 'condensed') {
  //     changeMenuSize('default')
  //   } else if (size == 'fullscreen') {
  //     changeMenuSize('default')
  //   } else if (size == 'compact') {
  //     changeMenuSize('condensed')
  //   } else if (size == 'sm-hover-active') {
  //     changeMenuSize('default')
  //   } else if (size == 'default') {
  //     changeMenuSize('sm-hover')
  //   }
  // }

  useEffect(() => {
    if (width <= 768) {
      if (size !== 'full') {
        changeMenuSize('full');
      }
    } else if (width <= 1140) {
      if (size !== 'condensed') {
        changeMenuSize('condensed');
      }
    } else {
      if (size !== 'default') {
        changeMenuSize('default');
      }
    }
  }, [width, pathname]);
  return <>
      {layoutOrientation === 'horizontal' && <button onClick={horizontalMenu.toggle} className="topnav-toggle-button px-2">
          <IconifyIcon icon="tabler:menu-deep" className="fs-22" />
        </button>}

      <button onClick={handleMenuSize} className="sidenav-toggle-button px-2">
        <IconifyIcon icon="ri:menu-2-line" className="fs-24" />
      </button>
    </>;
};
export default LeftSideBarToggle;