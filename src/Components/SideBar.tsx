import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useState, type ReactNode } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function SideBar({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

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

    return (
        <div className='flex h-screen'>
            <Sidebar
                collapsed={collapsed}
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
                            button: {
                                color: '#D6E3EE',
                                '&:hover': {
                                    backgroundColor: '#1f2937',
                                    color: '#FFFFFF',
                                },
                            }
                        }}
                    >
                        <MenuItem
                            icon={<Bars3Icon className='size-5' />}
                            onClick={() => setCollapsed(prev => !prev)}
                        >
                            {!collapsed && <span>Ocultar Menú</span>}
                        </MenuItem>

                        <MenuItem
                            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                            </svg>}
                            onClick={() => navigate('/projects')}
                        >
                            Proyectos
                        </MenuItem>

                        <MenuItem
                            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>}
                            onClick={() => navigate('/scenarios')}
                        >
                            Escenario
                        </MenuItem>

                        <MenuItem
                            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>}
                            onClick={() => navigate('/alternatives')}
                        >
                            Alternativas
                        </MenuItem>

                        <MenuItem
                            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>}
                            onClick={() => navigate('/criteria')}
                        >
                            Criterios
                        </MenuItem>

                        <MenuItem
                            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                            </svg>}
                            onClick={() => navigate('/weights')}
                        >
                            Pesos
                        </MenuItem>

                        <MenuItem
                            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
                            </svg>}
                            onClick={() => navigate('/value-matrix')}
                        >
                            Matriz Valuada
                        </MenuItem>

                        <MenuItem
                            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" className="size-5">
                                <path
                                    fill="currentColor"
                                    d="M7 3v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V3h1a2 2 0 0 1 2 2v11a6 6 0 0 1-6 6H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
                                    opacity=".3"
                                ></path>
                                <path
                                    fill="currentColor"
                                    d="M14 2a1 1 0 0 1 .117 1.993L14 4h-4a1 1 0 0 1-.117-1.993L10 2zm1 8H9a1 1 0 0 0-.117 1.993L9 12h6a1 1 0 1 0 0-2m-3 4H9a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2"
                                ></path>
                            </svg>}
                            onClick={() => navigate('/reports')}
                        >
                            Reportes
                        </MenuItem>
                        <MenuItem
                        icon={<svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 14 14"
                            width="1em"
                            height="1em"
                            className="size-5"
                        >
                            <path
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M.5 13.5h13m-9 0V.5h-4v13m8 0v-7h-4v7m8 0v-10h-4v10"
                            ></path>
                        </svg>}
                        onClick={() => navigate('/scenario-comparison')}
                    >
                        Comparar Escenarios
                    </MenuItem>

                    </Menu>

                    {/* Botón de cerrar sesión al final */}
                    <div className="mt-auto">
                        <Menu
                            menuItemStyles={{
                                button: {
                                    color: '#D6E3EE',
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

            <main className="p-3 md:p-7 text-gray-200 w-5/6 sm:w-5/6 mx-auto h-full overflow-auto">
                {children}
            </main>
        </div>
    );
}