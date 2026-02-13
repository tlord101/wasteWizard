
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { MapMarker, WasteType, Vendor, PickupStatus, CustomerHouse } from '../types';
import { COLORS, MOCK_MARKERS, MOCK_CUSTOMER_HOUSES } from '../constants';

interface RadarMapProps {
  onMarkerClick?: (marker: MapMarker) => void;
  onVendorClick?: (vendor: Vendor) => void;
  onCustomerClick?: (house: CustomerHouse) => void;
  userLocation?: { lat: number; lng: number } | null;
  registrationMode?: boolean;
  isCustomerView?: boolean;
  isVendorView?: boolean;
  isOnline?: boolean;
  highlightedVendorId?: string | null;
  vendors?: Vendor[];
  trackingStatus?: PickupStatus;
  activeJob?: CustomerHouse | null;
}

const RadarMap: React.FC<RadarMapProps> = ({ 
  onMarkerClick, 
  onVendorClick,
  onCustomerClick,
  userLocation, 
  registrationMode = false,
  isCustomerView = false,
  isVendorView = false,
  isOnline = true,
  highlightedVendorId = null,
  vendors = [],
  trackingStatus = PickupStatus.IDLE,
  activeJob = null
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.42;

    const uLat = userLocation?.lat || 50;
    const uLng = userLocation?.lng || 50;

    // Expanded domain to ensure mock vendors (coordinates like 35, 80 etc) are visible
    const scaleX = d3.scaleLinear()
      .domain([uLng - 60, uLng + 60])
      .range([centerX - maxRadius, centerX + maxRadius]);
    const scaleY = d3.scaleLinear()
      .domain([uLat - 60, uLat + 60])
      .range([centerY - maxRadius, centerY + maxRadius]);

    const mainG = svg.append('g');

    // Radar Grid Styling
    const gridG = mainG.append('g').attr('class', 'grid');
    [0.2, 0.4, 0.6, 0.8, 1].forEach(pct => {
      gridG.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', maxRadius * pct)
        .attr('fill', 'none')
        .attr('stroke', isVendorView ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', pct === 1 ? 'none' : '4 6');
    });

    // Crosshairs
    gridG.append('line').attr('x1', centerX - maxRadius).attr('y1', centerY).attr('x2', centerX + maxRadius).attr('y2', centerY).attr('stroke', 'rgba(255,255,255,0.03)');
    gridG.append('line').attr('x1', centerX).attr('y1', centerY - maxRadius).attr('x2', centerX).attr('y2', centerY + maxRadius).attr('stroke', 'rgba(255,255,255,0.03)');

    const markersG = mainG.append('g').attr('class', 'markers');

    if (isVendorView) {
      // Vendor Perspective
      const visibleCustomers = activeJob ? [activeJob] : (isOnline ? MOCK_CUSTOMER_HOUSES : []);
      
      const houses = markersG.selectAll('.customer-house')
        .data(visibleCustomers).enter().append('g')
        .attr('transform', d => `translate(${scaleX(d.lng) - 15}, ${scaleY(d.lat) - 15})`)
        .on('click', (event, d) => onCustomerClick?.(d))
        .attr('class', 'cursor-pointer');

      houses.append('circle').attr('cx', 15).attr('cy', 15).attr('r', 20).attr('fill', d => COLORS[d.type]).attr('opacity', 0.15).attr('class', 'pulse-ring');
      
      houses.append('foreignObject').attr('width', 30).attr('height', 30)
        .append('xhtml:div').attr('class', 'flex items-center justify-center w-full h-full')
        .html(d => `<div style="color: ${COLORS[d.type]}; filter: drop-shadow(0 0 5px ${COLORS[d.type]}80)"><i class="fa-solid fa-trash-can" style="font-size: 18px;"></i></div>`);

      // Self center for Vendor
      markersG.append('circle').attr('cx', centerX).attr('cy', centerY).attr('r', 8).attr('fill', '#f59e0b').attr('stroke', '#0a0a0a').attr('stroke-width', 2);
    } else {
      // Customer Perspective
      const visibleVendors = trackingStatus !== PickupStatus.IDLE 
        ? vendors.filter(v => v.id === highlightedVendorId) 
        : vendors;

      const vendorNodes = markersG.selectAll('.vendor-avatar-node')
        .data(visibleVendors).enter().append('g')
        .attr('transform', d => `translate(${scaleX(d.location.lng) - 20}, ${scaleY(d.location.lat) - 20})`)
        .on('click', (event, d) => onVendorClick?.(d))
        .attr('class', 'cursor-pointer animate-[fadeIn_0.5s_ease-out]');

      // Pulsing aura for available vendors
      vendorNodes.append('circle')
        .attr('cx', 20).attr('cy', 20).attr('r', 24)
        .attr('fill', d => d.status === 'available' ? '#10b981' : '#4b5563')
        .attr('opacity', 0.15)
        .attr('class', 'pulse-ring');

      // Avatar Container with Border
      vendorNodes.append('circle')
        .attr('cx', 20).attr('cy', 20).attr('r', 20)
        .attr('fill', '#111')
        .attr('stroke', d => d.status === 'available' ? '#10b981' : '#262626')
        .attr('stroke-width', 2);

      // ForeignObject for the Actual Image Avatar - ensure dimensions match exactly
      vendorNodes.append('foreignObject')
        .attr('x', 2).attr('y', 2)
        .attr('width', 36)
        .attr('height', 36)
        .append('xhtml:div')
        .attr('class', 'w-full h-full rounded-full overflow-hidden')
        .html(d => `<img src="${d.image}" class="w-full h-full object-cover rounded-full ${d.status !== 'available' ? 'grayscale opacity-50' : ''}" />`);

      // Status indicator dot
      vendorNodes.append('circle')
        .attr('cx', 34).attr('cy', 34).attr('r', 5)
        .attr('fill', d => d.status === 'available' ? '#10b981' : '#ef4444')
        .attr('stroke', '#0a0a0a')
        .attr('stroke-width', 1.5);

      // Home marker at center - Enhanced for visibility
      const userG = markersG.append('g').attr('transform', `translate(${centerX}, ${centerY})`);
      userG.append('circle').attr('r', 28).attr('fill', '#10b981').attr('opacity', 0.1).attr('class', 'pulse-ring');
      userG.append('path')
        .attr('d', 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z')
        .attr('transform', 'translate(-18, -20) scale(1.8)')
        .attr('fill', '#10b981')
        .attr('stroke', '#0a0a0a')
        .attr('stroke-width', 1);
    }

    // Dynamic Scanning Beam
    if (isOnline) {
      const beam = svg.append('line')
        .attr('x1', centerX).attr('y1', centerY)
        .attr('x2', centerX + maxRadius)
        .attr('y2', centerY)
        .attr('stroke', isVendorView ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)')
        .attr('stroke-width', 4)
        .attr('opacity', 0.6);
      
      let angle = 0;
      const timer = d3.timer(() => {
        angle += 0.025;
        beam.attr('x2', centerX + Math.cos(angle) * maxRadius)
            .attr('y2', centerY + Math.sin(angle) * maxRadius);
      });
      return () => timer.stop();
    }
  }, [dimensions, userLocation, registrationMode, isCustomerView, isVendorView, isOnline, highlightedVendorId, vendors, trackingStatus, activeJob]);

  return (
    <div ref={containerRef} className="w-full h-full bg-neutral-950 relative overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* HUD Info */}
      <div className="absolute top-4 left-4 pointer-events-none w-full pr-8">
        <div className={`flex items-center space-x-2 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border shadow-2xl w-fit ${isVendorView ? 'border-amber-500/20' : 'border-emerald-500/20'}`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? (isVendorView ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-neutral-700'}`} />
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-300 font-black">
            {isOnline ? 'Active Logistics Scanner' : 'System Standby'}
          </span>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex flex-col items-end gap-2 opacity-40">
        <div className="text-[8px] font-black uppercase tracking-[0.3em] text-neutral-500">Grid: Enabled</div>
        <div className="text-[8px] font-black uppercase tracking-[0.3em] text-neutral-500">Node: {userLocation?.lat.toFixed(2)}, {userLocation?.lng.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default RadarMap;
