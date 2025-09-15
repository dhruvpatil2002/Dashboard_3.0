import React, { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  Activity,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Clock,
  Monitor,
  Network
} from "lucide-react"

// Dummy data and helpers for demonstration
const initialSystemStatuses = [
  {
    id: 1,
    name: "Server 1",
    status: "healthy",
    alerts: 0,
    uptime: "24d 6h",
    lastCheck: "2 min ago",
    metrics: { cpu: 32.5, memory: 60.2, storage: 80.1, network: 15.3 }
  },
  {
    id: 2,
    name: "Server 2",
    status: "warning",
    alerts: 2,
    uptime: "12d 3h",
    lastCheck: "1 min ago",
    metrics: { cpu: 75.1, memory: 82.3, storage: 90.5, network: 45.7 }
  }
]

const initialServices = [
  {
    id: 1,
    name: "API Gateway",
    status: "healthy",
    port: 8080,
    uptime: "24d 6h",
    requests: 123456,
    errors: 2
  },
  {
    id: 2,
    name: "Auth Service",
    status: "critical",
    port: 3001,
    uptime: "12d 3h",
    requests: 65432,
    errors: 12
  }
]

function getStatusColor(status) {
  switch (status) {
    case "healthy":
      return "bg-success/20 text-success"
    case "warning":
      return "bg-warning/20 text-warning"
    case "critical":
      return "bg-destructive/20 text-destructive"
    default:
      return "bg-muted/20 text-muted-foreground"
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "healthy":
      return <CheckCircle className="inline h-4 w-4 mr-1" />
    case "warning":
      return <AlertTriangle className="inline h-4 w-4 mr-1" />
    case "critical":
      return <XCircle className="inline h-4 w-4 mr-1" />
    default:
      return null
  }
}

function getMetricColor(value) {
  if (value < 60) return "text-success"
  if (value < 85) return "text-warning"
  return "text-destructive"
}

const StatusMonitoring = () => {
  const [systemStatuses, setSystemStatuses] = useState(initialSystemStatuses)
  const [services, setServices] = useState(initialServices)

  // Simulate real-time updates (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatuses(prev =>
        prev.map(system => ({
          ...system,
          metrics: {
            cpu: Math.min(100, Math.max(0, system.metrics.cpu + (Math.random() - 0.5) * 5)),
            memory: Math.min(100, Math.max(0, system.metrics.memory + (Math.random() - 0.5) * 5)),
            storage: Math.min(100, Math.max(0, system.metrics.storage + (Math.random() - 0.5) * 2)),
            network: Math.min(100, Math.max(0, system.metrics.network + (Math.random() - 0.5) * 10))
          }
        }))
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <Tabs defaultValue="servers">
        <TabsList>
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="servers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {systemStatuses.map(system => (
              <Card
                key={system.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Server className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{system.name}</CardTitle>
                        <Badge
                          className={getStatusColor(system.status)}
                          variant="secondary"
                        >
                          {getStatusIcon(system.status)}
                          <span className="ml-1 capitalize">
                            {system.status}
                          </span>
                        </Badge>
                      </div>
                    </div>
                    {system.alerts > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {system.alerts} alerts
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Uptime: {system.uptime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span>Last check: {system.lastCheck}</span>
                      </div>
                    </div>

                    {/* Resource Usage */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Cpu className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">CPU</span>
                          </div>
                          <span
                            className={`text-sm font-medium ${getMetricColor(
                              system.metrics.cpu
                            )}`}
                          >
                            {system.metrics.cpu.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={system.metrics.cpu} className="h-2" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MemoryStick className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Memory</span>
                          </div>
                          <span
                            className={`text-sm font-medium ${getMetricColor(
                              system.metrics.memory
                            )}`}
                          >
                            {system.metrics.memory.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={system.metrics.memory}
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <HardDrive className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Storage</span>
                          </div>
                          <span
                            className={`text-sm font-medium ${getMetricColor(
                              system.metrics.storage
                            )}`}
                          >
                            {system.metrics.storage.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={system.metrics.storage}
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Network className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Network</span>
                          </div>
                          <span
                            className={`text-sm font-medium ${getMetricColor(
                              system.metrics.network
                            )}`}
                          >
                            {system.metrics.network.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={system.metrics.network}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {services.map(service => (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <Monitor className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {service.name}
                        </CardTitle>
                        <Badge
                          className={getStatusColor(service.status)}
                          variant="secondary"
                        >
                          {getStatusIcon(service.status)}
                          <span className="ml-1 capitalize">
                            {service.status}
                          </span>
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Port {service.port}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Uptime: {service.uptime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Requests: {service.requests.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-2 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-primary">
                          {service.requests.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Total Requests
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-destructive">
                          {service.errors}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Errors
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Status</CardTitle>
              <CardDescription>
                Network connectivity and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <Wifi className="h-8 w-8 text-success mx-auto mb-2" />
                  <div className="text-lg font-semibold text-success">
                    Connected
                  </div>
                  <div className="text-sm text-muted-foreground">
                    All networks operational
                  </div>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-lg font-semibold text-primary">
                    45.6 Mbps
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average bandwidth
                  </div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <Clock className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <div className="text-lg font-semibold text-secondary">
                    12ms
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average latency
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>
                Overall system performance metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">2.3s</div>
                  <div className="text-sm text-muted-foreground">
                    Response Time
                  </div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">1.2K</div>
                  <div className="text-sm text-muted-foreground">
                    Requests/min
                  </div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">0.1%</div>
                  <div className="text-sm text-muted-foreground">
                    Error Rate
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default StatusMonitoring