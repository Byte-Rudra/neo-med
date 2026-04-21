import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 120
const CONNECTION_DISTANCE = 2.8
const BOUNDS = 8

function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const linesRef = useRef<THREE.LineSegments>(null!)

  const particles = useMemo(() => {
    const arr = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * BOUNDS * 2,
          (Math.random() - 0.5) * BOUNDS * 2,
          (Math.random() - 0.5) * BOUNDS
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.004
        ),
        scale: 0.03 + Math.random() * 0.04
      })
    }
    return arr
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const maxLines = PARTICLE_COUNT * PARTICLE_COUNT
    const positions = new Float32Array(maxLines * 6)
    const colors = new Float32Array(maxLines * 6)
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setDrawRange(0, 0)
    return geo
  }, [])

  useFrame(() => {
    if (!meshRef.current) return

    // Update particle positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i]
      p.position.add(p.velocity)

      // Boundary bounce
      if (Math.abs(p.position.x) > BOUNDS) p.velocity.x *= -1
      if (Math.abs(p.position.y) > BOUNDS) p.velocity.y *= -1
      if (Math.abs(p.position.z) > BOUNDS / 2) p.velocity.z *= -1

      dummy.position.copy(p.position)
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true

    // Update connections
    const posAttr = lineGeometry.getAttribute('position') as THREE.BufferAttribute
    const colAttr = lineGeometry.getAttribute('color') as THREE.BufferAttribute
    let lineIdx = 0

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dist = particles[i].position.distanceTo(particles[j].position)
        if (dist < CONNECTION_DISTANCE) {
          const alpha = 1 - dist / CONNECTION_DISTANCE

          posAttr.setXYZ(lineIdx * 2, particles[i].position.x, particles[i].position.y, particles[i].position.z)
          posAttr.setXYZ(lineIdx * 2 + 1, particles[j].position.x, particles[j].position.y, particles[j].position.z)

          // Blue-tinted connections matching primary color
          colAttr.setXYZ(lineIdx * 2, 0, 0.37 * alpha, 0.64 * alpha)
          colAttr.setXYZ(lineIdx * 2 + 1, 0, 0.37 * alpha, 0.64 * alpha)

          lineIdx++
          if (lineIdx >= PARTICLE_COUNT * PARTICLE_COUNT) break
        }
      }
      if (lineIdx >= PARTICLE_COUNT * PARTICLE_COUNT) break
    }

    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
    lineGeometry.setDrawRange(0, lineIdx * 2)
  })

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#a2c9ff" transparent opacity={0.7} />
      </instancedMesh>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.3} />
      </lineSegments>
    </>
  )
}

export default function NeuralBackground() {
  return (
    <div className="neural-canvas">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
    </div>
  )
}
