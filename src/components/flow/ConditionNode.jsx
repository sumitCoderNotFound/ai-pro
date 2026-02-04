import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { GitBranch } from 'lucide-react'

const ConditionNode = ({ data, selected }) => {
  const condition = data.conditions?.[0]
  
  return (
    <div className={`px-4 py-3 rounded-xl bg-white border-2 shadow-lg min-w-[180px] max-w-[280px] ${
      selected ? 'border-amber-500 ring-2 ring-amber-200' : 'border-amber-200'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-amber-500 border-2 border-white"
      />
      
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <GitBranch className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-neutral-800">{data.label || 'Condition'}</p>
          {condition && (
            <p className="text-xs text-neutral-500 mt-1">
              If <span className="text-amber-600 font-medium">{condition.variable}</span>{' '}
              {condition.operator?.replace('_', ' ')}{' '}
              <span className="text-amber-600 font-medium">"{condition.value}"</span>
            </p>
          )}
        </div>
      </div>
      
      {/* Two output handles - Yes and No */}
      <div className="flex justify-between mt-3 pt-3 border-t border-amber-100">
        <div className="flex flex-col items-center">
          <span className="text-xs text-green-600 font-medium mb-1">Yes</span>
          <Handle
            type="source"
            position={Position.Bottom}
            id="yes"
            className="!relative !transform-none w-3 h-3 bg-green-500 border-2 border-white"
            style={{ left: 'auto', bottom: 'auto' }}
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-red-600 font-medium mb-1">No</span>
          <Handle
            type="source"
            position={Position.Bottom}
            id="no"
            className="!relative !transform-none w-3 h-3 bg-red-500 border-2 border-white"
            style={{ left: 'auto', bottom: 'auto' }}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(ConditionNode)
