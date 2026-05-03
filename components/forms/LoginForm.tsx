'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getSession, signIn, useSession } from 'next-auth/react'
import { toast } from "sonner";

const formSchema = z.object({

  username: z.string({
    message: "Debe ingresar un nombre de usuario."
  }),
  password: z.string().min(5, {
    message: "Debe ingresar una contraseña."
  }),
})

const LoginForm
  = () => {

    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: "",
        password: "",
      },
    })

    const { data: session } = useSession();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      setIsLoading(true);
      try{

        const res = await signIn("credentials", {
          username: values.username,
          password: values.password,
          redirect: false,
        })
        if (res?.error) {
          setIsLoading(false)
          toast.error("Ooops!", {
            description: `${res.error}`,
            position: "bottom-left"
          }
          )
        } else {
          const sessionFresca = await getSession();

          setIsLoading(false); // Ya podemos quitar el estado de carga

          if (sessionFresca?.user?.user_role === 'ADMIN') {
            router.refresh(); 
            router.push('/dashboard');
          } else {
            router.push('/');
          }
          // toast.success("¡Bienvenido!");
          // window.location.href = '/dashboard';

        }

      }catch(error){
        setIsLoading(false);
        toast.error("Error al iniciar sesión. Por favor, inténtelo de nuevo.");
        return;
      }
      
    }

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto grid w-full max-w-[460px] gap-7 rounded-2xl border border-[#d6b894]/80 bg-white/70 p-7 shadow-[0_18px_46px_rgba(79,45,18,0.16)] backdrop-blur-sm sm:p-10 dark:border-[#6c4830] dark:bg-[#1a140f]/78 dark:shadow-[0_24px_70px_rgba(0,0,0,0.42)]"
        >
          <div className="grid gap-2 text-center">
            <p className="[font-family:var(--font-cormorant)] text-3xl font-semibold tracking-[0.045em] text-[#9b6430] dark:text-[#d9ad83]">
              Acceso Privado
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#2b1c12] dark:text-[#f6e8d5]">
              Inicio de Sesion
            </h1>
            <p className="text-balance text-sm italic text-[#735b46] dark:text-[#bba084]">
              Inicie sesion en su cuenta personal.
            </p>
          </div>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#7c5735] dark:text-[#c79f73]">Usuario</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="usuario"
                      className="h-11 rounded-xl border-[#d8c4ad] bg-white/90 text-[15px] text-[#2c1a0f] placeholder:text-[#af9073] focus-visible:ring-[#c46824] dark:border-[#5c3f2b] dark:bg-[#241a14]/80 dark:text-[#f7e7d2] dark:placeholder:text-[#8f735a]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#7c5735] dark:text-[#c79f73]">Contrasena</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder="*******"
                      className="h-11 rounded-xl border-[#d8c4ad] bg-white/90 text-[15px] text-[#2c1a0f] placeholder:text-[#af9073] focus-visible:ring-[#c46824] dark:border-[#5c3f2b] dark:bg-[#241a14]/80 dark:text-[#f7e7d2] dark:placeholder:text-[#8f735a]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              type="submit"
              className="h-11 w-full rounded-xl bg-[#c4621d] text-[15px] font-semibold tracking-[0.02em] text-[#fff4ea] transition-all duration-200 hover:bg-[#ab5315] hover:shadow-[0_10px_24px_rgba(196,98,29,0.35)] dark:bg-[#d07631] dark:text-[#1f140d] dark:hover:bg-[#bf6727]"
            >
              {
                isLoading ? <Loader2 className='size-4 animate-spin' /> : <p>Iniciar Sesión</p>
              }
            </Button>
          </div>
        </form>
      </Form>
    )
  }

export default LoginForm
