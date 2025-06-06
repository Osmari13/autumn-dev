'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useQueryClient } from "@tanstack/react-query";


const formSchema = z.object({
  first_name: z.string({
    message: "Debe ingresar su primer nombre"
  }),
  last_name: z.string({
    message: "Debe ingresar su apellido"
  }),
  username: z.string().min(2).max(50),
  password: z.string().min(5, {
    message: "La contraseña debe tener al menos 5 carácteres."
  }),
  user_role: z.string({
    message: "Debe seleccionar un tipo de usuario"
  }),

})

const RegisterForm = () => {

  const [isLoading, setIsLoading] = useState(false)

  const queryClient = useQueryClient()

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      password: "",
      user_role: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      const res = await axios.post('/api/auth/register', {
        ...values,
      });
      if (res.status == 200) {
        toast.success("¡Creado!", {
          description: `El usuario ${values.username} ha sido creado correctamente.`
        })
        router.push('/login')
        queryClient.invalidateQueries({ queryKey: ["users"] })
      }
    } catch (error: any) {
      toast.error("Oops!", {
        description: `No se ha podido crear el usuario: ${error.response.data.message}`
      })
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Registro</h1>
          <p className="text-balance text-muted-foreground  italic">
            Ingrese los datos para el registro de un usuario
          </p>
        </div>
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Maria" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Lopez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuario</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
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
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type='password' placeholder="*******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="user_role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol del Usuario</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un rol para el usuario..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USER">Usuario</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          
          <Button disabled={isLoading} type="submit" className="w-full">
            {
              isLoading ? <Loader2 className='size-4 animate-spin' /> : <p>Registrar</p>
            }
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          ¿Ya tiene una cuenta?{" "}
          <Link href="#" className="underline">
            Iniciar sesión
          </Link>
        </div>
      </form>
    </Form>
  )
}

export default RegisterForm
