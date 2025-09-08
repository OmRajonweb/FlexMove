"use client";

import { useState } from "react";
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
  Users,
  XCircle,
  Shield,
  User,
  Zap,
} from "lucide-react";
import Image from "next/image";

import { InteractiveMap } from "@/components/interactive-map";
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
  suggestions: string[];
}

export default function FlexMovePage() {
  const [currentUser, setCurrentUser] = useState<UserRole>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>(null);

  const handleLogin = (role: UserRole) => {
    setCurrentUser(role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

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
                        className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                          role === "supplier"
                            ? "border-emerald-400 bg-emerald-400/10 text-white"
                            : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                        }`}
                        aria-pressed={role === "supplier"}
                      >
                        <Package className="h-4 w-4" />
                        Supplier
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("transporter")}
                        className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                          role === "transporter"
                            ? "border-emerald-400 bg-emerald-400/10 text-white"
                            : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                        }`}
                        aria-pressed={role === "transporter"}
                      >
                        <Truck className="h-4 w-4" />
                        Transporter
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("customer")}
                        className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                          role === "customer"
                            ? "border-emerald-400 bg-emerald-400/10 text-white"
                            : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
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
        {currentUser === "supplier" && <SupplierDashboard />}
        {currentUser === "transporter" && <TransporterDashboard />}
        {currentUser === "customer" && <CustomerDashboard />}
      </main>
    </div>
  );
}

import { CreateShipmentForm } from "@/components/create-shipment-form";

function SupplierDashboard() {
  const [showCreateShipment, setShowCreateShipment] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentData | null>(
    null
  );
  const [disruptions, setDisruptions] = useState<DisruptionAlert[]>([
    {
      id: "D001",
      shipmentId: "SH001",
      type: "Vehicle Breakdown",
      description: "Truck breakdown on Route A. Delay: +4 hrs",
      delay: "+4 hours",
      suggestions: [
        "Reroute via Highway B",
        "Switch to air transport",
        "Assign backup vehicle",
      ],
    },
  ]);

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

  const shipments: ShipmentData[] = [
    {
      id: "SH001",
      customer: "TechCorp Inc.",
      transporter: "FastTrack Logistics",
      mode: "truck",
      route: "NYC → LA",
      status: "in-transit",
      eta: "2 days",
      cost: 2450,
      carbonFootprint: 1.2,
      riskLevel: "medium",
      disruptionProbability: 15,
    },
    {
      id: "SH002",
      customer: "Global Retail",
      transporter: "Ocean Express",
      mode: "ship",
      route: "LA → SEA",
      status: "delivered",
      eta: "Completed",
      cost: 1850,
      carbonFootprint: 0.8,
      riskLevel: "low",
      disruptionProbability: 5,
    },
    {
      id: "SH003",
      customer: "Manufacturing Co.",
      transporter: "Green Transport",
      mode: "ev",
      route: "CHI → DEN",
      status: "pending",
      eta: "5 days",
      cost: 1950,
      carbonFootprint: 0.3,
      riskLevel: "low",
      disruptionProbability: 8,
    },
  ];

  // Supplier analytics datasets
  const supplierModeSplit = [
    { name: "Truck", value: 48, color: "#22c55e" },
    { name: "Ship", value: 22, color: "#0ea5e9" },
    { name: "Air", value: 18, color: "#a78bfa" },
    { name: "EV", value: 12, color: "#84cc16" },
  ];
  const supplierMonthlyCosts = [
    { month: "Jan", cost: 12.1 },
    { month: "Feb", cost: 11.3 },
    { month: "Mar", cost: 10.7 },
    { month: "Apr", cost: 9.8 },
    { month: "May", cost: 9.2 },
    { month: "Jun", cost: 8.6 },
  ];
  const supplierOnTimeSeries = [
    { month: "Jan", rate: 88 },
    { month: "Feb", rate: 89 },
    { month: "Mar", rate: 91 },
    { month: "Apr", rate: 92 },
    { month: "May", rate: 94 },
    { month: "Jun", rate: 95 },
  ];

  const handleDisruptionAction = (disruptionId: string, action: string) => {
    setDisruptions((prev) => prev.filter((d) => d.id !== disruptionId));
    // In a real app, this would update the shipment status and notify relevant parties
  };

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="operations">Operations</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-6">
      {/* Disruption Alerts */}
      {disruptions.length > 0 && (
        <div className="space-y-4">
          {disruptions.map((disruption) => (
            <Alert key={disruption.id} className="border-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{disruption.description}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Shipment: {disruption.shipmentId} • Delay:{" "}
                      {disruption.delay}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      onValueChange={(value) =>
                        handleDisruptionAction(disruption.id, value)
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Choose action" />
                      </SelectTrigger>
                      <SelectContent>
                        {disruption.suggestions.map((suggestion, index) => (
                          <SelectItem key={index} value={suggestion}>
                            {suggestion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleDisruptionAction(disruption.id, "approve")
                      }
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          Supplier Dashboard
        </h1>
        <Dialog open={showCreateShipment} onOpenChange={setShowCreateShipment}>
          <DialogTrigger asChild>
            <Button className="btn-glow">
              <Plus className="h-4 w-4 mr-2" />
              Create New Shipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Shipment</DialogTitle>
              <DialogDescription>
                Set up a new shipment with route optimization and cost analysis
              </DialogDescription>
            </DialogHeader>
            <CreateShipmentForm
              customers={customers}
              transporters={transporters}
              onClose={() => setShowCreateShipment(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Shipments
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              On-Time Delivery
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Carbon Footprint
            </CardTitle>
            <div className="h-4 w-4 rounded-full bg-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4t CO₂</div>
            <p className="text-xs text-primary">-12% reduction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <div className="h-4 w-4 rounded-full bg-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-accent">+8% this quarter</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
          <CardDescription>
            Track your latest shipment activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: "SH001",
                customer: "TechCorp Inc.",
                status: "In Transit",
                eta: "2 days",
              },
              {
                id: "SH002",
                customer: "Global Retail",
                status: "Delivered",
                eta: "Completed",
              },
              {
                id: "SH003",
                customer: "Manufacturing Co.",
                status: "Pending",
                eta: "5 days",
              },
            ].map((shipment) => (
              <div
                key={shipment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{shipment.id}</div>
                  <div className="text-sm text-muted-foreground">
                    {shipment.customer}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{shipment.status}</div>
                  <div className="text-xs text-muted-foreground">
                    {shipment.eta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Shipments List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Shipments</CardTitle>
          <CardDescription>
            Manage and track your shipment portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                className="p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-medium">{shipment.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {shipment.customer}
                      </div>
                    </div>
                    <Badge
                      variant={
                        shipment.status === "delivered"
                          ? "default"
                          : shipment.status === "in-transit"
                            ? "secondary"
                            : shipment.status === "delayed"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {shipment.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{shipment.eta}</div>
                    <div className="text-xs text-muted-foreground">
                      {shipment.route}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${shipment.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-primary" />
                    <span>{shipment.carbonFootprint}t CO₂</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`h-4 w-4 ${
                        shipment.riskLevel === "high"
                          ? "text-destructive"
                          : shipment.riskLevel === "medium"
                            ? "text-yellow-500"
                            : "text-primary"
                      }`}
                    />
                    <span className="capitalize">
                      {shipment.riskLevel} Risk
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {shipment.mode === "truck" && <Truck className="h-4 w-4" />}
                    {shipment.mode === "ship" && <Ship className="h-4 w-4" />}
                    {shipment.mode === "air" && <Plane className="h-4 w-4" />}
                    {shipment.mode === "ev" && (
                      <Truck className="h-4 w-4 text-primary" />
                    )}
                    <span className="capitalize">
                      {shipment.mode === "ev" ? "EV Truck" : shipment.mode}
                    </span>
                  </div>
                </div>

                {shipment.status === "in-transit" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Route Performance</CardTitle>
            <CardDescription>Most disrupted routes this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { route: "NYC → LA", disruptions: 12, percentage: 85 },
                { route: "CHI → MIA", disruptions: 8, percentage: 60 },
                { route: "SEA → DEN", disruptions: 5, percentage: 35 },
                { route: "LA → SEA", disruptions: 3, percentage: 20 },
              ].map((route) => (
                <div key={route.route} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{route.route}</span>
                    <span className="text-muted-foreground">
                      {route.disruptions} disruptions
                    </span>
                  </div>
                  <Progress value={route.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transporter Reliability</CardTitle>
            <CardDescription>
              Performance ratings and on-time delivery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transporters.map((transporter) => (
                <div
                  key={transporter.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{transporter.name}</span>
                    </div>
                    {transporter.evFleet && (
                      <Badge
                        variant="outline"
                        className="text-primary border-primary"
                      >
                        <Leaf className="h-3 w-3 mr-1" />
                        EV Fleet
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{transporter.rating}/5.0</div>
                    <div className="text-xs text-muted-foreground">
                      {transporter.modes.join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Analytics & Insights</CardTitle>
          <CardDescription>
            Comprehensive performance metrics and business intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsCharts userRole="supplier" />
        </CardContent>
      </Card>
      </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Operations Center</CardTitle>
              <CardDescription>Manage disruptions, create shipments, and assign carriers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Use the Overview tab widgets to action items. More operations tools can be integrated here.</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Mode Split</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer id="supplier-pie" config={{}} className="aspect-[4/3]">
                  <PieChart>
                    <Pie data={supplierModeSplit} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                      {supplierModeSplit.map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avg Cost per Shipment ($k)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer id="supplier-bar" config={{}} className="aspect-[4/3]">
                  <BarChart data={supplierMonthlyCosts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Bar dataKey="cost" fill="#22c55e" radius={[6,6,0,0]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>On-Time Delivery Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer id="supplier-line" config={{}} className="aspect-[4/3]">
                  <LineChart data={supplierOnTimeSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[80,100]} />
                    <Line type="monotone" dataKey="rate" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </LineChart>
                </ChartContainer>
        </CardContent>
      </Card>
    </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Preferences and defaults for your supplier account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Settings UI coming soon.</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
  );
}

function TransporterDashboard() {
  const [showAddVehicle, setShowAddVehicle] = useState(false);
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
      lastMaintenance: "2024-01-15",
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
      lastMaintenance: "2024-02-01",
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
      lastMaintenance: "2024-01-20",
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
      lastMaintenance: "2024-02-10",
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
      pickupDate: "2024-02-15",
      deliveryDate: "2024-02-18",
    },
    {
      id: "REQ002",
      supplier: "Global Retail",
      route: "CHI → MIA",
      priority: "Medium",
      weight: "32,000 lbs",
      estimatedRevenue: 1850,
      pickupDate: "2024-02-16",
      deliveryDate: "2024-02-20",
    },
    {
      id: "REQ003",
      supplier: "Manufacturing Co.",
      route: "SEA → DEN",
      priority: "Low",
      weight: "28,000 lbs",
      estimatedRevenue: 1650,
      pickupDate: "2024-02-17",
      deliveryDate: "2024-02-22",
    },
  ]);

  const handleRequestAction = (
    requestId: string,
    action: "accept" | "decline"
  ) => {
    if (action === "accept") {
      const request = pendingRequests.find((r) => r.id === requestId);
      if (request) {
        // Add to active shipments
        const newShipment = {
          id: `SH${Date.now().toString().slice(-3)}`,
          supplier: request.supplier,
          route: request.route,
          status: "preparing" as const,
          progress: 0,
          vehicle: "TBD",
          eta: "TBD",
          lastUpdate: "Just now",
        };
        setActiveShipments((prev) => [...prev, newShipment]);
      }
    }
    setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  const updateShipmentStatus = (
    shipmentId: string,
    newStatus: string,
    newProgress: number
  ) => {
    setActiveShipments((prev) =>
      prev.map((shipment) =>
        shipment.id === shipmentId
          ? {
              ...shipment,
              status: newStatus as any,
              progress: newProgress,
              lastUpdate: "Just now",
            }
          : shipment
      )
    );
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          Transporter Dashboard
        </h1>
        <Dialog open={showAddVehicle} onOpenChange={setShowAddVehicle}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>
                Register a new vehicle to your fleet
              </DialogDescription>
            </DialogHeader>
            <AddVehicleForm onClose={() => setShowAddVehicle(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Vehicles
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <p className="text-xs text-muted-foreground">
              {vehicles.filter((v) => v.status === "available").length}{" "}
              available,{" "}
              {vehicles.filter((v) => v.status === "in-transit").length} in
              transit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingRequests.filter((r) => r.priority === "High").length}{" "}
              urgent,{" "}
              {pendingRequests.filter((r) => r.priority !== "High").length}{" "}
              standard
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EV Fleet %</CardTitle>
            <div className="h-4 w-4 rounded-full bg-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (vehicles.filter((v) => v.isEV).length / vehicles.length) * 100
              )}
              %
            </div>
            <p className="text-xs text-primary">
              {vehicles.filter((v) => v.isEV).length} of {vehicles.length}{" "}
              vehicles
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,230</div>
            <p className="text-xs text-accent">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fleet Tracking</CardTitle>
          <CardDescription>Monitor your vehicles in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <InteractiveMap
            vehicles={trackingVehicles}
            showVehicles={true}
            trackingMode={true}
            className="h-96"
          />
        </CardContent>
      </Card>

      {/* Enhanced Fleet Management */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Management</CardTitle>
          <CardDescription>
            Monitor and manage your vehicle fleet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="vehicles" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="shipments">Active Shipments</TabsTrigger>
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

      <Card>
        <CardHeader>
          <CardTitle>Fleet Analytics & Performance</CardTitle>
          <CardDescription>
            Detailed insights into fleet operations and sustainability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsCharts userRole="transporter" />
        </CardContent>
      </Card>
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

function CustomerDashboard() {
  const [showTrackShipment, setShowTrackShipment] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [deliveryPreference, setDeliveryPreference] = useState("eco");
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [shipmentToRate, setShipmentToRate] = useState<any>(null);

  const [incomingShipments, setIncomingShipments] = useState([
    {
      id: "SH001",
      supplier: "TechCorp Inc.",
      transporter: "FastTrack Logistics",
      status: "in-transit",
      progress: 65,
      eta: "18 hours",
      route: "NYC → Your Location",
      estimatedDelivery: "2024-02-16 14:30",
      trackingUpdates: [
        {
          time: "2024-02-14 09:00",
          status: "Dispatched from NYC",
          location: "New York, NY",
        },
        {
          time: "2024-02-14 15:30",
          status: "In transit via I-80",
          location: "Newark, NJ",
        },
        {
          time: "2024-02-15 08:00",
          status: "Reached checkpoint",
          location: "Pittsburgh, PA",
        },
        {
          time: "2024-02-15 14:00",
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
      estimatedDelivery: "2024-02-18 10:00",
      trackingUpdates: [
        {
          time: "2024-02-15 07:00",
          status: "Dispatched from Chicago",
          location: "Chicago, IL",
        },
        {
          time: "2024-02-15 12:00",
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
      estimatedDelivery: "2024-02-20 16:00",
      trackingUpdates: [
        {
          time: "2024-02-15 09:00",
          status: "Order confirmed",
          location: "Seattle, WA",
        },
        {
          time: "2024-02-15 11:00",
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
      deliveredDate: "2024-02-10",
      rating: null,
      deliveryType: "fast",
      onTime: true,
    },
    {
      id: "SH003",
      supplier: "Global Retail",
      transporter: "Green Transport",
      deliveredDate: "2024-02-08",
      rating: 5,
      deliveryType: "eco",
      onTime: true,
    },
  ]);

  const suppliers = [
    { id: "TechCorp Inc.", rating: 4.8, totalOrders: 24, onTimeRate: 95 },
    { id: "Global Retail", rating: 4.6, totalOrders: 18, onTimeRate: 92 },
    { id: "Manufacturing Co.", rating: 4.7, totalOrders: 12, onTimeRate: 88 },
  ];

  const handleRateSupplier = (
    shipmentId: string,
    rating: number,
    feedback: string
  ) => {
    setCompletedShipments((prev) =>
      prev.map((shipment) =>
        shipment.id === shipmentId
          ? { ...shipment, rating, feedback }
          : shipment
      )
    );
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          Customer Dashboard
        </h1>
        <Dialog open={showTrackShipment} onOpenChange={setShowTrackShipment}>
          <DialogTrigger asChild>
            <Button>
              <MapPin className="h-4 w-4 mr-2" />
              Track Shipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Track Your Shipment</DialogTitle>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Incoming Shipments
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incomingShipments.length}</div>
            <p className="text-xs text-muted-foreground">
              {
                incomingShipments.filter((s) => s.status === "in-transit")
                  .length
              }{" "}
              in transit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Delivery Time
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 days</div>
            <p className="text-xs text-muted-foreground">
              -0.5 days improvement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Eco Deliveries
            </CardTitle>
            <div className="h-4 w-4 rounded-full bg-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ecoDeliveryPercentage}%</div>
            <p className="text-xs text-primary">
              {ecoDeliveryPercentage >= 70
                ? "Green badge earned!"
                : "Keep going for green badge!"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Supplier Rating
            </CardTitle>
            <div className="h-4 w-4 rounded-full bg-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-accent">Excellent service</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Delivery Analytics & Sustainability</CardTitle>
          <CardDescription>
            Track your delivery patterns and environmental impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsCharts userRole="customer" />
        </CardContent>
      </Card>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Delivery Experience</DialogTitle>
            <DialogDescription>
              Help us improve by rating your delivery from{" "}
              {shipmentToRate?.supplier}
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
