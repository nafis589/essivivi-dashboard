export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="w-full max-w-md md:max-w-xl">
        <div className="flex flex-col items-center space-y-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="flex items-center gap-2">
            {/* Replace with your actual logo component or image */}
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg ring-4 ring-primary/5">
              F
            </div>
            <span className="text-2xl font-bold tracking-tight">FlowCommerce</span>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
