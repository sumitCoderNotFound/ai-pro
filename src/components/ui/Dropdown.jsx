import { useState, useRef, useEffect } from 'react'

const Dropdown = ({ trigger, children, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={`absolute z-50 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {typeof children === 'function' ? children(() => setIsOpen(false)) : children}
        </div>
      )}
    </div>
  )
}

export const DropdownItem = ({ onClick, icon: Icon, children, variant = 'default' }) => {
  const variants = {
    default: 'text-neutral-700 hover:bg-neutral-50',
    danger: 'text-red-600 hover:bg-red-50'
  }

  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 ${variants[variant]}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  )
}

export default Dropdown