import { useState } from 'react';
import { loginUser, registerUser } from '../../api/auth';


const LoginRegisterSystem = () => {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <div className="flex min-h-screen flex-col justify-center items-center bg-gray-950">
            {showLogin ? (
                <Login onSwitchToRegister={() => setShowLogin(false)} />
            ) : (
                <Register onSwitchToLogin={() => setShowLogin(true)} />
            )}
        </div>
    );
};

const ErrorText = ({ message }: { message: string }) => (
    <p className="text-red-500 text-sm mt-1">{message}</p>
);



const Login = ({ onSwitchToRegister }: { onSwitchToRegister: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const newErrors: any = {};

        if (!email) newErrors.email = 'Campo requerido';
        if (!password) newErrors.password = 'Campo requerido';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            await loginUser(email, password);
            window.location.href = '/';
        } catch (error: any) {
            setErrors({ general: 'Correo o contraseña incorrectos' });
        }
    };

    return (
        <div className="w-full max-w-md px-6 py-12">
            <div className="flex flex-col items-center">
                <div className="rounded-full bg-indigo-600 p-3">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571..." />
                    </svg>
                </div>
                <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">Inicia sesión en tu cuenta</h2>
            </div>

            <div className="mt-8 space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Correo electrónico</label>
                    <div className="mt-1">
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="block w-full rounded-md border-0 bg-gray-800 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" />
                        {errors.email && <ErrorText message={errors.email} />}
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">Contraseña</label>
                    <div className="mt-1">
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-md border-0 bg-gray-800 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" />
                        {errors.password && <ErrorText message={errors.password} />}
                    </div>
                </div>

                {errors.general && <ErrorText message={errors.general} />}

                <div>
                    <button onClick={handleSubmit}
                        className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                        Iniciar sesión
                    </button>
                </div>

                <div className="mt-6">
                    <button onClick={onSwitchToRegister}
                        className="flex w-full justify-center rounded-md border border-indigo-600 bg-transparent py-2 px-3 text-sm font-semibold text-indigo-400 hover:bg-gray-800">
                        ¿No tienes cuenta? Crea una
                    </button>
                </div>
            </div>
        </div>
    );
};

const Register = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; general?: string }>({});

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const newErrors: any = {};

        if (!name) newErrors.name = 'Campo requerido';
        if (!email) newErrors.email = 'Campo requerido';
        if (!password) newErrors.password = 'Campo requerido';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            await registerUser({ name, email, password, is_active: true });
            onSwitchToLogin();
        } catch (error: any) {
            if (error?.response?.status === 400) {
                setErrors({ email: 'Este correo ya está registrado' });
            } else {
                setErrors({ general: 'Error en el registro' });
            }
        }
    };

    return (
        <div className="w-full max-w-md px-6 py-12">
            <div className="flex flex-col items-center">
                <div className="rounded-full bg-indigo-600 p-3">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m..." />
                    </svg>
                </div>
                <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">Crea tu cuenta</h2>
            </div>

            <div className="mt-8 space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nombre completo</label>
                    <div className="mt-1">
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className="block w-full rounded-md bg-gray-800 py-2 px-3 text-white ring-1 ring-inset ring-gray-700 focus:ring-indigo-600 sm:text-sm" />
                        {errors.name && <ErrorText message={errors.name} />}
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Correo electrónico</label>
                    <div className="mt-1">
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="block w-full rounded-md bg-gray-800 py-2 px-3 text-white ring-1 ring-inset ring-gray-700 focus:ring-indigo-600 sm:text-sm" />
                        {errors.email && <ErrorText message={errors.email} />}
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">Contraseña</label>
                    <div className="mt-1">
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-md bg-gray-800 py-2 px-3 text-white ring-1 ring-inset ring-gray-700 focus:ring-indigo-600 sm:text-sm" />
                        {errors.password && <ErrorText message={errors.password} />}
                    </div>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirmar contraseña</label>
                    <div className="mt-1">
                        <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full rounded-md bg-gray-800 py-2 px-3 text-white ring-1 ring-inset ring-gray-700 focus:ring-indigo-600 sm:text-sm" />
                        {errors.confirmPassword && <ErrorText message={errors.confirmPassword} />}
                    </div>
                </div>

                {errors.general && <ErrorText message={errors.general} />}

                <div>
                    <button onClick={handleSubmit} className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500">
                        Crear cuenta
                    </button>
                </div>

                <div className="mt-6">
                    <button onClick={onSwitchToLogin} className="flex w-full justify-center rounded-md border border-indigo-600 py-2 px-3 text-sm font-semibold text-indigo-400 hover:bg-gray-800">
                        ¿Ya tienes cuenta? Inicia sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginRegisterSystem;