import type { Value } from "@/lib/types"
import { Card } from "@/components/ui/card"

interface ValuesSectionProps {
  values: Value[]
}

export function ValuesSection({ values }: ValuesSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {values.map((value, index) => (
        <Card key={value.name} className="p-6 animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{value.icon}</span>
            <h3 className="text-xl font-bold" style={{ color: value.color }}>
              {value.name}
            </h3>
          </div>

          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{value.description}</p>

          <div className="p-4 bg-gray-50 rounded-lg border-l-4" style={{ borderLeftColor: value.color }}>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Ejemplo de aplicación:</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{value.example}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
