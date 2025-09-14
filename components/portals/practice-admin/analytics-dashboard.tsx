"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Users, Calendar, Clock } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function AnalyticsDashboard() {
  const analyticsData = {
    revenue: {
      current: 125400,
      previous: 112300,
      growth: 11.7,
    },
    patients: {
      current: 1247,
      previous: 1156,
      growth: 7.9,
    },
    appointments: {
      current: 892,
      previous: 834,
      growth: 7.0,
    },
    efficiency: {
      current: 94.2,
      previous: 91.8,
      growth: 2.6,
    },
  }

  const monthlyTrends = [
    { month: "Jan", revenue: 98000, patients: 1050 },
    { month: "Feb", revenue: 105000, patients: 1120 },
    { month: "Mar", revenue: 112000, patients: 1180 },
    { month: "Apr", revenue: 118000, patients: 1220 },
    { month: "May", revenue: 125400, patients: 1247 },
  ]

  const departmentPerformance = [
    { name: "General Practice", revenue: 45000, utilization: 92 },
    { name: "Cardiology", revenue: 38000, utilization: 88 },
    { name: "Dermatology", revenue: 25000, utilization: 95 },
    { name: "Pediatrics", revenue: 17400, utilization: 85 },
  ]

  const appointmentTypes = [
    { name: "Routine Check-up", value: 35, color: "#0088FE" },
    { name: "Follow-up", value: 28, color: "#00C49F" },
    { name: "Urgent Care", value: 20, color: "#FFBB28" },
    { name: "Consultation", value: 17, color: "#FF8042" },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.revenue.current.toLocaleString()}</div>
            <div className="flex items-center space-x-2 mt-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <Badge variant="secondary" className="text-green-600 bg-green-50">
                +{analyticsData.revenue.growth}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.patients.current.toLocaleString()}</div>
            <div className="flex items-center space-x-2 mt-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <Badge variant="secondary" className="text-green-600 bg-green-50">
                +{analyticsData.patients.growth}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.appointments.current}</div>
            <div className="flex items-center space-x-2 mt-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <Badge variant="secondary" className="text-green-600 bg-green-50">
                +{analyticsData.appointments.growth}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.efficiency.current}%</div>
            <div className="flex items-center space-x-2 mt-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <Badge variant="secondary" className="text-green-600 bg-green-50">
                +{analyticsData.efficiency.growth}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Patient Trends</CardTitle>
            <CardDescription>Monthly performance over the last 5 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue" ? `$${value.toLocaleString()}` : value,
                    name === "revenue" ? "Revenue" : "Patients",
                  ]}
                />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="patients" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Types Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Distribution</CardTitle>
            <CardDescription>Breakdown of appointment types this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Revenue and utilization by department this month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) => [
                  name === "revenue" ? `$${value.toLocaleString()}` : `${value}%`,
                  name === "revenue" ? "Revenue" : "Utilization",
                ]}
              />
              <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="utilization" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
