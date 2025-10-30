// src/app/account/myRabbits/TestMatingTab.tsx
'use client';
import { useEffect, useState, useMemo } from "react";
import { useRabbitsOwnedStore } from "@/store/rabbitsOwnedStore";
import { getTestMatingPedigree } from "@/app/actions/rabbit/rabbitCrudActions";
import { Spinner, Button } from "@heroui/react";
import PedigreeTable from "@/components/pedigree/pedigreeTable/pedigreeTable";
import RabbitPedigreeCard from "@/components/cards/rabbitPedigreeCard";
import { Rabbit_OwnedPreviewDTO, Rabbit_PedigreeDTO, PedigreeResultDTO } from "@/api/types/AngoraDTOs";

// Mapping-funktion fra OwnedPreview til PedigreeDTO
function mapOwnedPreviewToPedigree(r: Rabbit_OwnedPreviewDTO): Rabbit_PedigreeDTO {
  return {
    EarCombId: r.earCombId,
    NickName: r.nickName ?? null,
    Gender: r.gender ?? null,
    DateOfBirth: r.dateOfBirth ?? null,
    Race: r.race ?? null,
    Color: r.color ?? null,
    UserOriginName: r.originFullName ?? null,
    UserOwnerName: r.ownerFullName ?? null,
    ProfilePicture: r.profilePicture ?? null,
    InbreedingCoefficient: r.inbreedingCoefficient ?? null,
    Relation: "",
    Generation: 0,
    AncestorPaths: [],
    Father: null,
    Mother: null,
  };
}

export default function TestMatingTab() {
  const { filteredRabbits, fetchRabbits, filters } = useRabbitsOwnedStore();
  const [selectedDoe, setSelectedDoe] = useState<Rabbit_OwnedPreviewDTO | null>(null);
  const [selectedBuck, setSelectedBuck] = useState<Rabbit_OwnedPreviewDTO | null>(null);
  const [manualFatherId, setManualFatherId] = useState<string>("");
  const [manualMotherId, setManualMotherId] = useState<string>("");
  const [result, setResult] = useState<PedigreeResultDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filteredRabbits.length) fetchRabbits();
    setSelectedDoe(null);
    setSelectedBuck(null);
    setResult(null);
    setError(null);
    setManualFatherId("");
    setManualMotherId("");
  }, [filters, fetchRabbits, filteredRabbits.length]);

  const does = useMemo(
    () => filteredRabbits.filter(r => r.gender === "Doe" && !r.dateOfDeath),
    [filteredRabbits]
  );
  const bucks = useMemo(
    () => filteredRabbits.filter(r => r.gender === "Buck" && !r.dateOfDeath),
    [filteredRabbits]
  );

  const handleTestPedigree = async () => {
    const fatherId = manualFatherId.trim() || selectedBuck?.earCombId;
    const motherId = manualMotherId.trim() || selectedDoe?.earCombId;
    if (!fatherId || !motherId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await getTestMatingPedigree(fatherId, motherId, 4);
      if (res.success) setResult(res.data);
      else setError(res.error);
    } catch {
      setError("Uventet fejl");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Doe cards */}
        <div>
          <h3 className="font-medium mb-2">Vælg hun (Doe)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {does.map(d => (
              <div
                key={d.earCombId}
                className={`cursor-pointer transition-shadow ${selectedDoe?.earCombId === d.earCombId ? "ring-2 ring-secondary" : "hover:shadow-lg"}`}
                onClick={() => {
                  setSelectedDoe(d);
                  setManualMotherId(d.earCombId);
                }}
              >
                <RabbitPedigreeCard rabbit={mapOwnedPreviewToPedigree(d)} />
              </div>
            ))}
            {!does.length && (
              <div className="text-xs text-zinc-400 col-span-full">Ingen hun-kaniner fundet</div>
            )}
          </div>
        </div>
        {/* Buck cards */}
        <div>
          <h3 className="font-medium mb-2">Vælg han (Buck)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bucks.map(b => (
              <div
                key={b.earCombId}
                className={`cursor-pointer transition-shadow ${selectedBuck?.earCombId === b.earCombId ? "ring-2 ring-primary" : "hover:shadow-lg"}`}
                onClick={() => {
                  setSelectedBuck(b);
                  setManualFatherId(b.earCombId);
                }}
              >
                <RabbitPedigreeCard rabbit={mapOwnedPreviewToPedigree(b)} />
              </div>
            ))}
            {!bucks.length && (
              <div className="text-xs text-zinc-400 col-span-full">Ingen han-kaniner fundet</div>
            )}
          </div>
        </div>
      </div>

      {/* Inputfelter i hver deres kolonne */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs text-zinc-400 mb-1" htmlFor="manualMotherId">
            Øremærke på hun (Doe)
          </label>
          <input
            id="manualMotherId"
            type="text"
            value={manualMotherId}
            onChange={e => {
              setManualMotherId(e.target.value);
              setSelectedDoe(null);
            }}
            placeholder="fx 1234-5678"
            className="w-full px-2 py-1 rounded border border-zinc-600 bg-zinc-900 text-zinc-200 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1" htmlFor="manualFatherId">
            Øremærke på han (Buck)
          </label>
          <input
            id="manualFatherId"
            type="text"
            value={manualFatherId}
            onChange={e => {
              setManualFatherId(e.target.value);
              setSelectedBuck(null);
            }}
            placeholder="fx 1234-5678"
            className="w-full px-2 py-1 rounded border border-zinc-600 bg-zinc-900 text-zinc-200 text-sm"
          />
        </div>
      </div>

      {/* Knap og spinner */}
      <div className="flex gap-3 mt-4">
        <Button
          color="primary"
          disabled={
            loading ||
            (!manualFatherId.trim() && !selectedBuck) ||
            (!manualMotherId.trim() && !selectedDoe)
          }
          onPress={handleTestPedigree}
        >
          Test stamtavle
        </Button>
        {loading && <Spinner size="sm" />}
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {result && (
        <div className="space-y-6 mt-8">
          {/* Indavlskoefficient og COI-bidragydere */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1 bg-zinc-800/60 border border-zinc-700/30 rounded-lg p-4 flex flex-col justify-center">
              <h4 className="text-sm text-zinc-300 mb-1">Indavlskoefficient</h4>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl font-semibold text-blue-400">
                  {(result.CalculatedInbreedingCoefficient * 100).toFixed(2)}%
                </span>
                <span className="text-xs text-zinc-400">
                  {result.CalculatedInbreedingCoefficient > 0.125
                    ? "Højt niveau af indavl"
                    : result.CalculatedInbreedingCoefficient > 0
                      ? "Moderat niveau af indavl"
                      : "Ingen registreret indavl"}
                </span>
              </div>
            </div>
            <div className="md:col-span-2 overflow-hidden bg-zinc-800/50 border border-zinc-700/30 rounded-lg">
              <div className="px-4 py-3 border-b border-zinc-700/50">
                <h3 className="text-sm font-medium text-zinc-200">COI-bidragydere</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-zinc-400 border-b border-zinc-700/30">
                      <th className="px-4 py-2">Kanin</th>
                      <th className="px-4 py-2">Bidrag</th>
                      <th className="px-4 py-2">Bidrag (%)</th>
                      <th className="px-4 py-2">Stier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700/30">
                    {result.COIContributors && result.COIContributors.length > 0 ? (
                      result.COIContributors.map((contrib, idx) => (
                        <tr key={contrib.EarCombId ?? idx} className="text-xs">
                          <td className="px-4 py-2 text-zinc-200">{contrib.NickName || contrib.EarCombId}</td>
                          <td className="px-4 py-2 text-blue-400">
                            {(contrib.Contribution * 100).toFixed(2)}%
                          </td>
                          <td className="px-4 py-2 text-zinc-400">{contrib.ContributionPercent.toFixed(1)}%</td>
                          <td className="px-4 py-2 text-zinc-400">{(contrib.AncestorPaths || []).join(', ')}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-zinc-500 text-sm">Ingen COI-bidragydere fundet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="relative border border-zinc-700/50 rounded-lg overflow-auto">
            <PedigreeTable pedigree={result.Pedigree} generations={4} onGenerationsChange={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
}