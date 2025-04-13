"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DataTablePagination } from "./pagination"
import { LoadingState } from "@/components/loading-state"
import { Search } from "lucide-react"

interface DataTableColumn<T> {
  header: string
  accessorKey: keyof T | ((row: T) => any)
  cell?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  isLoading?: boolean
  searchPlaceholder?: string
  searchFunction?: (data: T[], searchTerm: string) => T[]
  pagination?: boolean
  initialPageSize?: number
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  searchPlaceholder = "Buscar...",
  searchFunction,
  pagination = true,
  initialPageSize = 10,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(initialPageSize)

  // Filtra os dados com base no termo de busca
  const filteredData = searchTerm && searchFunction ? searchFunction(data, searchTerm) : data

  // Calcula o número total de páginas
  const pageCount = Math.ceil(filteredData.length / pageSize)

  // Obtém os dados da página atual
  const paginatedData = pagination ? filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize) : filteredData

  // Função para acessar o valor de uma célula
  const getCellValue = (row: T, column: DataTableColumn<T>) => {
    if (column.cell) {
      return column.cell(row)
    }

    const accessorKey = column.accessorKey
    if (typeof accessorKey === "function") {
      return accessorKey(row)
    }

    return row[accessorKey]
  }

  // Função para lidar com a mudança de página
  const handlePageChange = (page: number) => {
    setPageIndex(page)
  }

  // Função para lidar com a mudança de tamanho da página
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setPageIndex(0) // Volta para a primeira página ao mudar o tamanho
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
              setPageIndex(0) // Volta para a primeira página ao buscar
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
                  <LoadingState text="Carregando dados..." />
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>{getCellValue(row, column)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <DataTablePagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageCount={pageCount}
          totalItems={filteredData.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  )
}
