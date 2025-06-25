const ResultContainerPlugin = (results) => {
  return (
    <div className="Result-container mt-4 border p-4 rounded bg-white shadow">
      <div className="Result-header font-bold mb-2">
        Scanned results ({results.length})
      </div>
      <div className="Result-section space-y-2">
        {results.map((result, index) => (
          <div key={index} className="border-b pb-1 text-sm">
            <div>
              <strong>Text:</strong> {result.decodedText}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultContainerPlugin;
