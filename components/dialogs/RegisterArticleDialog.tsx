'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { useState } from "react"

import ArticleForm from "../forms/ArticleForm"

export function RegisterArticleDialog() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-bold">Registrar Articulo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 rounded-lg">
        <DialogHeader>
          <DialogTitle>Registrar</DialogTitle>
          <DialogDescription>
            Rellene el formulario para registrar un articulo.
          </DialogDescription>
        </DialogHeader>
        <ArticleForm onClose={() => setOpen(false)} />
        <DialogFooter className="sm:justify-start">
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}