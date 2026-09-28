import { Sidebar, Menu, MenuItem, type MenuItemStylesParams } from 'react-pro-sidebar';
import { useState, type ReactNode } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';
import WorkContextHeader from './WorkContextHeader';
import { NAV_ITEMS, isActivePath } from './navigation';

export default function SideBar({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    // En pantallas pequeñas el menú se oculta y se abre como panel
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [toggled, setToggled] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleLogout = () => {
        // Eliminar el access_token del localStorage
        localStorage.removeItem('access_token');

        // Eliminar el idProject del localStorage
        localStorage.removeItem('id_project_selected');

        //Eliminar el idScenario del localStorage
        localStorage.removeItem('id_scenario_selected');

        // Opcional: redirigir a la página de login
        navigate('/login');
    };

    const goTo = (path: string) => {
        setToggled(false);
        navigate(path);
    };

    return (
        <div className='flex h-screen'>
            <Sidebar
                collapsed={collapsed && !isSmallScreen}
                toggled={toggled}
                onBackdropClick={() => setToggled(false)}
                breakPoint='md'
                onBreakPoint={setIsSmallScreen}
                backgroundColor='#020612'
                rootStyles={{ color: '#D6E3EE' }}
                className='h-full'
                width='14rem'
                collapsedWidth='5rem'
                transitionDuration={400}
            >
                <div className="flex flex-col h-full">
                    {/* Menú principal */}
                    <Menu
                        menuItemStyles={{
                            button: ({ active }: MenuItemStylesParams) => ({
                                color: active ? '#FFFFFF' : '#D6E3EE',
                                backgroundColor: active ? '#1e3a8a' : undefined,
                                borderLeft: `4px solid ${active ? '#3b82f6' : 'transparent'}`,
                                fontWeight: active ? 700 : undefined,
                                '&:hover': {
                                    backgroundColor: active ? '#1e40af' : '#1f2937',
                                    color: '#FFFFFF',
                                },
                            })
                        }}
                    >
                        {!isSmallScreen && (
                            <MenuItem
                                icon={<Bars3Icon className='size-5' />}
                                onClick={() => setCollapsed(prev => !prev)}
                            >
                                {!collapsed && <span>Ocultar Menú</span>}
                            </MenuItem>
                        )}

                        {NAV_ITEMS.map(item => (
                            <MenuItem
                                key={item.path}
                                icon={item.icon}
                                active={isActivePath(item.path, pathname)}
                                onClick={() => goTo(item.path)}
                                title={item.label}
                            >
                                {item.label}
                            </MenuItem>
                        ))}
                    </Menu>

                    {/* Botón de cerrar sesión al final */}
                    <div className="mt-auto">
                        <Menu
                            menuItemStyles={{
                                button: {
                                    color: '#D6E3EE',
                                    borderLeft: '4px solid transparent',
                                    '&:hover': {
                                        backgroundColor: '#dc2626',
                                        color: '#FFFFFF',
                                    },
                                }
                            }}
                        >
                            <MenuItem
                                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                </svg>}
                                onClick={handleLogout}
                            >
                                {!collapsed && <span>Cerrar Sesión</span>}
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </Sidebar>

            {/* El contenido ocupa todo el espacio restante (min-w-0 evita que las tablas anchas lo desborden) */}
            <main className="flex-1 min-w-0 h-full overflow-auto p-3 md:p-7 text-gray-200">
                <WorkContextHeader
                    showMenuButton={isSmallScreen}
                    onOpenMenu={() => setToggled(true)}
                />
                {children}
            </main>
        </div>
    );
}
