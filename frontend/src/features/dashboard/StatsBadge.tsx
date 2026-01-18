import React from 'react'

interface StatsBadgeProps {
    title: string;
    value: number;
    icon: React.JSX.Element;
}

const StatsBadge = ({title, value, icon}: StatsBadgeProps) => {
  return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
            <div>
            <p className="text-sm font-medium text-gray-500">
                {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
                {value}
            </p>
            </div>
            <div className="bg-indigo-100 rounded-full p-3">
            {icon}
            </div>
        </div>
    </div>
  )
}

export default StatsBadge