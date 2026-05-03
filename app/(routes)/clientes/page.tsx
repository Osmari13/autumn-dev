"use client"

import { useGetClients } from '@/actions/clients/actions'
import { ContentLayout } from '@/components/sidebar/ContentLayout'
import { Loader2 } from 'lucide-react'
import { DataTable } from './data-table'
import { columns } from './columns'

const ClientPage = () => {
  const { data: clients, loading, error } = useGetClients()
  return (
    <ContentLayout title='Clientes' description='Registro y seguimiento de todos los clientes en el sistema.'>
      {
        loading && <div className='w-full flex justify-center'>
          <Loader2 className='size-12 animate-spin' />
        </div>
      }
      {
        clients && <DataTable columns={columns} data={clients} />
      }
      {
        error && <div className='w-full flex justify-center text-sm text-muted-foreground'>Hubo un error...</div>
      }
    </ContentLayout>
  )
}

export default ClientPage
