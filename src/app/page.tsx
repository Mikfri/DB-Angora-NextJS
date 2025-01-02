// src/app/page.tsx
'use client';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="p-4 flex flex-col justify-center items-center mt-20 gap-6 text-zinc-100">
      <Image 
        src="/images/DB-Angora.png"
        alt="DenBlå-Angora Logo"
        width={125}
        height={125}
        className="rounded-sm"
      />
      <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-950 to-sky-800 bg-clip-text text-transparent">
        Velkommen til DenBlå-Angora
      </h1>
      <p>Dette er en tidlig alpha version af et kanin-register, hvor det er muligt at oprette slette og redigere kaniner af forskellige racer. Vi udruller løbende opdateringer ud så hold øje med siden.</p>      
    </div>
  );
}