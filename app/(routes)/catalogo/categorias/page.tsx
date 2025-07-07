"use client"

import { ContentLayout } from '@/components/sidebar/ContentLayout'
import { Loader2 } from 'lucide-react'
import { columns } from './columns'
import { DataTable } from './data-table'
import { useGetCategories } from '@/actions/categories/actions'


const CategoryPage = () => {
  const {data: categories, loading, error} = useGetCategories()
  return (
    <ContentLayout title='Categorias'>
        <div className="text-center mt-6">
            <h1 className='text-5xl font-bold'>Categorias</h1>
            <p className="text-muted-foreground italic text-sm">Aquí puede llevar el control de los Categorias que han sido registrados en el sistema.</p>
        </div>
        {
          loading && <div className='w-full flex justify-center'>
            <Loader2 className='size-12 animate-spin'/>
          </div>
        }
        {
          categories && <DataTable columns={columns} data={categories}/>
        }
        {
          error && <div className='w-full flex justify-center text-sm text-muted-foreground'>Hubo un error...</div>
        }
    </ContentLayout>
  )
}

export default CategoryPage
