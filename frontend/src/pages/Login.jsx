import {useForm} from 'react-hook-form'

const {register, handleSubmit} = useForm()

const onSubmitform = handleSubmit(data => console.log(data))

export function Login() {
  return (
    <div>
      <h1>Control Escolar CCV</h1>
      <form action="" onSubmit={onSubmitform}>
        <div>
          <input id="email" placeholder="Correo" type="email" required {...register("email")}/>
        </div>
        <div>
          <input type="password" placeholder="Contraseña" required {...register("password")}/>
        </div>
        <div>
          <button>Login</button>
        </div>
        <a href="">Olvidaste tu contraseña?</a>
      </form>
    </div>
  );
}
