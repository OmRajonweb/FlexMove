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
  step: 'customer' | 'transporter' | 'details'
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
  onClose 
}: CreateShipmentFormProps) {

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
    if (!formData.mode || !formData.weight) return null

    const baseData = {
      truck: { cost: 850, time: "3-4 days", carbon: 120, risk: "Low" },
      ship: { cost: 450, time: "7-10 days", carbon: 45, risk: "Medium" },
      air: { cost: 2100, time: "1-2 days", carbon: 380, risk: "Low" },
    }

    const data = baseData[formData.mode.toLowerCase() as keyof typeof baseData]
    if (!data) return null

    const weightMultiplier = Number.parseFloat(formData.weight) / 1000
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
  const selectedCustomerData = customers.find((c) => c.id === selectedCustomer)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onShipmentCreated(formData)
  }

  const handleNext = () => {
    if (step === 'customer' && selectedCustomer) {
      onCustomerSelected(selectedCustomer)
    } else if (step === 'transporter' && selectedTransporter) {
      onTransporterSelected(selectedTransporter)
    }
  }

  const handleBack = () => {
    if (step === 'transporter') {
      onCustomerSelected('')
    } else if (step === 'details') {
      onTransporterSelected('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>Create New Shipment</span>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step === 'customer' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>1</div>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step === 'transporter' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>2</div>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step === 'details' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>3</div>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Customer Selection */}
            {step === 'customer' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Select Customer</h3>
                  <p className="text-gray-600">Choose the customer for this shipment</p>
                </div>
                <div className="grid gap-4">
                  {customers.map((customer) => (
                    <div
                      key={customer.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedCustomer === customer.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => onCustomerSelected(customer.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{customer.name}</h4>
                          <p className="text-sm text-gray-600">{customer.location}</p>
                        </div>
                        {selectedCustomer === customer.id && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Transporter Selection */}
            {step === 'transporter' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Select Transporter</h3>
                  <p className="text-gray-600">Choose a transporter for {selectedCustomerData?.name}</p>
                </div>
                <div className="grid gap-4">
                  {transporters.map((transporter) => (
                    <div
                      key={transporter.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedTransporter === transporter.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => onTransporterSelected(transporter.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{transporter.name}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-600">Rating: {transporter.rating}/5</span>
                            <span className="text-sm text-gray-600">Modes: {transporter.modes.join(', ')}</span>
                            {transporter.evFleet && (
                              <Badge variant="outline" className="text-green-600 border-green-300">
                                <Leaf className="h-3 w-3 mr-1" />
                                EV Fleet
                              </Badge>
                            )}
                          </div>
                        </div>
                        {selectedTransporter === transporter.id && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Shipment Details */}
            {step === 'details' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Shipment Details</h3>
                  <p className="text-gray-600">Complete the shipment information</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="origin">Origin</Label>
                      <Input
                        id="origin"
                        value={formData.origin}
                        onChange={(e) => onFormDataChange({...formData, origin: e.target.value})}
                        placeholder="Enter origin location"
                      />
                    </div>

                    <div>
                      <Label htmlFor="destination">Destination</Label>
                      <Input
                        id="destination"
                        value={formData.destination}
                        onChange={(e) => onFormDataChange({...formData, destination: e.target.value})}
                        placeholder="Enter destination"
                      />
                    </div>

                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => onFormDataChange({...formData, weight: e.target.value})}
                        placeholder="Enter weight"
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
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="mode">Transport Mode</Label>
                      <Select value={formData.mode} onValueChange={(value) => onFormDataChange({...formData, mode: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transport mode" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedTransporterData?.modes.map((mode) => (
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
              </div>
            )}

            <div className="flex justify-between pt-4 border-t">
              <div>
                {step !== 'customer' && (
                  <Button type="button" variant="outline" onClick={handleBack}>
                    ← Back
                  </Button>
                )}
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                {step === 'details' ? (
                  <Button
                    type="submit"
                    disabled={!formData.origin || !formData.destination || !formData.weight || !formData.priority || !formData.mode}
                  >
                    Create Shipment
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (step === 'customer' && !selectedCustomer) ||
                      (step === 'transporter' && !selectedTransporter)
                    }
                  >
                    Next →
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
