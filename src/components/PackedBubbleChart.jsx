import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function getRadiusByRank(rank) {
  if (rank <= 3) return 90;
  if (rank <= 6) return 70;
  if (rank <= 9) return 55;
  if (rank <= 12) return 40;
  return 28;
}

function PackedBubbleChart({ data = [] }) {
  const svgRef = useRef();
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setNodes([]);
      return;
    }
    const width = 800, height = 800;
    const root = d3.hierarchy({ children: data }).sum(d => getRadiusByRank(d.rank) ** 2);
    d3.pack().size([width, height]).padding(2)(root);
    setNodes(root.descendants());
  }, [data]);

  // hover된 노드를 맨 뒤로 빼서 맨 위에 렌더링
  const orderedNodes = hoveredIdx !== null && nodes.length > 0
    ? [
        ...nodes.filter((_, i) => i !== hoveredIdx),
        nodes[hoveredIdx]
      ]
    : nodes;

  return (
    <svg ref={svgRef} width={800} height={800}>
      <defs>
        <linearGradient id="bubbleLinear" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6ac1" stopOpacity="1" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
        </linearGradient>
        <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.4" />
        </filter>
        <filter id="bubbleNeon" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#c084fc" flood-opacity="0.85" />
          <feDropShadow dx="0" dy="0" stdDeviation="16" flood-color="#a259f7" flood-opacity="0.5" />
          <feDropShadow dx="0" dy="0" stdDeviation="32" flood-color="#fff" flood-opacity="0.18" />
        </filter>
      </defs>
      {orderedNodes.map((d) => (
        <g
          key={d.data.keyword || d.data.name}
          transform={`translate(${d.x},${d.y}) scale(${hoveredIdx !== null && nodes[hoveredIdx] === d ? 1.12 : (hoveredIdx !== null && nodes.indexOf(d) === hoveredIdx && d.depth !== 0 ? 1.12 : 1)})`}
          style={{ transition: 'transform 0.2s', cursor: d.depth !== 0 ? 'pointer' : 'default' }}
          onMouseOver={() => d.depth !== 0 && setHoveredIdx(nodes.indexOf(d))}
          onMouseOut={() => setHoveredIdx(null)}
        >
          <circle
            r={d.depth !== 0 ? getRadiusByRank(d.data.rank) : 0}
            fill={d.depth === 0 ? "none" : "url(#bubbleLinear)"}
            opacity={d.depth === 0 ? 1 : 1}
            stroke="none"
            filter={d.depth !== 0 ? "url(#bubbleNeon)" : undefined}
          />
          {d.depth !== 0 && (
            <text
              textAnchor="middle"
              dy=".35em"
              filter="url(#textShadow)"
              style={{
                fontSize: Math.min(2 * getRadiusByRank(d.data.rank) / (d.data.keyword ? d.data.keyword.length : d.data.name.length), getRadiusByRank(d.data.rank) / 2.5),
                fill: "#fff",
                pointerEvents: "none",
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {d.data.keyword || d.data.name}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

export default PackedBubbleChart; 