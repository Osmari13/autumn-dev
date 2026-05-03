'use client';

import { useCreateArticle, useGetArticle, useGetArticlesCount, useUpdateArticle } from "@/actions/articles/actions";
import { useGetCategories } from "@/actions/categories/actions";
import { useGetProviders } from "@/actions/providers/actions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { Article } from "@/types";
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, ImageIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { z } from 'zod';
import { RegisterCategoryDialog } from "../dialogs/RegisterCategoryDialog";
import { RegisterProviderDialog } from "../dialogs/RegisterProviderDialog";
import { AmountInput } from "../misc/AmountInput";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  serial: z.string(),
  quantity: z.string(),
  priceUnit: z.string(),
  price: z.string(),
  image: z.string().optional(),
  tag: z.string().optional(),
  categoryId: z.string(),
  providerId: z.string(),
});

interface FormProps {
  onClose: () => void;
  isEditing?: boolean;
  id?: string;
}

const ArticleForm = ({ id, onClose, isEditing = false }: FormProps) => {
  const [initialValues, setInitialValues] = useState<Article | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openProvider, setOpenProvider] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      serial: "",
      quantity: "",
      priceUnit: "",
      price: "",
      image: "",
      tag: "",
      categoryId: "",
      providerId: "",
    },
  });

  const { data: session } = useSession();
  const { data: providers, loading: providersLoading, error: providersError } = useGetProviders();
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useGetCategories();
  const { data } = useGetArticle(id ?? null);
  const { count: articlesCount } = useGetArticlesCount();
  const { createArticle } = useCreateArticle();
  const { updateArticle } = useUpdateArticle();

  const { watch, setValue } = form;
  const quantity = watch('quantity');
  const priceUnit = watch('priceUnit');
  const watchedCategoryId = watch('categoryId');

  useEffect(() => {
    const calculatedPrice = (parseFloat(quantity || "0") * parseFloat(priceUnit || "0")).toFixed(2);
    setValue('price', calculatedPrice);
  }, [quantity, priceUnit, setValue]);

  useEffect(() => {
    if (data) {
      setInitialValues(data);
      form.reset({
        name: data.name,
        description: data.description ?? "",
        serial: data.serial,
        quantity: data.quantity.toString(),
        priceUnit: data.priceUnit.toString(),
        price: data.price.toString(),
        image: data.image ?? "",
        tag: data.tag ?? "",
        providerId: data.provider?.id ?? "",
        categoryId: data.category?.id ?? "",
      });
      setPreviewImage(data.image ?? null);
    }
  }, [data, form]);

  const generateSerial = (categoryId: string): string => {
    const category = categories?.find((c) => c.id === categoryId);
    const catPrefix = (category?.name ?? "ART")
      .toUpperCase()
      .replace(/\s+/g, "")
      .slice(0, 3)
      .padEnd(3, "X");
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const seq = String(articlesCount + 1).padStart(4, "0");
    return `${catPrefix}-${dd}${mm}${yyyy}-${seq}`;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const quantityInMiliunits = parseFloat(values.quantity);
    const priceUnitInMiliunits = parseFloat(values.priceUnit);
    const priceInMiliunits = parseFloat(values.price);

    let imageUrl: string = values.image || "";
    if (selectedFile) {
      const res = await startUpload([selectedFile]);
      const uploadedUrl = res?.[0]?.ufsUrl || res?.[0]?.url;
      if (!uploadedUrl) {
        toast.error("Error al subir la imagen.");
        return;
      }
      imageUrl = uploadedUrl;
    }

    const generateTag = (name: string): string => {
      return name
        .toUpperCase()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^\w_]/g, "");
    };

    // Serial: keep existing when editing, auto-generate on create
    const serial = isEditing ? values.serial : generateSerial(values.categoryId);

    try {
      if (isEditing && initialValues) {
        await updateArticle.mutateAsync({
          id: initialValues.id,
          name: values.name.toUpperCase(),
          serial,
          image: imageUrl,
          tag: generateTag(values.name),
          description: values.description || "",
          categoryId: values.categoryId,
          providerId: values.providerId,
          updated_by: session?.user.username || "",
          quantity: quantityInMiliunits,
          priceUnit: priceUnitInMiliunits,
          price: priceInMiliunits,
        });
      } else {
        await createArticle.mutateAsync({
          name: values.name.toUpperCase(),
          serial,
          image: imageUrl,
          tag: generateTag(values.name),
          description: values.description || "",
          categoryId: values.categoryId,
          providerId: values.providerId,
          registered_by: session?.user.username || "",
          quantity: quantityInMiliunits,
          priceUnit: priceUnitInMiliunits,
          price: priceInMiliunits,
        });
      }

      form.reset();
      setPreviewImage(null);
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el Articulo", {
        description: "Ocurrió un error, por favor intenta nuevamente.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("Errores de validación:", errors);
        })}
      >
        <div className='flex flex-col gap-5'>
          <div id="client-provider" className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Categoria</FormLabel>
                  <Popover open={openCategory} onOpenChange={setOpenCategory}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between rounded-lg border border-slate-200 dark:border-slate-700 shadow-none text-sm",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {categoriesLoading && <Loader2 className="size-4 animate-spin mr-2" />}
                          {field.value
                            ? <p>{categories?.find((category) => category.id === field.value)?.name}</p>
                            : "Seleccione categoria..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Busque una categoria..." />
                        <RegisterCategoryDialog />
                        <CommandList>
                          <CommandEmpty>No se ha encontrado una categoria.</CommandEmpty>
                          <CommandGroup>
                            {categories?.map((category) => (
                              <CommandItem
                                value={`${category.name}`}
                                key={category.id}
                                onSelect={() => {
                                  form.setValue("categoryId", category.id);
                                  setOpenCategory(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    category.id === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <p>{category.name}</p>
                              </CommandItem>
                            ))}
                            {categoriesError && <p className="text-sm text-muted-foreground">Ha ocurrido un error al cargar los datos...</p>}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="sr-only">Seleccione la categoria</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="providerId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Proveedor</FormLabel>
                  <Popover open={openProvider} onOpenChange={setOpenProvider}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between rounded-lg border border-slate-200 dark:border-slate-700 shadow-none text-sm",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {providersLoading && <Loader2 className="size-4 animate-spin mr-2" />}
                          {field.value
                            ? <p>{providers?.find((provider) => provider.id === field.value)?.name}</p>
                            : "Elige un proveedor..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Busque su proveedor..." />
                        <RegisterProviderDialog />
                        <CommandList>
                          <CommandEmpty>No se ha encontrado un proveedor.</CommandEmpty>
                          <CommandGroup>
                            {providers?.map((provider) => (
                              <CommandItem
                                value={`${provider.name}`}
                                key={provider.id}
                                onSelect={() => {
                                  form.setValue("providerId", provider.id);
                                  setOpenProvider(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    provider.id === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <p>{provider.name}</p>
                              </CommandItem>
                            ))}
                            {providersError && <p className="text-muted-foreground text-sm">Ha ocurrido un error al cargar los datos...</p>}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="sr-only">Seleccione al proveedor</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Nombre</FormLabel>
                  <FormControl>
                    <Input type="text" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 shadow-none" placeholder="Topo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Serial {!isEditing && <span className="normal-case tracking-normal text-slate-400 font-normal">(auto-generado)</span>}
                  </FormLabel>
                  <FormControl>
                    {isEditing ? (
                      <Input className="w-full rounded-lg border border-slate-200 dark:border-slate-700 shadow-none" {...field} />
                    ) : (
                      <div className={`w-full rounded-lg border border-dashed px-3 py-2 text-sm font-mono select-none transition-colors ${
                        watchedCategoryId
                          ? "border-primary/40 bg-primary/5 text-slate-700 dark:text-slate-300"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-400"
                      }`}>
                        {watchedCategoryId
                          ? generateSerial(watchedCategoryId)
                          : "Seleccione una categoría para previsualizar"}
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Cantidad</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Precio Unitario</FormLabel>
                  <FormControl>
                    <AmountInput {...field} placeholder="0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Precio Total</FormLabel>
                  <FormControl>
                    <AmountInput {...field} placeholder="0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Imagen del Artículo</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 16 * 1024 * 1024) {
                            toast.error("La imagen es demasiado grande.", {
                              description: "El tamaño máximo permitido es 16 MB.",
                            });
                            e.target.value = "";
                            return;
                          }
                          setSelectedFile(file);
                          const localUrl = URL.createObjectURL(file);
                          setPreviewImage(localUrl);
                          form.setValue("image", "pending", { shouldValidate: false });
                        }}
                      />

                      {/* Upload zone */}
                      <div
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={cn(
                          "relative w-full h-36 rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden",
                          isUploading && "pointer-events-none opacity-60",
                          previewImage
                            ? "border-transparent"
                            : "border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                        )}
                      >
                        {previewImage ? (
                          <>
                            <img
                              src={previewImage}
                              alt="Vista previa"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-white text-xs font-semibold uppercase tracking-widest">Cambiar imagen</p>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                            {isUploading ? (
                              <Loader2 className="size-6 animate-spin" />
                            ) : (
                              <ImageIcon className="size-6" />
                            )}
                            <p className="text-xs font-medium">
                              {isUploading ? "Subiendo..." : "Haz clic para seleccionar"}
                            </p>
                            <p className="text-[10px] text-slate-300">PNG, JPG, WebP — máx. 8MB</p>
                          </div>
                        )}
                      </div>

                      {(field.value || selectedFile) && (
                        <button
                          type="button"
                          onClick={() => {
                            form.setValue("image", "", { shouldValidate: true });
                            setPreviewImage(null);
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="text-xs text-slate-500 hover:text-red-500 transition-colors underline underline-offset-2"
                        >
                          Quitar imagen
                        </button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2 w-full">
                  <FormLabel className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Observaciones</FormLabel>
                  <FormControl>
                    <Textarea className="w-full h-36 resize-none rounded-xl border border-slate-200 dark:border-slate-700 shadow-none text-sm" placeholder="Notas opcionales sobre el artículo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={createArticle.isPending || updateArticle.isPending || isUploading}
            type="submit"
            className="w-full h-11 rounded-xl font-semibold tracking-wide text-sm"
          >
            {createArticle.isPending || updateArticle.isPending || isUploading ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              isEditing ? "Actualizar Artículo" : "Registrar Artículo"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ArticleForm;
