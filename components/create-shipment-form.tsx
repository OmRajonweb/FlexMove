"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Truck, Ship, Plane, Leaf, Clock, DollarSign, AlertTriangle } from "lucide-react"

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

interface CreateShipmentFormProps {
  customers: Customer[]
  transporters: Transporter[]
  onClose: () => void
}

export function CreateShipmentForm({ customers, transporters, onClose }: CreateShipmentFormProps) {
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [selectedTransporter, setSelectedTransporter] = useState("")
  const [selectedMode, setSelectedMode] = useState("")
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [weight, setWeight] = useState("")
  const [priority, setPriority] = useState("")

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

  const getRouteAnalysis = () => {
    if (!selectedMode || !weight) return null

    const baseData = {
      truck: { cost: 850, time: "3-4 days", carbon: 120, risk: "Low" },
      ship: { cost: 450, time: "7-10 days", carbon: 45, risk: "Medium" },
      air: { cost: 2100, time: "1-2 days", carbon: 380, risk: "Low" },
    }

    const data = baseData[selectedMode.toLowerCase() as keyof typeof baseData]
    if (!data) return null

    const weightMultiplier = Number.parseFloat(weight) / 1000
    const adjustedCost = Math.round(data.cost * weightMultiplier)
    const adjustedCarbon = Math.round(data.carbon * weightMultiplier)

    return {
      ...data,
      cost: adjustedCost,
      carbon: adjustedCarbon,
    }
  }

  const analysis = getRouteAnalysis()
  const selectedTransporterData = transporters.find((t) => t.id === selectedTransporter)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Creating shipment:", {
      customer: selectedCustomer,
      transporter: selectedTransporter,
      mode: selectedMode,
      origin,
      destination,
      weight,
      priority,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Create New Shipment
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer">Customer</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Enter origin location"
                  />
                </div>

                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter destination"
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter weight"
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
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
              </div>

              {/* Transporter Selection */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="transporter">Transporter</Label>
                  <Select value={selectedTransporter} onValueChange={setSelectedTransporter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transporter" />
                    </SelectTrigger>
                    <SelectContent>
                      {transporters.map((transporter) => (
                        <SelectItem key={transporter.id} value={transporter.id}>
                          <div className="flex items-center gap-2">
                            {transporter.name}
                            <Badge variant="secondary">★ {transporter.rating}</Badge>
                            {transporter.evFleet && <Leaf className="h-3 w-3 text-green-600" />}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTransporterData && (
                  <div>
                    <Label htmlFor="mode">Transport Mode</Label>
                    <Select value={selectedMode} onValueChange={setSelectedMode}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedTransporterData.modes.map((mode) => (
                          <SelectItem key={mode} value={mode}>
                            <div className="flex items-center gap-2">
                              {getModeIcon(mode)}
                              {mode}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Route Analysis */}
                {analysis && (
                  <Card className="bg-slate-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Route Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span>Cost: ${analysis.cost}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span>Time: {analysis.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <span>CO₂: {analysis.carbon}kg</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span>Risk: {analysis.risk}</span>
                        </div>
                      </div>

                      {selectedTransporterData?.evFleet && (
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                          <Leaf className="h-4 w-4" />
                          <span>15% carbon reduction with EV fleet</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !selectedCustomer || !selectedTransporter || !selectedMode || !origin || !destination || !weight
                }
              >
                Create Shipment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
