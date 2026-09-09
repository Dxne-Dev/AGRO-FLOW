import { Outlet } from 'react-router-dom';
import { BottomNav, SideNav } from './AppNav';

export function Layout() {
  return (
    <div className="min-h-screen bg-af-canvas text-af-ink">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-40 focus:h-auto focus:w-auto focus:bg-white focus:px-3 focus:py-2"
      >
        Aller au contenu
      </a>
      <div className="flex min-h-screen">
        <SideNav />
        <div className="flex min-w-0 flex-1 flex-col">
          <main
            id="contenu"
            className="mx-auto w-full max-w-[390px] flex-1 px-5 pt-4 pb-24 md:max-w-3xl md:px-8 md:pt-8 md:pb-10"
          >
            <Outlet />
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
