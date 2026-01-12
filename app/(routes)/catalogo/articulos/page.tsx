"use client"

import { useGetArticles } from '@/actions/articles/actions'
import { ContentLayout } from '@/components/sidebar/ContentLayout'
import { Loader2 } from 'lucide-react'
import { columns } from './columns'
import { DataTable } from './data-table'


const ArticlePage = () => {
    const {data: articles, loading, error} = useGetArticles()
    return (
      <ContentLayout title='Articulos'>
          <div className="text-center mt-6">
              <h1 className='text-5xl font-bold'>Articulos</h1>
              <p className="text-muted-foreground italic text-sm">Aquí puede llevar el control de los Articulos que han sido registrados en el sistema.</p>
          </div>
          {
            loading && <div className='w-full flex justify-center'>
              <Loader2 className='size-12 animate-spin'/>
            </div>
          }
          {
            articles && <DataTable columns={columns} data={articles}/>
          }
          {
            error && <div className='w-full flex justify-center text-sm text-muted-foreground'>Hubo un error...</div>
          }
      </ContentLayout>
    )
}

export default ArticlePage
