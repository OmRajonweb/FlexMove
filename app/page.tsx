"use client";

import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {InteractiveMap} from "@/components/interactive-map";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Truck,
  Ship,
  Plane,
  Package,
  BarChart3,
  MapPin,
  Plus,
  DollarSign,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  XCircle,
  Shield,
  User,
  Zap,
  RefreshCw,
  MessageSquare,
  Settings,
  AlertCircle,
  Check
} from "lucide-react";
import Image from "next/image";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, CartesianGrid, XAxis, YAxis, Tooltip as RTooltip, Legend as RLegend, Cell } from "recharts";

type UserRole = "supplier" | "transporter" | "customer" | null;

type TransportMode = "truck" | "ship" | "air" | "ev";
type ShipmentStatus = "pending" | "in-transit" | "delivered" | "delayed";
type RiskLevel = "low" | "medium" | "high";

interface ShipmentData {
  id: string;
  customer: string;
  transporter: string;
  mode: TransportMode;
  route: string;
  status: ShipmentStatus;
  eta: string;
  cost: number;
  carbonFootprint: number;
  riskLevel: RiskLevel;
  disruptionProbability: number;
}

interface DisruptionAlert {
  id: string;
  shipmentId: string;
  type: string;
  description: string;
  delay: string;
  status: 'active' | 'in-progress' | 'monitoring' | 'resolved' | 'acknowledged' | 'escalated';
  severity: 'low' | 'medium' | 'high';
  location: string;
  timestamp: string;
  suggestions: string[];
  resolvedAt?: string;
  escalatedAt?: string;
}

export default function FlexMovePage() {
  const [currentUser, setCurrentUser] = useState<UserRole>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>(null);

  // Global state for notifications and alerts
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
  }>>([]);
  
  // Global state for shipments and data
  const [globalShipments, setGlobalShipments] = useState<ShipmentData[]>([]);
  const [globalDisruptions, setGlobalDisruptions] = useState<DisruptionAlert[]>([]);
  
  // Global state for create shipment flow
  const [showCreateShipment, setShowCreateShipment] = useState(false);
  const [createShipmentStep, setCreateShipmentStep] = useState<'customer' | 'transporter' | 'details'>('customer');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedTransporter, setSelectedTransporter] = useState<string>('');
  const [shipmentFormData, setShipmentFormData] = useState<{
    origin: string;
    destination: string;
    weight: string;
    priority: string;
    mode: string;
  }>({
    origin: '',
    destination: '',
    weight: '',
    priority: '',
    mode: ''
  });

  // Global state for rerouting
  const [showRerouteDialog, setShowRerouteDialog] = useState(false);
  const [selectedDisruption, setSelectedDisruption] = useState<DisruptionAlert | null>(null);
  const [availableRoutes, setAvailableRoutes] = useState<Array<{
    id: string;
    name: string;
    distance: number;
    estimatedTime: string;
    cost: number;
    carbonFootprint: number;
    riskLevel: 'low' | 'medium' | 'high';
    status: 'available' | 'congested' | 'delayed';
  }>>([]);

  // Global state for customer orders
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [orderFormData, setOrderFormData] = useState<{
    product: string;
    quantity: string;
    priority: string;
    deliveryDate: string;
    specialInstructions: string;
  }>({
    product: '',
    quantity: '',
    priority: '',
    deliveryDate: '',
    specialInstructions: ''
  });

  const handleLogin = (role: UserRole) => {
    setCurrentUser(role);
    addNotification('success', 'Login Successful', `Welcome to your ${role} dashboard!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowCreateShipment(false);
    setCreateShipmentStep('customer');
    setSelectedCustomer('');
    setSelectedTransporter('');
    setShipmentFormData({
      origin: '',
      destination: '',
      weight: '',
      priority: '',
      mode: ''
    });
    addNotification('info', 'Logged Out', 'You have been successfully logged out.');
  };

  const addNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleCreateShipment = () => {
    setShowCreateShipment(true);
    setCreateShipmentStep('customer');
  };

  const handleCustomerSelected = (customerId: string) => {
    setSelectedCustomer(customerId);
    setCreateShipmentStep('transporter');
    addNotification('info', 'Customer Selected', 'Please select a transporter for this shipment.');
  };

  const handleTransporterSelected = (transporterId: string) => {
    setSelectedTransporter(transporterId);
    setCreateShipmentStep('details');
    addNotification('info', 'Transporter Selected', 'Please fill in the shipment details.');
  };

  const handleShipmentCreated = (shipmentData: any) => {
    const newShipment: ShipmentData = {
      id: `SH${Date.now()}`,
      customer: 'Unknown Customer', // Will be updated when customer data is available
      transporter: 'Unknown Transporter', // Will be updated when transporter data is available
      mode: shipmentData.mode as TransportMode,
      route: `${shipmentData.origin} → ${shipmentData.destination}`,
      status: 'pending' as ShipmentStatus,
      eta: '3-5 days',
      cost: Math.floor(Math.random() * 2000) + 500,
      carbonFootprint: Math.floor(Math.random() * 200) + 50,
      riskLevel: shipmentData.priority === 'urgent' ? 'high' : shipmentData.priority === 'high' ? 'medium' : 'low' as RiskLevel,
      disruptionProbability: Math.floor(Math.random() * 30) + 5
    };
    
    setGlobalShipments(prev => [...prev, newShipment]);
    setShowCreateShipment(false);
    setCreateShipmentStep('customer');
    setSelectedCustomer('');
    setSelectedTransporter('');
    setShipmentFormData({
      origin: '',
      destination: '',
      weight: '',
      priority: '',
      mode: ''
    });
    addNotification('success', 'Shipment Created', `Shipment ${newShipment.id} has been created successfully!`);
  };

  const handleDisruptionAction = (disruptionId: string, action: string) => {
    setGlobalDisruptions(prev => prev.filter(d => d.id !== disruptionId));
    addNotification('success', 'Disruption Resolved', `Action "${action}" has been applied to disruption ${disruptionId}.`);
  };

  const handleRequestAction = (requestId: string, action: 'accept' | 'decline') => {
    addNotification(
      action === 'accept' ? 'success' : 'info',
      `Request ${action === 'accept' ? 'Accepted' : 'Declined'}`,
      `Request ${requestId} has been ${action === 'accept' ? 'accepted' : 'declined'}.`
    );
  };

  const handleShipmentStatusUpdate = (shipmentId: string, newStatus: string) => {
    setGlobalShipments(prev => prev.map(s => 
      s.id === shipmentId ? { ...s, status: newStatus as ShipmentStatus } : s
    ));
    addNotification('info', 'Status Updated', `Shipment ${shipmentId} status updated to ${newStatus}.`);
  };

  const handleRatingSubmit = (shipmentId: string, rating: number, feedback: string) => {
    addNotification('success', 'Rating Submitted', `Thank you for rating shipment ${shipmentId}. Your feedback has been recorded.`);
  };

  const handleRerouteRequest = (disruption: DisruptionAlert) => {
    setSelectedDisruption(disruption);
    // Generate available routes based on disruption
    const routes = generateAvailableRoutes(disruption);
    setAvailableRoutes(routes);
    setShowRerouteDialog(true);
  };

  const generateAvailableRoutes = (disruption: DisruptionAlert) => {
    // Mock data - in real app, this would come from a routing API
    return [
      {
        id: 'R001',
        name: 'Alternative Highway Route',
        distance: 450,
        estimatedTime: '6-8 hours',
        cost: 1200,
        carbonFootprint: 85,
        riskLevel: 'low' as const,
        status: 'available' as const
      },
      {
        id: 'R002',
        name: 'Coastal Route',
        distance: 520,
        estimatedTime: '8-10 hours',
        cost: 1100,
        carbonFootprint: 95,
        riskLevel: 'medium' as const,
        status: 'available' as const
      },
      {
        id: 'R003',
        name: 'Mountain Pass Route',
        distance: 380,
        estimatedTime: '5-7 hours',
        cost: 1350,
        carbonFootprint: 70,
        riskLevel: 'high' as const,
        status: 'congested' as const
      },
      {
        id: 'R004',
        name: 'Express Lane Route',
        distance: 420,
        estimatedTime: '4-6 hours',
        cost: 1500,
        carbonFootprint: 90,
        riskLevel: 'low' as const,
        status: 'available' as const
      }
    ];
  };

  const handleRouteSelection = (routeId: string) => {
    const selectedRoute = availableRoutes.find(r => r.id === routeId);
    if (selectedRoute && selectedDisruption) {
      // Update shipment with new route
      setGlobalShipments(prev => prev.map(shipment => 
        shipment.id === selectedDisruption.shipmentId 
          ? { 
              ...shipment, 
              route: selectedRoute.name,
              eta: selectedRoute.estimatedTime,
              cost: selectedRoute.cost,
              carbonFootprint: selectedRoute.carbonFootprint,
              riskLevel: selectedRoute.riskLevel
            }
          : shipment
      ));
      
      // Remove disruption
      setGlobalDisruptions(prev => prev.filter(d => d.id !== selectedDisruption.id));
      
      addNotification('success', 'Route Updated', `Shipment rerouted via ${selectedRoute.name}. New ETA: ${selectedRoute.estimatedTime}`);
      setShowRerouteDialog(false);
      setSelectedDisruption(null);
    }
  };

  const handleNewOrder = () => {
    setShowNewOrderDialog(true);
    setSelectedSupplier('');
    setOrderFormData({
      product: '',
      quantity: '',
      priority: '',
      deliveryDate: '',
      specialInstructions: ''
    });
  };

  const handleSupplierSelection = (supplierId: string) => {
    setSelectedSupplier(supplierId);
  };

  const handleOrderSubmit = () => {
    if (!selectedSupplier || !orderFormData.product || !orderFormData.quantity) {
      addNotification('error', 'Missing Information', 'Please fill in all required fields.');
      return;
    }

    const supplier = suppliers.find(s => s.id === selectedSupplier);
    if (supplier) {
      addNotification('success', 'Order Placed', `New order placed with ${supplier.name}. Order ID: ORD${Date.now()}`);
      setShowNewOrderDialog(false);
      setSelectedSupplier('');
      setOrderFormData({
        product: '',
        quantity: '',
        priority: '',
        deliveryDate: '',
        specialInstructions: ''
      });
    }
  };

  // Global data
  const customers = [
    { id: "C001", name: "TechCorp Inc.", location: "New York, NY" },
    { id: "C002", name: "Global Retail", location: "Los Angeles, CA" },
    { id: "C003", name: "Manufacturing Co.", location: "Chicago, IL" },
    { id: "C004", name: "Logistics Plus", location: "Miami, FL" },
  ];

  const transporters = [
    {
      id: "T001",
      name: "FastTrack Logistics",
      rating: 4.8,
      modes: ["truck", "air"],
      evFleet: true,
    },
    {
      id: "T002",
      name: "Ocean Express",
      rating: 4.6,
      modes: ["ship", "truck"],
      evFleet: false,
    },
    {
      id: "T003",
      name: "Green Transport",
      rating: 4.9,
      modes: ["truck", "ev"],
      evFleet: true,
    },
  ];

  const suppliers = [
    {
      id: "S001",
      name: "TechCorp Inc.",
      rating: 4.8,
      specialties: ["Electronics", "Software", "Hardware"],
      location: "New York, NY",
      deliveryTime: "2-3 days",
      minOrder: 500,
      ecoFriendly: true,
      certifications: ["ISO 9001", "Green Certified"],
      totalOrders: 1247,
      onTimeRate: 96
    },
    {
      id: "S002",
      name: "Global Retail",
      rating: 4.6,
      specialties: ["Consumer Goods", "Fashion", "Home & Garden"],
      location: "Los Angeles, CA",
      deliveryTime: "3-5 days",
      minOrder: 300,
      ecoFriendly: false,
      certifications: ["ISO 9001"],
      totalOrders: 892,
      onTimeRate: 92
    },
    {
      id: "S003",
      name: "Manufacturing Co.",
      rating: 4.7,
      specialties: ["Industrial Equipment", "Automotive Parts", "Machinery"],
      location: "Chicago, IL",
      deliveryTime: "5-7 days",
      minOrder: 1000,
      ecoFriendly: true,
      certifications: ["ISO 9001", "ISO 14001", "Green Certified"],
      totalOrders: 634,
      onTimeRate: 94
    },
    {
      id: "S004",
      name: "Logistics Plus",
      rating: 4.9,
      specialties: ["Logistics Services", "Warehousing", "Distribution"],
      location: "Miami, FL",
      deliveryTime: "1-2 days",
      minOrder: 200,
      ecoFriendly: true,
      certifications: ["ISO 9001", "Green Certified", "Carbon Neutral"],
      totalOrders: 2156,
      onTimeRate: 98
    }
  ];

  if (!currentUser) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated dark SVG background */}
        <div className="absolute inset-0 bg-[#0b0f19]">
          <svg
            className="absolute inset-0 w-full h-full opacity-70"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 1600 900"
          >
            <defs>
              <radialGradient id="g1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0b0f19" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="g2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0b0f19" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="g3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0b0f19" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="320" fill="url(#g1)">
              <animate
                attributeName="cx"
                values="200;1400;200"
                dur="24s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="200;700;200"
                dur="32s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="1200" cy="300" r="380" fill="url(#g2)">
              <animate
                attributeName="cx"
                values="1200;300;1200"
                dur="28s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="300;800;300"
                dur="36s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="800" cy="600" r="300" fill="url(#g3)">
              <animate
                attributeName="cx"
                values="800;200;800"
                dur="26s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="600;200;600"
                dur="34s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Floating particle field */}
            <g opacity="0.55">
              <circle cx="100" cy="120" r="2" fill="#ffffff">
                <animate
                  attributeName="cx"
                  values="100;1500;100"
                  dur="40s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="120;820;120"
                  dur="52s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="300" cy="500" r="1.8" fill="#e2e8f0">
                <animate
                  attributeName="cx"
                  values="300;50;300"
                  dur="48s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="500;200;500"
                  dur="44s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="620" cy="240" r="2.2" fill="#cbd5e1">
                <animate
                  attributeName="cx"
                  values="620;1000;620"
                  dur="50s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="240;780;240"
                  dur="38s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="940" cy="740" r="1.6" fill="#94a3b8">
                <animate
                  attributeName="cx"
                  values="940;200;940"
                  dur="46s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="740;120;740"
                  dur="58s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="1300" cy="420" r="2.1" fill="#e5e7eb">
                <animate
                  attributeName="cx"
                  values="1300;400;1300"
                  dur="42s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="420;860;420"
                  dur="47s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="1500" cy="180" r="1.4" fill="#ffffff">
                <animate
                  attributeName="cx"
                  values="1500;200;1500"
                  dur="54s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="180;780;180"
                  dur="41s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="420" cy="860" r="1.8" fill="#d1d5db">
                <animate
                  attributeName="cx"
                  values="420;1200;420"
                  dur="57s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="860;200;860"
                  dur="49s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="760" cy="60" r="1.7" fill="#f1f5f9">
                <animate
                  attributeName="cx"
                  values="760;100;760"
                  dur="45s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="60;880;60"
                  dur="53s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="80" cy="700" r="1.5" fill="#ffffff">
                <animate
                  attributeName="cx"
                  values="80;900;80"
                  dur="51s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="700;150;700"
                  dur="39s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="1120" cy="520" r="2" fill="#e2e8f0">
                <animate
                  attributeName="cx"
                  values="1120;300;1120"
                  dur="43s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values="520;840;520"
                  dur="55s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </svg>
          <div className="absolute inset-0 backdrop-blur-[2px]" />
          </div>

        <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-12">
          {/* Left: features */}
          <div className="hidden lg:flex lg:col-span-7 items-start justify-center p-10">
            <div className="max-w-2xl text-white">
              <div className="flex items-center gap-6 mb-8 mt-10">
                <Image
                  src="/images/logo.png"
                  alt="FlexMove"
                  width={128}
                  height={128}
                />
                <div className="flex items-center gap-2 select-none">
                  <span className="text-white text-6xl font-extrabold leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                    Flex
                  </span>
                  <span className="text-emerald-400 text-6xl font-extrabold leading-none drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                    Move
                  </span>
                </div>
              </div>

              <h1 className="text-blue-500 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
                Manage your supply chain with confidence
              </h1>
              <p className="mt-3 text-lg text-white/70 max-w-prose">
                FlexMove connects suppliers, transporters, and customers with
                real-time visibility and optimization.
              </p>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
  <div className="flex items-start gap-3">
    <MapPin className="h-6 w-6 text-sky-400 flex-shrink-0" />
    <div>
      <div className="font-extrabold text-xl text-orange-300">Live Tracking</div>
      <div className="text-white/80 text-sm">Real-time routes, ETAs, and disruption alerts.</div>
    </div>
  </div>
  
  <div className="flex items-start gap-3">
    <BarChart3 className="h-6 w-6 text-emerald-400 flex-shrink-0" />
    <div>
      <div className="font-extrabold text-xl text-emerald-300">Analytics</div>
      <div className="text-white/80 text-sm">Performance, costs, and sustainability insights.</div>
    </div>
  </div>
  
  <div className="flex items-start gap-3">
    <Package className="h-6 w-6 text-violet-400 flex-shrink-0" />
    <div>
      <div className="font-extrabold text-xl text-yellow-300">Smart Logistics</div>
      <div className="text-white/80 text-sm">Optimize routes and reduce delays automatically.</div>
    </div>
  </div>
  
  <div className="flex items-start gap-3">
    <Leaf className="h-6 w-6 text-lime-400 flex-shrink-0" />
    <div>
      <div className="font-extrabold text-xl text-lime-300">Sustainability</div>
      <div className="text-white/80 text-sm">Track carbon footprint and EV adoption.</div>
    </div>
  </div>

  {/* New Features */}
  <div className="flex items-start gap-3">
    <Truck className="h-6 w-6 text-red-400 flex-shrink-0" />
    <div>
      <div className="font-extrabold text-xl text-red-300">Fleet Management</div>
      <div className="text-white/80 text-sm">Efficient scheduling and vehicle tracking.</div>
    </div>
  </div>

  <div className="flex items-start gap-3">
    <Shield className="h-6 w-6 text-indigo-400 flex-shrink-0" />
    <div>
      <div className="font-extrabold text-xl text-indigo-300">Security</div>
      <div className="text-white/80 text-sm">Ensure data protection and transport safety.</div>
    </div>
  </div>

  <div className="flex items-start gap-3">
    <User className="h-6 w-6 text-pink-400 flex-shrink-0" />
    <div>
      <div className="font-extrabold text-xl text-pink-300">Customer Support</div>
      <div className="text-white/80 text-sm">24/7 assistance for users and stakeholders.</div>
    </div>
  </div>

  <div className="flex items-start gap-3">
    <Zap className="h-6 w-6 text-yellow-400 flex-shrink-0" />
    <div>
      <div className="font-extrabold text-xl text-yellow-300">Automation</div>
      <div className="text-white/80 text-sm">Reduce manual tasks with smart workflows.</div>
    </div>
  </div>
</div>

            </div>
          </div>

          {/* Right: form */}
          <div className="col-span-1 lg:col-span-5 flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 text-white lg:hidden">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/logo.png"
                    alt="FlexMove"
                    width={120}
                    height={48}
                  />
                  <div className="flex items-baseline gap-1 select-none">
                    <span className="text-white text-2xl font-extrabold leading-none">
                      Flex
                    </span>
                    <span className="text-emerald-400 text-2xl font-extrabold leading-none">
                      Move
                    </span>
                  </div>
                </div>
                <h2 className="mt-6 text-3xl font-extrabold tracking-tight">
                  Welcome to FlexMove
                </h2>
                <p className="mt-2 text-white/70">
                  Connect suppliers, transporters, and customers
                </p>
              </div>

              <Card className="bg-white/10 border-white/20 text-white backdrop-blur-md shadow-2xl">
            <CardHeader>
                  <CardTitle className="text-emarald-300 text-2xl font-extrabold">
                    {isLogin ? "Sign In" : "Create your account"}
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    {isLogin
                      ? "Access your dashboard"
                      : "Start your journey with FlexMove"}
                  </CardDescription>
            </CardHeader>
                <CardContent className="space-y-5">
                  {!isLogin && (
              <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="text-white/90 font-semibold"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        className="bg-white/5 border-white/20 placeholder:text-white/60"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
              </div>
                  )}
              <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-white/90 font-semibold"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="bg-white/5 border-white/20 placeholder:text-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
              </div>
              <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-white/90 font-semibold"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="bg-white/5 border-white/20 placeholder:text-white pr-12"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 text-white/80 hover:text-white text-sm"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {!isLogin && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/70">
                            Password strength
                          </span>
                          <span className="text-white/80 font-semibold">
                            {password.length >= 12
                              ? "Strong"
                              : password.length >= 8
                              ? "Medium"
                              : password.length > 0
                              ? "Weak"
                              : ""}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
                          <div
                            className={`${
                              password.length >= 12
                                ? "bg-emerald-400 w-[100%]"
                                : password.length >= 8
                                ? "bg-yellow-300 w-[66%]"
                                : password.length > 0
                                ? "bg-rose-400 w-[33%]"
                                : "w-0"
                            } h-full transition-all`}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/90 font-semibold">
                      Select Your Role
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
  <button
    type="button"
    onClick={() => setRole("supplier")}
    className={`flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-md border px-3 py-2 text-sm transition-transform transform ${
      role === "supplier"
        ? "border-emerald-400 bg-emerald-400/10 text-white"
        : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:scale-105 active:scale-95"
    }`}
    aria-pressed={role === "supplier"}
  >
    <Package className="h-4 w-4" />
    Supplier
  </button>

  <button
    type="button"
    onClick={() => setRole("transporter")}
    className={`flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-700 rounded-md border px-3 py-2 text-sm transition-transform transform ${
      role === "transporter"
        ? "border-emerald-400 bg-emerald-400/10 text-white"
        : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:scale-105 active:scale-95"
    }`}
    aria-pressed={role === "transporter"}
  >
    <Truck className="h-4 w-4" />
    Transporter
  </button>

  <button
    type="button"
    onClick={() => setRole("customer")}
    className={`flex items-center justify-center gap-2 rounded-md border bg-gradient-to-r from-purple-600 via-pink-600 to-rose-700 px-3 py-2 text-sm transition-transform transform ${
      role === "customer"
        ? "border-emerald-400 bg-emerald-400/10 text-white"
        : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:scale-105 active:scale-95"
    }`}
    aria-pressed={role === "customer"}
  >
    <MapPin className="h-4 w-4" />
    Customer
  </button>
</div>

              </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-white/80 text-sm select-none">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/30 bg-transparent"
                        defaultChecked
                      />
                      Remember me
                    </label>
                    <button className="text-sm text-sky-300 hover:text-sky-200">
                      Forgot password?
                    </button>
                  </div>
                  <Button
                    className="w-full font-bold text-base"
                    onClick={() => handleLogin(role || "supplier")}
                    disabled={!role}
                  >
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
              <div className="text-center">
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      {isLogin
                        ? "Don't have an account? Sign up"
                        : "Already have an account? Sign in"}
                </button>
              </div>
                  {!isLogin && (
                    <div className="text-xs text-white/70 text-center">
                      By creating an account, you agree to our{" "}
                      <span className="text-emerald-300 font-semibold">
                        Terms
                      </span>{" "}
                      and{" "}
                      <span className="text-emerald-300 font-semibold">
                        Privacy Policy
                      </span>
                      .
                    </div>
                  )}
            </CardContent>
          </Card>

          {/* Demo Login Buttons */}
              <Card className="mt-6 bg-white/10 border-white/20 text-white backdrop-blur-md">
            <CardHeader>
                  <CardTitle className="text-base font-bold">
                    Demo Access
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Try the platform with different roles
                  </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                    className="btn-glow w-full justify-start bg-transparent border-white/20 text-white hover:bg-white/10"
                onClick={() => handleLogin("supplier")}
              >
                <Package className="h-4 w-4 mr-2" />
                Demo as Supplier
              </Button>
              <Button
                variant="outline"
                    className="btn-glow w-full justify-start bg-transparent border-white/20 text-white hover:bg-white/10"
                onClick={() => handleLogin("transporter")}
              >
                <Truck className="h-4 w-4 mr-2" />
                Demo as Transporter
              </Button>
              <Button
                variant="outline"
                    className="btn-glow w-full justify-start bg-transparent border-white/20 text-white hover:bg-white/10"
                onClick={() => handleLogin("customer")}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Demo as Customer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="FlexMove"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <div className="flex items-baseline gap-1 select-none">
              <span className="text-foreground text-xl font-extrabold leading-none">
                Flex
              </span>
              <span className="text-emerald-600 text-xl font-extrabold leading-none">
                Move
              </span>
            </div>
            <div className="ml-4 text-sm text-muted-foreground">
              {currentUser === "supplier" && "Supplier Dashboard"}
              {currentUser === "transporter" && "Transporter Dashboard"}
              {currentUser === "customer" && "Customer Dashboard"}
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="btn-glow">
            Sign Out
          </Button>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="p-6">
        {currentUser === "supplier" && (
          <SupplierDashboard 
            onCreateShipment={handleCreateShipment}
            onDisruptionAction={handleDisruptionAction}
            onRerouteRequest={handleRerouteRequest}
            shipments={globalShipments}
            disruptions={globalDisruptions}
          />
        )}
        {currentUser === "transporter" && (
          <TransporterDashboard 
            onRequestAction={handleRequestAction}
            onShipmentStatusUpdate={handleShipmentStatusUpdate}
            shipments={globalShipments}
          />
        )}
        {currentUser === "customer" && (
          <CustomerDashboard 
            onRatingSubmit={handleRatingSubmit}
            onNewOrder={handleNewOrder}
            shipments={globalShipments}
            suppliers={suppliers}
          />
        )}
      </main>

      {/* Notification System */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg border-l-4 max-w-sm animate-in slide-in-from-right-full duration-300 ${
              notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
              notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
              notification.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
              'bg-blue-50 border-blue-500 text-blue-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-sm mt-1">{notification.message}</p>
                <p className="text-xs mt-2 opacity-75">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Shipment Modal */}
      {showCreateShipment && (
        <CreateShipmentForm
          customers={customers}
          transporters={transporters}
          step={createShipmentStep}
          selectedCustomer={selectedCustomer}
          selectedTransporter={selectedTransporter}
          formData={shipmentFormData}
          onCustomerSelected={handleCustomerSelected}
          onTransporterSelected={handleTransporterSelected}
          onFormDataChange={setShipmentFormData}
          onShipmentCreated={handleShipmentCreated}
          onClose={() => {
            setShowCreateShipment(false);
            setCreateShipmentStep('customer');
            setSelectedCustomer('');
            setSelectedTransporter('');
            setShipmentFormData({
              origin: '',
              destination: '',
              weight: '',
              priority: '',
              mode: ''
            });
          } }        />
      )}

      {/* Reroute Dialog */}
      {showRerouteDialog && selectedDisruption && (
        <RerouteDialog
          disruption={selectedDisruption}
          availableRoutes={availableRoutes}
          onRouteSelection={handleRouteSelection}
          onClose={() => {
            setShowRerouteDialog(false);
            setSelectedDisruption(null);
          }}
        />
      )}

      {/* New Order Dialog */}
      {showNewOrderDialog && (
        <NewOrderDialog
          suppliers={suppliers}
          selectedSupplier={selectedSupplier}
          formData={orderFormData}
          onSupplierSelection={handleSupplierSelection}
          onFormDataChange={setOrderFormData}
          onSubmit={handleOrderSubmit}
          onClose={() => {
            setShowNewOrderDialog(false);
            setSelectedSupplier('');
            setOrderFormData({
              product: '',
              quantity: '',
              priority: '',
              deliveryDate: '',
              specialInstructions: ''
            });
          }}
        />
      )}
    </div>
  );
}

import { CreateShipmentForm } from "@/components/create-shipment-form";
import { Header } from "@radix-ui/react-accordion";

// Reroute Dialog Component
function RerouteDialog({
  disruption,
  availableRoutes,
  onRouteSelection,
  onClose
}: {
  disruption: DisruptionAlert;
  availableRoutes: Array<{
    id: string;
    name: string;
    distance: number;
    estimatedTime: string;
    cost: number;
    carbonFootprint: number;
    riskLevel: 'low' | 'medium' | 'high';
    status: 'available' | 'congested' | 'delayed';
  }>;
  onRouteSelection: (routeId: string) => void;
  onClose: () => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-50 border-green-200';
      case 'congested': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'delayed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-blue-600" />
              <span>Reroute Shipment</span>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </CardTitle>
          <CardDescription>
            Disruption: {disruption.type} - {disruption.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              <strong>Shipment ID:</strong> {disruption.shipmentId} | 
              <strong className="ml-2">Delay:</strong> {disruption.delay}
            </div>
            
            <div className="grid gap-4">
              {availableRoutes.map((route) => (
                <div
                  key={route.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    route.status === 'available' 
                      ? 'border-green-200 hover:border-green-300' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => route.status === 'available' && onRouteSelection(route.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{route.name}</h4>
                        <Badge className={getStatusColor(route.status)}>
                          {route.status}
                        </Badge>
                        <Badge variant="outline" className={getRiskColor(route.riskLevel)}>
                          Risk: {route.riskLevel}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span>{route.distance} km</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span>{route.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span>${route.cost}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <span>{route.carbonFootprint}kg CO₂</span>
                        </div>
                      </div>
                    </div>
                    
                    {route.status === 'available' && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRouteSelection(route.id);
                        }}
                        className="ml-4 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Select Route
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// New Order Dialog Component
function NewOrderDialog({
  suppliers,
  selectedSupplier,
  formData,
  onSupplierSelection,
  onFormDataChange,
  onSubmit,
  onClose
}: {
  suppliers: Array<{
    id: string;
    name: string;
    rating: number;
    specialties: string[];
    location: string;
    deliveryTime: string;
    minOrder: number;
    ecoFriendly: boolean;
    certifications: string[];
    totalOrders: number;
    onTimeRate: number;
  }>;
  selectedSupplier: string;
  formData: {
    product: string;
    quantity: string;
    priority: string;
    deliveryDate: string;
    specialInstructions: string;
  };
  onSupplierSelection: (supplierId: string) => void;
  onFormDataChange: (data: any) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const selectedSupplierData = suppliers.find(s => s.id === selectedSupplier);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plus className="h-6 w-6 text-purple-600" />
              <span>Place New Order</span>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </CardTitle>
          <CardDescription>
            Select a supplier and provide order details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Supplier Selection */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">Select Supplier</Label>
              <div className="grid gap-4">
                {suppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedSupplier === supplier.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => onSupplierSelection(supplier.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">{supplier.name}</h4>
                          <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                            ⭐ {supplier.rating}/5
                          </Badge>
                          {supplier.ecoFriendly && (
                            <Badge variant="outline" className="text-green-600 border-green-300">
                              <Leaf className="h-3 w-3 mr-1" />
                              Eco-Friendly
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="font-medium">Location:</span> {supplier.location}
                          </div>
                          <div>
                            <span className="font-medium">Delivery:</span> {supplier.deliveryTime}
                          </div>
                          <div>
                            <span className="font-medium">Min Order:</span> ${supplier.minOrder}
                          </div>
                          <div>
                            <span className="font-medium">On-Time Rate:</span> {supplier.onTimeRate}%
                          </div>
                        </div>
                        
                        <div className="text-sm mb-2">
                          <span className="font-medium">Specialties:</span> {supplier.specialties.join(', ')}
                        </div>
                        
                        <div className="text-sm">
                          <span className="font-medium">Certifications:</span> {supplier.certifications.join(', ')}
                        </div>
                      </div>
                      
                      {selectedSupplier === supplier.id && (
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center ml-4">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details */}
            {selectedSupplier && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Order Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product">Product/Service *</Label>
                    <Input
                      id="product"
                      value={formData.product}
                      onChange={(e) => onFormDataChange({...formData, product: e.target.value})}
                      placeholder="Enter product or service name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => onFormDataChange({...formData, quantity: e.target.value})}
                      placeholder="Enter quantity"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => onFormDataChange({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="deliveryDate">Preferred Delivery Date</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => onFormDataChange({...formData, deliveryDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Textarea
                    id="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={(e) => onFormDataChange({...formData, specialInstructions: e.target.value})}
                    placeholder="Any special requirements or instructions..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={onSubmit}
                disabled={!selectedSupplier || !formData.product || !formData.quantity}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Place Order
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SupplierDashboard({ 
  onCreateShipment, 
  onDisruptionAction, 
  onRerouteRequest,
  shipments = [], 
  disruptions: propDisruptions = [] 
}: {
  onCreateShipment: () => void;
  onDisruptionAction: (id: string, action: string) => void;
  onRerouteRequest: (disruption: DisruptionAlert) => void;
  shipments: ShipmentData[];
  disruptions: DisruptionAlert[];
}) {
  const [selectedShipment, setSelectedShipment] = useState<ShipmentData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAnalytics, setShowAnalytics] = useState(false);

  const customers = [
    { id: "C001", name: "TechCorp Inc.", location: "New York, NY" },
    { id: "C002", name: "Global Retail", location: "Los Angeles, CA" },
    { id: "C003", name: "Manufacturing Co.", location: "Chicago, IL" },
    { id: "C004", name: "Logistics Plus", location: "Miami, FL" },
  ];

  const transporters = [
    {
      id: "T001",
      name: "FastTrack Logistics",
      rating: 4.8,
      modes: ["truck", "air"],
      evFleet: true,
    },
    {
      id: "T002",
      name: "Ocean Express",
      rating: 4.6,
      modes: ["ship", "truck"],
      evFleet: false,
    },
    {
      id: "T003",
      name: "Sky Cargo",
      rating: 4.9,
      modes: ["air"],
      evFleet: true,
    },
    {
      id: "T004",
      name: "Green Transport",
      rating: 4.7,
      modes: ["truck", "ev"],
      evFleet: true,
    },
  ];


  // Supplier analytics datasets
  const supplierModeSplit = [
    { name: "Truck", value: 48, color: "#3b82f6" },
    { name: "Ship", value: 22, color: "#14b8a6" },
    { name: "Air", value: 18, color: "#8b5cf6" },
    { name: "EV", value: 12, color: "#22c55e" },
  ];

  const supplierMonthlyCosts = [
    { month: "Jan", cost: 12.1, carbon: 8.5 },
    { month: "Feb", cost: 11.3, carbon: 8.1 },
    { month: "Mar", cost: 10.7, carbon: 7.9 },
    { month: "Apr", cost: 9.8, carbon: 7.2 },
    { month: "May", cost: 9.2, carbon: 6.8 },
    { month: "Jun", cost: 8.6, carbon: 6.5 },
  ];

  const supplierOnTimeSeries = [
    { month: "Jan", rate: 88, disruptions: 12 },
    { month: "Feb", rate: 89, disruptions: 10 },
    { month: "Mar", rate: 91, disruptions: 8 },
    { month: "Apr", rate: 92, disruptions: 7 },
    { month: "May", rate: 94, disruptions: 5 },
    { month: "Jun", rate: 95, disruptions: 4 },
  ];
  
  const costBreakdownData = [
    { name: 'Fuel', value: 40, color: '#ef4444' },
    { name: 'Labor', value: 30, color: '#f97316' },
    { name: 'Maintenance', value: 15, color: '#eab308' },
    { name: 'Overhead', value: 10, color: '#84cc16' },
    { name: 'Fees', value: 5, color: '#14b8a6' },
  ];
  
  const carrierPerformanceData = [
    { name: 'FastTrack', onTime: 95, cost: 4.2, rating: 4.8 },
    { name: 'Ocean Express', onTime: 92, cost: 3.8, rating: 4.6 },
    { name: 'Sky Cargo', onTime: 98, cost: 5.5, rating: 4.9 },
    { name: 'Green Transport', onTime: 94, cost: 4.0, rating: 4.7 },
  ];

  // State for disruptions with local management
  const [localDisruptions, setLocalDisruptions] = useState<DisruptionAlert[]>([
    {
      id: 'DISP-001',
      shipmentId: 'SHIP-2023-0456',
      type: 'Severe Weather Alert',
      description: 'Heavy snowstorm causing delays on I-80 in Wyoming',
      delay: '12-24 hours',
      status: 'active',
      severity: 'high',
      location: 'I-80, WY',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
      suggestions: ['Reroute shipment', 'Delay delivery', 'Contact customer']
    },
    {
      id: 'DISP-002',
      shipmentId: 'SHIP-2023-0457',
      type: 'Mechanical Failure',
      description: 'Truck breakdown - waiting for repair service',
      delay: '6-8 hours',
      status: 'in-progress',
      severity: 'medium',
      location: 'Denver, CO',
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
      suggestions: ['Arrange backup vehicle', 'Update ETA', 'Contact repair service']
    },
    {
      id: 'DISP-003',
      shipmentId: 'SHIP-2023-0458',
      type: 'Port Congestion',
      description: 'Unloading delays at Port of Los Angeles',
      delay: '24-48 hours',
      status: 'monitoring',
      severity: 'high',
      location: 'Los Angeles, CA',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
      suggestions: ['Reroute to alternate port', 'Update customer', 'Monitor situation']
    },
    ...propDisruptions // Include any disruptions passed as props
  ]);

  const handleDisruptionAction = (disruptionId: string, action: string) => {
    // Call the parent handler if provided
    if (onDisruptionAction) {
      onDisruptionAction(disruptionId, action);
    }
    
    // Update local state
    setLocalDisruptions(currentDisruptions => {
      // If resolving, filter out the resolved disruption
      if (action === 'resolve') {
        return currentDisruptions.filter(d => d.id !== disruptionId);
      }
      
      // For other actions, update the disruption
      return currentDisruptions.map(disruption => {
        if (disruption.id === disruptionId) {
          // Handle different actions
          switch(action) {
            case 'acknowledge':
              return { ...disruption, status: 'acknowledged' };
            case 'escalate':
              return { ...disruption, status: 'escalated', escalatedAt: new Date().toISOString() };
            case 'customer_updated':
              // In a real app, you might add a property like lastCustomerUpdate
              return disruption;
            default:
              return disruption;
          }
        }
        return disruption;
      });
    });
  };

  const handleReroute = (disruption: DisruptionAlert) => {
    if (onRerouteRequest) {
      onRerouteRequest(disruption);
    }
    // Show success message or update UI
    console.log(`Rerouting shipment ${disruption.shipmentId}...`);
  };

  const handleUpdateCustomer = (disruption: DisruptionAlert) => {
    // In a real app, this would open a customer communication interface
    console.log(`Updating customer about shipment ${disruption.shipmentId}...`);
    handleDisruptionAction(disruption.id, 'customer_updated');
  };

  // Custom label renderer for Pie Charts
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const radius = outerRadius + 30; // space for the label
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        className="text-xs"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Supplier Dashboard</h1>
              <p className="text-blue-100 text-lg">Manage your supply chain operations with confidence</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={onCreateShipment}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Shipment
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("analytics")}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-gradient-to-r from-slate-50 to-slate-100 p-1 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 font-semibold transition-all duration-200"
          >
            <Package className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="operations" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 font-semibold transition-all duration-200"
          >
            <Truck className="h-4 w-4 mr-2" />
            Operations
          </TabsTrigger>
          <TabsTrigger 
            value="disruptions" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-red-600 font-semibold transition-all duration-200 relative"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Disruptions
            {localDisruptions.length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {localDisruptions.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-600 font-semibold transition-all duration-200"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-orange-600 font-semibold transition-all duration-200"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-6">
          {/* Enhanced Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
              Active Shipments
            </CardTitle>
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Package className="h-4 w-4 text-white" />
                </div>
          </CardHeader>
          <CardContent>
                <div className="text-3xl font-bold text-blue-800">24</div>
                <p className="text-xs text-blue-600 font-medium">+2 from last week</p>
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
          </CardContent>
        </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
              On-Time Delivery
            </CardTitle>
                <div className="p-2 bg-green-500 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
          </CardHeader>
          <CardContent>
                <div className="text-3xl font-bold text-green-800">94.2%</div>
                <p className="text-xs text-green-600 font-medium">+1.2% from last month</p>
                <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '94%'}}></div>
                </div>
          </CardContent>
        </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700">
              Carbon Footprint
            </CardTitle>
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
          </CardHeader>
          <CardContent>
                <div className="text-3xl font-bold text-emerald-800">2.4t CO₂</div>
                <p className="text-xs text-emerald-600 font-medium">-12% reduction</p>
                <div className="mt-2 w-full bg-emerald-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
          </CardContent>
        </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Cost Savings</CardTitle>
                <div className="p-2 bg-purple-500 rounded-lg">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
          </CardHeader>
          <CardContent>
                <div className="text-3xl font-bold text-purple-800">$12,450</div>
                <p className="text-xs text-purple-600 font-medium">+8% this quarter</p>
                <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
          </CardContent>
        </Card>
      </div>

          {/* Enhanced Recent Shipments */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Recent Shipments
              </CardTitle>
              <CardDescription className="text-slate-600">
                Track your latest shipment activities and performance
          </CardDescription>
        </CardHeader>
            <CardContent className="p-6">
          <div className="space-y-4">
            {[
              {
                id: "SH001",
                customer: "TechCorp Inc.",
                status: "In Transit",
                eta: "2 days",
                    progress: 65,
                    color: "blue"
              },
              {
                id: "SH002",
                customer: "Global Retail",
                status: "Delivered",
                eta: "Completed",
                    progress: 100,
                    color: "green"
              },
              {
                id: "SH003",
                customer: "Manufacturing Co.",
                status: "Pending",
                eta: "5 days",
                    progress: 10,
                    color: "yellow"
              },
            ].map((shipment) => (
              <div
                key={shipment.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        shipment.color === 'blue' ? 'bg-blue-100' :
                        shipment.color === 'green' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>
                        <Package className={`h-4 w-4 ${
                          shipment.color === 'blue' ? 'text-blue-600' :
                          shipment.color === 'green' ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                      </div>
                <div>
                        <div className="font-semibold text-slate-800">{shipment.id}</div>
                        <div className="text-sm text-slate-600">{shipment.customer}</div>
                  </div>
                </div>
                <div className="text-right">
                      <Badge 
                        variant={
                          shipment.status === "Delivered" ? "default" :
                          shipment.status === "In Transit" ? "secondary" : "outline"
                        }
                        className={
                          shipment.status === "Delivered" ? "bg-green-100 text-green-800" :
                          shipment.status === "In Transit" ? "bg-blue-100 text-blue-800" : 
                          "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {shipment.status}
                      </Badge>
                      <div className="text-xs text-slate-500 mt-1">{shipment.eta}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

          {/* Enhanced Active Shipments */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Truck className="h-5 w-5 text-indigo-600" />
                Active Shipments
              </CardTitle>
              <CardDescription className="text-slate-600">
                Manage and track your shipment portfolio with detailed insights
          </CardDescription>
        </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                    className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          shipment.mode === 'truck' ? 'bg-blue-100' :
                          shipment.mode === 'ship' ? 'bg-cyan-100' :
                          shipment.mode === 'air' ? 'bg-purple-100' : 'bg-green-100'
                        }`}>
                          {shipment.mode === "truck" && <Truck className="h-5 w-5 text-blue-600" />}
                          {shipment.mode === "ship" && <Ship className="h-5 w-5 text-cyan-600" />}
                          {shipment.mode === "air" && <Plane className="h-5 w-5 text-purple-600" />}
                          {shipment.mode === "ev" && <Truck className="h-5 w-5 text-green-600" />}
                        </div>
                    <div>
                          <div className="font-bold text-lg text-slate-800">{shipment.id}</div>
                          <div className="text-sm text-slate-600 font-medium">{shipment.customer}</div>
                          <div className="text-xs text-slate-500">{shipment.route}</div>
                    </div>
                    <Badge
                      variant={
                            shipment.status === "delivered" ? "default" :
                            shipment.status === "in-transit" ? "secondary" :
                            shipment.status === "delayed" ? "destructive" : "outline"
                          }
                          className={`font-semibold ${
                            shipment.status === "delivered" ? "bg-green-100 text-green-800" :
                            shipment.status === "in-transit" ? "bg-blue-100 text-blue-800" :
                            shipment.status === "delayed" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {shipment.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-right">
                        <div className="text-lg font-bold text-slate-800">{shipment.eta}</div>
                        <div className="text-sm text-slate-600">ETA</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="text-slate-500 text-xs">Cost</div>
                          <div className="font-semibold text-slate-800">${shipment.cost.toLocaleString()}</div>
                  </div>
                  </div>
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <Leaf className="h-4 w-4 text-emerald-600" />
                        <div>
                          <div className="text-slate-500 text-xs">Carbon</div>
                          <div className="font-semibold text-slate-800">{shipment.carbonFootprint}t CO₂</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <AlertTriangle
                      className={`h-4 w-4 ${
                            shipment.riskLevel === "high" ? "text-red-500" :
                            shipment.riskLevel === "medium" ? "text-yellow-500" : "text-green-500"
                      }`}
                    />
                        <div>
                          <div className="text-slate-500 text-xs">Risk</div>
                          <div className="font-semibold text-slate-800 capitalize">{shipment.riskLevel}</div>
                  </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        {shipment.mode === "truck" && <Truck className="h-4 w-4 text-blue-600" />}
                        {shipment.mode === "ship" && <Ship className="h-4 w-4 text-cyan-600" />}
                        {shipment.mode === "air" && <Plane className="h-4 w-4 text-purple-600" />}
                        {shipment.mode === "ev" && <Truck className="h-4 w-4 text-green-600" />}
                        <div>
                          <div className="text-slate-500 text-xs">Mode</div>
                          <div className="font-semibold text-slate-800 capitalize">
                      {shipment.mode === "ev" ? "EV Truck" : shipment.mode}
                          </div>
                        </div>
                  </div>
                </div>

                {shipment.status === "in-transit" && (
                  <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-slate-600">Delivery Progress</span>
                          <span className="text-slate-800">65%</span>
                    </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{width: '65%'}}></div>
                        </div>
                  </div>
                )}

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 hover:bg-blue-50 hover:border-blue-300">
                        <MapPin className="h-4 w-4 mr-1" />
                        Track
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 hover:bg-green-50 hover:border-green-300">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 hover:bg-purple-50 hover:border-purple-300">
                        <Users className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                    </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

          {/* Enhanced Analytics Section */}
      <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-orange-800 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  Route Performance
                </CardTitle>
                <CardDescription className="text-slate-600">Most disrupted routes this month</CardDescription>
          </CardHeader>
              <CardContent className="p-6">
            <div className="space-y-4">
              {[
                    { route: "NYC → LA", disruptions: 12, percentage: 85, color: "red" },
                    { route: "CHI → MIA", disruptions: 8, percentage: 60, color: "orange" },
                    { route: "SEA → DEN", disruptions: 5, percentage: 35, color: "yellow" },
                    { route: "LA → SEA", disruptions: 3, percentage: 20, color: "green" },
              ].map((route) => (
                <div key={route.route} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-700">{route.route}</span>
                        <span className="text-slate-600">{route.disruptions} disruptions</span>
                  </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            route.color === 'red' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                            route.color === 'orange' ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                            route.color === 'yellow' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                            'bg-gradient-to-r from-green-400 to-green-600'
                          }`}
                          style={{width: `${route.percentage}%`}}
                        ></div>
                      </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-purple-800 flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Transporter Reliability
                </CardTitle>
                <CardDescription className="text-slate-600">Performance ratings and on-time delivery</CardDescription>
          </CardHeader>
              <CardContent className="p-6">
            <div className="space-y-4">
              {transporters.map((transporter) => (
                <div
                  key={transporter.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Users className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{transporter.name}</div>
                          <div className="text-sm text-slate-600">{transporter.modes.join(", ")}</div>
                    </div>
                    {transporter.evFleet && (
                      <Badge
                        variant="outline"
                            className="text-green-600 border-green-300 bg-green-50"
                      >
                        <Leaf className="h-3 w-3 mr-1" />
                        EV Fleet
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                        <div className="font-bold text-lg text-slate-800">{transporter.rating}/5.0</div>
                        <div className="text-xs text-slate-500">Rating</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

          {/* Enhanced Advanced Analytics */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-t-lg">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-slate-600" />
                Advanced Analytics & Insights
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg">
            Comprehensive performance metrics and business intelligence
          </CardDescription>
        </CardHeader>
            <CardContent className="p-6">
          <AnalyticsCharts userRole="supplier" />
        </CardContent>
      </Card>

      </TabsContent>

      <TabsContent value="operations" className="space-y-6">
          {/* Operations Center */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-t-lg">
                <CardTitle className="text-lg font-bold text-blue-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600" />
                  Disruption Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-800 mb-2">
                    {localDisruptions.filter(d => d.status !== 'resolved').length}
                  </div>
                  <div className="text-sm text-blue-600 mb-4">Active Disruptions</div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setActiveTab('disruptions')}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    View Disruptions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-100 to-green-200 rounded-t-lg">
                <CardTitle className="text-lg font-bold text-green-800 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  Create Shipment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-800 mb-2">New</div>
                  <div className="text-sm text-green-600 mb-4">Shipment Creation</div>
                  <Button
                    onClick={onCreateShipment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-t-lg">
                <CardTitle className="text-lg font-bold text-purple-800 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Carrier Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-800 mb-2">{transporters.length}</div>
                  <div className="text-sm text-purple-600 mb-4">Available Carriers</div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <Users className="h-4 w-4 mr-2" />
                    Assign Carriers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Truck className="h-5 w-5 text-slate-600" />
                Operations Dashboard
              </CardTitle>
              <CardDescription className="text-slate-600">Manage disruptions, create shipments, and assign carriers</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button size="sm" variant="outline" className="w-full justify-start bg-white hover:bg-blue-50" onClick={() => setActiveTab('disruptions')}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      View All Disruptions
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start bg-white hover:bg-blue-50" onClick={() => setActiveTab('analytics')}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Performance Reports
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start bg-white hover:bg-blue-50">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Carriers
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Recent Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Shipment SH001</span>
                      <span className="text-green-600">In Transit</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Disruption D001</span>
                      <span className="text-red-600">Resolved</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">New Carrier</span>
                      <span className="text-blue-600">Added</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="disruptions" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Active Disruptions</h2>
              <Badge variant="destructive" className="px-3 py-1 text-sm">
                {localDisruptions.length} Active
              </Badge>
            </div>
            
            {localDisruptions.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium">No active disruptions</h3>
                <p className="text-muted-foreground">Your supply chain is running smoothly.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {localDisruptions.map((disruption) => (
                  <Card key={disruption.id} className="border-l-4 border-red-500 bg-red-50/50">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-red-900">{disruption.type}</CardTitle>
                          <CardDescription className="text-red-700">
                            Shipment: {disruption.shipmentId} • {disruption.location}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={disruption.severity === 'high' ? 'destructive' : 'secondary'}
                          className="ml-2"
                        >
                          {disruption.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-red-800">{disruption.description}</p>
                      <div className="flex items-center text-sm text-red-700 mb-4">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Detected: {new Date(disruption.timestamp).toLocaleString()}</span>
                        <span className="mx-2">•</span>
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span>Estimated delay: {disruption.delay}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReroute(disruption)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reroute Shipment
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdateCustomer(disruption)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Update Customer
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDisruptionAction(disruption.id, 'escalate')}
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Escalate
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDisruptionAction(disruption.id, 'resolve')}
                          className="ml-auto"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Resolved
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Enhanced Analytics Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-t-lg">
                <CardTitle className="text-lg font-bold text-blue-800 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Shipment Mode Split
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ChartContainer id="supplier-pie" config={{}} className="aspect-square h-[300px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie 
                      data={supplierModeSplit} 
                      dataKey="value" 
                      nameKey="name" 
                      innerRadius={60}
                      labelLine={false}
                      label={renderCustomizedLabel}
                    >
                      {supplierModeSplit.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-yellow-50">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-t-lg">
                <CardTitle className="text-lg font-bold text-orange-800 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ChartContainer id="cost-breakdown-pie" config={{}} className="aspect-square h-[300px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie 
                      data={costBreakdownData} 
                      dataKey="value" 
                      nameKey="name" 
                      outerRadius={80}
                      labelLine={false}
                      label={renderCustomizedLabel}
                    >
                      {costBreakdownData.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="bg-gradient-to-r from-green-100 to-green-200 rounded-t-lg">
              <CardTitle className="text-lg font-bold text-green-800 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Monthly Costs vs Carbon Footprint
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ChartContainer id="supplier-bar" config={{}} className="h-[300px] w-full">
                <BarChart data={supplierMonthlyCosts}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" stroke="#16a34a" />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="cost" fill="#22c55e" radius={[4, 4, 0, 0]} name="Cost ($k)" />
                  <Line yAxisId="right" type="monotone" dataKey="carbon" stroke="#4b5563" strokeWidth={2} name="Carbon (t CO₂)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-t-lg">
              <CardTitle className="text-lg font-bold text-purple-800 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                On-Time Delivery vs Disruptions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ChartContainer id="supplier-line" config={{}} className="h-[300px] w-full">
                <LineChart data={supplierOnTimeSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" domain={[85, 100]} stroke="#8b5cf6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line yAxisId="left" type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={2} name="On-Time Rate (%)" />
                  <Line yAxisId="right" type="monotone" dataKey="disruptions" stroke="#ef4444" strokeDasharray="5 5" name="Disruptions" />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-slate-600" />
                Carrier Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold">On-Time Percentage by Carrier</h3>
                  <ChartContainer config={{}} className="h-[250px] w-full">
                    <BarChart data={carrierPerformanceData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid horizontal={false} />
                      <XAxis type="number" domain={[80, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="onTime" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Average Cost per Shipment ($k)</h3>
                  <ChartContainer config={{}} className="h-[250px] w-full">
                    <BarChart data={carrierPerformanceData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="cost" fill="#16a34a" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Enhanced Settings */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
              <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-slate-600" />
                  Account Settings
                </CardTitle>
                <CardDescription className="text-slate-600">Manage your supplier account preferences</CardDescription>
            </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Profile Information</h4>
                    <Button variant="outline" className="w-full justify-start bg-white hover:bg-blue-50">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Notification Preferences</h4>
                    <Button variant="outline" className="w-full justify-start bg-white hover:bg-green-50">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Configure Alerts
                    </Button>
                  </div>
                </div>
            </CardContent>
          </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
              <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-slate-600" />
                  Business Settings
                </CardTitle>
                <CardDescription className="text-slate-600">Configure your business operations</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">Default Carriers</h4>
                    <Button variant="outline" className="w-full justify-start bg-white hover:bg-purple-50">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Carriers
                    </Button>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">Shipping Preferences</h4>
                    <Button variant="outline" className="w-full justify-start bg-white hover:bg-orange-50">
                      <Truck className="h-4 w-4 mr-2" />
                      Set Defaults
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TransporterDashboard({
  onRequestAction, 
  onShipmentStatusUpdate, 
  shipments = [] 
}: {
  onRequestAction: (id: string, action: 'accept' | 'decline') => void;
  onShipmentStatusUpdate: (id: string, status: string) => void;
  shipments: ShipmentData[];
}) {
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeShipments, setActiveShipments] = useState([
    {
      id: "SH001",
      supplier: "TechCorp Inc.",
      route: "NYC → LA",
      status: "in-transit",
      progress: 65,
      vehicle: "TRK-001",
      eta: "18 hours",
      lastUpdate: "2 hours ago",
    },
    {
      id: "SH004",
      supplier: "Global Retail",
      route: "CHI → MIA",
      status: "dispatched",
      progress: 25,
      vehicle: "SHP-002",
      eta: "3 days",
      lastUpdate: "6 hours ago",
    },
    {
      id: "SH007",
      supplier: "Manufacturing Co.",
      route: "SEA → DEN",
      status: "preparing",
      progress: 10,
      vehicle: "TRK-003",
      eta: "5 days",
      lastUpdate: "1 day ago",
    },
  ]);

  const [vehicles, setVehicles] = useState([
    {
      id: "TRK-001",
      type: "truck",
      model: "Freightliner Cascadia",
      capacity: "80,000 lbs",
      status: "in-transit",
      location: "Kansas City, MO",
      driver: "John Smith",
      isEV: false,
      fuelEfficiency: "6.5 MPG",
      lastMaintenance: "2025-01-15",
    },
    {
      id: "TRK-002",
      type: "ev",
      model: "Tesla Semi",
      capacity: "82,000 lbs",
      status: "available",
      location: "Los Angeles, CA",
      driver: "Sarah Johnson",
      isEV: true,
      fuelEfficiency: "1.7 kWh/mile",
      lastMaintenance: "2025-02-01",
    },
    {
      id: "SHP-001",
      type: "ship",
      model: "Container Vessel",
      capacity: "20,000 TEU",
      status: "available",
      location: "Port of Long Beach",
      driver: "Captain Rodriguez",
      isEV: false,
      fuelEfficiency: "0.15 gal/TEU-mile",
      lastMaintenance: "2025-01-20",
    },
    {
      id: "AIR-001",
      type: "air",
      model: "Boeing 747F",
      capacity: "140 tons",
      status: "maintenance",
      location: "LAX Cargo",
      driver: "Pilot Williams",
      isEV: false,
      fuelEfficiency: "4.2 gal/mile",
      lastMaintenance: "2025-02-10",
    },
  ]);

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: "REQ001",
      supplier: "TechCorp Inc.",
      route: "NYC → LA",
      priority: "High",
      weight: "45,000 lbs",
      estimatedRevenue: 2450,
      pickupDate: "2025-02-15",
      deliveryDate: "2025-02-18",
    },
    {
      id: "REQ002",
      supplier: "Global Retail",
      route: "CHI → MIA",
      priority: "Medium",
      weight: "32,000 lbs",
      estimatedRevenue: 1850,
      pickupDate: "2025-02-16",
      deliveryDate: "2025-02-20",
    },
    {
      id: "REQ003",
      supplier: "Manufacturing Co.",
      route: "SEA → DEN",
      priority: "Low",
      weight: "28,000 lbs",
      estimatedRevenue: 1650,
      pickupDate: "2025-02-17",
      deliveryDate: "2025-02-22",
    },
  ]);

  const handleRequestAction = (
    requestId: string,
    action: "accept" | "decline"
  ) => {
    onRequestAction(requestId, action);
  };

  const updateShipmentStatus = (
    shipmentId: string,
    newStatus: string,
    newProgress: number
  ) => {
    onShipmentStatusUpdate(shipmentId, newStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-primary";
      case "in-transit":
        return "text-blue-600";
      case "maintenance":
        return "text-destructive";
      case "preparing":
        return "text-yellow-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "truck":
        return Truck;
      case "ev":
        return Truck;
      case "ship":
        return Ship;
      case "air":
        return Plane;
      default:
        return Truck;
    }
  };

  const trackingVehicles = [
    {
      id: "TRK-001",
      type: "truck" as const,
      position: { lat: 39.0458, lng: -76.6413 },
      shipmentId: "SH001",
      status: "in-transit" as const,
    },
    {
      id: "TRK-002",
      type: "ev" as const,
      position: { lat: 34.0522, lng: -118.2437 },
      status: "idle" as const,
    },
    {
      id: "SHP-001",
      type: "ship" as const,
      position: { lat: 33.7701, lng: -118.1937 },
      status: "loading" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-600 via-teal-600 to-cyan-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
      <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Transporter Dashboard</h1>
              <p className="text-green-100 text-lg">Manage your fleet operations and delivery performance</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowAddVehicle(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              >
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
              <Button 
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-gradient-to-r from-slate-50 to-slate-100 p-1 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-600 font-semibold transition-all duration-200"
          >
            <Truck className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="fleet" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 font-semibold transition-all duration-200"
          >
            <Ship className="h-4 w-4 mr-2" />
            Fleet
          </TabsTrigger>
          <TabsTrigger 
            value="shipments" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 font-semibold transition-all duration-200"
          >
            <Package className="h-4 w-4 mr-2" />
            Shipments
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-orange-600 font-semibold transition-all duration-200"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

          {/* Enhanced Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
              Active Vehicles
            </CardTitle>
                <div className="p-2 bg-green-500 rounded-lg">
                  <Truck className="h-4 w-4 text-white" />
                </div>
          </CardHeader>
          <CardContent>
                <div className="text-3xl font-bold text-green-800">{vehicles.length}</div>
                <p className="text-xs text-green-600 font-medium">
              {vehicles.filter((v) => v.status === "available").length}{" "}
              available,{" "}
              {vehicles.filter((v) => v.status === "in-transit").length} in
              transit
            </p>
                <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
          </CardContent>
        </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
              Pending Requests
            </CardTitle>
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Package className="h-4 w-4 text-white" />
                </div>
          </CardHeader>
          <CardContent>
                <div className="text-3xl font-bold text-blue-800">{pendingRequests.length}</div>
                <p className="text-xs text-blue-600 font-medium">
              {pendingRequests.filter((r) => r.priority === "High").length}{" "}
              urgent,{" "}
              {pendingRequests.filter((r) => r.priority !== "High").length}{" "}
              standard
            </p>
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
          </CardContent>
        </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700">EV Fleet %</CardTitle>
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
          </CardHeader>
          <CardContent>
                <div className="text-3xl font-bold text-emerald-800">
              {Math.round(
                (vehicles.filter((v) => v.isEV).length / vehicles.length) * 100
              )}
              %
            </div>
                <p className="text-xs text-emerald-600 font-medium">
              {vehicles.filter((v) => v.isEV).length} of {vehicles.length}{" "}
              vehicles
            </p>
                <div className="mt-2 w-full bg-emerald-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
          </CardContent>
        </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Revenue</CardTitle>
                <div className="p-2 bg-purple-500 rounded-lg">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
          </CardHeader>
          <CardContent>
                <div className="text-3xl font-bold text-purple-800">$45,230</div>
                <p className="text-xs text-purple-600 font-medium">+12% from last month</p>
                <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
          </CardContent>
        </Card>
      </div>

          {/* Enhanced Fleet Tracking */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-cyan-600" />
                Fleet Tracking
              </CardTitle>
              <CardDescription className="text-slate-600">Monitor your vehicles in real-time with live updates</CardDescription>
        </CardHeader>
            <CardContent className="p-6">
          <InteractiveMap
            vehicles={trackingVehicles}
            showVehicles={true}
            trackingMode={true}
                className="h-96 rounded-lg"
          />
        </CardContent>
      </Card>

      {/* Enhanced Fleet Management */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Truck className="h-5 w-5 text-indigo-600" />
                Fleet Management
              </CardTitle>
              <CardDescription className="text-slate-600">Monitor and manage your vehicle fleet with comprehensive controls</CardDescription>
        </CardHeader>
            <CardContent className="p-6">
          <Tabs defaultValue="vehicles" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-slate-100 to-slate-200 p-1 rounded-lg">
                  <TabsTrigger 
                    value="vehicles" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-600 font-semibold transition-all duration-200"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Vehicles
                  </TabsTrigger>
                  <TabsTrigger 
                    value="requests" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 font-semibold transition-all duration-200"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Requests
                  </TabsTrigger>
                  <TabsTrigger 
                    value="shipments" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 font-semibold transition-all duration-200"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Active Shipments
                  </TabsTrigger>
            </TabsList>

            <TabsContent value="vehicles" className="space-y-4">
              <div className="space-y-4">
                {vehicles.map((vehicle) => {
                  const VehicleIcon = getVehicleIcon(vehicle.type);
                  return (
                    <div key={vehicle.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              vehicle.isEV ? "bg-primary" : "bg-muted"
                            }`}
                          >
                            <VehicleIcon
                              className={`h-4 w-4 ${
                                vehicle.isEV
                                  ? "text-white"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <div>
                            <div className="font-medium">
                              {vehicle.id} - {vehicle.model}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Driver: {vehicle.driver} • Capacity:{" "}
                              {vehicle.capacity}
                            </div>
                          </div>
                          {vehicle.isEV && (
                            <Badge
                              variant="outline"
                              className="text-primary border-primary"
                            >
                              <Leaf className="h-3 w-3 mr-1" />
                              EV
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-sm font-medium capitalize ${getStatusColor(
                              vehicle.status
                            )}`}
                          >
                            {vehicle.status.replace("-", " ")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {vehicle.location}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Fuel Efficiency:
                          </span>
                          <div className="font-medium">
                            {vehicle.fuelEfficiency}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Last Maintenance:
                          </span>
                          <div className="font-medium">
                            {vehicle.lastMaintenance}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          {vehicle.status === "available" && (
                            <Button size="sm">Assign</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{request.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {request.supplier}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {request.route}
                        </div>
                      </div>
                      <Badge
                        variant={
                          request.priority === "High"
                            ? "destructive"
                            : request.priority === "Medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {request.priority} Priority
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Weight:</span>
                        <div className="font-medium">{request.weight}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Revenue:</span>
                        <div className="font-medium text-primary">
                          ${request.estimatedRevenue.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pickup:</span>
                        <div className="font-medium">{request.pickupDate}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Delivery:</span>
                        <div className="font-medium">
                          {request.deliveryDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleRequestAction(request.id, "decline")
                        }
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleRequestAction(request.id, "accept")
                        }
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shipments" className="space-y-4">
              <div className="space-y-4">
                {activeShipments.map((shipment) => (
                  <div key={shipment.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{shipment.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {shipment.supplier}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {shipment.route}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            shipment.status === "delivered"
                              ? "default"
                              : shipment.status === "in-transit"
                                ? "secondary"
                                : shipment.status === "preparing"
                                  ? "outline"
                                  : "outline"
                          }
                        >
                          {shipment.status.replace("-", " ")}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          Vehicle: {shipment.vehicle}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {shipment.progress}% • ETA: {shipment.eta}
                        </span>
                      </div>
                      <Progress value={shipment.progress} className="h-2" />

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          Last update: {shipment.lastUpdate}
                        </div>
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(value) => {
                              const statusMap: {
                                [key: string]: {
                                  status: string;
                                  progress: number;
                                };
                              } = {
                                preparing: {
                                  status: "preparing",
                                  progress: 10,
                                },
                                dispatched: {
                                  status: "dispatched",
                                  progress: 25,
                                },
                                "in-transit": {
                                  status: "in-transit",
                                  progress: 50,
                                },
                                halfway: { status: "in-transit", progress: 75 },
                                delivered: {
                                  status: "delivered",
                                  progress: 100,
                                },
                              };
                              const update = statusMap[value];
                              if (update) {
                                updateShipmentStatus(
                                  shipment.id,
                                  update.status,
                                  update.progress
                                );
                              }
                            }}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Update status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="preparing">
                                Preparing
                              </SelectItem>
                              <SelectItem value="dispatched">
                                Dispatched
                              </SelectItem>
                              <SelectItem value="in-transit">
                                In Transit
                              </SelectItem>
                              <SelectItem value="halfway">
                                Reached Halfway
                              </SelectItem>
                              <SelectItem value="delivered">
                                Delivered
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Analytics Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
            <CardDescription>
              Track your delivery performance and efficiency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Deliveries Completed
                </span>
                <span className="text-2xl font-bold">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Average Delay per Route
                </span>
                <span className="text-lg font-semibold text-yellow-600">
                  2.3 hours
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  On-Time Delivery Rate
                </span>
                <span className="text-lg font-semibold text-primary">
                  92.4%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Customer Satisfaction
                </span>
                <span className="text-lg font-semibold text-primary">
                  4.7/5.0
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sustainability Score</CardTitle>
            <CardDescription>
              Your environmental impact and EV adoption
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">B+</div>
                <div className="text-sm text-muted-foreground">
                  Overall Sustainability Grade
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>EV Fleet Adoption</span>
                    <span>25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Carbon Reduction</span>
                    <span>18%</span>
                  </div>
                  <Progress value={18} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Route Optimization</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                <Leaf className="h-4 w-4 text-primary" />
                <div className="text-sm">
                  <div className="font-medium text-primary">
                    Green Badge Earned!
                  </div>
                  <div className="text-muted-foreground">
                    25% EV fleet milestone reached
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

          {/* Enhanced Analytics Section */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-t-lg">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-slate-600" />
                Fleet Analytics & Performance
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg">
            Detailed insights into fleet operations and sustainability
          </CardDescription>
        </CardHeader>
            <CardContent className="p-6">
          <AnalyticsCharts userRole="transporter" />
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="fleet" className="space-y-6">
          {/* Fleet Management Tab */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-t-lg">
                <CardTitle className="text-lg font-bold text-blue-800 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Vehicle Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Available</span>
                    <Badge className="bg-green-100 text-green-800">{vehicles.filter(v => v.status === "available").length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">In Transit</span>
                    <Badge className="bg-blue-100 text-blue-800">{vehicles.filter(v => v.status === "in-transit").length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Maintenance</span>
                    <Badge className="bg-red-100 text-red-800">{vehicles.filter(v => v.status === "maintenance").length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-100 to-green-200 rounded-t-lg">
                <CardTitle className="text-lg font-bold text-green-800 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  EV Fleet
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-800 mb-2">
                    {Math.round((vehicles.filter(v => v.isEV).length / vehicles.length) * 100)}%
                  </div>
                  <div className="text-sm text-green-600 mb-4">EV Adoption</div>
                  <div className="w-full bg-green-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{width: `${(vehicles.filter(v => v.isEV).length / vehicles.length) * 100}%`}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-t-lg">
                <CardTitle className="text-lg font-bold text-purple-800 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Drivers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-800 mb-2">{vehicles.length}</div>
                  <div className="text-sm text-purple-600 mb-4">Active Drivers</div>
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Drivers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-6">
          {/* Shipments Management Tab */}
          <div className="grid gap-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-orange-800 flex items-center gap-2">
                  <Package className="h-5 w-5 text-orange-600" />
                  Active Shipments
                </CardTitle>
                <CardDescription className="text-orange-600">Manage your current delivery assignments</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {activeShipments.map((shipment) => (
                    <div key={shipment.id} className="p-4 bg-white rounded-lg border border-orange-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Package className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-orange-800">{shipment.id}</div>
                            <div className="text-sm text-orange-600">{shipment.supplier}</div>
                            <div className="text-xs text-orange-500">{shipment.route}</div>
                          </div>
                        </div>
                        <Badge 
                          variant={
                            shipment.status === "delivered" ? "default" :
                            shipment.status === "in-transit" ? "secondary" : "outline"
                          }
                          className={
                            shipment.status === "delivered" ? "bg-green-100 text-green-800" :
                            shipment.status === "in-transit" ? "bg-blue-100 text-blue-800" : 
                            "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {shipment.status.replace("-", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-orange-600">Progress</span>
                          <span className="text-orange-800 font-medium">{shipment.progress}% • ETA: {shipment.eta}</span>
                        </div>
                        <div className="w-full bg-orange-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{width: `${shipment.progress}%`}}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Tab */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-cyan-50 to-blue-50">
              <CardHeader className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-cyan-800 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-cyan-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-700 font-medium">Deliveries Completed</span>
                    <span className="text-cyan-800 font-bold text-xl">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-700 font-medium">On-Time Rate</span>
                    <span className="text-cyan-800 font-bold text-xl">92.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-700 font-medium">Customer Rating</span>
                    <span className="text-cyan-800 font-bold text-xl">4.7/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-green-50">
              <CardHeader className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-emerald-800 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                  Sustainability Score
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-emerald-800 mb-2">B+</div>
                  <div className="text-sm text-emerald-600">Overall Sustainability Grade</div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-emerald-700">EV Fleet Adoption</span>
                      <span className="text-emerald-800 font-medium">25%</span>
                    </div>
                    <div className="w-full bg-emerald-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{width: '25%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-emerald-700">Carbon Reduction</span>
                      <span className="text-emerald-800 font-medium">18%</span>
                    </div>
                    <div className="w-full bg-emerald-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{width: '18%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-t-lg">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-slate-600" />
                Detailed Analytics
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg">
                Comprehensive performance insights and business intelligence
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <AnalyticsCharts userRole="transporter" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Vehicle Dialog */}
      <Dialog open={showAddVehicle} onOpenChange={setShowAddVehicle}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Vehicle</DialogTitle>
            <DialogDescription>
              Register a new vehicle to your fleet with detailed specifications
            </DialogDescription>
          </DialogHeader>
          <AddVehicleForm onClose={() => setShowAddVehicle(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddVehicleForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    type: "",
    model: "",
    capacity: "",
    driver: "",
    isEV: false,
    location: "",
  });

  const handleSubmit = () => {
    // In a real app, this would add the vehicle to the fleet
    console.log("Adding vehicle:", formData);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Vehicle Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, type: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select vehicle type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="truck">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Truck
              </div>
            </SelectItem>
            <SelectItem value="ev">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                EV Truck
              </div>
            </SelectItem>
            <SelectItem value="ship">
              <div className="flex items-center gap-2">
                <Ship className="h-4 w-4" />
                Ship
              </div>
            </SelectItem>
            <SelectItem value="air">
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4" />
                Aircraft
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          placeholder="e.g., Freightliner Cascadia"
          value={formData.model}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, model: e.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="capacity">Capacity</Label>
        <Input
          id="capacity"
          placeholder="e.g., 80,000 lbs"
          value={formData.capacity}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, capacity: e.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="driver">Assigned Driver</Label>
        <Input
          id="driver"
          placeholder="Driver name"
          value={formData.driver}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, driver: e.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Current Location</Label>
        <Input
          id="location"
          placeholder="e.g., Los Angeles, CA"
          value={formData.location}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1 bg-transparent"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="flex-1">
          Add Vehicle
        </Button>
      </div>
    </div>
  );
}

function CustomerDashboard({ 
  onRatingSubmit, 
  onNewOrder,
  shipments = [],
  suppliers = []
}: {
  onRatingSubmit: (id: string, rating: number, feedback: string) => void;
  onNewOrder: () => void;
  shipments: ShipmentData[];
  suppliers: Array<{
    id: string;
    name: string;
    rating: number;
    specialties: string[];
    location: string;
    deliveryTime: string;
    minOrder: number;
    ecoFriendly: boolean;
    certifications: string[];
    totalOrders: number;
    onTimeRate: number;
  }>;
}) {
  const [showTrackShipment, setShowTrackShipment] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [deliveryPreference, setDeliveryPreference] = useState("eco");
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [shipmentToRate, setShipmentToRate] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAnalytics, setShowAnalytics] = useState(false);

  const [incomingShipments, setIncomingShipments] = useState([
    {
      id: "SH001",
      supplier: "TechCorp Inc.",
      transporter: "FastTrack Logistics",
      status: "in-transit",
      progress: 65,
      eta: "18 hours",
      route: "NYC → Your Location",
      estimatedDelivery: "2025-02-16 14:30",
      trackingUpdates: [
        {
          time: "2025-02-14 09:00",
          status: "Dispatched from NYC",
          location: "New York, NY",
        },
        {
          time: "2025-02-14 15:30",
          status: "In transit via I-80",
          location: "Newark, NJ",
        },
        {
          time: "2025-02-15 08:00",
          status: "Reached checkpoint",
          location: "Pittsburgh, PA",
        },
        {
          time: "2025-02-15 14:00",
          status: "Currently en route",
          location: "Columbus, OH",
        },
      ],
      deliveryType: "fast",
      carbonFootprint: 1.2,
      cost: 2450,
    },
    {
      id: "SH004",
      supplier: "Global Retail",
      transporter: "Green Transport",
      status: "dispatched",
      progress: 25,
      eta: "2 days",
      route: "CHI → Your Location",
      estimatedDelivery: "2025-02-18 10:00",
      trackingUpdates: [
        {
          time: "2025-02-15 07:00",
          status: "Dispatched from Chicago",
          location: "Chicago, IL",
        },
        {
          time: "2025-02-15 12:00",
          status: "Loading complete",
          location: "Chicago, IL",
        },
      ],
      deliveryType: "eco",
      carbonFootprint: 0.3,
      cost: 1850,
    },
    {
      id: "SH007",
      supplier: "Manufacturing Co.",
      transporter: "Ocean Express",
      status: "preparing",
      progress: 10,
      eta: "5 days",
      route: "SEA → Your Location",
      estimatedDelivery: "2025-02-20 16:00",
      trackingUpdates: [
        {
          time: "2025-02-15 09:00",
          status: "Order confirmed",
          location: "Seattle, WA",
        },
        {
          time: "2025-02-15 11:00",
          status: "Preparing for dispatch",
          location: "Seattle, WA",
        },
      ],
      deliveryType: "eco",
      carbonFootprint: 0.8,
      cost: 1650,
    },
  ]);

  const [completedShipments, setCompletedShipments] = useState([
    {
      id: "SH002",
      supplier: "TechCorp Inc.",
      transporter: "FastTrack Logistics",
      deliveredDate: "2025-02-10",
      rating: null,
      deliveryType: "fast",
      onTime: true,
    },
    {
      id: "SH003",
      supplier: "Global Retail",
      transporter: "Green Transport",
      deliveredDate: "2025-02-08",
      rating: 5,
      deliveryType: "eco",
      onTime: true,
    },
  ]);


  const handleRateSupplier = (
    shipmentId: string,
    rating: number,
    feedback: string
  ) => {
    onRatingSubmit(shipmentId, rating, feedback);
    setShowRatingDialog(false);
    setShipmentToRate(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-primary";
      case "in-transit":
        return "text-blue-600";
      case "dispatched":
        return "text-yellow-600";
      case "preparing":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  const ecoDeliveryPercentage = Math.round(
    (incomingShipments.filter((s) => s.deliveryType === "eco").length /
      incomingShipments.length) *
      100
  );

  const getShipmentRoutes = (shipment: any) => [
    {
      id: `route-${shipment.id}`,
      name: shipment.route,
      locations: [
        {
          id: "origin",
          name: "Origin",
          lat: 40.7128,
          lng: -74.006,
          type: "origin" as const,
        },
        {
          id: "current",
          name: "Current Location",
          lat: 39.0458,
          lng: -76.6413,
          type: "waypoint" as const,
        },
        {
          id: "dest",
          name: "Destination",
          lat: 34.0522,
          lng: -118.2437,
          type: "destination" as const,
        },
      ],
      distance: "2,789 miles",
      duration: shipment.eta,
      cost: `$${shipment.cost}`,
      carbonFootprint: `${shipment.carbonFootprint}t CO₂`,
      riskScore: 1,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-700 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
      <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Customer Dashboard</h1>
              <p className="text-purple-100 text-lg">Track your deliveries and manage your shipping preferences</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={onNewOrder}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
              <Button 
                onClick={() => setShowTrackShipment(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
              >
              <MapPin className="h-4 w-4 mr-2" />
              Track Shipment
            </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-gradient-to-r from-slate-50 to-slate-100 p-1 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 font-semibold transition-all duration-200"
          >
            <Package className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="tracking" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 font-semibold transition-all duration-200"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Tracking
          </TabsTrigger>
          <TabsTrigger 
            value="preferences" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-600 font-semibold transition-all duration-200"
          >
            <Leaf className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-orange-600 font-semibold transition-all duration-200"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

          {/* Enhanced Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">
              Incoming Shipments
            </CardTitle>
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Package className="h-4 w-4 text-white" />
                </div>
          </CardHeader>
          <CardContent>
                <div className="text-3xl font-bold text-purple-800">{incomingShipments.length}</div>
                <p className="text-xs text-purple-600 font-medium">
              {
                incomingShipments.filter((s) => s.status === "in-transit")
                  .length
              }{" "}
              in transit
            </p>
                <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
          </CardContent>
        </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
              Avg Delivery Time
            </CardTitle>
                <div className="p-2 bg-blue-500 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
          </CardHeader>
          <CardContent>
                <div className="text-3xl font-bold text-blue-800">3.2 days</div>
                <p className="text-xs text-blue-600 font-medium">
              -0.5 days improvement
            </p>
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
          </CardContent>
        </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
              Eco Deliveries
            </CardTitle>
                <div className="p-2 bg-green-500 rounded-lg">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
          </CardHeader>
          <CardContent>
                <div className="text-3xl font-bold text-green-800">{ecoDeliveryPercentage}%</div>
                <p className="text-xs text-green-600 font-medium">
              {ecoDeliveryPercentage >= 70
                ? "Green badge earned!"
                : "Keep going for green badge!"}
            </p>
                <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${ecoDeliveryPercentage}%`}}></div>
                </div>
          </CardContent>
        </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">
              Supplier Rating
            </CardTitle>
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
          </CardHeader>
          <CardContent>
                <div className="text-3xl font-bold text-orange-800">4.7/5</div>
                <p className="text-xs text-orange-600 font-medium">Excellent service</p>
                <div className="mt-2 w-full bg-orange-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{width: '94%'}}></div>
                </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Live Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Live Shipment Tracking</CardTitle>
          <CardDescription>
            Monitor your shipments with real-time updates and interactive maps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active Shipments</TabsTrigger>
              <TabsTrigger value="completed">Completed Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {incomingShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="p-4 border rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">{shipment.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {shipment.supplier}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {shipment.route}
                        </div>
                      </div>
                      <Badge
                        variant={
                          shipment.status === "in-transit"
                            ? "secondary"
                            : shipment.status === "dispatched"
                              ? "outline"
                              : "outline"
                        }
                      >
                        {shipment.status.replace("-", " ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          shipment.deliveryType === "eco"
                            ? "text-primary border-primary"
                            : "text-blue-600 border-blue-600"
                        }
                      >
                        <Leaf className="h-3 w-3 mr-1" />
                        {shipment.deliveryType === "eco" ? "Eco" : "Fast"}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        ETA: {shipment.eta}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {shipment.estimatedDelivery}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Delivery Progress</span>
                      <span>{shipment.progress}%</span>
                    </div>
                    <Progress value={shipment.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Transporter:
                      </span>
                      <div className="font-medium">{shipment.transporter}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Carbon Impact:
                      </span>
                      <div className="font-medium text-primary">
                        {shipment.carbonFootprint}t CO₂
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cost:</span>
                      <div className="font-medium">
                        ${shipment.cost.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Recent Updates:</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {shipment.trackingUpdates
                        .slice(-3)
                        .reverse()
                        .map((update, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-muted-foreground">
                              {update.time}
                            </span>
                            <span>{update.status}</span>
                            <span className="text-muted-foreground">
                              {update.location}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {shipment.status === "in-transit" && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        Live Tracking Map:
                      </div>
                      <InteractiveMap
                        routes={getShipmentRoutes(shipment)}
                        vehicles={[
                          {
                            id: `vehicle-${shipment.id}`,
                            type: "truck" as const,
                            position: { lat: 39.0458, lng: -76.6413 },
                            shipmentId: shipment.id,
                            status: "in-transit" as const,
                          },
                        ]}
                        selectedRoute={`route-${shipment.id}`}
                        showVehicles={true}
                        trackingMode={true}
                        className="h-64"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedShipment(shipment);
                        setShowTrackShipment(true);
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      View Map
                    </Button>
                    <Button size="sm" variant="outline">
                      Contact Supplier
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedShipments.map((shipment) => (
                <div key={shipment.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">{shipment.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {shipment.supplier}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Delivered: {shipment.deliveredDate}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {shipment.onTime && (
                        <Badge
                          variant="outline"
                          className="text-primary border-primary"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          On Time
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={
                          shipment.deliveryType === "eco"
                            ? "text-primary border-primary"
                            : "text-blue-600 border-blue-600"
                        }
                      >
                        {shipment.deliveryType === "eco" ? "Eco" : "Fast"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {shipment.rating ? (
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground">
                            Your rating:
                          </span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div
                                key={star}
                                className={`text-sm ${
                                  star <= shipment.rating
                                    ? "text-yellow-500"
                                    : "text-muted-foreground"
                                }`}
                              >
                                ★
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Not rated yet
                        </span>
                      )}
                    </div>
                    {!shipment.rating && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setShipmentToRate(shipment);
                          setShowRatingDialog(true);
                        }}
                      >
                        Rate Delivery
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Enhanced Delivery Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Preferences</CardTitle>
            <CardDescription>
              Set your default delivery preferences for future orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={deliveryPreference}
              onValueChange={setDeliveryPreference}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="fast">Fast Delivery</TabsTrigger>
                <TabsTrigger value="eco">Eco Delivery</TabsTrigger>
              </TabsList>
              <TabsContent value="fast" className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Priority shipping with faster delivery times
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Delivery Time:</span>
                    <span className="font-medium">1-2 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbon Impact:</span>
                    <span className="text-destructive">Higher</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span className="font-medium">Premium (+15-25%)</span>
                  </div>
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Fast delivery may impact your sustainability score
                  </AlertDescription>
                </Alert>
              </TabsContent>
              <TabsContent value="eco" className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Environmentally friendly shipping options
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Delivery Time:</span>
                    <span className="font-medium">3-5 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbon Impact:</span>
                    <span className="text-primary">Lower (-60%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span className="font-medium">Standard</span>
                  </div>
                </div>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Eco delivery helps you earn green badges and reduces
                    environmental impact
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
            <div className="mt-4">
              <Button className="w-full">Save Preferences</Button>
            </div>
          </CardContent>
        </Card>

        {/* Supplier Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Performance</CardTitle>
            <CardDescription>
              Track reliability and service quality of your suppliers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{supplier.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {supplier.totalOrders} orders • {supplier.onTimeRate}%
                        on-time
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{supplier.rating}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className={`text-sm ${
                                star <= Math.floor(supplier.rating)
                                  ? "text-yellow-500"
                                  : "text-muted-foreground"
                              }`}
                            >
                              ★
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Progress value={supplier.onTimeRate} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sustainability Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Your Sustainability Impact</CardTitle>
          <CardDescription>
            Track your environmental choices and carbon savings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {ecoDeliveryPercentage >= 70
                  ? "🌱"
                  : ecoDeliveryPercentage >= 50
                  ? "🌿"
                  : "🌱"}
              </div>
              <div className="text-lg font-semibold text-primary">
                {ecoDeliveryPercentage >= 70
                  ? "Eco Champion"
                  : ecoDeliveryPercentage >= 50
                    ? "Green Supporter"
                    : "Getting Started"}
              </div>
              <div className="text-sm text-muted-foreground">
                Sustainability Level
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Eco Delivery Choice</span>
                  <span>{ecoDeliveryPercentage}%</span>
                </div>
                <Progress value={ecoDeliveryPercentage} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Carbon Savings</span>
                  <span>2.1t CO₂</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Achievements</div>
              <div className="space-y-1">
                {ecoDeliveryPercentage >= 70 && (
                  <Badge
                    variant="outline"
                    className="text-primary border-primary"
                  >
                    <Leaf className="h-3 w-3 mr-1" />
                    Green Champion
                  </Badge>
                )}
                {ecoDeliveryPercentage >= 50 && (
                  <Badge
                    variant="outline"
                    className="text-primary border-primary"
                  >
                    <Leaf className="h-3 w-3 mr-1" />
                    Eco Supporter
                  </Badge>
                )}
                <div className="text-xs text-muted-foreground mt-2">
                  Next: Reach 80% eco deliveries for Sustainability Leader badge
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

          {/* Enhanced Analytics Section */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-t-lg">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-slate-600" />
                Delivery Analytics & Sustainability
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg">
            Track your delivery patterns and environmental impact
          </CardDescription>
        </CardHeader>
            <CardContent className="p-6">
          <AnalyticsCharts userRole="customer" />
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          {/* Enhanced Live Tracking Tab */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Live Shipment Tracking
              </CardTitle>
              <CardDescription className="text-slate-600">Monitor your shipments with real-time updates and interactive maps</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-slate-100 to-slate-200 p-1 rounded-lg">
                  <TabsTrigger 
                    value="active" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 font-semibold transition-all duration-200"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Active Shipments
                  </TabsTrigger>
                  <TabsTrigger 
                    value="completed" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-600 font-semibold transition-all duration-200"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed Orders
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  {incomingShipments.map((shipment) => (
                    <div
                      key={shipment.id}
                      className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            shipment.deliveryType === 'eco' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            <Package className={`h-5 w-5 ${
                              shipment.deliveryType === 'eco' ? 'text-green-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <div className="font-bold text-lg text-slate-800">{shipment.id}</div>
                            <div className="text-sm text-slate-600 font-medium">{shipment.supplier}</div>
                            <div className="text-xs text-slate-500">{shipment.route}</div>
                          </div>
                          <Badge
                            variant={
                              shipment.status === "in-transit" ? "secondary" :
                              shipment.status === "dispatched" ? "outline" : "outline"
                            }
                            className={
                              shipment.status === "in-transit" ? "bg-blue-100 text-blue-800" :
                              shipment.status === "dispatched" ? "bg-yellow-100 text-yellow-800" : 
                              "bg-gray-100 text-gray-800"
                            }
                          >
                            {shipment.status.replace("-", " ").toUpperCase()}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              shipment.deliveryType === "eco"
                                ? "text-green-600 border-green-300 bg-green-50"
                                : "text-blue-600 border-blue-300 bg-blue-50"
                            }
                          >
                            <Leaf className="h-3 w-3 mr-1" />
                            {shipment.deliveryType === "eco" ? "Eco" : "Fast"}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-800">
                            ETA: {shipment.eta}
                          </div>
                          <div className="text-xs text-slate-500">
                            {shipment.estimatedDelivery}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-slate-600">Delivery Progress</span>
                          <span className="text-slate-800">{shipment.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div className={`h-3 rounded-full ${
                            shipment.deliveryType === 'eco' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'
                          }`} style={{width: `${shipment.progress}%`}}></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <div className="text-slate-500 text-xs">Transporter:</div>
                          <div className="font-semibold text-slate-800">{shipment.transporter}</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <div className="text-slate-500 text-xs">Carbon Impact:</div>
                          <div className="font-semibold text-green-600">{shipment.carbonFootprint}t CO₂</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <div className="text-slate-500 text-xs">Cost:</div>
                          <div className="font-semibold text-slate-800">${shipment.cost.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 hover:bg-blue-50 hover:border-blue-300">
                          <MapPin className="h-4 w-4 mr-1" />
                          View Map
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 hover:bg-green-50 hover:border-green-300">
                          <Users className="h-4 w-4 mr-1" />
                          Contact Supplier
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                  {completedShipments.map((shipment) => (
                    <div key={shipment.id} className="p-4 border rounded-lg bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-slate-800">{shipment.id}</div>
                          <div className="text-sm text-slate-600">{shipment.supplier}</div>
                          <div className="text-xs text-slate-500">Delivered: {shipment.deliveredDate}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {shipment.onTime && (
                            <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              On Time
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={
                              shipment.deliveryType === "eco"
                                ? "text-green-600 border-green-300 bg-green-50"
                                : "text-blue-600 border-blue-300 bg-blue-50"
                            }
                          >
                            {shipment.deliveryType === "eco" ? "Eco" : "Fast"}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {shipment.rating ? (
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-slate-600">Your rating:</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <div
                                    key={star}
                                    className={`text-sm ${
                                      star <= shipment.rating
                                        ? "text-yellow-500"
                                        : "text-slate-300"
                                    }`}
                                  >
                                    ★
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-600">Not rated yet</span>
                          )}
                        </div>
                        {!shipment.rating && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setShipmentToRate(shipment);
                              setShowRatingDialog(true);
                            }}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            Rate Delivery
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          {/* Enhanced Delivery Preferences */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Delivery Preferences
                </CardTitle>
                <CardDescription className="text-slate-600">Set your default delivery preferences for future orders</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs
                  value={deliveryPreference}
                  onValueChange={setDeliveryPreference}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-slate-100 to-slate-200 p-1 rounded-lg">
                    <TabsTrigger 
                      value="fast" 
                      className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 font-semibold transition-all duration-200"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Fast Delivery
                    </TabsTrigger>
                    <TabsTrigger 
                      value="eco" 
                      className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-600 font-semibold transition-all duration-200"
                    >
                      <Leaf className="h-4 w-4 mr-2" />
                      Eco Delivery
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="fast" className="space-y-4 mt-4">
                    <div className="text-sm text-slate-600">Priority shipping with faster delivery times</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Delivery Time:</span>
                        <span className="font-medium">1-2 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbon Impact:</span>
                        <span className="text-red-600">Higher</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost:</span>
                        <span className="font-medium">Premium (+15-25%)</span>
                      </div>
                    </div>
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <AlertDescription className="text-red-700">
                        Fast delivery may impact your sustainability score
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                  <TabsContent value="eco" className="space-y-4 mt-4">
                    <div className="text-sm text-slate-600">Environmentally friendly shipping options</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Delivery Time:</span>
                        <span className="font-medium">3-5 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbon Impact:</span>
                        <span className="text-green-600">Lower (-60%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost:</span>
                        <span className="font-medium">Standard</span>
                      </div>
                    </div>
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-700">
                        Eco delivery helps you earn green badges and reduces environmental impact
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>
                <div className="mt-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Supplier Performance
                </CardTitle>
                <CardDescription className="text-slate-600">Track reliability and service quality of your suppliers</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {suppliers.map((supplier) => (
                    <div key={supplier.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-800">{supplier.id}</div>
                          <div className="text-sm text-slate-600">
                            {supplier.totalOrders} orders • {supplier.onTimeRate}% on-time
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{supplier.rating}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                  key={star}
                                  className={`text-sm ${
                                    star <= Math.floor(supplier.rating)
                                      ? "text-yellow-500"
                                      : "text-slate-300"
                                  }`}
                                >
                                  ★
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: `${supplier.onTimeRate}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Tab */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Delivery Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700 font-medium">Total Deliveries</span>
                    <span className="text-purple-800 font-bold text-xl">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700 font-medium">On-Time Rate</span>
                    <span className="text-purple-800 font-bold text-xl">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700 font-medium">Avg Delivery Time</span>
                    <span className="text-purple-800 font-bold text-xl">3.2 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-green-50">
              <CardHeader className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                  Sustainability Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-emerald-800 mb-2">
                    {ecoDeliveryPercentage >= 70 ? "🌱" : ecoDeliveryPercentage >= 50 ? "🌿" : "🌱"}
                  </div>
                  <div className="text-lg font-semibold text-emerald-800">
                    {ecoDeliveryPercentage >= 70 ? "Eco Champion" : ecoDeliveryPercentage >= 50 ? "Green Supporter" : "Getting Started"}
                  </div>
                  <div className="text-sm text-emerald-600">Sustainability Level</div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-emerald-700">Eco Delivery Choice</span>
                      <span className="text-emerald-800 font-medium">{ecoDeliveryPercentage}%</span>
                    </div>
                    <div className="w-full bg-emerald-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${ecoDeliveryPercentage}%`}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-emerald-700">Carbon Savings</span>
                      <span className="text-emerald-800 font-medium">2.1t CO₂</span>
                    </div>
                    <div className="w-full bg-emerald-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-t-lg">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-slate-600" />
                Detailed Analytics
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg">
                Comprehensive delivery insights and environmental impact
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <AnalyticsCharts userRole="customer" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Rate Your Delivery Experience</DialogTitle>
            <DialogDescription>
              Help us improve by rating your delivery from {shipmentToRate?.supplier}
            </DialogDescription>
          </DialogHeader>
          {shipmentToRate && (
            <RatingForm
              shipment={shipmentToRate}
              onSubmit={handleRateSupplier}
              onClose={() => setShowRatingDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Track Shipment Dialog */}
      <Dialog open={showTrackShipment} onOpenChange={setShowTrackShipment}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Track Your Shipment</DialogTitle>
            <DialogDescription>
              Enter shipment ID or select from your active shipments
            </DialogDescription>
          </DialogHeader>
          <TrackShipmentDialog
            shipments={incomingShipments}
            onClose={() => setShowTrackShipment(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TrackShipmentDialog({
  shipments,
  onClose,
}: {
  shipments: any[];
  onClose: () => void;
}) {
  const [trackingId, setTrackingId] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  const handleTrack = () => {
    const shipment = shipments.find((s) => s.id === trackingId);
    if (shipment) {
      setSelectedShipment(shipment);
    }
  };

  const getTrackingRoute = (shipment: any) => [
    {
      id: `track-${shipment.id}`,
      name: shipment.route,
      locations: [
        {
          id: "origin",
          name: "Origin",
          lat: 40.7128,
          lng: -74.006,
          type: "origin" as const,
        },
        {
          id: "current",
          name: "Current",
          lat: 39.0458,
          lng: -76.6413,
          type: "waypoint" as const,
        },
        {
          id: "dest",
          name: "Destination",
          lat: 34.0522,
          lng: -118.2437,
          type: "destination" as const,
        },
      ],
      distance: "2,789 miles",
      duration: shipment.eta,
      cost: `$${shipment.cost}`,
      carbonFootprint: `${shipment.carbonFootprint}t CO₂`,
      riskScore: 1,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tracking">Enter Shipment ID</Label>
        <div className="flex gap-2">
          <Input
            id="tracking"
            placeholder="e.g., SH001"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <Button onClick={handleTrack}>Track</Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Or select from your active shipments:
      </div>
      <div className="space-y-2">
        {shipments.map((shipment) => (
          <Button
            key={shipment.id}
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => setSelectedShipment(shipment)}
          >
            <div className="flex items-center justify-between w-full">
              <span>
                {shipment.id} - {shipment.supplier}
              </span>
              <Badge variant="secondary">{shipment.status}</Badge>
            </div>
          </Button>
        ))}
      </div>

      {selectedShipment && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedShipment.id} Tracking Details
            </CardTitle>
            <CardDescription>{selectedShipment.route}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>
                  {selectedShipment.progress}% • ETA: {selectedShipment.eta}
                </span>
              </div>
              <Progress value={selectedShipment.progress} className="h-3" />

              <div className="space-y-2">
                <div className="text-sm font-medium">Live Tracking Map:</div>
                <InteractiveMap
                  routes={getTrackingRoute(selectedShipment)}
                  vehicles={[
                    {
                      id: `track-vehicle-${selectedShipment.id}`,
                      type: "truck" as const,
                      position: { lat: 39.0458, lng: -76.6413 },
                      shipmentId: selectedShipment.id,
                      status: "in-transit" as const,
                    },
                  ]}
                  selectedRoute={`track-${selectedShipment.id}`}
                  showVehicles={true}
                  trackingMode={true}
                  className="h-80"
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Tracking History:</div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedShipment.trackingUpdates.map(
                    (update: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm p-2 bg-muted rounded"
                      >
                      <div>
                        <div className="font-medium">{update.status}</div>
                          <div className="text-muted-foreground">
                            {update.location}
                      </div>
                    </div>
                        <div className="text-muted-foreground">
                          {update.time}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 pt-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1 bg-transparent"
        >
          Close
        </Button>
      </div>
    </div>
  );
}

function RatingForm({
  shipment,
  onSubmit,
  onClose,
}: {
  shipment: any;
  onSubmit: (shipmentId: string, rating: number, feedback: string) => void;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(shipment.id, rating, feedback);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Overall Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? "text-yellow-500" : "text-muted-foreground"
              } hover:text-yellow-400`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback">Feedback (Optional)</Label>
        <Textarea
          id="feedback"
          placeholder="Share your experience with this delivery..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1 bg-transparent"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="flex-1"
        >
          Submit Rating
        </Button>
      </div>
    </div>
  );
}
