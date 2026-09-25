import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import Footer from './Footer';
import PageTransition from './PageTransition';
import AudioPlayer from '../audio/AudioPlayer';
import CommandPalette from '../command/CommandPalette';
import ScrollToTop from '../common/ScrollToTop';
import SkipToContent from '../common/SkipToContent';
import BackToTop from '../common/BackToTop';
import OfflineBanner from '../common/OfflineBanner';
import InstallPrompt from '../common/InstallPrompt';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';

export default function AppLayout() {
  const [cmdOpen, setCmdOpen] = useState(false);

  const openCmd = useCallback(() => setCmdOpen(true), []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);

  useKeyboardShortcut({ key: 'k', ctrl: true, allowInInput: true }, openCmd);

  return (
    <div className="min-h-screen flex flex-col bg-hero">
      <SkipToContent />
      <Navbar onOpenCommand={openCmd} />
      <OfflineBanner />
      <main id="main-content" className="flex-1 pb-24 md:pb-12">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <MobileNav />
      <AudioPlayer />
      <BackToTop />
      <CommandPalette open={cmdOpen} onClose={closeCmd} />
      <InstallPrompt />
      <ScrollToTop />
    </div>
  );
}