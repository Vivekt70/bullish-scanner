import React from "react";
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function RenkoChart({ bricks }) {
  if (!bricks || bricks.length === 0) return <div>No Renko data</div>;

  const data = bricks.map((b, i) => ({
    idx: i + 1,
    close: b.close,
    dir: b.dir,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={data}>
        <XAxis dataKey="idx" hide />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="close"
          fill="#22c55e"
          barSize={15}
          shape={(props) => {
            const { x, y, width, height, payload } = props;
            return (
              <rect
                x={x}
                y={y}
                width={width}
                height={15}
                fill={payload.dir === "up" ? "#22c55e" : "#ef4444"}
                rx={2}
              />
            );
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
