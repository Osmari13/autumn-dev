"use client"

import TransactionForm from '@/components/forms/TransactionForm'
import { ContentLayout } from '@/components/sidebar/ContentLayout'
import { useRouter } from 'next/navigation'


const TransactionPage = () => {
  // const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <ContentLayout title="Transacción" description="Rellene los datos para el registro de una nueva transacción.">
      <TransactionForm
        onClose={() => router.push("/transaccion")}
        isEditing={false}
      />
    </ContentLayout>
  )
}

export default TransactionPage
