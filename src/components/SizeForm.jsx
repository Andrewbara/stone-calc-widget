import React, { useState } from "react";

const EDGE_RADIUS_COST = 2000;

const THICKNESS_OPTIONS = [12, 20, 24, 30, 36, 40, 50, 60, 70, 80, 90, 100];

const ShapeOption = ({ shape, selected, onClick }) => (
  <div
    onClick={() => onClick(shape)}
    className={`p-2 border rounded cursor-pointer ${
      selected === shape ? "border-blue-500" : "border-gray-300"
    }`}
  >
    {shape}
  </div>
);

const SizeForm = () => {
  const [shape, setShape] = useState("Прямая");
  const [width, setWidth] = useState(600);
  const [length, setLength] = useState(1000);
  const [thickness, setThickness] = useState(40);
  const [roundedCorners, setRoundedCorners] = useState({
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: false,
  });

  const toggleCorner = (corner) => {
    setRoundedCorners((prev) => ({
      ...prev,
      [corner]: !prev[corner],
    }));
  };

  const roundedCount = Object.values(roundedCorners).filter(Boolean).length;
  const roundedCost = roundedCount * EDGE_RADIUS_COST;

  return (
    <div className="bg-white p-6 rounded shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">1. Размер</h2>

      {/* Выбор формы */}
      <div className="mb-4">
        <p className="font-semibold mb-2">Форма изделия</p>
        <div className="flex space-x-2">
          {["Прямая", "Г-образная", "П-образная"].map((s) => (
            <ShapeOption key={s} shape={s} selected={shape} onClick={setShape} />
          ))}
        </div>
      </div>

      {/* Размеры */}
      <div className="mb-4 flex space-x-4">
        <div>
          <label className="block font-semibold">Длина (мм)</label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">Ширина (мм)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Скругления */}
      <div className="mb-4">
        <p className="font-semibold mb-2">Скругление углов</p>
        <div className="grid grid-cols-2 gap-4 w-48">
          {Object.entries(roundedCorners).map(([corner, isChecked]) => (
            <label key={corner} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleCorner(corner)}
              />
              <span>{corner}</span>
            </label>
          ))}
        </div>
        {roundedCount > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            Скругление углов: {roundedCount} шт. × 2000₽ ={" "}
            <span className="font-semibold">{roundedCost}₽</span>
          </p>
        )}
      </div>

      {/* Толщина */}
      <div>
        <label className="block font-semibold">Толщина (мм)</label>
        <select
          value={thickness}
          onChange={(e) => setThickness(Number(e.target.value))}
          className="border p-2 rounded w-full mt-1"
        >
          {THICKNESS_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t} см
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SizeForm;
