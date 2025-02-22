function floydWarshall(matrix) {
  const n = matrix.length;
  const dist = matrix.map((row) => row.slice());
  const nextNode = Array.from({ length: n }, () => Array(n).fill(null));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && dist[i][j] !== null) {
        nextNode[i][j] = j;
      }
    }
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          nextNode[i][j] = nextNode[i][k];
        }
      }
    }
  }

  return { dist, nextNode };
}

module.exports = floydWarshall;
