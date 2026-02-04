import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Zap, Webhook, Variable, PhoneForwarded, Mail, MessageSquare } from 'lucide-react'

const actionIcons = {
  webhook: Webhook,
  set_variable: Variable,
  transfer: PhoneForwarded,
  send_email: Mail,
  send_sms: MessageSquare,
}

const actionLabels = {
  webhook: 'Call Webhook',
  set_variable: 'Set Variable',
  transfer: 'Transfer Call',
  send_email: 'Send Email',
  send_sms: 'Send SMS',
}

const ActionNode = ({ data, selected }) => {
  const ActionIcon = actionIcons[data.action_type] || Zap
  const actionLabel = actionLabels[data.action_type] || 'Action'
  
  return (
    <div className={`px-4 py-3 rounded-xl bg-white border-2 shadow-lg min-w-[180px] max-w-[280px] ${
      selected ? 'border-orange-500 ring-2 ring-orange-200' : 'border-orange-200'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-orange-500 border-2 border-white"
      />
      
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <ActionIcon className="w-4 h-4 text-orange-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-neutral-800">{data.label || 'Action'}</p>
          <p className="text-xs text-orange-600 mt-1">{actionLabel}</p>
          {data.action_type === 'webhook' && data.action_config?.url && (
            <p className="text-xs text-neutral-500 mt-1 truncate">{data.action_config.url}</p>
          )}
          {data.action_type === 'set_variable' && data.action_config?.variable && (
            <p className="text-xs text-neutral-500 mt-1">
              {data.action_config.variable} = {data.action_config.value}
            </p>
          )}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-orange-500 border-2 border-white"
      />
    </div>
  )
}

export default memo(ActionNode)
