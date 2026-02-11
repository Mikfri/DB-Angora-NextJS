// src/app/_components/WelcomeSection.tsx
export default function WelcomeSection() {
  return (
    <div className="w-full">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6">
        <section id="welcome" className="flex flex-col justify-center items-start gap-6 py-10">
          {/* Hero header med CRAP principper */}
          <div className="mb-6 w-full">
            <div className="w-full mx-auto max-w-3xl md:max-w-4xl">
              <h1 className="section-title mb-4">
                Velkommen til DenBlå-Angora
              </h1>
              
              <p className="section-description mb-8">
                Dette er en tidlig version af et kanin-register, hvor en lille håndfuld brugere er istand til at holde styr på deres kaniner ved let at kunne se dens relationer - børn og forældre - og evt indavlskoefficient. Vi udruller løbende opdateringer, så hold øje med siden.
              </p>
              
              {/* Video container med forbedret spacing */}
              <div className="mt-8">
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-border/50">
                  <iframe
                    src="https://www.youtube.com/embed/en3_STEyxno"
                    title="Den Blå Angora - Introduktionsvideo"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <p className="text-sm text-muted mt-3 text-left">
                  Se videoen på{" "}
                  <a
                    href="https://www.youtube.com/watch?v=en3_STEyxno"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium transition-colors"
                  >
                    YouTube
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
