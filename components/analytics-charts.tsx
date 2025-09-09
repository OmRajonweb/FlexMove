"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Leaf,
  Target,
  Award,
  Calendar,
  DollarSign,
  Package,
  Truck,
  Clock,
} from "lucide-react"

interface ChartDataPoint {
  label: string
  value: number
  change?: number
  color?: string
}

interface AnalyticsChartsProps {
  userRole: "supplier" | "transporter" | "customer"
  timeframe?: "week" | "month" | "quarter" | "year"
}

export function AnalyticsCharts({ userRole, timeframe = "month" }: AnalyticsChartsProps) {
  // Mock data - in real app this would come from API
  const getSupplierData = () => ({
    shipmentVolume: [
      { label: "Jan", value: 45, change: 12 },
      { label: "Feb", value: 52, change: 15 },
      { label: "Mar", value: 48, change: -8 },
      { label: "Apr", value: 61, change: 27 },
      { label: "May", value: 58, change: -5 },
      { label: "Jun", value: 67, change: 15 },
    ],
    costTrends: [
      { label: "Transportation", value: 45000, change: -8 },
      { label: "Fuel", value: 12000, change: 15 },
      { label: "Insurance", value: 8500, change: 2 },
      { label: "Maintenance", value: 6200, change: -12 },
    ],
    carbonReduction: [
      { label: "Q1", value: 15, change: 5 },
      { label: "Q2", value: 22, change: 7 },
      { label: "Q3", value: 28, change: 6 },
      { label: "Q4", value: 35, change: 7 },
    ],
    routeEfficiency: [
      { label: "NYC → LA", value: 92, change: 3 },
      { label: "CHI → MIA", value: 88, change: -2 },
      { label: "SEA → DEN", value: 95, change: 5 },
      { label: "LA → SEA", value: 90, change: 1 },
    ],
  })

  const getTransporterData = () => ({
    deliveryPerformance: [
      { label: "On-Time", value: 92, color: "#10b981" },
      { label: "Early", value: 5, color: "#3b82f6" },
      { label: "Delayed", value: 3, color: "#ef4444" },
    ],
    revenueGrowth: [
      { label: "Jan", value: 42000, change: 8 },
      { label: "Feb", value: 45000, change: 7 },
      { label: "Mar", value: 48000, change: 6 },
      { label: "Apr", value: 52000, change: 8 },
      { label: "May", value: 49000, change: -6 },
      { label: "Jun", value: 55000, change: 12 },
    ],
    fleetUtilization: [
      { label: "Trucks", value: 85, change: 5 },
      { label: "EV Trucks", value: 78, change: 12 },
      { label: "Ships", value: 92, change: -2 },
      { label: "Aircraft", value: 88, change: 3 },
    ],
    sustainabilityScore: [
      { label: "EV Adoption", value: 25, change: 8 },
      { label: "Route Optimization", value: 85, change: 3 },
      { label: "Carbon Reduction", value: 18, change: 5 },
      { label: "Fuel Efficiency", value: 72, change: 7 },
    ],
  })

  const getCustomerData = () => ({
    deliveryTrends: [
      { label: "Fast Delivery", value: 35, color: "#3b82f6" },
      { label: "Eco Delivery", value: 65, color: "#10b981" },
    ],
    supplierRatings: [
      { label: "TechCorp Inc.", value: 4.8, change: 0.2 },
      { label: "Global Retail", value: 4.6, change: -0.1 },
      { label: "Manufacturing Co.", value: 4.7, change: 0.3 },
    ],
    costSavings: [
      { label: "Eco Choices", value: 1200, change: 15 },
      { label: "Bulk Orders", value: 800, change: 8 },
      { label: "Route Optimization", value: 450, change: 12 },
    ],
    carbonImpact: [
      { label: "Jan", value: 2.1, change: -15 },
      { label: "Feb", value: 1.8, change: -14 },
      { label: "Mar", value: 1.5, change: -17 },
      { label: "Apr", value: 1.3, change: -13 },
      { label: "May", value: 1.1, change: -15 },
      { label: "Jun", value: 0.9, change: -18 },
    ],
  })

  const data =
    userRole === "supplier" ? getSupplierData() : userRole === "transporter" ? getTransporterData() : getCustomerData()

  const renderBarChart = (data: ChartDataPoint[], title: string, description: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => {
            const maxValue = Math.max(...data.map((d) => d.value))
            const percentage = (item.value / maxValue) * 100

            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {typeof item.value === "number" && item.value > 100 ? item.value.toLocaleString() : item.value}
                      {userRole === "customer" && title.includes("Carbon")
                        ? "t CO₂"
                        : userRole === "transporter" && title.includes("Revenue")
                          ? ""
                          : userRole === "supplier" && title.includes("Cost")
                            ? ""
                            : typeof item.value === "number" && item.value <= 100
                              ? "%"
                              : ""}
                    </span>
                    {item.change && (
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          item.change > 0 ? "text-primary" : "text-destructive"
                        }`}
                      >
                        {item.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(item.change)}%
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <Progress
                    value={percentage}
                    className="h-3"
                    style={{
                      backgroundColor: item.color ? `${item.color}20` : undefined,
                    }}
                  />
                  {item.color && (
                    <div
                      className="absolute top-0 left-0 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )

  const renderKPIGrid = () => {
    const kpis =
      userRole === "supplier"
        ? [
            { label: "Active Shipments", value: "24", change: "+2", icon: Package },
            { label: "On-Time Rate", value: "94.2%", change: "+1.2%", icon: Clock },
            { label: "Cost Savings", value: "$12.4K", change: "+8%", icon: DollarSign },
            { label: "Carbon Reduction", value: "12%", change: "+3%", icon: Leaf },
          ]
        : userRole === "transporter"
          ? [
              { label: "Fleet Utilization", value: "87%", change: "+5%", icon: Truck },
              { label: "Revenue Growth", value: "12%", change: "+3%", icon: TrendingUp },
              { label: "EV Fleet %", value: "25%", change: "+8%", icon: Leaf },
              { label: "Customer Rating", value: "4.7/5", change: "+0.2", icon: Award },
            ]
          : [
              { label: "Eco Deliveries", value: "67%", change: "+12%", icon: Leaf },
              { label: "Avg Delivery Time", value: "3.2 days", change: "-0.5", icon: Clock },
              { label: "Cost Savings", value: "$2.4K", change: "+15%", icon: DollarSign },
              { label: "Supplier Rating", value: "4.7/5", change: "+0.1", icon: Award },
            ]

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className={`text-xs ${kpi.change.startsWith("+") ? "text-primary" : "text-destructive"}`}>
                  {kpi.change} from last {timeframe}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {renderKPIGrid()}

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {userRole === "supplier" && (
              <>
                {renderBarChart(data.shipmentVolume, "Shipment Volume", "Monthly shipment trends and growth")}
                {renderBarChart(data.routeEfficiency, "Route Efficiency", "Performance by major routes")}
              </>
            )}
            {userRole === "transporter" && (
              <>
                {renderBarChart(data.deliveryPerformance, "Delivery Performance", "On-time delivery breakdown")}
                {renderBarChart(data.fleetUtilization, "Fleet Utilization", "Vehicle type utilization rates")}
              </>
            )}
            {userRole === "customer" && (
              <>
                {renderBarChart(data.deliveryTrends, "Delivery Preferences", "Your delivery choice breakdown")}
                {renderBarChart(data.supplierRatings, "Supplier Ratings", "Your ratings for suppliers")}
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {userRole === "supplier" && (
              <>
                {renderBarChart(data.carbonReduction, "Carbon Reduction", "Quarterly CO₂ reduction progress")}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Sustainability Goals
                    </CardTitle>
                    <CardDescription>Track your environmental targets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Carbon Neutral by 2030</span>
                          <span>35% complete</span>
                        </div>
                        <Progress value={35} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>50% EV Fleet by 2025</span>
                          <span>28% complete</span>
                        </div>
                        <Progress value={28} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Route Optimization</span>
                          <span>85% complete</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            {userRole === "transporter" && (
              <>
                {renderBarChart(
                  data.sustainabilityScore,
                  "Sustainability Metrics",
                  "Environmental performance indicators",
                )}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Green Certifications
                    </CardTitle>
                    <CardDescription>Your sustainability achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-primary" />
                          <span className="font-medium">EV Fleet Pioneer</span>
                        </div>
                        <Badge variant="outline" className="text-primary border-primary">
                          Earned
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Carbon Neutral Fleet</span>
                        </div>
                        <Badge variant="outline">In Progress</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Green Logistics Leader</span>
                        </div>
                        <Badge variant="outline">Locked</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            {userRole === "customer" && (
              <>
                {renderBarChart(
                  data.carbonImpact,
                  "Carbon Footprint Reduction",
                  "Monthly CO₂ savings from eco choices",
                )}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5" />
                      Eco Impact Summary
                    </CardTitle>
                    <CardDescription>Your environmental contribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-primary/10 rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-1">12.3t CO₂</div>
                        <div className="text-sm text-muted-foreground">Total carbon saved this year</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold">67%</div>
                          <div className="text-xs text-muted-foreground">Eco deliveries</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold">156</div>
                          <div className="text-xs text-muted-foreground">Trees equivalent</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {userRole === "supplier" && (
              <>
                {renderBarChart(data.costTrends, "Cost Analysis", "Breakdown of operational costs")}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Cost Optimization
                    </CardTitle>
                    <CardDescription>Savings opportunities identified</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Route Optimization</div>
                          <div className="text-sm text-muted-foreground">Potential savings</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">$2,400/month</div>
                          <div className="text-xs text-muted-foreground">8% reduction</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">EV Fleet Transition</div>
                          <div className="text-sm text-muted-foreground">Long-term savings</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">$1,800/month</div>
                          <div className="text-xs text-muted-foreground">6% reduction</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            {userRole === "transporter" && (
              <>
                {renderBarChart(data.revenueGrowth, "Revenue Growth", "Monthly revenue trends")}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Profitability Analysis
                    </CardTitle>
                    <CardDescription>Revenue breakdown by service type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { service: "Standard Delivery", revenue: 32000, margin: 18 },
                        { service: "Express Delivery", revenue: 15000, margin: 25 },
                        { service: "Eco Delivery", revenue: 8000, margin: 22 },
                      ].map((item) => (
                        <div key={item.service} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{item.service}</span>
                            <span>
                              ${item.revenue.toLocaleString()} ({item.margin}% margin)
                            </span>
                          </div>
                          <Progress value={(item.revenue / 55000) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            {userRole === "customer" && (
              <>
                {renderBarChart(data.costSavings, "Cost Savings", "Savings from smart choices")}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Spending Forecast
                    </CardTitle>
                    <CardDescription>Projected logistics costs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold mb-1">$18,450</div>
                        <div className="text-sm text-muted-foreground">Projected annual logistics spend</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>With current eco choices</span>
                          <span className="font-medium text-primary">-$2,400 savings</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Potential additional savings</span>
                          <span className="font-medium text-muted-foreground">-$800 available</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Industry Benchmarks
              </CardTitle>
              <CardDescription>Compare your performance with industry standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {userRole === "supplier" &&
                  [
                    { metric: "On-Time Delivery Rate", your: 94.2, industry: 89.5, unit: "%" },
                    { metric: "Carbon Efficiency", your: 1.2, industry: 1.8, unit: "t CO₂/shipment" },
                    { metric: "Cost per Mile", your: 2.45, industry: 2.78, unit: "$" },
                  ].map((benchmark) => (
                    <div key={benchmark.metric} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{benchmark.metric}</span>
                        <div className="flex gap-4">
                          <span>
                            You: {benchmark.your}
                            {benchmark.unit}
                          </span>
                          <span className="text-muted-foreground">
                            Industry: {benchmark.industry}
                            {benchmark.unit}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Progress
                            value={(benchmark.your / Math.max(benchmark.your, benchmark.industry)) * 100}
                            className="h-2"
                          />
                          <div className="text-xs text-primary mt-1">Your Performance</div>
                        </div>
                        <div className="flex-1">
                          <Progress
                            value={(benchmark.industry / Math.max(benchmark.your, benchmark.industry)) * 100}
                            className="h-2 opacity-50"
                          />
                          <div className="text-xs text-muted-foreground mt-1">Industry Average</div>
                        </div>
                      </div>
                    </div>
                  ))}

                {userRole === "transporter" &&
                  [
                    { metric: "Fleet Utilization", your: 87, industry: 82, unit: "%" },
                    { metric: "Customer Satisfaction", your: 4.7, industry: 4.2, unit: "/5" },
                    { metric: "EV Adoption Rate", your: 25, industry: 15, unit: "%" },
                  ].map((benchmark) => (
                    <div key={benchmark.metric} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{benchmark.metric}</span>
                        <div className="flex gap-4">
                          <span>
                            You: {benchmark.your}
                            {benchmark.unit}
                          </span>
                          <span className="text-muted-foreground">
                            Industry: {benchmark.industry}
                            {benchmark.unit}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Progress
                            value={(benchmark.your / Math.max(benchmark.your, benchmark.industry)) * 100}
                            className="h-2"
                          />
                          <div className="text-xs text-primary mt-1">Your Performance</div>
                        </div>
                        <div className="flex-1">
                          <Progress
                            value={(benchmark.industry / Math.max(benchmark.your, benchmark.industry)) * 100}
                            className="h-2 opacity-50"
                          />
                          <div className="text-xs text-muted-foreground mt-1">Industry Average</div>
                        </div>
                      </div>
                    </div>
                  ))}

                {userRole === "customer" &&
                  [
                    { metric: "Eco Delivery Adoption", your: 67, industry: 35, unit: "%" },
                    { metric: "Average Delivery Time", your: 3.2, industry: 4.1, unit: " days" },
                    { metric: "Cost Optimization", your: 15, industry: 8, unit: "% savings" },
                  ].map((benchmark) => (
                    <div key={benchmark.metric} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{benchmark.metric}</span>
                        <div className="flex gap-4">
                          <span>
                            You: {benchmark.your}
                            {benchmark.unit}
                          </span>
                          <span className="text-muted-foreground">
                            Average: {benchmark.industry}
                            {benchmark.unit}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Progress
                            value={(benchmark.your / Math.max(benchmark.your, benchmark.industry)) * 100}
                            className="h-2"
                          />
                          <div className="text-xs text-primary mt-1">Your Performance</div>
                        </div>
                        <div className="flex-1">
                          <Progress
                            value={(benchmark.industry / Math.max(benchmark.your, benchmark.industry)) * 100}
                            className="h-2 opacity-50"
                          />
                          <div className="text-xs text-muted-foreground mt-1">Industry Average</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
