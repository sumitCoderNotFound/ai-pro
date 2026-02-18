import { useState } from 'react'
import { 
  X, 
  Search, 
  FileText, 
  GraduationCap, 
  Hotel, 
  HeadphonesIcon, 
  Target, 
  Calendar,
  ChevronRight,
  Sparkles,
  Check
} from 'lucide-react'
import { flowTemplates, templateCategories } from '../../data/flowTemplates'

const categoryIcons = {
  'all': FileText,
  'Education': GraduationCap,
  'Hospitality': Hotel,
  'Support': HeadphonesIcon,
  'Sales': Target,
  'General': Calendar
}

const FlowTemplatesModal = ({ isOpen, onClose, onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  if (!isOpen) return null

  // Filter templates
  const filteredTemplates = flowTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleUseTemplate = (template) => {
    onSelectTemplate(template)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-4 md:inset-10 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-gradient-to-r from-primary-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Flow Templates</h2>
              <p className="text-sm text-neutral-500">Choose a template to get started quickly</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Categories */}
          <div className="w-56 border-r border-neutral-200 bg-neutral-50 p-4 flex flex-col">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              {templateCategories.map(category => {
                const Icon = categoryIcons[category.id] || FileText
                const count = category.id === 'all' 
                  ? flowTemplates.length 
                  : flowTemplates.filter(t => t.category === category.id).length

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                      selectedCategory === category.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-primary-200 text-primary-700'
                        : 'bg-neutral-200 text-neutral-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main - Templates Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            {filteredTemplates.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                <Search className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">No templates found</p>
                <p className="text-sm">Try adjusting your search or category filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map(template => (
                  <div
                    key={template.id}
                    className={`group relative bg-white border-2 rounded-xl overflow-hidden transition-all cursor-pointer hover:shadow-lg ${
                      selectedTemplate?.id === template.id
                        ? 'border-primary-500 shadow-lg shadow-primary-100'
                        : 'border-neutral-200 hover:border-primary-300'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    {/* Template Header */}
                    <div className={`h-24 bg-gradient-to-br ${template.color} p-4 flex items-end`}>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{template.icon}</span>
                        <div>
                          <h3 className="font-bold text-white text-lg leading-tight">{template.name}</h3>
                          <span className="text-white/80 text-xs">{template.nodes.length} nodes</span>
                        </div>
                      </div>
                    </div>

                    {/* Template Body */}
                    <div className="p-4">
                      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                        {template.description}
                      </p>

                      {/* Node Preview */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {['message', 'question', 'condition', 'action'].map(type => {
                          const count = template.nodes.filter(n => n.type === type).length
                          if (count === 0) return null
                          
                          const colors = {
                            message: 'bg-blue-100 text-blue-700',
                            question: 'bg-amber-100 text-amber-700',
                            condition: 'bg-pink-100 text-pink-700',
                            action: 'bg-purple-100 text-purple-700'
                          }
                          
                          return (
                            <span 
                              key={type}
                              className={`px-2 py-0.5 rounded text-xs font-medium ${colors[type]}`}
                            >
                              {count} {type}
                            </span>
                          )
                        })}
                      </div>

                      {/* Use Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUseTemplate(template)
                        }}
                        className={`w-full py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                          selectedTemplate?.id === template.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-primary-500 hover:text-white'
                        }`}
                      >
                        {selectedTemplate?.id === template.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            Selected
                          </>
                        ) : (
                          <>
                            Use Template
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Selected Indicator */}
                    {selectedTemplate?.id === template.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview Panel (when template selected) */}
          {selectedTemplate && (
            <div className="w-80 border-l border-neutral-200 bg-neutral-50 p-4 overflow-y-auto">
              <h3 className="font-bold text-neutral-900 mb-4">Template Preview</h3>
              
              {/* Flow Preview */}
              <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-4">
                <div className="space-y-2">
                  {selectedTemplate.nodes.slice(0, 8).map((node, index) => (
                    <div 
                      key={node.id}
                      className="flex items-center gap-2"
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white ${
                        node.type === 'start' ? 'bg-green-500' :
                        node.type === 'end' ? 'bg-red-500' :
                        node.type === 'message' ? 'bg-blue-500' :
                        node.type === 'question' ? 'bg-amber-500' :
                        node.type === 'condition' ? 'bg-pink-500' :
                        'bg-purple-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 text-sm text-neutral-600 truncate">
                        {node.data.label || node.type}
                      </div>
                    </div>
                  ))}
                  {selectedTemplate.nodes.length > 8 && (
                    <div className="text-xs text-neutral-400 pl-8">
                      +{selectedTemplate.nodes.length - 8} more nodes...
                    </div>
                  )}
                </div>
              </div>

              {/* Template Info */}
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-neutral-400 uppercase">Category</span>
                  <p className="text-sm font-medium text-neutral-700">{selectedTemplate.category}</p>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 uppercase">Total Nodes</span>
                  <p className="text-sm font-medium text-neutral-700">{selectedTemplate.nodes.length} nodes</p>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 uppercase">Connections</span>
                  <p className="text-sm font-medium text-neutral-700">{selectedTemplate.edges.length} edges</p>
                </div>
              </div>

              {/* Use Button */}
              <button
                onClick={() => handleUseTemplate(selectedTemplate)}
                className="w-full mt-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Use This Template
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FlowTemplatesModal