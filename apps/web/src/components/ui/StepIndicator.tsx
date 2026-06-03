interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

export default function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  const defaultLabels = ['Dados', 'Fotos', 'Descrição', 'Preço']

  return (
    <div className="flex gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
        <div key={s} className="flex items-center flex-1 gap-2">
          <div
            className={`h-1.5 flex-1 rounded-full transition-all ${
              s <= currentStep ? 'bg-teal-500' : 'bg-steel-200'
            }`}
          />
          {labels && (
            <span className={`text-xs whitespace-nowrap ${s <= currentStep ? 'text-teal-600' : 'text-steel-400'}`}>
              {labels[s - 1]}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}