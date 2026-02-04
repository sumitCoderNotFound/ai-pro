import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Play } from 'lucide-react'

const StartNode = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg min-w-[140px] ${
      selected ? 'ring-2 ring-green-300 ring-offset-2' : ''
    }`}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <Play className="w-4 h-4" />
        </div>
        <div>
          <p className="font-semibold text-sm">{data.label || 'Start'}</p>
          <p className="text-xs text-green-100">Entry point</p>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-300 border-2 border-white"
      />
    </div>
  )
}

export default memo(StartNode)
