"use client"

import { useGetTransactions } from '@/actions/transactions/actions'
import { ContentLayout } from '@/components/sidebar/ContentLayout'
import { Loader2 } from 'lucide-react'
import { columns } from './columns'
import { DataTable } from './data-table'


const TransactionPage = () => {
    const {data: transaction, loading, error} = useGetTransactions()
    return (
      <ContentLayout title='Transacciones' description='Historial completo de movimientos y transacciones de artículos.'>
          {
            loading && <div className='w-full flex justify-center'>
              <Loader2 className='size-12 animate-spin'/>
            </div>
          }
          {
            transaction && <DataTable columns={columns} data={transaction}/>
          }
          {
            error && <div className='w-full flex justify-center text-sm text-muted-foreground'>Hubo un error...</div>
          }
      </ContentLayout>
    )
}

export default TransactionPage
