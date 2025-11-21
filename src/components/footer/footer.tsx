// src/components/footer/footer.tsx
'use client'
import { Link } from "@heroui/react";
import { ROUTES } from '@/constants/navigationConstants';

export default function Footer() {
    return (
        <footer className="app-footer">
            <div className="max-w-screen-2xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Om DenBlå-Angora */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">
                            DenBlå-Angora
                        </h3>
                        <p className="text-sm text-foreground/60">
                            Et dansk kaninregister med fokus på avl og køb/salg af kanin relaterede produkter. Heraf uld, garn og skind.
                        </p>
                    </div>

                    {/* Nyttige Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">
                            Nyttige Links
                        </h3>
                        <div className="flex flex-col gap-2">
                            <Link 
                                href={ROUTES.SALE.BASE} 
                                className="footer-link"
                            >
                                Salg
                            </Link>
                            <Link 
                                href={ROUTES.BLOGS.BASE} 
                                className="footer-link"
                            >
                                Blogs
                            </Link>
                            {/* Uncomment når siderne er klar */}
                            {/* <Link href="/about" className="footer-link">Om Os</Link> */}
                            {/* <Link href="/contact" className="footer-link">Kontakt</Link> */}
                        </div>
                    </div>

                    {/* Kontakt */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">
                            Kontakt
                        </h3>
                        <p className="text-sm text-foreground/60">
                            Email: kontakt@db-angora.dk
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-4 border-t border-divider text-center text-sm text-foreground/60">
                    © {new Date().getFullYear()} DenBlå-Angora. Alle rettigheder forbeholdes.
                </div>
            </div>
        </footer>
    );
}