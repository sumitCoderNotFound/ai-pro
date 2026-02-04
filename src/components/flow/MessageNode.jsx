import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { MessageSquare } from 'lucide-react'

const MessageNode = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 rounded-xl bg-white border-2 shadow-lg min-w-[180px] max-w-[280px] ${
      selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-blue-200'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-neutral-800">{data.label || 'Message'}</p>
          {data.content && (
            <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{data.content}</p>
          )}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </div>
  )
}

export default memo(MessageNode)
