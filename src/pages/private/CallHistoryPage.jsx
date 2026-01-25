import { useState } from 'react'
import { Card, Button } from '@/components/ui'
import { 
  Search, 
  Filter, 
  Download,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Play,
  Clock,
  Calendar,
  ChevronRight,
  MoreVertical
} from 'lucide-react'

const CallHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCall, setSelectedCall] = useState(null)

  const calls = [
    {
      id: 1,
      type: 'inbound',
      from: '+1 (555) 123-4567',
      to: '+1 (888) 555-0001',
      agent: 'Admission Assistant',
      duration: '3:24',
      status: 'completed',
      date: '2026-01-25',
      time: '14:32',
      recording: true,
      transcript: true
    },
    {
      id: 2,
      type: 'outbound',
      from: '+1 (888) 555-0001',
      to: '+1 (555) 987-6543',
      agent: 'Lead Qualification',
      duration: '5:12',
      status: 'completed',
      date: '2026-01-25',
      time: '14:15',
      recording: true,
      transcript: true
    },
    {
      id: 3,
      type: 'inbound',
      from: '+1 (555) 456-7890',
      to: '+1 (888) 555-0001',
      agent: 'Support Bot',
      duration: '1:45',
      status: 'transferred',
      date: '2026-01-25',
      time: '13:58',
      recording: true,
      transcript: false
    },
    {
      id: 4,
      type: 'inbound',
      from: '+1 (555) 321-0987',
      to: '+1 (888) 555-0002',
      agent: 'Healthcare Check-In',
      duration: '2:08',
      status: 'completed',
      date: '2026-01-25',
      time: '13:45',
      recording: true,
      transcript: true
    },
    {
      id: 5,
      type: 'outbound',
      from: '+1 (888) 555-0001',
      to: '+1 (555) 654-3210',
      agent: 'Appointment Reminder',
      duration: '0:45',
      status: 'no-answer',
      date: '2026-01-25',
      time: '13:30',
      recording: false,
      transcript: false
    },
  ]

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      transferred: 'bg-amber-100 text-amber-700',
      'no-answer': 'bg-red-100 text-red-700',
      failed: 'bg-red-100 text-red-700'
    }
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-neutral-100 text-neutral-700'}`}>
        {status.replace('-', ' ')}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Call History</h1>
          <p className="text-neutral-500">View and analyze all voice conversations</p>
        </div>
        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by phone number or agent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
        <Button variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
          Date Range
        </Button>
        <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
          Filters
        </Button>
      </div>

      {/* Calls Table */}
      <Card padding="none">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Type</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">From / To</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Agent</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Duration</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date & Time</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {calls.map((call) => (
              <tr key={call.id} className="hover:bg-neutral-50 transition-colors cursor-pointer group">
                <td className="px-6 py-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    call.type === 'inbound' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {call.type === 'inbound' ? (
                      <PhoneIncoming className="w-4 h-4 text-blue-600" />
                    ) : (
                      <PhoneOutgoing className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-neutral-900">{call.from}</p>
                  <p className="text-sm text-neutral-500">→ {call.to}</p>
                </td>
                <td className="px-6 py-4 text-neutral-700">{call.agent}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <span className="text-neutral-700">{call.duration}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(call.status)}</td>
                <td className="px-6 py-4 text-neutral-500 text-sm">
                  {call.date} at {call.time}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {call.recording && (
                      <button className="p-2 hover:bg-neutral-100 rounded-lg" title="Play recording">
                        <Play className="w-4 h-4 text-neutral-500" />
                      </button>
                    )}
                    <button className="p-2 hover:bg-neutral-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-neutral-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">Showing 1-5 of 2,847 calls</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  )
}

export default CallHistoryPage
