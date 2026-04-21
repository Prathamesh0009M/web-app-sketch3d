type Props = {
  onConvert: () => void;
  onClear: () => void;
};

export default function Controls({ onConvert, onClear }: Props) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <button onClick={onConvert}>Convert to 3D</button>
      <button onClick={onClear} style={{ marginLeft: "10px" }}>
        Clear
      </button>
    </div>
  );
}