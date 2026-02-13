
import React, { useState, useCallback, useEffect, useRef } from 'react';
import RadarMap from './components/RadarMap';
import BottomSheet from './components/BottomSheet';
import SplashScreen from './components/SplashScreen';
import AuthView from './components/AuthView';
import CustomerSignup from './components/CustomerSignup';
import VendorSignup from './components/VendorSignup';
import VendorOnboarding from './components/VendorOnboarding';
import VendorPending from './components/VendorPending';
import LocationRegistration from './components/LocationRegistration';
import ChatView from './components/ChatView';
import PickupHistory from './components/PickupHistory';
import NavigationMap from './components/NavigationMap';
import CameraScanner from './components/CameraScanner';
import { identifyWaste } from './services/geminiService';
import { auth, db } from './services/firebase';
// Use modular imports for auth functions
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  setDoc, 
  addDoc, 
  updateDoc,
  getDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { 
  ToastMessage, 
  BottomSheetState, 
  WasteType,
  AppView,
  UserRole,
  Vendor,
  PickupStatus,
  CustomerHouse,
  ChatMessage,
  WasteItem
} from './types';
import { COLORS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('splash');
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorOnline, setVendorOnline] = useState(false);
  const [earnings, setEarnings] = useState(0);
  const [sheet, setSheet] = useState<BottomSheetState>({ isOpen: false, view: 'initial' });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [trackingStatus, setTrackingStatus] = useState<PickupStatus>(PickupStatus.IDLE);
  const [activeJob, setActiveJob] = useState<any>(null);
  const [activeVendor, setActiveVendor] = useState<Vendor | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const [selectedRequestWaste, setSelectedRequestWaste] = useState<WasteType | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // 1. Auth & Profile Listener
  useEffect(() => {
    // Correct usage of modular onAuthStateChanged
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const profileRef = doc(db, 'users', u.uid);
        onSnapshot(profileRef, (snap) => {
          const data = snap.data();
          setUserProfile(data);
          if (data) {
            localStorage.setItem('wasteWizardRole', data.role);
            if (data.role === 'customer') {
              if (!data.homeLocation) setView('customer_location_reg');
              else setView('customer_radar');
            } else {
              if (!data.onboarded) setView('vendor_onboarding');
              else if (!data.approved) setView('vendor_pending');
              else {
                setView('vendor_radar');
                setVendorOnline(data.isOnline || false);
              }
            }
          }
        });
      } else {
        setUser(null);
        setUserProfile(null);
        setView('customer_auth');
      }
    });
    return () => unsubAuth();
  }, []);

  // 2. Real-time Vendors Listener (for customers)
  useEffect(() => {
    if (view === 'customer_radar' && userProfile?.role === 'customer') {
      const q = query(collection(db, 'users'), where('role', '==', 'vendor'), where('isOnline', '==', true));
      return onSnapshot(q, (snap) => {
        const vendorList = snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as unknown as Vendor));
        setVendors(vendorList);
      });
    }
  }, [view, userProfile]);

  // 3. Real-time Pickup Requests Listener (for vendors)
  useEffect(() => {
    if (view === 'vendor_radar' && userProfile?.role === 'vendor' && vendorOnline && !activeJob) {
      const q = query(collection(db, 'pickups'), where('status', '==', 'REQUESTING'), limit(1));
      return onSnapshot(q, (snap) => {
        if (!snap.empty) {
          const pickup = { id: snap.docs[0].id, ...snap.docs[0].data() };
          setSheet({ isOpen: true, view: 'customer_pickup', data: pickup });
        }
      });
    }
  }, [view, userProfile, vendorOnline, activeJob]);

  // 4. Tracking Listener (sync status across both)
  useEffect(() => {
    if (activeJob?.id) {
      return onSnapshot(doc(db, 'pickups', activeJob.id), (snap) => {
        const data = snap.data();
        if (data) {
          setTrackingStatus(data.status as PickupStatus);
          if (data.status === PickupStatus.COMPLETED && sheet.view !== 'vendor_navigation' && sheet.view !== 'tracking') {
             setSheet({ isOpen: true, view: 'tracking', data: activeVendor });
          }
        }
      });
    }
  }, [activeJob]);

  // Location Watcher for Vendor
  useEffect(() => {
    if (vendorOnline && userProfile?.role === 'vendor') {
      watchIdRef.current = window.navigator.geolocation.watchPosition((pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        updateDoc(doc(db, 'users', auth.currentUser!.uid), { location: loc });
      });
    } else if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    return () => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); };
  }, [vendorOnline, userProfile]);

  const addToast = (text: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleAuthSuccess = (role: UserRole) => {
    // Handled by onAuthStateChanged
  };

  const handleSignOut = () => { 
    // Correct modular signOut usage
    signOut(auth);
    setSheet({ isOpen: false, view: 'initial' }); 
    addToast("Logged out.", "info"); 
  };

  const handleVendorClick = useCallback((v: Vendor) => {
    if (trackingStatus !== PickupStatus.IDLE && v.id !== activeVendor?.id) return;
    setSheet({ isOpen: true, view: trackingStatus !== PickupStatus.IDLE ? 'tracking' : 'vendor_preview', data: v });
  }, [trackingStatus, activeVendor]);

  const handleSummonVendor = async (vendor: Vendor) => {
    if (!selectedRequestWaste) return addToast("Select category.", "error");
    
    try {
      const pickupDoc = await addDoc(collection(db, 'pickups'), {
        customerId: auth.currentUser!.uid,
        customerName: userProfile.name,
        customerLocation: userProfile.homeLocation,
        vendorId: vendor.id,
        status: 'REQUESTING',
        type: selectedRequestWaste,
        createdAt: Date.now()
      });
      setActiveJob({ id: pickupDoc.id });
      setActiveVendor(vendor);
      setTrackingStatus(PickupStatus.REQUESTING);
      setSheet({ isOpen: true, view: 'tracking', data: vendor });
    } catch (err) {
      addToast("Failed to request.", "error");
    }
  };

  const handleAcceptJob = async (job: any) => {
    try {
      await updateDoc(doc(db, 'pickups', job.id), {
        status: PickupStatus.ACCEPTED,
        vendorId: auth.currentUser!.uid,
        vendorName: userProfile.name
      });
      setActiveJob(job);
      setTrackingStatus(PickupStatus.ACCEPTED);
      setSheet({ isOpen: true, view: 'vendor_navigation', data: job });
    } catch (err) {
      addToast("Could not accept job.", "error");
    }
  };

  const handleFinishService = async () => {
    if (userProfile.role === 'vendor' && activeJob) {
      await updateDoc(doc(db, 'pickups', activeJob.id), { status: PickupStatus.COMPLETED });
      setEarnings(e => e + 45);
    }
    setActiveJob(null);
    setActiveVendor(null);
    setTrackingStatus(PickupStatus.IDLE);
    setSheet({ isOpen: false, view: 'initial' });
  };

  const handleCaptureWaste = async (base64: string) => {
    setIsScanning(true);
    try {
      const result = await identifyWaste(base64);
      setSheet({ isOpen: true, view: 'scan_result', data: result });
    } catch (err) {
      addToast("Identification failed.", "error");
    } finally {
      setIsScanning(false);
    }
  };

  const isVendor = userProfile?.role === 'vendor';
  const isTracking = trackingStatus !== PickupStatus.IDLE;

  if (view === 'splash') return <SplashScreen />;
  if (view === 'customer_auth' || view === 'vendor_auth') return <AuthView onSuccess={handleAuthSuccess} onError={m => addToast(m, 'error')} onGoToSignup={r => setView(r === 'customer' ? 'customer_signup' : 'vendor_signup')} />;
  if (view === 'customer_signup') return <CustomerSignup onSuccess={() => {}} onError={m => addToast(m, 'error')} onBack={() => setView('customer_auth')} />;
  if (view === 'vendor_signup') return <VendorSignup onSuccess={() => {}} onError={m => addToast(m, 'error')} onBack={() => setView('vendor_auth')} />;
  if (view === 'customer_location_reg') return <LocationRegistration onComplete={loc => updateDoc(doc(db, 'users', auth.currentUser!.uid), { homeLocation: loc })} onError={m => addToast(m, 'error')} />;
  if (view === 'vendor_onboarding') return <VendorOnboarding onComplete={data => updateDoc(doc(db, 'users', auth.currentUser!.uid), { ...data, onboarded: true, approved: false })} onError={m => addToast(m, 'error')} />;
  if (view === 'vendor_pending') return <VendorPending />;

  return (
    <div className="relative h-screen w-screen bg-neutral-950 overflow-hidden flex flex-col text-white font-sans">
      <main className="flex-grow relative">
        <RadarMap 
          onVendorClick={handleVendorClick}
          onCustomerClick={job => setSheet({ isOpen: true, view: 'customer_pickup', data: job })}
          userLocation={isVendor ? userProfile?.location : userProfile?.homeLocation} 
          isCustomerView={!isVendor} 
          isVendorView={isVendor}
          isOnline={isVendor ? vendorOnline : true}
          vendors={vendors}
          trackingStatus={trackingStatus}
          activeJob={activeJob}
        />

        <header className="absolute top-0 left-0 right-0 z-30 pt-safe px-4 py-3 flex flex-col bg-gradient-to-b from-black/90 to-transparent">
          <div className="flex justify-between items-center w-full max-w-lg mx-auto">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl ${isVendor ? 'bg-amber-500/20 border-amber-500/30 text-amber-500' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500'} border flex items-center justify-center`}>
                <i className={`fa-solid ${isVendor ? 'fa-truck-pickup' : 'fa-trash-can'} text-lg`}></i>
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight leading-none mb-0.5">{isVendor ? 'Trasher Portal' : 'WasteWizard'}</h1>
                <p className="text-[9px] uppercase tracking-widest font-black text-neutral-500">{isVendor ? 'Tasker Mode' : 'Logistics Scanner'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isVendor && (
                <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl text-right">
                  <span className="text-[7px] font-black text-neutral-500 uppercase block">Earnings</span>
                  <span className="text-sm font-black text-amber-500">$ {earnings}</span>
                </div>
              )}
              <button onClick={() => setSheet({ isOpen: true, view: 'user_profile' })} className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden shadow-lg">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser?.uid}`} className="w-full h-full" alt="Profile" />
              </button>
            </div>
          </div>
        </header>

        <div className="absolute inset-x-0 bottom-32 z-20 flex flex-col items-center px-6 max-w-lg mx-auto">
          {isVendor ? (
            !activeJob && (
              <button onClick={() => {
                const newState = !vendorOnline;
                setVendorOnline(newState);
                updateDoc(doc(db, 'users', auth.currentUser!.uid), { isOnline: newState });
              }} className={`w-full h-16 rounded-3xl flex items-center justify-between px-8 border-2 transition-all shadow-2xl ${vendorOnline ? 'bg-amber-500 border-amber-400 text-black' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>
                <span className="text-base font-black uppercase tracking-widest">{vendorOnline ? 'Go Offline' : 'Go Online'}</span>
                <div className={`w-3 h-3 rounded-full ${vendorOnline ? 'bg-black animate-pulse' : 'bg-neutral-700'}`} />
              </button>
            )
          ) : (
            !isTracking && (
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setSheet({ isOpen: true, view: 'report_waste' })}
                  className="flex-grow h-16 bg-emerald-500 text-black font-black text-sm uppercase tracking-widest rounded-3xl shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                >
                  <i className="fa-solid fa-wand-magic-sparkles text-lg"></i>
                  AI Scanner
                </button>
              </div>
            )
          )}
        </div>
      </main>

      <BottomSheet isOpen={sheet.isOpen} onClose={() => setSheet(p => ({ ...p, isOpen: false }))}>
        {sheet.view === 'report_waste' && <CameraScanner onCapture={handleCaptureWaste} isProcessing={isScanning} />}
        {sheet.view === 'scan_result' && (
          <div className="pt-2 pb-12">
            <h2 className="text-2xl font-black text-white mb-4">{sheet.data.name}</h2>
            <p className="text-neutral-400 mb-8">{sheet.data.type} Category identified.</p>
            <button onClick={() => setSheet({ isOpen: false, view: 'initial' })} className="w-full h-16 bg-emerald-500 text-black font-black rounded-2xl">Confirm</button>
          </div>
        )}
        {sheet.view === 'user_profile' && (
          <div className="pt-2 pb-12 text-center w-full">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.currentUser?.uid}`} className="w-20 h-20 rounded-full border-4 border-neutral-800 mx-auto mb-4" alt="User" />
            <h2 className="text-xl font-black text-white">{userProfile?.name}</h2>
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-8">{userProfile?.role}</p>
            <button onClick={handleSignOut} className="w-full h-14 bg-red-500/10 text-red-500 font-black rounded-2xl border border-red-500/20">Sign Out</button>
          </div>
        )}
        {sheet.view === 'vendor_preview' && (
          <div className="pt-2 pb-12 text-center w-full">
            <h2 className="text-3xl font-black text-white mb-6">{sheet.data.name}</h2>
            <div className="mb-6">
              <p className="text-xs font-black uppercase text-neutral-600 mb-4 tracking-widest">Select Category</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[WasteType.MEDICAL, WasteType.RECYCLABLE, WasteType.DOMESTIC].map((s) => (
                  <button key={s} onClick={() => setSelectedRequestWaste(s)} className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedRequestWaste === s ? 'bg-emerald-500 text-black' : 'bg-neutral-900 text-neutral-500 border border-neutral-800'}`}>{s}</button>
                ))}
              </div>
            </div>
            <button onClick={() => handleSummonVendor(sheet.data)} className="w-full h-18 bg-emerald-500 text-black font-black text-lg rounded-[1.5rem]">Request Collection</button>
          </div>
        )}
        {sheet.view === 'customer_pickup' && (
          <div className="pt-2 pb-8">
            <h2 className="text-2xl font-black text-white mb-2">{sheet.data.customerName}</h2>
            <p className="text-amber-500 font-black text-xs uppercase tracking-widest mb-6">{sheet.data.type} PICKUP REQUEST</p>
            <button onClick={() => handleAcceptJob(sheet.data)} className="w-full h-18 bg-amber-500 text-black font-black text-lg rounded-[1.5rem]">Accept Job</button>
          </div>
        )}
        {sheet.view === 'vendor_navigation' && (
          <div className="pt-2 pb-12">
            <NavigationMap customer={sheet.data} liveLocation={userProfile.location} />
            <button onClick={handleFinishService} className="w-full h-18 bg-emerald-500 text-black font-black rounded-2xl mt-8">Confirm Pickup</button>
          </div>
        )}
        {sheet.view === 'tracking' && (
           <div className="pt-2 pb-12 text-center">
             <h2 className="text-2xl font-black text-white mb-4">Pickup Status</h2>
             <div className="bg-emerald-500/10 p-8 rounded-3xl border border-emerald-500/20">
               <p className="text-xl font-black text-emerald-500 uppercase tracking-widest">{trackingStatus}</p>
             </div>
             {trackingStatus === PickupStatus.COMPLETED && (
               <button onClick={handleFinishService} className="w-full h-16 bg-white text-black font-black rounded-2xl mt-8">Back to Radar</button>
             )}
           </div>
        )}
      </BottomSheet>

      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[100] w-full max-w-[90%] space-y-2 pointer-events-none px-4">
        {toasts.map(t => (
          <div key={t.id} className="p-4 rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-white/10 shadow-2xl text-center">
            <p className="text-sm font-bold">{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
