import React from 'react';
import '../../css/nav.css';
import SideNavItem from './SideNavItem';
import SideNavMenu from './SideNavMenu';

export default ({ menuItems, path, setPath }) => {
    return (
        <nav className="nav">
            <header className="nav-header">
                <h1 className="nav-title">NM員工排班優化系統</h1>
            </header>
            <div className="nav-content-wrapper">
                {menuItems.map((menu, index) => (
                    <SideNavMenu icon={menu.icon} title={menu.title} isOpen={menu.isOpen} key={index}>
                        {menu.items.map((item, index) => (
                            <SideNavItem
                                path={item.path}
                                setPath={setPath}
                                title={item.title}
                                selected={path === item.path}
                                key={index}
                            />
                        ))}
                    </SideNavMenu>
                ))}
            </div>
        </nav>
    );
};
