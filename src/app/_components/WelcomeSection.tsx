// src/app/_components/WelcomeSection.tsx
export default function WelcomeSection() {
  return (
    <div className="w-full">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6">
        <section id="welcome" className="flex flex-col justify-center items-start gap-6 py-10">
          <div className="mb-4 w-full">
            {/* Shared width wrapper: h1, paragraph + video får samme max-width and alignment */}
            <div className="w-full mx-auto max-w-3xl md:max-w-4xl">
              <h1 className="site-title text-left mb-4">Velkommen til DenBlå-Angora</h1>
              <p className="text-left">
                Dette er en tidlig alpha version af et kanin-register, hvor det er muligt at oprette slette og redigere kaniner af forskellige racer. Vi udruller løbende opdateringer ud så hold øje med siden.
              </p>
              <div className="mt-6">
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
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
                <p className="text-sm text-muted mt-2 text-left">
                  Se videoen på{" "}
                  <a
                    href="https://www.youtube.com/watch?v=en3_STEyxno"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    YouTube
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}