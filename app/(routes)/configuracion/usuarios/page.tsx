'use client'

import { useGetUsers } from '@/actions/users/actions'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import { ContentLayout } from '@/components/sidebar/ContentLayout'
import { columns } from './columns'
import { DataTable } from './data-table'
import { Loader2 } from 'lucide-react'

const UsersPage = () => {
  const { data, loading } = useGetUsers()
  return (
    <ContentLayout title='Usuarios' description='Administración de accesos y roles de los usuarios del sistema.'>
      <ProtectedRoute roles={['ADMIN', 'AUDITOR']}>
        {
          loading && <Loader2 className='size-4 animate-spin' />
        }
        {
          data && <DataTable columns={columns} data={data} />
        }
      </ProtectedRoute>
    </ContentLayout>
  )
}

export default UsersPage
