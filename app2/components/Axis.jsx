import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import styled from "styled-components";

const Axis = props => {
  const { size, pad, scale, tick, label, ori, visible } = props;

  const [smin, smax] = scale.range();

  const local = {
    bottom: {
      renderfun: d3.axisBottom,
      w: 2 * pad + smax,
      h: size,
      x: pad,
      y: size * 0.2,
      lx: pad + smax * 0.45,
      ly: size * 0.85
    },
    left: {
      renderfun: d3.axisLeft,
      w: size,
      h: 2 * pad + smax,
      x: size * 0.9,
      y: pad,
      lx: size * 0.05,
      ly: (2 * pad + smax) * 0.95
    }
  };

  const svg = useRef(null);
  const g = useRef(null);

  const TextLabel = styled.text.attrs({
    x: local[ori].lx,
    y: local[ori].ly
  })`
    font-family: sans-serif;
    font-size: 10px;
  `;

  useEffect(() => {
    let axis =
      tick === "default"
        ? local[ori].renderfun(scale)
        : local[ori].renderfun(scale).ticks(tick);

    axis.tickValues(
      ((t, [min, max]) => {
        t.splice(0, 1, min);
        t.reverse();
        t.splice(0, 1, max);
        t.reverse();
        return t;
      })(scale.ticks(), scale.domain())
    );

    d3.select(g.current)
      .transition()
      .attr("transform", `translate(${local[ori].x},${local[ori].y})`)
      .call(axis);
  }, [props]);

  return (
    <div>
      <svg ref={svg} width={local[ori].w} height={local[ori].h}>
        {visible && (
          <g>
            <g ref={g}></g>
            <TextLabel>{label}</TextLabel>
          </g>
        )}
      </svg>
    </div>
  );
};

export default Axis;
