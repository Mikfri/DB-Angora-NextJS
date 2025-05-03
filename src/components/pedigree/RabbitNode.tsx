import { NodeProps } from 'reactflow';
import { useState } from 'react';
import { Rabbit_PedigreeDTO } from '@/api/types/AngoraDTOs';

interface RabbitNodeData {
  rabbit: Rabbit_PedigreeDTO;
  isInbreeding?: boolean;
}

// Custom node komponent med mere detaljeret information
export default function RabbitNode({ data }: NodeProps<RabbitNodeData>) {
  const { rabbit, isInbreeding } = data;
  const earCombId = rabbit.EarCombId || 'Ukendt ID';
  const [showDetails, setShowDetails] = useState(false);
  
  // Beregn alder baseret på fødselsdato
  const getAge = () => {
    if (!rabbit.DateOfBirth) return 'Ukendt alder';
    const dob = new Date(rabbit.DateOfBirth);
    const now = new Date();
    const ageInYears = now.getFullYear() - dob.getFullYear();
    const ageInMonths = now.getMonth() - dob.getMonth();
    
    if (ageInMonths < 0) {
      return `${ageInYears - 1} år, ${ageInMonths + 12} mdr`;
    }
    return `${ageInYears} år, ${ageInMonths} mdr`;
  };
  
  return (
    <div 
      className={`${isInbreeding ? 'bg-purple-900/50 border-purple-700' : 'bg-zinc-800 border-zinc-700'}
                 border rounded-lg p-2 shadow-md text-left transition-all hover:shadow-lg hover:border-blue-500/50`} 
      style={{ width: 200, minHeight: 80 }}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Relation badge - Viser relationen i øverste højre hjørne */}
      {rabbit.Relation && rabbit.Relation !== 'Selv' && (
        <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full px-2 py-0.5 text-xs text-white font-medium">
          {rabbit.Relation}
        </div>
      )}
      
      {/* Generation badge - Vises i øverste venstre hjørne */}
      <div className={`absolute -top-2 -left-2 rounded-full px-2 py-0.5 text-xs text-white font-medium
        ${rabbit.Generation === 0 ? 'bg-emerald-600' : 
          rabbit.Generation === 1 ? 'bg-sky-600' : 
          rabbit.Generation === 2 ? 'bg-amber-600' :
          rabbit.Generation >= 3 ? 'bg-orange-600' : 'bg-slate-600'}`}>
        Gen {rabbit.Generation}
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        {/* Mini profile picture */}
        <div className="w-9 h-9 flex-shrink-0 rounded-full overflow-hidden bg-zinc-700">
          {rabbit.ProfilePicture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={rabbit.ProfilePicture} 
              alt={rabbit.NickName || ""} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xs">
              {earCombId.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-medium text-sm text-white truncate">
            {rabbit.NickName || 'Unavngivet'}
          </h4>
          <p className="text-xs text-zinc-400 truncate">{earCombId}</p>
        </div>
      </div>
      <div className="mt-1 text-xs">
        <div className="flex justify-between text-zinc-400">
          <span className="truncate">{rabbit.Race || ''}</span>
          <span className="truncate">{rabbit.Color || ''}</span>
        </div>
        <div className="text-zinc-500 flex justify-between">
          <span>{rabbit.DateOfBirth ? new Date(rabbit.DateOfBirth).toLocaleDateString('da-DK') : ''}</span>
          <span>{rabbit.DateOfBirth ? getAge() : ''}</span>
        </div>
      </div>
      
      {/* Indavlsinformation */}
      {rabbit.InbreedingCoefficient > 0 && (
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-blue-400">Indavl:</span>
          <span className="text-xs font-medium text-blue-400">
            {(rabbit.InbreedingCoefficient * 100).toFixed(1)}%
          </span>
        </div>
      )}
      
      {isInbreeding && (
        <div className="mt-1 text-xs text-purple-300 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span>Indavlsforekomst</span>
        </div>
      )}
      
      {/* Udvidelsesskjult information */}
      {showDetails && (
        <div className="mt-2 pt-2 border-t border-zinc-700/50 text-xs">
          {/* Opdrætter og ejer information */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            {rabbit.UserOriginName && (
              <>
                <span className="text-zinc-500">Opdrætter:</span>
                <span className="text-zinc-300 truncate">{rabbit.UserOriginName}</span>
              </>
            )}
            
            {rabbit.UserOwnerName && (
              <>
                <span className="text-zinc-500">Ejer:</span>
                <span className="text-zinc-300 truncate">{rabbit.UserOwnerName}</span>
              </>
            )}
            
            {/* Indavlsdetaljer - kun første par detaljer når det er i fokus */}
            {rabbit.InbreedingDetails && rabbit.InbreedingDetails.length > 0 && (
              <div className="col-span-2 mt-2">
                <p className="text-zinc-400 mb-1 font-medium">Indavlsbidrag (top 3):</p>
                <div className="max-h-32 overflow-auto bg-black/20 rounded p-1">
                  {rabbit.InbreedingDetails.slice(0, 3).map((detail, idx) => (
                    <div key={idx} className="grid grid-cols-2 mb-1 gap-1">
                      <div className="text-zinc-500 truncate">{detail.AncestorId}</div>
                      <div className="text-right">
                        <span className="text-blue-400 font-medium">{(detail.Contribution * 100).toFixed(1)}%</span>
                        <span className="text-zinc-500 text-[10px] ml-1">
                          (F:{detail.FatherDepth}/M:{detail.MotherDepth})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center text-zinc-500 mt-1 text-[10px]">
            (Klik for at skjule detaljer)
          </div>
        </div>
      )}
      
      {!showDetails && (
        <div className="text-center text-zinc-500 mt-1 text-[10px]">
          (Klik for flere detaljer)
        </div>
      )}
    </div>
  );
}