"use client"

import type { SpringValue } from '@react-spring/three'
import { animated } from '@react-spring/three'
import { PointMaterial, Points } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const AnimatedPoints = animated(Points)
const AnimatedPointMaterial = animated(PointMaterial)

export default function StarField({
  count = 20000,
  radius = 1,
  opacity = 1,
}: {
  count?: number
  radius?: number
  opacity?: number | SpringValue<number>
  speed?: number
}) {
  const ref = useRef<THREE.Points>(null!)

  // distribute points randomly inside a cube centered on origin
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      arr[i3 + 0] = (Math.random() * 2 - 1) * radius
      arr[i3 + 1] = (Math.random() * 2 - 1) * radius
      arr[i3 + 2] = (Math.random() * 2 - 1) * radius
    }
    return arr
  }, [count, radius])

  const colors = useMemo(() => {
    const c = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) c[i] = 255;
    return c
  }, [count])

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.08
    ref.current.rotation.x += delta * 0.01
  })

  // Center the camera while this starfield is mounted, restore on unmount
  const { camera } = useThree()
  useEffect(() => {
    const prevPos = camera.position.clone()
    const prevQuat = camera.quaternion.clone()
    // place camera slightly away from origin so points are visible and not clipped
    camera.position.set(0, 1, 0)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    return () => {
      camera.position.copy(prevPos)
      camera.quaternion.copy(prevQuat)
    }
  }, [camera])

  return (
    <AnimatedPoints ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <AnimatedPointMaterial
        transparent
        vertexColors
        size={0.006}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={opacity}
      />
      <bufferAttribute
        attach="geometry-attributes-color"
        count={colors.length / 3}
        array={colors}
        itemSize={3}
        args={[colors, 3]}
      />
    </AnimatedPoints>
  )
}
