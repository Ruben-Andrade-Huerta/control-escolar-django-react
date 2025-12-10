import { useForm } from 'react-hook-form';
import { useAuth } from '../auth/authProvider';
import { useNavigate } from 'react-router-dom';

export function Login() {

  const { register, handleSubmit, formState: { errors } } = useForm()
  const userData = (data) => {
    console.log(data)
  }
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmitform = async (data) => {
    try {
      userData(data); // Llama a userData con los datos del formulario
      await login(data.email, data.password); // Llama a la función de login del contexto
      navigate('/dashboard'); // Redirige a dashboard
    } catch (error) {
      // Muestra mensaje de error aquí
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Control Escolar CCV</h1>
        <form onSubmit={handleSubmit(onSubmitform)} className="space-y-3">
          <div className="text-left">
            <input 
              id="email"
              placeholder="Correo" 
              type="email" 
              className="w-full rounded-xl px-4 py-3 bg-slate-100 placeholder:text-slate-400
                         text-slate-800 outline-none ring-1 ring-slate-200 focus:ring-2
                         focus:ring-blue-500 transition" 
              {...register("email", { required: true })} />
            {errors.email && <span>Este campo es requerido</span>}
          </div>
          <div className="text-left">
            <input 
              type="password" 
              placeholder="Contraseña"
              className="w-full rounded-xl px-4 py-3 bg-slate-100 placeholder:text-slate-400
                         text-slate-800 outline-none ring-1 ring-slate-200 focus:ring-2
                         focus:ring-blue-500 transition" 
              required {...register("password", { required: true })} />
            {errors.password && <span>Este campo es requerido</span>}
          </div>
          <div>
            <button 
              type='submit'
              className="w-full rounded-full bg-primary-ccv hover:bg-blue-700 active:bg-blue-800
                       text-white font-medium py-3 transition focus:outline-none
                       focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >Login</button>
          </div>
          <a 
            href="#"
            className="mt-3 inline-block text-sm text-slate-500 hover:text-slate-700">Olvidaste tu contraseña?</a>
        </form>
      </div>
    </main >
  );
}