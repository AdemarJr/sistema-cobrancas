"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
          <CardTitle className="text-3xl">404</CardTitle>
          <CardDescription className="text-lg">Página não encontrada</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">A página que você está procurando não existe ou foi movida.</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ir para a página inicial
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="#" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para a página anterior
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
