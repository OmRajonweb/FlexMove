"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Truck, Ship, Plane, Navigation, Zap } from "lucide-react"

interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  type: "origin" | "destination" | "waypoint" | "vehicle"
}

interface Route {
  id: string
  name: string
  locations: MapLocation[]
  distance: string
  duration: string
  cost: string
  carbonFootprint: string
  riskScore: number
}

interface Vehicle {
  id: string
  type: "truck" | "ship" | "plane" | "ev"
  position: { lat: number; lng: number }
  shipmentId?: string
  status: "idle" | "in-transit" | "loading" | "unloading"
}

interface InteractiveMapProps {
  routes?: Route[]
  vehicles?: Vehicle[]
  selectedRoute?: string
  onRouteSelect?: (routeId: string) => void
  showVehicles?: boolean
  trackingMode?: boolean
  className?: string
}

export function InteractiveMap({
  routes = [],
  vehicles = [],
  selectedRoute,
  onRouteSelect,
  showVehicles = false,
  trackingMode = false,
  className = "",
}: InteractiveMapProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 })
  const [zoom, setZoom] = useState(6)
  const [animatedVehicles, setAnimatedVehicles] = useState(vehicles)

  // Simulate real-time vehicle movement
  useEffect(() => {
    if (!showVehicles || !trackingMode) return

    const interval = setInterval(() => {
      setAnimatedVehicles((prev) =>
        prev.map((vehicle) => {
          if (vehicle.status === "in-transit") {
            // Simulate movement along route
            const deltaLat = (Math.random() - 0.5) * 0.01
            const deltaLng = (Math.random() - 0.5) * 0.01
            return {
              ...vehicle,
              position: {
                lat: vehicle.position.lat + deltaLat,
                lng: vehicle.position.lng + deltaLng,
              },
            }
          }
          return vehicle
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [showVehicles, trackingMode])

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "truck":
        return <Truck className="h-4 w-4" />
      case "ship":
        return <Ship className="h-4 w-4" />
      case "plane":
        return <Plane className="h-4 w-4" />
      case "ev":
        return <Zap className="h-4 w-4" />
      default:
        return <Truck className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "idle":
        return "bg-gray-500"
      case "in-transit":
        return "bg-blue-500"
      case "loading":
        return "bg-yellow-500"
      case "unloading":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Map Container */}
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-gray-200">
        {/* Map Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Routes */}
        {routes.map((route, index) => (
          <div key={route.id} className="absolute inset-0">
            {/* Route Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d={`M ${100 + index * 80} 50 Q ${200 + index * 60} ${100 + index * 40} ${300 + index * 80} ${150 + index * 30}`}
                stroke={selectedRoute === route.id ? "#10b981" : "#6b7280"}
                strokeWidth={selectedRoute === route.id ? "4" : "2"}
                fill="none"
                strokeDasharray={selectedRoute === route.id ? "0" : "5,5"}
                className="transition-all duration-300"
              />
            </svg>

            {/* Route Locations */}
            {route.locations.map((location, locIndex) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{
                  left: `${20 + locIndex * 30}%`,
                  top: `${30 + locIndex * 20}%`,
                }}
              >
                <div
                  className={`p-2 rounded-full ${
                    location.type === "origin"
                      ? "bg-blue-500"
                      : location.type === "destination"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                  } text-white shadow-lg`}
                >
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                  <Badge variant="secondary" className="text-xs whitespace-nowrap">
                    {location.name}
                  </Badge>
                </div>
              </div>
            ))}

            {/* Route Selection Button */}
            {onRouteSelect && (
              <Button
                variant={selectedRoute === route.id ? "default" : "outline"}
                size="sm"
                className="absolute top-2 left-2 z-20"
                onClick={() => onRouteSelect(route.id)}
              >
                {route.name}
              </Button>
            )}
          </div>
        ))}

        {/* Vehicles */}
        {showVehicles &&
          animatedVehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-3000 ease-linear"
              style={{
                left: `${30 + index * 25}%`,
                top: `${40 + index * 15}%`,
              }}
            >
              <div className={`p-2 rounded-full ${getStatusColor(vehicle.status)} text-white shadow-lg animate-pulse`}>
                {getVehicleIcon(vehicle.type)}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {vehicle.status}
                </Badge>
              </div>
            </div>
          ))}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button variant="outline" size="sm" onClick={() => setZoom((prev) => Math.min(prev + 1, 10))}>
            +
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom((prev) => Math.max(prev - 1, 1))}>
            -
          </Button>
          <Button variant="outline" size="sm" onClick={() => setMapCenter({ lat: 40.7128, lng: -74.006 })}>
            <Navigation className="h-4 w-4" />
          </Button>
        </div>

        {/* Live Tracking Indicator */}
        {trackingMode && (
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-red-500 text-white animate-pulse">🔴 LIVE TRACKING</Badge>
          </div>
        )}
      </div>

      {/* Route Information Panel */}
      {selectedRoute && routes.find((r) => r.id === selectedRoute) && (
        <div className="p-4 border-t bg-gray-50">
          {(() => {
            const route = routes.find((r) => r.id === selectedRoute)!
            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-600">Distance</div>
                  <div className="text-lg font-semibold">{route.distance}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Duration</div>
                  <div className="text-lg font-semibold">{route.duration}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Cost</div>
                  <div className="text-lg font-semibold text-green-600">{route.cost}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Carbon Footprint</div>
                  <div className="text-lg font-semibold text-blue-600">{route.carbonFootprint}</div>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </Card>
  )
}
