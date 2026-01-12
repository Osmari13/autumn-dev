"use client"

import TransactionForm from '@/components/forms/TransactionForm'
import { ContentLayout } from '@/components/sidebar/ContentLayout'
import { useRouter } from 'next/navigation'


const TransactionPage = () => {
  // const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <ContentLayout title="Transacción">
      <div className="text-center mt-4">
        <h1 className="text-5xl font-bold mb-3">Registro de Transacción</h1>
        <p className="text-muted-foreground italic text-sm">
          Rellene los diferentes datos para el registro de una transacción
        </p>
      </div>
      <TransactionForm
        onClose={() => router.push("/transaccion")}
        isEditing={false}
      />
    </ContentLayout>
  )
}

export default TransactionPage
