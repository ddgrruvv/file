import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "File Manager",
    description: "file manager",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={`${inter.className} bg-[#1b5e20]`}>
                {children}
        </body>
        </html>
    );
}
