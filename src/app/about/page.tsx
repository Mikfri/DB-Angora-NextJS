// /app/about/page.tsx
import React from "react";

// If you have an MDX loader, you could import a markdown file instead:
// import AboutContent from "../../content/about.md";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="text-3xl font-bold mb-4">Om DB-Angora</h1>
      <p className="mb-2">
        Velkommen til DB-Angora! Dette er et Next.js projekt med .NET-backend,
        EF Core til databaseadgang, og Microsoft Identity til brugerautentifikation.
        Her kan du læse om, hvad vi gør, og hvorfor vi gør det.
      </p>
      <p className="mb-2">
        Projektet bruger en RESTful API til at hente blogindlæg, og alle blogindlæg gemmes
        i en SQL Server via EF Core. “About” siden er dog en statisk komponent,
        da den sjældent ændres.
      </p>
      <p className="mb-2">
        Udviklet af dig som datamatiker dimmitend, og hostet i Danmark.
      </p>
    </main>
  );
}