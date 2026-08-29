import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function MarketingLayout(
  { children } : { children?: React.ReactNode }
) {
  return (
    <div
      className="min-h-dvh grid grid-rows-[auto_1fr_auto]">
        <Header />
        { children }
        <Footer />
    </div>
  )
}
