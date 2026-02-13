
export enum WasteType {
  MEDICAL = 'MEDICAL',
  RECYCLABLE = 'RECYCLABLE',
  DOMESTIC = 'DOMESTIC'
}

export type UserRole = 'customer' | 'vendor';

export type VendorStatus = 'available' | 'busy' | 'offline';

export enum PickupStatus {
  IDLE = 'IDLE',
  REQUESTING = 'REQUESTING',
  ACCEPTED = 'ACCEPTED',
  EN_ROUTE = 'EN_ROUTE',
  ARRIVED = 'ARRIVED',
  COMPLETED = 'COMPLETED'
}

export interface Vendor {
  id: string;
  name: string;
  image: string;
  status: VendorStatus;
  distance: string;
  rating: number;
  specialties: WasteType[];
  location: { lat: number; lng: number };
}

export interface CustomerHouse {
  id: string;
  lat: number;
  lng: number;
  type: WasteType;
  customerName: string;
  notes?: string;
  estimatedArrivalTime?: string;
  distance?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  customerName: string;
  wasteType?: WasteType;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: 'customer' | 'vendor' | 'system';
  text: string;
  timestamp: number;
}

export interface ActivePickup {
  vendorId: string;
  status: PickupStatus;
  startTime: number;
}

export type AppView = 
  | 'splash' 
  | 'role_selection' 
  | 'customer_auth' 
  | 'customer_signup'
  | 'customer_location_reg' 
  | 'customer_radar' 
  | 'vendor_auth'
  | 'vendor_signup'
  | 'vendor_onboarding'
  | 'vendor_pending'
  | 'vendor_radar';

export interface WasteItem {
  id: string;
  name: string;
  type: WasteType;
  confidence: number;
  instructions: string[];
  location?: { lat: number; lng: number };
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: WasteType;
  label: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'info' | 'success' | 'error';
}

export interface BottomSheetState {
  isOpen: boolean;
  view: 'initial' | 'scan_result' | 'location_detail' | 'report_waste' | 'vendor_preview' | 'tracking' | 'customer_pickup' | 'vendor_job_tracking' | 'vendor_earnings' | 'vendor_transactions' | 'chat' | 'user_profile' | 'pickup_history' | 'vendor_navigation';
  data?: any;
}
