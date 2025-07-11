import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
const InstallPWAButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      (deferredPrompt as any).userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA installation');
        } else {
          console.log('User dismissed the PWA installation');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return deferredPrompt ? (
    <>
    <button onClick={handleInstallClick} className="install_button">
        <span className="icon">
          <Icon icon="material-symbols:download-sharp"/>
        </span>
        <span className="text">Install App</span> 
    </button>

      <style jsx>{`
        .install_button {
          position: relative;
          display: inline-flex;
          gap: 8px;
          margin:5px;
          width: 150px;
          padding: 0px;
          height:45px;
          font-size: 18px;
          font-weight: bold;
          font-family: 'Segoe UI', sans-serif;
          color: #fff;
          background: linear-gradient(45deg, #5C3317, #703C1D);
          border: none;
          border-radius: 5px;
          cursor: pointer;
          box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.2),
                      inset -2px -2px 5px rgba(0, 0, 0, 0.4),
                      0 4px 6px rgba(0, 0, 0, 0.2);
          text-shadow: 1px 1px 0 #000;
          transition: transform 0.2s ease;
          overflow: hidden;
        }

        .install_button:active {
          transform: scale(0.98);
          box-shadow: inset 1px 1px 3px rgba(255, 255, 255, 0.2),
                      inset -1px -1px 3px rgba(0, 0, 0, 0.4),
                      0 3px 4px rgba(0, 0, 0, 0.2);
        }

        .text {
          border-radius: 0px 8px 8px 0px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          box-sizing: border-box;
          height:45px;
        }

        .icon {
          color:#707070;
          height:45px;
          background: linear-gradient(-45deg, #ffffff, #f1f1f1); /* Reversed gradient */
          padding: 5px;
          border-radius: 5px 0px 0px 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.2),
                      inset -2px -2px 5px rgba(0, 0, 0, 0.4),
                      0 4px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
    
  ) : null;
};

export default InstallPWAButton;
