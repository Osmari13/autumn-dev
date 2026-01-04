import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { HandCoins, Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import PassangerForm from "../forms/CategoryForm"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { useDeleteArticle } from "@/actions/articles/actions"
import ArticleForm from "../forms/ArticleForm"
import TransactionForm from "../forms/TransactionForm"
import { useDeleteTransaction } from "@/actions/transactions/actions"
import PaymentTransactionForm from "../forms/PaymentTransactionForm"
import { useGetTransaction } from "@/actions/payment/actions"

const TransactionDropdownActions = ({ id }: { id: string }) => {
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState<boolean>(false);
  const [isDialogOpen1, setIsDialogOpen1] = useState<boolean>(false); // Delete dialog
  // const [isDialogOpen2, setIsDialogOpen2] = useState<boolean>(false); // Edit dialog
  const [isDialogOpen3, setIsDialogOpen3] = useState<boolean>(false); // Transaction dialog

  const { deleteTransaction } = useDeleteTransaction();
  const stableId = useMemo(() => id ?? null, [id]);
  const { data: transaction, loading, error } = useGetTransaction(stableId);

  const handleDelete = async (id: string) => {
    await deleteTransaction.mutateAsync(id);
    setIsDialogOpen3(false);
  };

  return (
    <>
      {/* Dropdown Menu for Edit/Delete */}
      <DropdownMenu open={isDropdownMenuOpen} onOpenChange={setIsDropdownMenuOpen}>
        <DropdownMenuTrigger>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="flex gap-2 justify-center">
          {/* Realizar la funcion de transaccion */}
          {/* Transaction Option */}
          <DropdownMenuItem  onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); 
              setIsDialogOpen1(true);
              setIsDropdownMenuOpen(false);
            }}>
            <HandCoins className="size-6 text-green-600 cursor-pointer" />
          </DropdownMenuItem>

          {/* Edit Option */}
          {/* <DropdownMenuItem onClick={() => {
            setIsDialogOpen2(true);
            setIsDropdownMenuOpen(false);
          }}>
            <Pencil className="size-4 cursor-pointer" />
          </DropdownMenuItem> */}

          {/* Delete Option */}
          <DropdownMenuItem onClick={() => {
            setIsDialogOpen3(true);
            setIsDropdownMenuOpen(false);
          }}>
            <Trash2 className='size-5 text-red-500' />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Transaction Article Dialog */}
     <Dialog
        open={isDialogOpen1}
        onOpenChange={(open) => {
          // Solo sincroniza el estado con el valor que entrega Radix
          console.log("onOpenChange:", open);
          setIsDialogOpen1(open)
        }}
        modal={true}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Añadir Transaccion del Articulo</DialogTitle>
            <DialogDescription>
              Registre los Detalles de la Transaccion del Articulo
            </DialogDescription>
          </DialogHeader>
           {isDialogOpen1 && <PaymentTransactionForm id={id} transaction={transaction} onClose={() => setIsDialogOpen1(false)} />}
        </DialogContent>
      </Dialog>

      
      {/* Edit Transaction Dialog // HACER QUE ESTO TE LLEVE A UNA PAGINA DE EDICION */}
      {/* <Dialog open={isDialogOpen2} onOpenChange={setIsDialogOpen2}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Pasajero</DialogTitle>
            <DialogDescription>
              Actualice los detalles del pasajero
            </DialogDescription>
          </DialogHeader>
          <ArticleForm isEditing id={id} onClose={() => setIsDialogOpen2(false)} />
        </DialogContent>
      </Dialog>  */}


      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen3} onOpenChange={setIsDialogOpen3}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">¿Seguro que desea eliminar el pasajero?</DialogTitle>
            <DialogDescription className="text-center p-2 mb-0 pb-0">
              Esta acción es irreversible y estaría eliminando por completo el pasajero seleccionado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 md:gap-0">
            <Button className="bg-rose-400 hover:bg-white hover:text-black hover:border hover:border-black" onClick={() => setIsDialogOpen3(false)} type="button">
              Cancelar
            </Button>
            <Button
              disabled={deleteTransaction.isPending} // Disable button while mutation is pending
              className="hover:bg-white hover:text-black hover:border hover:border-black transition-all"
              onClick={() => handleDelete(id)}
            >
              {deleteTransaction.isPending ? <Loader2 className="animate-spin" /> : "Confirmar"} {/* Show loader */}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
    </>
  );
};

export default TransactionDropdownActions;
