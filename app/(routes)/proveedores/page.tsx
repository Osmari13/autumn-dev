"use client"

import { useGetProviders } from '@/actions/providers/actions'
import { ContentLayout } from '@/components/sidebar/ContentLayout'
import { Loader2 } from 'lucide-react'
import { columns } from './columns'
import { DataTable } from './data-table'


const ProviderPage = () => {
  const {data: providers, loading, error} = useGetProviders()
  return (
    <ContentLayout title='Proveedores' description='Control de proveedores registrados y sus condiciones de pago.'>
        {
          loading && <div className='w-full flex justify-center'>
            <Loader2 className='size-12 animate-spin'/>
          </div>
        }
        {
          providers && <DataTable columns={columns} data={providers}/>
        }
        {
          error && <div className='w-full flex justify-center text-sm text-muted-foreground'>Hubo un error...</div>
        }
    </ContentLayout>
  )
}

export default ProviderPage
