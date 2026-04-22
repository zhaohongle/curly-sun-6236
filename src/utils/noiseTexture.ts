import * as THREE from 'three';

/**
 * 生成 256x256 FBM noise texture
 * 用于向 smoke shader 提供预计算的噪声数据
 */
export function createNoiseTexture(size: number = 256): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      // 归一化坐标
      const nx = x / size;
      const ny = y / size;
      // 使用简单 FBM 近似（实际噪声在 shader 中运行）
      const v = Math.floor(
        (0.5 +
          0.5 *
            (Math.sin(nx * 12.9898 + ny * 78.233) * 43758.5453) %
              1) *
          255,
      );
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  return texture;
}
