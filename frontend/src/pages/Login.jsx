import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../auth/authProvider';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitform = async (data) => {
    try {
      setLoginError('');
      setIsLoading(true);
      await login(data.email, data.password);
      navigate('/dashboard-admin');
    } catch (error) {
      console.error(error);
      setLoginError('Correo o contraseña incorrectos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f6fa] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#e0e4ed] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">

          {/* Header azul */}
          <div className="bg-[#1a3a6b] px-8 py-8 flex flex-col items-center gap-4">
            {/* Logo */}
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 28 28" fill="none" className="w-9 h-9">
                <rect x="3" y="3" width="9" height="9" rx="2" fill="#1a3a6b" />
                <rect x="16" y="3" width="9" height="9" rx="2" fill="#C0392B" opacity="0.85" />
                <rect x="3" y="16" width="9" height="9" rx="2" fill="#1a3a6b" opacity="0.6" />
                <rect x="16" y="16" width="9" height="9" rx="2" fill="#1a3a6b" opacity="0.35" />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-white text-xl font-bold leading-tight">
                Control Escolar CCV
              </h1>
              <p className="text-white/50 text-xs mt-1">
                Colegio Central Veracruzano
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="px-8 py-8">
            <div className="mb-6">
              <h2 className="text-[15px] font-semibold text-[#1a1a2e]">
                Iniciar sesión
              </h2>
              <p className="text-xs text-[#888] mt-1">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmitform)} className="flex flex-col gap-4">

              {/* Error general */}
              {loginError && (
                <div className="flex items-center gap-2 px-4 py-3 bg-[#FCEBEB] border border-[#f5c0b8] rounded-lg">
                  <svg className="w-4 h-4 text-[#A32D2D] flex-shrink-0" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  <span className="text-[12px] text-[#A32D2D] font-medium">{loginError}</span>
                </div>
              )}

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-[10px] font-semibold text-[#888] uppercase tracking-wider"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="usuario@ccv.edu.mx"
                  className={`h-10 rounded-lg px-3 text-sm text-[#1a1a2e] bg-white outline-none border transition
                    placeholder:text-[#ccc]
                    focus:border-[#1a3a6b] focus:shadow-[0_0_0_3px_rgba(26,58,107,0.08)]
                    ${errors.email
                      ? 'border-[#E24B4A]'
                      : 'border-[#e0e4ed]'
                    }`}
                  {...register('email', {
                    required: 'El correo es requerido',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Ingresa un correo válido',
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-[11px] text-[#A32D2D]">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Contraseña */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-[10px] font-semibold text-[#888] uppercase tracking-wider"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`h-10 rounded-lg px-3 text-sm text-[#1a1a2e] bg-white outline-none border transition
                    placeholder:text-[#ccc]
                    focus:border-[#1a3a6b] focus:shadow-[0_0_0_3px_rgba(26,58,107,0.08)]
                    ${errors.password
                      ? 'border-[#E24B4A]'
                      : 'border-[#e0e4ed]'
                    }`}
                  {...register('password', {
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 6,
                      message: 'Mínimo 6 caracteres',
                    },
                  })}
                />
                {errors.password && (
                  <span className="text-[11px] text-[#A32D2D]">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 h-10 w-full bg-[#1a3a6b] hover:bg-[#0f2548] active:bg-[#091a38]
                           text-white text-sm font-semibold rounded-lg transition
                           disabled:opacity-60 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </button>

            </form>
          </div>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="text-[11px] text-[#bbb]">
              ¿Problemas para acceder? Contacta al administrador del sistema.
            </p>
          </div>

        </div>

        {/* Versión */}
        <p className="text-center text-[11px] text-[#bbb] mt-4">
          Control Escolar CCV · Ciclo 2025–2026
        </p>

      </div>
    </main>
  );
}
