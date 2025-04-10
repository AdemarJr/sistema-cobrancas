import type { ReactNode } from "react"
import Link from "next/link"
import {
  BanknoteIcon,
  CalendarIcon,
  CreditCard,
  FileText,
  Home,
  LogOut,
  Menu,
  Settings,
  Users,
  UserCog,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/clientes"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <Users className="h-5 w-5" />
                Clientes
              </Link>
              <Link
                href="/dashboard/emprestimos"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <BanknoteIcon className="h-5 w-5" />
                Empréstimos
              </Link>
              <Link
                href="/dashboard/cobrancas"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <CalendarIcon className="h-5 w-5" />
                Cobranças
              </Link>
              <Link
                href="/dashboard/pagamentos"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <CreditCard className="h-5 w-5" />
                Pagamentos
              </Link>
              <Link
                href="/dashboard/relatorios"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <FileText className="h-5 w-5" />
                Relatórios
              </Link>
              <Link
                href="/dashboard/usuarios"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <UserCog className="h-5 w-5" />
                Usuários
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <BanknoteIcon className="h-6 w-6" />
          <span className="hidden md:inline-block">Sistema de Cobranças</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Avatar>
            <AvatarImage src="" alt="Avatar" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/clientes"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <Users className="h-4 w-4" />
                  Clientes
                </Link>
                <Link
                  href="/dashboard/emprestimos"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <BanknoteIcon className="h-4 w-4" />
                  Empréstimos
                </Link>
                <Link
                  href="/dashboard/cobrancas"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Cobranças
                </Link>
                <Link
                  href="/dashboard/pagamentos"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <CreditCard className="h-4 w-4" />
                  Pagamentos
                </Link>
                <Link
                  href="/dashboard/relatorios"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <FileText className="h-4 w-4" />
                  Relatórios
                </Link>
                <Link
                  href="/dashboard/usuarios"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                >
                  <UserCog className="h-4 w-4" />
                  Usuários
                </Link>
              </nav>
            </div>
            <div className="mt-auto p-4">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Settings className="h-4 w-4" />
                Configurações
              </Button>
              <Button variant="outline" className="mt-2 w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
      </div>
    </div>
  )
}
