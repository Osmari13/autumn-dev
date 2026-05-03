import { Navbar } from "./Navbar";

interface ContentLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, description, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="container mx-auto pt-8 pb-12 px-4 sm:px-8">
        {description !== undefined && (
          <div className="mb-8 pb-6 border-b border-[#E0D4C8] dark:border-white/[0.06]">
            <h1 className="font-cormorant font-medium italic text-[2.4rem] leading-tight text-foreground tracking-wide">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">{description}</p>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
