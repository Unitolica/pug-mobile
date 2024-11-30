import { useState } from "react"
import { Loader2Icon } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { z } from "zod"
import { useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/contexts/auth-context"
import { Textarea } from "@/components/ui/textarea"

const LoginSchema = z.object({
  email: z.string({ required_error: "Email eh requirido" }),
  password: z.string({ required_error: "Senha eh requirida " }).min(4, {
    message: "Senha deve ter, no minimo, 4 caracteres"
  })
})

type LoginData = z.infer<typeof LoginSchema>

export default function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const form = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function onSubmit(formData: LoginData) {
    setIsLoading(true)

    try {
      await login(formData.email, formData.password)

      const from = (location.state)?.from || "/"
      toast({
        itemID: "login",
        variant: "success",
        title: "Sucesso",
        description: "Login realizado com sucesso",
      })
      navigate(from, { replace: true })
    } catch (err) {
      console.error("err on login", err)
      toast({
        itemID: "login",
        variant: "destructive",
        title: "Falha!",
        description: "Aconteceu um erro ao realizar o seu login, tente novamente mais tarde",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Digite seu email e senha
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="meuemail@email.com"
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
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2Icon className="animate-spin" />}
                Entrar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

