import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { StopCircle } from 'lucide-react'

const EndNode = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg min-w-[140px] ${
      selected ? 'ring-2 ring-red-300 ring-offset-2' : ''
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-red-300 border-2 border-white"
      />
      
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <StopCircle className="w-4 h-4" />
        </div>
        <div>
          <p className="font-semibold text-sm">{data.label || 'End'}</p>
          <p className="text-xs text-red-100">End conversation</p>
        </div>
      </div>
    </div>
  )
}

export default memo(EndNode)
