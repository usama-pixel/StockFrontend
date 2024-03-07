'use client'
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles/line-chart.module.scss';
import * as d3 from 'd3';

type propType = {
  data: number[] | undefined;
  horizontalLabels: string[];
  verticalLabels?: string[];
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
};

function LineChart({
    data,
    horizontalLabels,
    verticalLabels,
    width = 640,
    height = 400,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 40, 
    marginLeft = 40,
  }: propType) {
    if(!data) return;
  const svgRef = useRef(null);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    value: number;
  } | null>(null)
  const x = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([marginLeft, width - marginRight]);
  let y 
  const total = data.reduce((t: number, n: number) => t+n)
  if(total === 0) {
    y = d3
    .scaleLinear()
    .domain((d3.extent([0, 100]) as unknown) as [number, number])
    .range([height - marginBottom, marginTop])  
  } else {
    y = d3
      .scaleLinear()
      .domain((d3.extent(data) as unknown) as [number, number])
      .range([height - marginBottom, marginTop])
  }
  const line = d3.line<number>().x((d, i) => x(i)).y(y);

  const handleMouseOver = (xValue: number, yValue: number, value: number) => {
    setTooltipData({ x: xValue, y: yValue, value: value });
  };

  const handleMouseOut = () => {
    setTooltipData(null);
  };

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
  
    // Create the <path> element if it doesn't exist
    const p = d3.select('.path')
    if(p.node() === null) {
      svg.append('path')
      .attr('fill', 'none')
      .attr('class', 'path')
    }
    svg.select(".path")
      .datum(data)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-width", 1.5)
      .transition()
      .duration(2000)
      .attr("d", line)
  }, [data, height, line, width]);
  // console.log({horizontalLabels})
  return (
    <div>
      {tooltipData && (
        <div
          className="tooltip shadow-lg bg-white dark:bg-gray-800 dark:text-white"
          style={{
            position: 'absolute',
            left: tooltipData.x + 250,
            top: tooltipData.y + 140, // Adjust this value to position the tooltip properly
            padding: 10,
            borderRadius: 10
          }}
        >
          {tooltipData.value}
        </div>
      )}
      <svg ref={svgRef}>
         <g fill="currentColor" fontSize="12" textAnchor="middle">
           {/* Horizontal labels */}
           {horizontalLabels && horizontalLabels?.map((d, i) => (
             <text key={`label-x-${i}`} x={x(i) || 0} y={height - marginBottom + 20}>
               {d}
             </text>
           ))}

           {/* Vertical labels */}
           {y.ticks().map((tick) => (
             <text key={`label-y-${tick}`} x={marginLeft - 10} y={y(tick) || 0}>
               {tick}
             </text>
           ))}
         </g>
         <g fill="currentColor" stroke="currentColor" strokeWidth="3">
          {data.map((d, i) => (
            <circle
              key={i}
              cx={x(i) || 0}
              cy={y(d) || 0}
              className={`${styles.circle}`}
              onMouseOver={() => handleMouseOver(x(i) || 0, y(d) || 0, d)}
              onMouseOut={handleMouseOut}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default LineChart
