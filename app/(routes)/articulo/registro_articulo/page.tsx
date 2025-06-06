"use client"

import ArticleForm from '@/components/forms/ArticleForm'
import { ContentLayout } from '@/components/sidebar/ContentLayout'


const ProviderPage = () => {
  return (
    <ContentLayout title='Boletos'>
      <div className="text-center mt-4">
        <h1 className='text-5xl font-bold mb-3'>Registro de Boletos</h1>
        <p className="text-muted-foreground italic text-sm">Rellene los diferentes datos para el registro de un boleto</p>
      </div>
      <ArticleForm />
    </ContentLayout>
  )
}

export default ProviderPage
