import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "YouQuery - Your Query Solution",
  description: "A powerful query tool for your data needs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={`antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
