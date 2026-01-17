"use client"
import { a, useSpring } from '@react-spring/three'
import { Html, PointMaterial, Points } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

// Centralized configuration for easy tuning
const CONFIG = {
    pointCount: 30000,
    pointSize: 0.035,
    radiusExponent: 1.1,
    maxRadius: 10,
    spin: 1.5,
    lateralFactor: 0.2,
    verticalFactor: 0.2,
    // project placement
    baseProjectRadius: 0.7,
    projectRadiusStep: 0.3,
    projectSizeBase: 0.10,
    projectSizeMinMultiplier: 0.85,
    projectSizeRange: 0.6,
    // camera + motion
    cameraZ: 6,
    cameraY: 3.5,
    cameraX: 6,
    rotationSpeedY: 0.03,
    rotationOscillationPeriod: 8000,
    rotationXAmplitude: 0.02,
    hoverScale: 1.25,
}

const POINT_COUNT = CONFIG.pointCount

export const projects : ProjectDetails[] = [
    {   
        name: 'State Space Mapper',
        description: "A state space prediction framework in C++, to model and predict unknown state-spaces. Supports cylindrical, stochastic, discontinuous and n-dimensional state spaces. Utilises Kriging, Bilinear, RBF and Ensemble methods with underlying KD-Trees to efficiently query and interpolate across state spaces.  Built a performance testing library to detect performance of various models using GoogleTest, CMake and Python.",
        photos: ['SEP.jpeg'],
        link: 'www.github.com/david6544/SEP25',
        techStack: ['C++', 'Python', 'Cmake'],
    },
    {   
        name: 'CSX',
        description: 'A simulated stock exchange a lock-free limit order book, rpc server for client api integration and internal websocket wrappers for price updates to front-end. Currently working on creating a fleshed out front-end and adding more order types as well as self-hosting the server for testing.',
        link: 'www.github.com/david6544/CSX',
        techStack: ['C++', 'Svelte', 'Cmake'],
    },
    {   
        name: 'PdfWordRunner',
        description: 'A simple PDF reader that displays each word in sequence using Rapid Serial Visual Presentation (RSVP).',
        photos: ['wordRunner.png'],
        link: 'www.github.com/david6544/pdfWordRunner',
        techStack: ['Python'],
    },
    {   
        name: 'SpotlightChat',
        description: 'A wrapper for Mac foundational models to handle offline LLM queries on MacOS26',
        link: 'www.github.com/david6544/SpotlightChat',
        techStack: ['Swift'],
    },
    {   
        name: 'Rave',
        description: 'A social media management website for university societies and clubs',
        photos: ['RaveCalendar.png', 'RaveClub.png'],
        link: 'www.github.com/david6544/Rave',
        techStack: ['Vue'],
    },
    {   
        name: 'Realm of Critters',
        description: 'A C++ game utilizing SFML library. The player controls a character which must dodge and survive waves of enemies to survive as long as possible',
        photos: [''],
        link: 'www.github.com/CuinnKemp/Realm-of-Critters',
        techStack: ['C++', 'SFML'],
    },
]

export type ProjectDetails = {
    name: string,
    description: string,
    link: string,
    photos?: string[],
    techStack?: string[],
}


export default function ProjectOrbit({ onSelect }: { onSelect?: (idx: number) => void } = {}) {
    const group = useRef<THREE.Group | null>(null)

    const { positions, colors } = useMemo(() => {
        const positions = new Float32Array(POINT_COUNT * 3)
        const colors = new Float32Array(POINT_COUNT * 3)

        const armCount = Math.max(2, projects.length)

        for (let i = 0; i < POINT_COUNT; i++) {
            const i3 = i * 3

            // assign to an arm so clusters represent projects
            const arm = i % armCount

            // radius distribution (more points near center) — slightly flatter to reduce extreme clustering
            const radius = Math.pow(Math.random(), CONFIG.radiusExponent) * CONFIG.maxRadius

            // spin and branch offset create the spiral
            const spin = CONFIG.spin
            const branch = (arm / armCount) * Math.PI * 2

            // lateral randomness orthogonal to the spiral path, tapered by radius
            const lateralX = (Math.random() - 0.5) * CONFIG.lateralFactor * (1 - radius / CONFIG.maxRadius)
            const lateralZ = (Math.random() - 0.5) * CONFIG.lateralFactor * (1 - radius / CONFIG.maxRadius)
            const randomY = (Math.random() - 0.5) * CONFIG.verticalFactor * (1 - radius / CONFIG.maxRadius)
            // remove jitter from the angle so arms keep consistent curvature
            const angle = radius * spin + branch

            positions[i3 + 0] = Math.cos(angle) * radius + lateralX
            positions[i3 + 1] = randomY
            positions[i3 + 2] = Math.sin(angle) * radius + lateralZ

            colors[i3 + 0] = 255// base[0] * shade
            colors[i3 + 1] = 255 //base[1] * shade
            colors[i3 + 2] = 255 //base[2] * shade
        }

        return { positions, colors }
    }, [])

    // compute one position per project along the spiral arms
    const { projectPositions, projectBaseColors, projectSizes } = useMemo(() => {
        const projectPositions = new Array(projects.length).fill(0).map(() => new THREE.Vector3())
        const projectBaseColors = [] as [number, number, number][]
        const projectSizes: number[] = []

        const armCount = Math.max(2, projects.length)
        const palette = [
            [0.8, 0.6, 1.0],
            [0.6, 0.8, 1.0],
            [1.0, 0.75, 0.5],
            [0.5, 1.0, 0.75],
        ]

        for (let i = 0; i < projects.length; i++) {
            const arm = i % armCount
            // smaller radii so project spheres sit closer to the center
            const radius = CONFIG.baseProjectRadius + i * CONFIG.projectRadiusStep
            const spin = 1.5
            const branch = (arm / armCount) * Math.PI * 2
            const angle = radius * spin + branch
            const x = Math.cos(angle) * radius
            const y = (Math.random() - 0.5) * 0.3
            const z = Math.sin(angle) * radius
            projectPositions[i].set(x, y, z)
            projectBaseColors.push([1, 1, 1])
            // Slightly vary project sphere sizes to give visual variety
            const sizeMultiplier = CONFIG.projectSizeMinMultiplier + Math.random() * CONFIG.projectSizeRange
            projectSizes.push(sizeMultiplier)
        }

        return { projectPositions, projectBaseColors, projectSizes }
    }, [])

    const [hovered, setHovered] = useState<number | null>(null)

    function ProjectSphere({ pos, base, label, idx, size }: { pos: THREE.Vector3, base: [number, number, number], label: string, idx: number, size: number }) {
        const [localHover, setLocalHover] = useState(false)
        const isHover = hovered === idx || localHover
        const baseRgb = `rgb(${Math.round(base[0] * 255)}, ${Math.round(base[1] * 255)}, ${Math.round(base[2] * 255)})`
        const hoverRgb = `rgb(${Math.round(1.0 * 255)}, ${Math.round(0.92 * 255)}, ${Math.round(0.6 * 255)})`
        const { scale, col } = useSpring({
            scale: isHover ? 1.25 : 1,
            col: isHover ? hoverRgb : baseRgb,
            config: { mass: 1, tension: 170, friction: 26 }
        })

        const geometry = useMemo(() => {
            let geom = new THREE.SphereGeometry(size, 24, 12) as THREE.BufferGeometry
            if ((geom as any).toNonIndexed) geom = (geom as any).toNonIndexed()
            const posAttr = geom.attributes.position as THREE.BufferAttribute
            const count = posAttr.count
            const colors = new Float32Array(count * 3)
            for (let i = 0; i < count; i++) {
                colors[i * 3 + 0] = base[0]
                colors[i * 3 + 1] = base[1]
                colors[i * 3 + 2] = base[2]
            }
            geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
            return geom
        }, [base, size])

        return (
                <a.mesh
                position={pos}
                scale={scale.to(s => [s, s, s])}
                geometry={geometry}
                    onPointerOver={(e) => { e.stopPropagation(); setHovered(idx); setLocalHover(true); document.body.style.cursor = 'pointer' }}
                    onPointerOut={(e) => { e.stopPropagation(); setLocalHover(false); setHovered(null); document.body.style.cursor = 'default' }}
                    onPointerDown={(e) => { e.stopPropagation(); onSelect?.(idx) }}
                castShadow={false}
            >
                <a.meshStandardMaterial 
                vertexColors={true} 
                color={"white"}
                emissive={isHover ? new THREE.Color(255, 255, 102) : new THREE.Color(255,255,255)}
                metalness={0.15}
                roughness={0.45}
                />
                {isHover && (
                    <Html distanceFactor={9} position={[0, 0.4, 0]} center>
                        <div style={{ padding: '6px 10px', background: 'rgba(10,10,15,0.9)', color: 'white', borderRadius: 6, fontSize: 24, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                            {label}
                        </div>
                    </Html>
                )}
            </a.mesh>
        )
    }

    useFrame((_, delta) => {
        if (!group.current) return
        // slow rotation for orbit effect
        group.current.rotation.y += delta * CONFIG.rotationSpeedY
        group.current.rotation.x = Math.sin(performance.now() / CONFIG.rotationOscillationPeriod) * CONFIG.rotationXAmplitude
    })

    // Move camera back when the projects galaxy mounts, restore on unmount
    // Center the camera while this starfield is mounted, restore on unmount
      const { camera } = useThree()
      useEffect(() => {
        const prevPos = camera.position.clone()
        const prevQuat = camera.quaternion.clone()
        // place camera slightly away from origin so points are visible and not clipped
        camera.position.set(CONFIG.cameraX, CONFIG.cameraY, CONFIG.cameraZ);
        camera.lookAt(new THREE.Vector3(0, 0, 0))
        return () => {
          camera.position.copy(prevPos)
          camera.quaternion.copy(prevQuat)
        }
      }, [camera])
    

    return (
        <group ref={group}>
            <Points positions={positions} colors={colors} stride={3} frustumCulled>
                    <PointMaterial
                        vertexColors
                        size={CONFIG.pointSize}
                        sizeAttenuation={true}
                        transparent={true}
                        opacity={0.9}
                        depthWrite={false}
                    />
            </Points>
            {projectPositions.map((pos, idx) => (
                // baseSize modulated by projectSizes
                <ProjectSphere key={projects[idx].name} pos={pos} base={projectBaseColors[idx]} label={projects[idx].name} idx={idx} size={CONFIG.projectSizeBase * projectSizes[idx]} />
            ))}
        </group>
    )
}