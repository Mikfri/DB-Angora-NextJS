// src/components/footer/footer.tsx
'use client'
import { Link } from "@heroui/react";
import { ROUTES } from '@/constants/navigationConstants';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="app-footer">
            <div className="max-w-screen-2xl mx-auto px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* LEFT column — address + social (spans 2 columns on md+) */}
                    <div className="md:col-span-2">
                        {/* Sociale medier under adressen */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-foreground">Sociale medier</h3>
                            <div className="flex gap-3 mb-4">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="w-9 h-9 rounded-full bg-content1/90 flex items-center justify-center shadow-sm text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    <FaFacebookF size={18} />
                                </a>

                                <a
                                    href="https://www.instagram.com/denblaaangora"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="w-9 h-9 rounded-full bg-content1/90 flex items-center justify-center shadow-sm text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    <FaInstagram size={18} />
                                </a>

                                <a
                                    href="https://www.youtube.com/@DenBlåAngora"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="DenBlå-Angora på YouTube"
                                    className="w-9 h-9 rounded-full bg-content1/90 flex items-center justify-center shadow-sm text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    <FaYoutube size={18} />
                                </a>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">DenBlå-Angora</h3>
                        <address className="not-italic text-sm text-foreground/60 mb-4">
                            DenBlå-Angora<br />
                            Fynsvej 14<br />
                            4060 Kirke Såby<br />
                            <br />
                            <a href="mailto:kontakt@db-angora.dk" className="text-primary hover:underline">kontakt@db-angora.dk</a>
                        </address>
                    </div>

                    {/* CENTER — Quick links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">Nyttige links</h3>
                        <ul className="flex flex-col gap-2 text-sm">
                            <li><Link href={ROUTES.SALE.BASE} className="footer-link">Salg</Link></li>
                            <li><Link href={ROUTES.BLOGS.BASE} className="footer-link">Blogs</Link></li>
                            <li><Link href="/om" className="footer-link">Om os</Link></li>
                            <li><Link href="/contact" className="footer-link">Kontakt</Link></li>
                        </ul>
                    </div>

                    {/* RIGHT — small newsletter / CTA (keeps layout balanced) */}
                    {/* <div>
                        <h3 className="text-lg font-semibold mb-3 text-foreground">Nyhedsbrev</h3>
                        <form className="flex gap-2 items-center">
                            <input aria-label="E-mail" type="email" placeholder="Din e-mail" className="input input-sm flex-1" />
                            <button type="submit" className="btn btn-sm btn-primary">Tilmeld</button>
                        </form>
                    </div> */}
                </div>

                <div className="mt-2 pt-4 border-t border-divider text-center text-sm text-foreground/60"> {/* mindre gap */}
                    © {new Date().getFullYear()} DenBlå-Angora. Alle rettigheder forbeholdes.
                </div>
            </div>
        </footer>
    );
}