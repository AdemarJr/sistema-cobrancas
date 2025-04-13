"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Users, CreditCard, Calendar, FileText, Home, LogOut, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Notifications } from "@/components/notifications"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Navbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { toast } = useToast()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/clientes",
      label: "Clientes",
      icon: Users,
      active: pathname.startsWith("/clientes"),
    },
    {
      href: "/emprestimos",
      label: "Empréstimos",
      icon: CreditCard,
      active: pathname.startsWith("/emprestimos"),
    },
    {
      href: "/cobrancas",
      label: "Cobranças",
      icon: Calendar,
      active: pathname.startsWith("/cobrancas"),
    },
    {
      href: "/relatorios",
      label: "Relatórios",
      icon: FileText,
      active: pathname.startsWith("/relatorios"),
    },
  ]

  const handleSignOut = async () => {
    await signOut()
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso.",
    })
  }

  // Não mostrar a navbar em páginas de autenticação
  if (
    pathname === "/login" ||
    pathname === "/cadastro" ||
    pathname === "/esqueci-senha" ||
    pathname === "/redefinir-senha"
  ) {
    return null
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4 justify-between">
        <div className="flex items-center">
          <Link href="/dashboard" className="font-bold text-xl mr-6">
            SisCobrança
          </Link>
          <div className="flex items-center space-x-4 lg:space-x-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center",
                  route.active ? "text-primary" : "text-muted-foreground hover:text-primary",
                )}
              >
                <route.icon className="h-4 w-4 mr-2" />
                {route.label}
              </Link>
            ))}
          </div>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <Notifications />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/configuracoes">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  )
}
