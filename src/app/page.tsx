// src/app/page.tsx
'use client';

import { Button } from "@nextui-org/react";
import { GiRabbit } from "react-icons/gi";

export default function Home() {
  return (
    // Add padding for content alignment
    <div className="p-4 flex flex-col justify-center items-center mt-20 gap-6 text-zinc-100">
      <GiRabbit size={100} className="text-emerald-500" />
      <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        Velkommen til DenBlå-Angora
      </h1>
      <Button className="bg-emerald-600 hover:bg-emerald-700">
        Click me
      </Button>
    </div>
  );
}