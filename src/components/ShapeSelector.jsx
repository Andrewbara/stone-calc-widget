const ShapeSelector = ({ shapes, onSelect }) => {
    return (
      <div className="flex gap-4 mb-6">
        {shapes.map(shape => (
          <div
            key={shape.id}
            className="cursor-pointer hover:scale-105 transition"
            onClick={() => onSelect(shape)}
          >
            <img src={shape.base_image} alt={shape.name} className="w-20 h-20 object-contain border" />
            <p className="text-center mt-1 text-sm">{shape.name}</p>
          </div>
        ))}
      </div>
    )
  }
  
  export default ShapeSelector
  
