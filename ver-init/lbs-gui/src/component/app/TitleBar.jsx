import { ipcRenderer } from 'electron';
import React from 'react';
import { FaAtom, FaTshirt } from 'react-icons/fa';
import { useGlobalContext } from '../../App';
import useSessionStorage from '../../utils/useSessionStorage';

export default () => {
    const { theme, setTheme } = useGlobalContext();
    const [maximized, setMaximized] = useSessionStorage('window-maximized', false);
    const platform = React.useMemo(() => (navigator.platform.includes('ac') ? 'mac' : 'win'), []);
    const [hovered, setHovered] = React.useState(true);

    React.useEffect(() => {
        ipcRenderer.on('window-maximize', () => setMaximized(true));
        ipcRenderer.on('window-unmaximize', () => setMaximized(false));
    }, []);

    return (
        <div className="title-bar">
            {platform === 'win' ? (
                <>
                    <div className="title-bar-title-icon-win title-bar-icon-scaled-up">
                        <FaAtom />
                    </div>
                    <div className="title-bar-draggable"></div>
                    <div className="title-bar-title">NM Optim App</div>
                    <div
                        className="title-bar-button title-bar-icon-scaled-up"
                        onClick={() => {
                            if (theme === 'light') {
                                setTheme('dark');
                            } else if (theme === 'dark') {
                                setTheme('light');
                            }
                        }}
                    >
                        <FaTshirt />
                    </div>
                    <div
                        className="title-bar-button"
                        onClick={() => {
                            ipcRenderer.send('app:window-minimize');
                        }}
                    >
                        <div className="title-bar-button-window-minimize"></div>
                    </div>
                    {maximized ? (
                        <div
                            className="title-bar-button"
                            onClick={() => {
                                ipcRenderer.send('app:window-unmaximize');
                                setMaximized(false);
                            }}
                        >
                            <div className="title-bar-button-window-unmaximize"></div>
                        </div>
                    ) : (
                        <div
                            className="title-bar-button"
                            onClick={() => {
                                ipcRenderer.send('app:window-maximize');
                                setMaximized(true);
                            }}
                        >
                            <div className="title-bar-button-window-maximize"></div>
                        </div>
                    )}

                    <div
                        className="title-bar-button"
                        onClick={() => {
                            ipcRenderer.send('app:quit');
                        }}
                    >
                        <div className="title-bar-button-window-close"></div>
                    </div>
                </>
            ) : (
                <>
                    <div className="title-bar-draggable"></div>
                    <div className="title-bar-title">
                        <div className="title-bar-title-icon-mac title-bar-icon-scaled-up">
                            <FaAtom />
                        </div>
                        NM Optim App
                    </div>
                    <div
                        className="title-bar-button title-bar-icon-scaled-up"
                        onClick={() => {
                            if (theme === 'light') {
                                setTheme('dark');
                            } else if (theme === 'dark') {
                                setTheme('light');
                            }
                        }}
                    >
                        <FaTshirt />
                    </div>
                </>
            )}
        </div>
    );
};
