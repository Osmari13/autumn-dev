'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Package2 } from "lucide-react"
import { useState } from "react"
import ArticleForm from "../forms/ArticleForm"

export function RegisterArticleDialog() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold tracking-wide">Registrar Artículo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl border-0 shadow-2xl gap-0 [&>button]:text-white [&>button]:top-4 [&>button]:right-4">
        {/* Branded header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-7 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-primary/10 blur-xl" />
          <div className="absolute bottom-0 left-1/3 w-24 h-24 rounded-full bg-primary/5 blur-lg" />
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-primary/60" />
          <div className="absolute top-5 left-8 w-1 h-1 rounded-full bg-white/20" />

          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Package2 className="w-4 h-4 text-primary" />
              </div>
              <DialogTitle className="text-white text-xl font-semibold tracking-tight">
                Nuevo Artículo
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-400 text-sm ml-12">
              Complete los campos para registrar el producto en inventario.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form area */}
        <div className="bg-white dark:bg-slate-950 px-8 py-6 max-h-[72vh] overflow-y-auto custom-scrollbar">
          <ArticleForm onClose={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}