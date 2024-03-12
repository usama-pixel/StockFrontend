'use client'
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import styles from './styles/line-chart.module.scss';
import * as d3 from 'd3';

type propType = {
  data: number[] | undefined;
  horizontalLabels: string[];
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
};

function LineChart({
    data,
    horizontalLabels,
    height = 400,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 40, 
    marginLeft = 40,}: propType
  ) {
    if(!data) return;
    const [width, setWidth] = useState(window.innerWidth-140)
    const [lineWid, setLineWid] = useState(1)
    const svgRef = useRef(null);
    const [tooltipData, setTooltipData] = useState<{
      x: number;
      y: number;
      value: number;
    } | null>(null)
    const x = d3
      .scaleLinear()
      .domain([0, data.length+lineWid]) // here
      .range([marginLeft, width - marginRight]);
    let y: d3.ScaleLinear<number, number, never>
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

    const handleMouseOver = (xValue: number, yValue: number, value: number, e: any) => {
      setTooltipData({ x: e.clientX-154, y: e.clientY-70, value: value });
    };

    const handleMouseOut = () => {
      setTooltipData(null);
    };
    useEffect(() => {
      const handleResize = () => {
        setWidth(prev => {
          if(window.innerWidth >= 626)
            return window.innerWidth-150
          return prev
        })
      }
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [])
    // useEffect(() => {
    //   if (tooltipData) {
    //      const newX = x(tooltipData.x);
    //      const newY = y(tooltipData.y);
    //      setTooltipData({ ...tooltipData, x: newX, y: newY });
    //   }
    // }, [data, x, y]);
    useEffect(() => {
      if(width <= 626)
        setLineWid(3)
    }, [width])
    useEffect(() => {
      const svg = d3
        .select(svgRef.current)
        .attr('width', width-50) // here
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
      <div className='w-full'>
        {tooltipData && (
          <div
            className="tooltip shadow-lg bg-white dark:bg-gray-800 dark:text-white"
            style={{
              position: 'absolute',
              left: tooltipData.x +140,
              top: tooltipData.y, // Adjust this value to position the tooltip properly
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
                onMouseOver={(e) => handleMouseOver(x(i) || 0, y(d) || 0, d,e)}
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
