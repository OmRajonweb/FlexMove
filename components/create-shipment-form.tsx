"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, ChevronLeft, ChevronRight, X, Loader2, Truck, Ship, Plane, AlertTriangle, Clock, CloudSun, DollarSign, Leaf, User } from "lucide-react"
import { cn } from "@/lib/utils"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}

interface Customer {
  id: string
  name: string
  location: string
}

interface Transporter {
  id: string
  name: string
  rating: number
  modes: string[]
  evFleet: boolean
}

interface Route {
  id: string
  name: string
  baseCost: number
  baseCarbon: number
  time: string
  risk: string
  weather: string
  isIdeal: boolean
}

interface CreateShipmentFormProps {
  customers: Customer[]
  transporters: Transporter[]
  step: "customer" | "transporter" | "details"
  selectedCustomer: string
  selectedTransporter: string
  formData: {
    origin: string
    destination: string
    weight: string
    priority: string
    mode: string
  }
  onCustomerSelected: (customerId: string) => void
  onTransporterSelected: (transporterId: string) => void
  onFormDataChange: (data: any) => void
  onShipmentCreated: (data: any) => void
  onClose: () => void
}

export function CreateShipmentForm({
  customers,
  transporters,
  step,
  selectedCustomer,
  selectedTransporter,
  formData,
  onCustomerSelected,
  onTransporterSelected,
  onFormDataChange,
  onShipmentCreated,
  onClose,
}: CreateShipmentFormProps) {
  // Enhanced routes with more details
  const dummyRoutes: Route[] = [
    {
      id: "r1",
      name: "Express Highway",
      baseCost: 800,
      baseCarbon: 100,
      time: "3-4 days",
      risk: "Low",
      weather: "Clear skies, 24°C",
      isIdeal: true,
    },
    {
      id: "r2",
      name: "Coastal Route",
      baseCost: 600,
      baseCarbon: 80,
      time: "5-7 days",
      risk: "Medium",
      weather: "Rain showers, 18°C",
      isIdeal: false,
    },
    {
      id: "r3",
      name: "Mountain Pass",
      baseCost: 1000,
      baseCarbon: 120,
      time: "2-3 days",
      risk: "High",
      weather: "Foggy, 8°C",
      isIdeal: false,
    },
  ]
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedRoute, setSelectedRoute] = useState<string>("")
  
  // Update progress based on form completion
  useEffect(() => {
    let newProgress = 0;
    if (step === 'customer') {
      newProgress = selectedCustomer ? 33 : 0;
    } else if (step === 'transporter') {
      newProgress = selectedTransporter ? 66 : 33;
    } else if (step === 'details') {
      const detailFields = 6;
      const filledDetailFields = [
        formData.origin,
        formData.destination,
        formData.weight,
        formData.priority,
        formData.mode,
        selectedRoute,
      ].filter(Boolean).length;
      newProgress = 66 + Math.round((filledDetailFields / detailFields) * 34);
    }
    setProgress(newProgress);
  }, [step, selectedCustomer, selectedTransporter, formData, selectedRoute]);

  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "truck":
        return <Truck className="h-4 w-4" />
      case "ship":
        return <Ship className="h-4 w-4" />
      case "air":
        return <Plane className="h-4 w-4" />
      default:
        return <Truck className="h-4 w-4" />
    }
  }

  const calculateRouteValues = (route: Route) => {
    const weight = parseFloat(formData.weight || "0")
    const multiplier = weight > 0 ? weight / 1000 : 1
    return {
      cost: Math.round(route.baseCost * multiplier),
      carbon: Math.round(route.baseCarbon * multiplier),
    }
  }

  const selectedTransporterData = transporters.find((t) => t.id === selectedTransporter)

  const allDetailsFilled =
    formData.origin && formData.destination && formData.weight && formData.priority && formData.mode

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allDetailsFilled && selectedRoute) {
      setIsSubmitting(true);
      // Simulate API call before finalizing
      setTimeout(() => {
        onShipmentCreated({
          ...formData,
          route: selectedRoute,
          customer: selectedCustomer,
          transporter: selectedTransporter
        });
        setIsSubmitting(false);
      }, 1000);
    }
  }

  const handleNext = () => {
    if (step === "customer" && selectedCustomer) {
      onCustomerSelected(selectedCustomer)
    } else if (step === "transporter" && selectedTransporter) {
      onTransporterSelected(selectedTransporter)
    }
  }

  const handleBack = () => {
    if (step === "transporter") {
      onCustomerSelected("")
    } else if (step === "details") {
      onTransporterSelected("")
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 'customer': return 'Select Customer'
      case 'transporter': return 'Choose Transporter'
      case 'details': return 'Shipment Details'
      default: return 'Create New Shipment'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{getStepTitle()}</h2>
                <p className="text-blue-100">
                  {step === 'customer' && 'Select a customer to create a new shipment'}
                  {step === 'transporter' && 'Choose a transporter for your shipment'}
                  {step === 'details' && 'Fill in the shipment details'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/10 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm text-blue-100">
                <span>Step {step === 'customer' ? 1 : step === 'transporter' ? 2 : 3} of 3</span>
                <span>{progress}% Complete</span>
              </div>
              <Progress value={progress} className="h-2 bg-blue-700" />
              <div className="flex justify-between text-xs text-blue-200">
                <span className={cn(step === 'customer' ? 'font-bold text-white' : '')}>
                  {step !== 'customer' ? <Check className="inline h-3 w-3 mr-1" /> : null}
                  Customer
                </span>
                <span className={cn(step === 'transporter' ? 'font-bold text-white' : '')}>
                  {step === 'details' ? <Check className="inline h-3 w-3 mr-1" /> : null}
                  Transporter
                </span>
                <span className={cn(step === 'details' ? 'font-bold text-white' : '')}>
                  Details
                </span>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
              {/* Customer Selection */}
              {step === "customer" && (
                <motion.div
                  key="customer-step"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid gap-4 md:grid-cols-2"
                >
                  {customers.map((c) => (
                    <motion.div
                      key={c.id}
                      variants={itemVariants}
                      className={cn(
                        "group relative p-5 border rounded-xl cursor-pointer transition-all duration-200",
                        "hover:border-blue-400 hover:shadow-md hover:bg-blue-50/50",
                        selectedCustomer === c.id
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                          : "border-gray-200"
                      )}
                      onClick={() => onCustomerSelected(c.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <User className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-semibold text-gray-900 truncate">{c.name}</h4>
                          <p className="text-sm text-gray-500">{c.location}</p>
                        </div>
                        {selectedCustomer === c.id && (
                          <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Transporter Selection */}
              {step === "transporter" && (
                <motion.div
                  key="transporter-step"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid gap-4 md:grid-cols-2"
                >
                  {transporters.map((t) => (
                    <motion.div
                      key={t.id}
                      variants={itemVariants}
                      className={cn(
                        "group relative p-5 border rounded-xl cursor-pointer transition-all duration-200",
                        "hover:border-green-400 hover:shadow-md hover:bg-green-50/50",
                        selectedTransporter === t.id
                          ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                          : "border-gray-200"
                      )}
                      onClick={() => onTransporterSelected(t.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Truck className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-semibold text-gray-900">{t.name}</h4>
                            {t.evFleet && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Leaf className="h-3 w-3 mr-1" /> EV Fleet
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1 flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${i < t.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-sm text-gray-500">{t.rating}/5</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {t.modes.map((mode) => (
                              <Badge key={mode} variant="outline" className="text-xs">
                                {getModeIcon(mode)}
                                <span className="ml-1">{mode}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {selectedTransporter === t.id && (
                          <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center text-white">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Shipment Details */}
              {step === "details" && (
                <motion.div
                  key="details-step"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Shipment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Origin</Label>
                        <Input
                          className="h-11"
                          placeholder="e.g., New York, NY"
                          value={formData.origin}
                          onChange={(e) => onFormDataChange({ ...formData, origin: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Destination</Label>
                        <Input
                          className="h-11"
                          placeholder="e.g., Los Angeles, CA"
                          value={formData.destination}
                          onChange={(e) => onFormDataChange({ ...formData, destination: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Weight (kg)</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            className="h-11 pl-10"
                            placeholder="e.g., 500"
                            value={formData.weight}
                            onChange={(e) => onFormDataChange({ ...formData, weight: e.target.value })}
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package">
                              <path d="m7.5 4.27 9 5.15" />
                              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                              <path d="m3.3 7 8.7 5 8.7-5" />
                              <path d="M12 22V12" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(v) => onFormDataChange({ ...formData, priority: v })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                                <span>Low</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="medium">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                                <span>Medium</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="high">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                <span>High</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Transport Mode</Label>
                        <Select
                          value={formData.mode}
                          onValueChange={(v) => onFormDataChange({ ...formData, mode: v })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedTransporterData?.modes.map((m) => (
                              <SelectItem key={m} value={m}>
                                <div className="flex items-center gap-2">
                                  {getModeIcon(m)}
                                  <span className="capitalize">{m}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Show routes only if all details are filled */}
                  {allDetailsFilled && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Available Routes</h3>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-3">
                        {dummyRoutes.map((r) => {
                          const vals = calculateRouteValues(r)
                          const isSelected = selectedRoute === r.id
                          
                          return (
                            <motion.div
                              key={r.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className={cn(
                                "group relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden",
                                "hover:shadow-md hover:border-blue-400",
                                isSelected
                                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                  : "border-gray-200 hover:border-blue-300"
                              )}
                              onClick={() => setSelectedRoute(r.id)}
                            >
                              {r.isIdeal && (
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-bl-lg rounded-tr-lg">
                                  Recommended
                                </div>
                              )}
                              
                              <div className={cn("flex justify-between items-start", { "mt-4": r.isIdeal })}>
                                <h4 className="text-lg font-semibold text-gray-900">{r.name}</h4>
                                {isSelected && (
                                  <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                    <Check className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-4 space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                                  <span>Estimated time: <span className="font-medium">{r.time}</span></span>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-600">
                                  <AlertTriangle className={cn(
                                    "h-4 w-4 mr-2",
                                    r.risk === "Low" ? "text-green-500" :
                                    r.risk === "Medium" ? "text-yellow-500" : "text-red-500"
                                  )} />
                                  <span>Risk: <span className="font-medium">{r.risk}</span></span>
                                </div>
                                
                                <div className="flex items-center text-sm text-gray-600">
                                  <CloudSun className="h-4 w-4 mr-2 text-blue-400" />
                                  <span>{r.weather}</span>
                                </div>
                                
                                <div className="pt-2 mt-3 border-t border-gray-100">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                      <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                                      <span className="text-lg font-bold text-gray-900">${vals.cost}</span>
                                      <span className="ml-1 text-sm text-gray-500">/ shipment</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Leaf className="h-4 w-4 mr-1 text-green-600" />
                                      <span>{vals.carbon}kg CO₂</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {isSelected && (
                                <div className="absolute inset-0 -z-10 opacity-5">
                                  <div className="absolute right-0 top-0 h-20 w-20 bg-blue-500 rounded-full filter blur-3xl"></div>
                                </div>
                              )}
                            </motion.div>
                          )
                        })}
                      </div>
                      
                      {selectedRoute && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-blue-800">Selected Route: {dummyRoutes.find(r => r.id === selectedRoute)?.name}</h4>
                              <p className="mt-1 text-sm text-blue-700">
                                {dummyRoutes.find(r => r.id === selectedRoute)?.isIdeal
                                  ? "This is the recommended route based on cost, time, and environmental impact."
                                  : "This route may have higher costs or environmental impact than the recommended option."}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
              </AnimatePresence>
            
              {/* Navigation */}
              <motion.div
                className="flex justify-between pt-6 mt-8 border-t border-gray-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div>
                  {step !== "customer" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="h-11 px-4 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="h-11 px-6 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  {step === "details" ? (
                    <Button
                      type="submit"
                      disabled={!allDetailsFilled || !selectedRoute || isSubmitting}
                      className="h-11 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Create Shipment
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        (step === "customer" && !selectedCustomer) ||
                        (step === "transporter" && !selectedTransporter)
                      }
                      className="h-11 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}