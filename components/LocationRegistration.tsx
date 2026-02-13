
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MAP_DARK_STYLE } from '../constants';

interface LocationRegistrationProps {
  onComplete: (coords: { lat: number; lng: number }) => void;
  onError: (msg: string) => void;
}

const LocationRegistration: React.FC<LocationRegistrationProps> = ({ onComplete, onError }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  // Fix: Use any type to avoid "Cannot find namespace 'google'" error
  const [googleMap, setGoogleMap] = useState<any | null>(null);
  // Fix: Use any type to avoid "Cannot find namespace 'google'" error
  const [marker, setMarker] = useState<any | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<'requesting' | 'ready' | 'denied'>('requesting');
  const [isConfirming, setIsConfirming] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (mapRef.current && !googleMap) {
      const initialCoords = { lat: 0, lng: 0 };
      // Fix: Access google through window to avoid "Cannot find name 'google'" error
      const map = new (window as any).google.maps.Map(mapRef.current, {
        center: initialCoords,
        zoom: 15,
        styles: MAP_DARK_STYLE,
        disableDefaultUI: true,
        gestureHandling: 'greedy',
      });
      setGoogleMap(map);

      // Fix: Access google through window to avoid "Cannot find name 'google'" error
      const m = new (window as any).google.maps.Marker({
        position: initialCoords,
        map: map,
        draggable: true,
        icon: {
          // Fix: Access google through window to avoid "Cannot find name 'google'" error
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#10b981",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
        },
      });

      m.addListener('dragend', () => {
        const pos = m.getPosition();
        if (pos) {
          setCoords({ lat: pos.lat(), lng: pos.lng() });
        }
      });

      setMarker(m);
    }
  }, [googleMap]);

  // Handle Location fetching
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      onError("Geolocation not supported.");
      return;
    }

    setStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCoords(newCoords);
        setStatus('ready');
        if (googleMap && marker) {
          googleMap.setCenter(newCoords);
          marker.setPosition(newCoords);
        }
      },
      (error) => {
        setStatus('denied');
        onError("Location access required.");
      },
      { enableHighAccuracy: true }
    );
  }, [googleMap, marker, onError]);

  useEffect(() => {
    if (googleMap) {
      startTracking();
    }
  }, [googleMap, startTracking]);

  const handleConfirm = async () => {
    if (!coords) return;
    setIsConfirming(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onComplete(coords);
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 flex flex-col animate-[fadeIn_0.5s_ease-out]">
      <div className="flex-grow relative overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Map Overlay HUD */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="bg-neutral-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5 shadow-2xl pointer-events-auto">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Verify Address</p>
            <p className="text-xs text-neutral-400">Drag pin to adjust home location</p>
          </div>
          <button 
            onClick={startTracking}
            className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl pointer-events-auto active:scale-90 transition-transform"
          >
            <i className="fa-solid fa-location-crosshairs"></i>
          </button>
        </div>
      </div>

      <div className="bg-neutral-900 border-t border-neutral-800 rounded-t-[3rem] p-8 pb-safe relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white leading-tight">Home Base</h2>
            <p className="text-neutral-500 text-sm">Where should we pick up your trash?</p>
          </div>
          <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 ${
            status === 'ready' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'ready' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {status === 'ready' ? 'GPS Locked' : 'Searching...'}
            </span>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!coords || isConfirming}
          className="w-full h-18 bg-emerald-500 text-black font-black text-lg rounded-[1.5rem] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50"
        >
          {isConfirming ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <span>Confirm Pickup Address</span>}
        </button>
      </div>
    </div>
  );
};

export default LocationRegistration;
