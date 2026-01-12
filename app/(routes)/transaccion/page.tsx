"use client"

import ArticleForm from '@/components/forms/ArticleForm'
import { ContentLayout } from '@/components/sidebar/ContentLayout'
import { Loader2 } from 'lucide-react'
import { DataTable } from './data-table'
import { columns } from './columns'
import { useGetTransactions } from '@/actions/transactions/actions'


const TransactionPage = () => {
    const {data: transaction, loading, error} = useGetTransactions()
    return (
      <ContentLayout title='Transaccion'>
          <div className="text-center mt-6">
              <h1 className='text-5xl font-bold'>Transaccion</h1>
              <p className="text-muted-foreground italic text-sm">Aquí puede llevar el control de las Transacciones que han sido registrado de los articulos en el sistema.</p>
          </div>
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
