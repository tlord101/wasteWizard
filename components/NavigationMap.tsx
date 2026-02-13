
import React, { useEffect, useRef, useState } from 'react';
import { CustomerHouse, PickupStatus } from '../types';
import { MAP_DARK_STYLE, COLORS } from '../constants';

interface NavigationMapProps {
  customer: CustomerHouse;
  liveLocation?: { lat: number; lng: number } | null;
}

const NavigationMap: React.FC<NavigationMapProps> = ({ customer, liveLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // Fix: Use any type to avoid "Cannot find namespace 'google'" error
  const [googleMap, setGoogleMap] = useState<any | null>(null);
  // Fix: Use any type to avoid "Cannot find namespace 'google'" error
  const [directionsRenderer, setDirectionsRenderer] = useState<any | null>(null);
  // Fix: Use any type to avoid "Cannot find namespace 'google'" error
  const [vendorMarker, setVendorMarker] = useState<any | null>(null);
  const [eta, setEta] = useState<string>("Calculating...");

  useEffect(() => {
    if (mapContainerRef.current && !googleMap) {
      // Fix: Access google through window to avoid "Cannot find name 'google'" error
      const map = new (window as any).google.maps.Map(mapContainerRef.current, {
        center: { lat: customer.lat, lng: customer.lng },
        zoom: 14,
        styles: MAP_DARK_STYLE,
        disableDefaultUI: true,
      });
      setGoogleMap(map);

      // Fix: Access google through window to avoid "Cannot find name 'google'" error
      const renderer = new (window as any).google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#f59e0b",
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      });
      setDirectionsRenderer(renderer);

      // Customer Marker
      // Fix: Access google through window to avoid "Cannot find name 'google'" error
      new (window as any).google.maps.Marker({
        position: { lat: customer.lat, lng: customer.lng },
        map: map,
        icon: {
          // Fix: Access google through window to avoid "Cannot find name 'google'" error
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: COLORS[customer.type],
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: "#ffffff",
        }
      });

      // Vendor Marker
      // Fix: Access google through window to avoid "Cannot find name 'google'" error
      const vm = new (window as any).google.maps.Marker({
        map: map,
        icon: {
          path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
          fillColor: "#f59e0b",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#000000",
          scale: 1.5,
          // Fix: Access google through window to avoid "Cannot find name 'google'" error
          anchor: new (window as any).google.maps.Point(12, 24),
        }
      });
      setVendorMarker(vm);
    }
  }, [customer]);

  // Update Route and Vendor position
  useEffect(() => {
    if (googleMap && directionsRenderer && liveLocation) {
      // Fix: Access google through window to avoid "Cannot find name 'google'" error
      const directionsService = new (window as any).google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: { lat: liveLocation.lat, lng: liveLocation.lng },
          destination: { lat: customer.lat, lng: customer.lng },
          // Fix: Access google through window to avoid "Cannot find name 'google'" error
          travelMode: (window as any).google.maps.TravelMode.DRIVING,
        },
        (result: any, status: any) => {
          // Fix: Access google through window to avoid "Cannot find name 'google'" error
          if (status === (window as any).google.maps.DirectionsStatus.OK && result) {
            directionsRenderer.setDirections(result);
            const route = result.routes[0].legs[0];
            setEta(route.duration?.text || "Arrived");
            
            if (vendorMarker) {
              vendorMarker.setPosition(liveLocation);
            }
          }
        }
      );
    }
  }, [googleMap, directionsRenderer, liveLocation, customer, vendorMarker]);

  return (
    <div className="w-full aspect-square bg-neutral-950 rounded-[2.5rem] border border-neutral-800 overflow-hidden relative shadow-2xl group">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* HUD Overlay */}
      <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
            <i className="fa-solid fa-location-arrow"></i>
          </div>
          <div>
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none mb-1">Route Active</p>
            <p className="text-sm font-bold text-white leading-none">{eta} to destination</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 flex flex-col items-end gap-2">
        <div className="bg-emerald-500 text-black px-4 py-2 rounded-xl font-black text-[11px] uppercase tracking-tighter shadow-lg">
          Live Navigation
        </div>
      </div>
    </div>
  );
};

export default NavigationMap;
