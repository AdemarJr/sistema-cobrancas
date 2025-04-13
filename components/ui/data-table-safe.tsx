"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react"
import { SafeLink } from "@/components/ui/safe-link"

interface DataTableProps<T> {
  data: T[]
  columns: {
    header: string
    accessorKey: keyof T
    cell?: (item: T) => React.ReactNode
    enableSorting?: boolean
  }[]
  isLoading?: boolean
  searchPlaceholder?: string
  searchFunction?: (data: T[], searchTerm: string) => T[]
  pagination?: boolean
  initialPageSize?: number
  linkConfig?: {
    tipo: "cliente" | "emprestimo" | "cobranca"
    getIdFn: (item: T) => string
    baseUrl: string
    fallbackUrl?: string
  }
}

export function DataTableSafe<T>({
  data,
  columns,
  isLoading = false,
  searchPlaceholder = "Buscar...",
  searchFunction,
  pagination = false,
  initialPageSize = 10,
  linkConfig,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  // Filtragem
  const filteredData = searchTerm && searchFunction ? searchFunction(data, searchTerm) : data

  // Paginação
  const totalPages = pagination ? Math.ceil(filteredData.length / pageSize) : 1
  const paginatedData = pagination
    ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredData

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-4">
      {searchFunction && (
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // Reset to first page on search
            }}
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2">Carregando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.cell ? (
                        column.cell(item)
                      ) : linkConfig ? (
                        <SafeLink
                          href={`${linkConfig.baseUrl}/${linkConfig.getIdFn(item)}`}
                          tipo={linkConfig.tipo}
                          id={linkConfig.getIdFn(item)}
                          fallbackUrl={linkConfig.fallbackUrl || "/"}
                          className="hover:underline text-primary"
                        >
                          {String(item[column.accessorKey])}
                        </SafeLink>
                      ) : (
                        String(item[column.accessorKey])
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {Math.min(filteredData.length, (currentPage - 1) * pageSize + 1)} a{" "}
            {Math.min(filteredData.length, currentPage * pageSize)} de {filteredData.length} resultados
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
