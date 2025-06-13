"use client"

import { useState, useEffect, useRef } from "react"
import type { Medal, User } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as d3 from "d3"

interface MetricsSectionProps {
  medals: Medal[]
  users: User[]
  currentUser: User
}

export function MetricsSection({ medals, users, currentUser }: MetricsSectionProps) {
  const [viewType, setViewType] = useState("employee")
  const [selectedEntity, setSelectedEntity] = useState(currentUser.id)
  const svgRef = useRef<SVGSVGElement>(null)
  const [nodes, setNodes] = useState<any[]>([]) // Declare nodes state

  const getFilteredUsers = () => {
    if (currentUser.isAdmin) {
      return users
    } else {
      return users.filter((u) => u.team === currentUser.team)
    }
  }

  const getFilteredTeams = () => {
    if (currentUser.isAdmin) {
      return [...new Set(users.map((u) => u.team))]
    } else {
      return [currentUser.team]
    }
  }

  const getFilteredAreas = () => {
    if (currentUser.isAdmin) {
      return [...new Set(users.map((u) => u.area))]
    } else {
      return [currentUser.area]
    }
  }

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 600
    const height = 400
    const margin = { top: 20, right: 20, bottom: 20, left: 20 }

    // Preparar datos según el tipo de vista
    let newNodes: any[] = []
    let links: any[] = []

    if (viewType === "employee") {
      // Vista por empleado - mostrar conexiones con otros empleados
      const targetUser = users.find((u) => u.id === selectedEntity)
      if (!targetUser) return

      // Crear nodos
      const connectedUsers = new Set<string>()
      connectedUsers.add(targetUser.id)

      medals.forEach((medal) => {
        if (medal.giver.id === targetUser.id) {
          connectedUsers.add(medal.recipient.id)
        }
        if (medal.recipient.id === targetUser.id) {
          connectedUsers.add(medal.giver.id)
        }
      })

      newNodes = Array.from(connectedUsers).map((userId) => {
        const user = users.find((u) => u.id === userId)!
        return {
          id: userId,
          name: user.name.split(" ")[0],
          team: user.team,
          area: user.area,
          isTarget: userId === targetUser.id,
        }
      })

      // Crear enlaces con direcciones
      const linkCounts: Record<string, { source: string; target: string; count: number; type: "sent" | "received" }> =
        {}
      medals.forEach((medal) => {
        if (connectedUsers.has(medal.giver.id) && connectedUsers.has(medal.recipient.id)) {
          const key = `${medal.giver.id}-${medal.recipient.id}`
          if (!linkCounts[key]) {
            linkCounts[key] = {
              source: medal.giver.id,
              target: medal.recipient.id,
              count: 0,
              type: medal.giver.id === targetUser.id ? "sent" : "received",
            }
          }
          linkCounts[key].count++
        }
      })

      links = Object.values(linkCounts)
    } else if (viewType === "all") {
      // Vista general - mostrar todos los usuarios y sus conexiones principales
      newNodes = users.map((user) => ({
        id: user.id,
        name: user.name.split(" ")[0],
        team: user.team,
        area: user.area,
        isTarget: false,
      }))

      // Crear enlaces solo para las conexiones más significativas
      const linkCounts: Record<string, { source: string; target: string; count: number }> = {}
      medals.forEach((medal) => {
        const key = `${medal.giver.id}-${medal.recipient.id}`
        if (!linkCounts[key]) {
          linkCounts[key] = { source: medal.giver.id, target: medal.recipient.id, count: 0 }
        }
        linkCounts[key].count++
      })

      // Solo mostrar conexiones con más de 1 reconocimiento
      links = Object.values(linkCounts).filter((link) => link.count > 1)
    } else if (viewType === "team") {
      // Vista por equipo
      const teams = [...new Set(users.map((u) => u.team))]

      newNodes = teams.map((team) => ({
        id: team,
        name: team,
        type: "team",
      }))

      const teamConnections: Record<string, { source: string; target: string; count: number }> = {}
      medals.forEach((medal) => {
        const giverUser = users.find((u) => u.id === medal.giver.id)
        const recipientUser = users.find((u) => u.id === medal.recipient.id)

        if (giverUser && recipientUser && giverUser.team !== recipientUser.team) {
          const key = `${giverUser.team}-${recipientUser.team}`
          if (!teamConnections[key]) {
            teamConnections[key] = {
              source: giverUser.team,
              target: recipientUser.team,
              count: 0,
            }
          }
          teamConnections[key].count++
        }
      })

      links = Object.values(teamConnections)
    } else if (viewType === "area") {
      // Vista por área
      const areas = [...new Set(users.map((u) => u.area))]

      newNodes = areas.map((area) => ({
        id: area,
        name: area,
        type: "area",
      }))

      const areaConnections: Record<string, { source: string; target: string; count: number }> = {}
      medals.forEach((medal) => {
        const giverUser = users.find((u) => u.id === medal.giver.id)
        const recipientUser = users.find((u) => u.id === medal.recipient.id)

        if (giverUser && recipientUser && giverUser.area !== recipientUser.area) {
          const key = `${giverUser.area}-${recipientUser.area}`
          if (!areaConnections[key]) {
            areaConnections[key] = {
              source: giverUser.area,
              target: recipientUser.area,
              count: 0,
            }
          }
          areaConnections[key].count++
        }
      })

      links = Object.values(areaConnections)
    }

    if (newNodes.length === 0) return

    setNodes(newNodes)

    // Crear simulación de fuerza
    const simulation = d3
      .forceSimulation(newNodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(120),
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30))

    // Definir marcadores para las flechas
    svg
      .append("defs")
      .selectAll("marker")
      .data(["sent", "received", "default"])
      .enter()
      .append("marker")
      .attr("id", (d) => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", (d) => (d === "sent" ? "#ef4444" : d === "received" ? "#10b981" : "#6b7280"))

    // Dibujar enlaces con flechas
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "network-link")
      .attr("stroke", (d: any) => {
        if (viewType === "employee" && d.type) {
          return d.type === "sent" ? "#ef4444" : "#10b981"
        }
        return "#6b7280"
      })
      .attr("stroke-width", (d: any) => Math.max(2, Math.sqrt(d.count) * 2))
      .attr("marker-end", (d: any) => {
        if (viewType === "employee" && d.type) {
          return `url(#arrow-${d.type})`
        }
        return "url(#arrow-default)"
      })
      .attr("opacity", 0.7)

    // Dibujar nodos
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(newNodes)
      .enter()
      .append("circle")
      .attr("class", "network-node")
      .attr("r", (d: any) => (d.isTarget ? 25 : 20))
      .attr("fill", (d: any) => {
        if (d.isTarget) return "#f97316"
        if (d.type === "team") return "#3b82f6"
        if (d.type === "area") return "#8b5cf6"
        return "#6b7280"
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("cursor", "pointer")

    // Agregar etiquetas
    const labels = svg
      .append("g")
      .selectAll("text")
      .data(newNodes)
      .enter()
      .append("text")
      .attr("class", "network-label")
      .text((d: any) => d.name)
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("fill", "#374151")
      .attr("pointer-events", "none")

    // Agregar contadores en los enlaces con fondo
    const linkLabels = svg.append("g").selectAll("g").data(links).enter().append("g")

    linkLabels.append("circle").attr("r", 12).attr("fill", "white").attr("stroke", "#e5e7eb").attr("stroke-width", 1)

    linkLabels
      .append("text")
      .attr("class", "network-count")
      .text((d: any) => d.count)
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "700")
      .attr("fill", "#374151")
      .attr("pointer-events", "none")

    // Actualizar posiciones en cada tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)

      labels.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y)

      linkLabels.attr(
        "transform",
        (d: any) => `translate(${(d.source.x + d.target.x) / 2}, ${(d.source.y + d.target.y) / 2})`,
      )
    })

    // Agregar drag behavior
    node.call(
      // @ts-ignore - D3 typing issue
      d3
        .drag()
        .on("start", (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on("drag", (event: any, d: any) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on("end", (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        }),
    )
  }, [medals, users, viewType, selectedEntity])

  const getRecognitionStats = () => {
    const sent = medals.filter((m) => m.giver.id === currentUser.id).length
    const received = medals.filter((m) => m.recipient.id === currentUser.id).length
    const total = medals.length
    const activeUsers = new Set([...medals.map((m) => m.giver.id), ...medals.map((m) => m.recipient.id)]).size
    const participationRate = Math.round((activeUsers / users.length) * 100)

    return { sent, received, total, participationRate }
  }

  const stats = getRecognitionStats()

  return (
    <div>
      <div className="mb-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de vista</Label>
            <Select value={viewType} onValueChange={setViewType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tipo de vista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Por Empleado</SelectItem>
                <SelectItem value="team">Por Equipo</SelectItem>
                <SelectItem value="area">Por Área</SelectItem>
                <SelectItem value="all">Vista General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {viewType === "employee" && (
            <div className="space-y-2">
              <Label>Seleccionar empleado</Label>
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un empleado" />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredUsers().map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} - {user.team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Leyenda para vista por empleado */}
      {viewType === "employee" && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Leyenda:</h4>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-red-500"></div>
              <span>Reconocimientos enviados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-green-500"></div>
              <span>Reconocimientos recibidos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span>Usuario seleccionado</span>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-[400px] border border-gray-200 rounded-lg bg-gray-50 relative">
        <svg ref={svgRef} className="w-full h-full" viewBox="0 0 600 400"></svg>
        {viewType === "all" && nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">🌐</div>
              <div>Vista general de todas las conexiones</div>
              <div className="text-sm">Mostrando solo conexiones significativas</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="mb-4 text-lg font-medium">Estadísticas Detalladas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-3xl font-extrabold text-orange-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Reconocimientos</div>
            <div className="text-xs text-gray-500 mt-1">En toda la plataforma</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-extrabold text-green-600">{stats.received}</div>
            <div className="text-sm text-gray-600">Recibidos por ti</div>
            <div className="text-xs text-gray-500 mt-1">Reconocimientos que has recibido</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-extrabold text-blue-600">{stats.sent}</div>
            <div className="text-sm text-gray-600">Enviados por ti</div>
            <div className="text-xs text-gray-500 mt-1">Reconocimientos que has dado</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-extrabold text-purple-600">{stats.participationRate}%</div>
            <div className="text-sm text-gray-600">Participación Activa</div>
            <div className="text-xs text-gray-500 mt-1">Usuarios que han participado</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
