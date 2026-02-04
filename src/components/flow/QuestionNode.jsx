import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { HelpCircle } from 'lucide-react'

const QuestionNode = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 rounded-xl bg-white border-2 shadow-lg min-w-[180px] max-w-[280px] ${
      selected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-purple-200'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
      
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <HelpCircle className="w-4 h-4 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-neutral-800">{data.label || 'Question'}</p>
          {data.content && (
            <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{data.content}</p>
          )}
          {data.variable_name && (
            <p className="text-xs text-purple-600 mt-1">
              → ${'{' + data.variable_name + '}'}
            </p>
          )}
          {data.expected_type === 'choice' && data.choices?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.choices.slice(0, 3).map((choice, i) => (
                <span key={i} className="px-2 py-0.5 text-xs bg-purple-50 text-purple-600 rounded">
                  {choice}
                </span>
              ))}
              {data.choices.length > 3 && (
                <span className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-500 rounded">
                  +{data.choices.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
    </div>
  )
}

export default memo(QuestionNode)
