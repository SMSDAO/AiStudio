/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * FleetDispatchConsole.tsx
 * Interactive simulator for Enterprise Trucking OS (Archetype A)
 * FMCSA ELD Compliance + Base L2 Escrow Settlement
 */

import React, { useState } from 'react';
import { Truck, MapPin, DollarSign, Activity, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { FlashGlowCard } from '../FlashGlowCard';

export const FleetDispatchConsole: React.FC = () => {
  const [carrierAddress] = useState('0x71C824...49A1 (Base L2)');
  const [selectedLoadId, setSelectedLoadId] = useState<string>('LD-902');
  const [escrowReleased, setEscrowReleased] = useState<Record<string, boolean>>({
    'LD-418': true
  });

  const mockTrucks = [
    { 
      id: 'LD-902', 
      truckNumber: 'TRK-902',
      driver: 'Marcus Vance', 
      origin: 'Chicago, IL (Hub 4)', 
      dest: 'Dallas, TX (Logistics Center)', 
      status: 'IN_TRANSIT', 
      speed: 64, 
      hosHoursLeft: 4.8,
      escrowWei: '1.45 ETH',
      escrowUsd: '$3,770',
      bolHash: '0x8f3c...bb29'
    },
    { 
      id: 'LD-418', 
      truckNumber: 'TRK-418',
      driver: 'Elena Rostova', 
      origin: 'Atlanta, GA (Southeast Depot)', 
      dest: 'Miami, FL (Port Terminal)', 
      status: 'DELIVERED', 
      speed: 0, 
      hosHoursLeft: 7.2,
      escrowWei: '0.85 ETH',
      escrowUsd: '$2,210',
      bolHash: '0x12a0...e4c1'
    },
    { 
      id: 'LD-771', 
      truckNumber: 'TRK-771',
      driver: 'Devon Hayes', 
      origin: 'Seattle, WA (West Hub)', 
      dest: 'Denver, CO (Mountain Depot)', 
      status: 'REST_BREAK', 
      speed: 0, 
      hosHoursLeft: 10.5,
      escrowWei: '2.10 ETH',
      escrowUsd: '$5,460',
      bolHash: '0xaa78...90fd'
    }
  ];

  const handleReleaseEscrow = (loadId: string) => {
    setEscrowReleased((prev) => ({ ...prev, [loadId]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-500/20 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-400" />
            CarrierOS Freight & Telemetry Console
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time FMCSA ELD Compliance & Base L2 Smart Escrow
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 font-mono">
            Escrow Contract: {carrierAddress}
          </span>
        </div>
      </div>

      {/* Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockTrucks.map((truck) => {
          const isReleased = escrowReleased[truck.id];
          const isSelected = selectedLoadId === truck.id;

          return (
            <FlashGlowCard 
              key={truck.id} 
              variant="orange" 
              intensity={isSelected ? 'high' : 'medium'}
              interactive
              onClick={() => setSelectedLoadId(truck.id)}
              className={`p-4 space-y-3 cursor-pointer ${isSelected ? 'ring-1 ring-orange-500/80' : ''}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-orange-400">{truck.truckNumber}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                  truck.status === 'DELIVERED' 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : truck.status === 'REST_BREAK'
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                }`}>
                  {truck.status}
                </span>
              </div>

              <div>
                <div className="text-sm font-semibold text-white">{truck.driver}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400/80 shrink-0" />
                  <span className="truncate">{truck.origin} → {truck.dest}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-500">SPEED / TELEMETRY</div>
                  <div className="text-slate-200">{truck.speed} MPH</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">FMCSA HOS LEFT</div>
                  <div className="text-orange-300">{truck.hosHoursLeft} hrs</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">Escrow: </span>
                  <span className="text-emerald-400 font-mono font-bold">{truck.escrowWei}</span>
                </div>
                {isReleased ? (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Released
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReleaseEscrow(truck.id);
                    }}
                    className="px-2.5 py-1 rounded bg-orange-600/30 hover:bg-orange-600/50 text-orange-200 text-[10px] font-bold border border-orange-500/40"
                  >
                    Release Escrow
                  </button>
                )}
              </div>
            </FlashGlowCard>
          );
        })}
      </div>
    </div>
  );
};
