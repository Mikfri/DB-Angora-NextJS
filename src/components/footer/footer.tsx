// src/components/footer/footer.tsx
'use client'
import { Link } from "@heroui/react";

export default function Footer() {
    return (
        <footer className="w-full py-6 px-4 mt-8">
            <div className="max-w-7xl mx-auto bg-zinc-900/70 backdrop-blur-md backdrop-saturate-150 rounded-lg border border-zinc-800/50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">DenBlå-Angora</h3>
                        <p className="text-sm text-zinc-400">
                            Et dansk kaninregister med fokus på avl og køb/salg af kanin relaterede produkter. Heraf uld, garn og skind.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Hurtige Links</h3>
                        <div className="flex flex-col gap-2">
                            <Link href="/sale" className="text-sm text-zinc-400 hover:text-zinc-200">Til Salg</Link>
                            {/* <Link href="/about" className="text-sm text-zinc-400 hover:text-zinc-200">Om Os</Link>
                            <Link href="/contact" className="text-sm text-zinc-400 hover:text-zinc-200">Kontakt</Link> */}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
                        <p className="text-sm text-zinc-400">Email: kontakt@db-angora.dk</p>
                    </div>
                </div>
                <div className="mt-8 pt-4 border-t border-zinc-400/50 text-center text-sm text-zinc-400">
                    © {new Date().getFullYear()} DenBlå-Angora. Alle rettigheder forbeholdes.
                </div>
            </div>
        </footer>
    );
}