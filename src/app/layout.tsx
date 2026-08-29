import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";

export const metadata: Metadata = {
  title: "Nex0 - The agents brain",
  description: "The app built for constructing personalized AI agents",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.svg",
    apple: [
      { url: "/app_icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
    lang="es"
    className="scroll-smooth antialiased font-opensans">
      <body className="min-h-dvh flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
