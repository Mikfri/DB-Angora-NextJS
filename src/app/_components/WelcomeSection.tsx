// src/app/_components/WelcomeSection.tsx
export default function WelcomeSection() {
  return (
    <section id="welcome" className="flex flex-col justify-center items-center gap-6 text-zinc-100">
      <h1 className="site-title">Velkommen til DenBlå-Angora</h1>
      <p className="max-w-3xl text-center">
        Dette er en tidlig alpha version af et kanin-register, hvor det er muligt at oprette slette og redigere kaniner af forskellige racer. Vi udruller løbende opdateringer ud så hold øje med siden.
      </p>
    </section>
  );
}