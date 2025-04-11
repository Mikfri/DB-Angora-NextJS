// src/app/account/transferRequests/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Tabs, Tab, Spinner, Button } from '@heroui/react';
import MyNav from '@/components/nav/side/index/MyNav';
import { useNav } from '@/components/providers/Providers';
import { toast } from 'react-toastify';
import { TransferRequest_ReceivedDTO, TransferRequest_SentDTO } from '@/api/types/AngoraDTOs';
import { 
  getTransferRequests,
  respondToTransferRequest,
  deleteTransferRequest
} from '@/app/actions/transfers/transferRequestsActions';

export default function TransferRequestsPage() {
  const [receivedRequests, setReceivedRequests] = useState<TransferRequest_ReceivedDTO[]>([]);
  const [sentRequests, setSentRequests] = useState<TransferRequest_SentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setSecondaryNav } = useNav();

  // Navigation setup
  useEffect(() => {
    setSecondaryNav(<MyNav />);
    
    return () => {
      setSecondaryNav(null);
    };
  }, [setSecondaryNav]);

  // Indlæs overførselsanmodninger via server action
  const loadTransferRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Brug server action i stedet for direkte API-kald
      const result = await getTransferRequests();
      
      if (result.success) {
        setReceivedRequests(result.received);
        setSentRequests(result.sent);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Fejl ved indlæsning af overførselsanmodninger:', err);
      setError(`Fejl ved indlæsning af overførselsanmodninger: ${err instanceof Error ? err.message : 'Ukendt fejl'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Indlæs ved komponent-rendering
  useEffect(() => {
    loadTransferRequests();
  }, [loadTransferRequests]);

  // Håndter svar på anmodning (accept/afvis) med server action
  const handleRespond = useCallback(async (transferId: number, accept: boolean) => {
    setIsProcessing(transferId);
    try {
      // Brug server action i stedet for direkte API-kald
      const result = await respondToTransferRequest(transferId, accept);
      
      if (result.success) {
        toast.success(result.message);
        // Genindlæs data
        await loadTransferRequests();
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(`Fejl: ${err instanceof Error ? err.message : 'Ukendt fejl'}`);
    } finally {
      setIsProcessing(null);
    }
  }, [loadTransferRequests]);

  // Håndter sletning/annullering af anmodning med server action
  const handleDelete = useCallback(async (transferId: number) => {
    setIsProcessing(transferId);
    try {
      // Brug server action i stedet for direkte API-kald
      const result = await deleteTransferRequest(transferId);
      
      if (result.success) {
        toast.success(result.message);
        // Opdater lokalt eller genindlæs alle data
        setSentRequests(prev => prev.filter(req => req.id !== transferId));
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(`Fejl: ${err instanceof Error ? err.message : 'Ukendt fejl'}`);
    } finally {
      setIsProcessing(null);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 p-4 rounded-md my-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
      <h1 className="text-2xl font-bold mb-6">Overførselsanmodninger</h1>
      
      <Tabs aria-label="Overførselsanmodninger" color="primary" variant="solid">
        <Tab key="received" title={`Modtagne (${receivedRequests.length})`}>
          <div className="mt-4">
            {receivedRequests.length === 0 ? (
              <p className="text-gray-500">Du har ingen modtagne overførselsanmodninger.</p>
            ) : (
              <div className="grid gap-4">
                {receivedRequests.map((request) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    type="received"
                    onRespond={handleRespond}
                    onDelete={handleDelete}
                    isProcessing={isProcessing === request.id}
                  />
                ))}
              </div>
            )}
          </div>
        </Tab>
        
        <Tab key="sent" title={`Afsendte (${sentRequests.length})`}>
          <div className="mt-4">
            {sentRequests.length === 0 ? (
              <p className="text-gray-500">Du har ingen afsendte overførselsanmodninger.</p>
            ) : (
              <div className="grid gap-4">
                {sentRequests.map((request) => (
                  <RequestCard 
                    key={request.id} 
                    request={request}
                    type="sent"
                    onRespond={handleRespond}
                    onDelete={handleDelete}
                    isProcessing={isProcessing === request.id}
                  />
                ))}
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

// RequestCard komponent forbliver uændret
const RequestCard = React.memo(function RequestCard({ 
  request, 
  type,
  onRespond,
  onDelete,
  isProcessing 
}: { 
  request: TransferRequest_ReceivedDTO | TransferRequest_SentDTO,
  type: 'received' | 'sent',
  onRespond: (id: number, accept: boolean) => Promise<void>,
  onDelete: (id: number) => Promise<void>,
  isProcessing: boolean
}) {
  // Vi kan bruge TypeScript til at bestemme, hvilke felter vi skal vise
  const isReceived = type === 'received';
  
  // Fælles felter
  const { status, dateAccepted, rabbit_EarCombId, rabbit_NickName, saleConditions } = request;
  
  // Håndter null price
  const price = request.price ?? 0;
  
  // Type-specifikke felter
  const personInfo = isReceived 
    ? { regNo: (request as TransferRequest_ReceivedDTO).issuer_BreederRegNo, name: (request as TransferRequest_ReceivedDTO).issuer_FirstName }
    : { regNo: (request as TransferRequest_SentDTO).recipent_BreederRegNo, name: (request as TransferRequest_SentDTO).recipent_FirstName };

  // Status styling
  const getStatusColor = () => {
    switch (status) {
      case 'Accepted': return 'bg-green-500/20 text-green-500';
      case 'Rejected': return 'bg-red-500/20 text-red-500';
      default: return 'bg-amber-500/20 text-amber-500';
    }
  };

  // Formatér pris med håndtering af null
  const formatPrice = () => {
    return new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(price);
  };

  return (
    <div className="bg-zinc-700/30 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-600/50 p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{rabbit_NickName || rabbit_EarCombId}</h3>
          <p className="text-sm text-zinc-400">ID: {rabbit_EarCombId}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {status === 'Pending' ? 'Afventer' : status === 'Accepted' ? 'Accepteret' : 'Afvist'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-sm text-zinc-400">
            {isReceived ? 'Fra avler' : 'Til avler'}
          </p>
          <p>{personInfo.name} (#{personInfo.regNo})</p>
        </div>
        <div>
          <p className="text-sm text-zinc-400">Pris</p>
          <p className="font-semibold text-amber-500">
            {formatPrice()}
          </p>
        </div>
      </div>
      
      {dateAccepted && (
        <div className="mb-3">
          <p className="text-sm text-zinc-400">Dato accepteret</p>
          <p>{new Date(dateAccepted).toLocaleDateString('da-DK')}</p>
        </div>
      )}
      
      {saleConditions && (
        <div className="mb-3">
          <p className="text-sm text-zinc-400">Salgsbetingelser</p>
          <p className="bg-zinc-900/50 p-2 rounded text-sm">{saleConditions}</p>
        </div>
      )}
      
      {status === 'Pending' && isReceived && (
        <div className="flex gap-2 mt-4">
          <Button 
            color="primary" 
            onPress={() => onRespond(request.id, true)}
            isLoading={isProcessing}
            isDisabled={isProcessing}
          >
            Acceptér
          </Button>
          <Button 
            color="danger" 
            onPress={() => onRespond(request.id, false)}
            isLoading={isProcessing}
            isDisabled={isProcessing}
          >
            Afvis
          </Button>
        </div>
      )}
      
      {status === 'Pending' && !isReceived && (
        <div className="flex justify-end mt-4">
          <Button 
            color="danger" 
            onPress={() => onDelete(request.id)}
            isLoading={isProcessing}
            isDisabled={isProcessing}
          >
            Annullér anmodning
          </Button>
        </div>
      )}
    </div>
  );
});