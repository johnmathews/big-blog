import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

import siteMetadata from '@/data/siteMetadata'
const dateTemplate = { year: 'numeric', month: 'short', day: 'numeric' }
const dateTemplateXAxis = { year: 'numeric', month: 'short', day: 'numeric' }

const colorArray = [
  '#FF6633',
  '#FFB399',
  '#FF33FF',
  '#FFFF99',
  '#00B3E6',
  '#E6B333',
  '#3366E6',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#FF1A66',
  '#E6331A',
  '#33FFCC',
  '#66994D',
  '#B366CC',
  '#4D8000',
  '#B33300',
  '#CC80CC',
  '#66664D',
  '#991AFF',
  '#E666FF',
  '#4DB3FF',
  '#1AB399',
  '#E666B3',
  '#33991A',
  '#CC9999',
  '#B3B31A',
  '#00E680',
  '#4D8066',
  '#809980',
  '#E6FF80',
  '#1AFF33',
  '#999933',
  '#FF3380',
  '#CCCC00',
  '#66E64D',
  '#4D80CC',
  '#9900B3',
  '#E64D66',
  '#4DB380',
  '#FF4D4D',
  '#99E6E6',
  '#6666FF',
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const date = new Date(label)
    const formattedDate = date.toLocaleDateString(siteMetadata.locale, dateTemplate)
    return (
      <div className="custom-tooltip border-2 bg-blue-600 p-3 text-gray-100">
        <p className="date font-bold">{`${formattedDate}`}</p>
        {payload.map((p) => {
          if (p.value == 0) {
            return null
          } else {
            return <p key={p.dataKey}>{`${p.dataKey}: ${p.value}`}</p>
          }
        })}
      </div>
    )
  }

  return null
}

// https://recharts.org/en-US/guide/getting-started
export default function UserInteractions({ data }) {
  data.map((d) => {
    const date = new Date(d.date)
    d.date = date.toLocaleDateString(siteMetadata.locale, dateTemplateXAxis)
  })

  const uniqueKeys = new Set()
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      uniqueKeys.add(key)
    })
  })

  const keysToPlot = Array.from(uniqueKeys).filter((key) => key !== 'date' && key !== 'index')

  return (
    <div
      id="userInteractionsEachDay"
      className="min-h-32  col-span-3 border-2 border-slate-800 p-3 dark:border-slate-500"
    >
      <div className="mb-2">User Interactions</div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" reverses="true" />
          <YAxis orientation="right" />
          <Tooltip content={<CustomTooltip />} />
          {keysToPlot.map((key, index) => (
            <Bar key={key} dataKey={key} fill={colorArray[index % colorArray.length]} stackId="1" />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
