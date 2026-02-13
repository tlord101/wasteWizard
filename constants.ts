
import { WasteType, MapMarker, Vendor, CustomerHouse, Transaction } from './types';

export const COLORS = {
  [WasteType.MEDICAL]: '#ef4444',    // red
  [WasteType.RECYCLABLE]: '#10b981', // emerald
  [WasteType.DOMESTIC]: '#3b82f6',   // blue
};

export const MAP_DARK_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "poi.park", elementType: "labels.text.stroke", stylers: [{ color: "#1b1b1b" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
  { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] },
];

export const MOCK_MARKERS: MapMarker[] = [
  { id: '1', lat: 40, lng: 50, type: WasteType.RECYCLABLE, label: 'Central Drop-off' },
  { id: '2', lat: 60, lng: 30, type: WasteType.DOMESTIC, label: 'Organic Hub' },
  { id: '3', lat: 30, lng: 70, type: WasteType.MEDICAL, label: 'Tech Recycler' },
];

export const MOCK_CUSTOMER_HOUSES: CustomerHouse[] = [
  { id: 'h1', lat: 45, lng: 55, type: WasteType.RECYCLABLE, customerName: 'Felix Miller', notes: 'Bin is behind the oak tree.', estimatedArrivalTime: '8 mins', distance: '1.2 km' },
  { id: 'h2', lat: 30, lng: 40, type: WasteType.MEDICAL, customerName: 'Luna Lovegood', notes: 'Need specialized handling.', estimatedArrivalTime: '12 mins', distance: '2.5 km' },
  { id: 'h3', lat: 65, lng: 45, type: WasteType.DOMESTIC, customerName: 'Sam Gardener', notes: 'Domestic trash collection.', estimatedArrivalTime: '5 mins', distance: '0.8 km' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'T-9401', date: 'Today, 2:15 PM', amount: 45.00, status: 'Completed', customerName: 'Felix Miller', wasteType: WasteType.RECYCLABLE },
  { id: 'T-9388', date: 'Today, 11:40 AM', amount: 32.50, status: 'Completed', customerName: 'Sam Gardener', wasteType: WasteType.DOMESTIC },
];

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'Trasher Jero',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jero',
    status: 'available',
    distance: '0.8 km',
    rating: 4.9,
    specialties: [WasteType.MEDICAL, WasteType.RECYCLABLE, WasteType.DOMESTIC],
    location: { lat: 35, lng: 45 }
  },
  {
    id: 'v2',
    name: 'Eco-Driver Elena',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    status: 'available',
    distance: '1.2 km',
    rating: 4.7,
    specialties: [WasteType.RECYCLABLE, WasteType.DOMESTIC],
    location: { lat: 55, lng: 65 }
  },
  {
    id: 'v3',
    name: 'Scrap-Taker Silas',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Silas',
    status: 'busy',
    distance: '2.5 km',
    rating: 4.5,
    specialties: [WasteType.MEDICAL, WasteType.DOMESTIC],
    location: { lat: 25, lng: 85 }
  },
  {
    id: 'v4',
    name: 'Collector Gaia',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gaia',
    status: 'offline',
    distance: '4.1 km',
    rating: 5.0,
    specialties: [WasteType.DOMESTIC, WasteType.RECYCLABLE],
    location: { lat: 80, lng: 20 }
  }
];
