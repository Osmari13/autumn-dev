"use client"

import { useGetArticles } from '@/actions/articles/actions'
import { ContentLayout } from '@/components/sidebar/ContentLayout'
import { Loader2 } from 'lucide-react'
import { columns } from './columns'
import { DataTable } from './data-table'


const ArticlePage = () => {
    const {data: articles, loading, error} = useGetArticles()
    return (
      <ContentLayout title='Articulos' description='Lleve el control de los artículos registrados en el sistema.'>
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
