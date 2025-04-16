"use client";  

import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function ShopPriceFilter({ min, max }: { min: number; max: number }) {
  const [range, setRange] = useState([min, max]);

  return (
    <div >
      <Slider
        range
        min={min}
        max={max}
        step={5}
        value={range}
        onChange={(value) => setRange(Array.isArray(value) ? value : [value])}
        trackStyle={[{ backgroundColor: "#000000" }]}
        handleStyle={[
          { borderColor: "#000000" },
          { borderColor: "#000000" },
        ]}
      />
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>Min: ${range[0]}</span>
        <span>Max: ${range[1]}</span>
      </div>
      <button className="mt-3 w-full bg-black text-white py-1 rounded">
        Apply
      </button>
    </div>
  );
}
