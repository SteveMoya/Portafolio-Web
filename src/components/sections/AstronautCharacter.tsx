import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface AstronautCharacterProps {
	onFormInteraction?: (type: 'focus' | 'input' | 'submit') => void
}

export const AstronautCharacter: React.FC<AstronautCharacterProps> = ({ onFormInteraction }) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const sceneRef = useRef<THREE.Scene | null>(null)
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
	const astronautRef = useRef<THREE.Group | null>(null)
	const headRef = useRef<THREE.Mesh | null>(null)
	const leftEyeRef = useRef<THREE.Mesh | null>(null)
	const rightEyeRef = useRef<THREE.Mesh | null>(null)
	const [isReacting, setIsReacting] = useState(false)

	useEffect(() => {
		if (!containerRef.current) return

		// Scene setup
		const scene = new THREE.Scene()
		scene.background = new THREE.Color(0xfafaf8)
		sceneRef.current = scene

		// Camera
		const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000)
		camera.position.z = 3

		// Renderer
		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
		renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
		renderer.setPixelRatio(window.devicePixelRatio)
		containerRef.current.appendChild(renderer.domElement)
		rendererRef.current = renderer

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
		scene.add(ambientLight)

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
		directionalLight.position.set(5, 5, 5)
		scene.add(directionalLight)

		// Create astronaut
		const astronaut = new THREE.Group()
		scene.add(astronaut)
		astronautRef.current = astronaut

		// Body
		const bodyGeometry = new THREE.CapsuleGeometry(0.35, 1.2, 8, 16)
		const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.7 })
		const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
		body.position.y = -0.2
		astronaut.add(body)

		// Legs
		const legGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.15)
		const legMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.2, roughness: 0.8 })

		const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
		leftLeg.position.set(-0.15, -0.9, 0)
		astronaut.add(leftLeg)

		const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
		rightLeg.position.set(0.15, -0.9, 0)
		astronaut.add(rightLeg)

		// Arms
		const armGeometry = new THREE.BoxGeometry(0.1, 0.9, 0.1)
		const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.7 })

		const leftArm = new THREE.Mesh(armGeometry, armMaterial)
		leftArm.position.set(-0.5, 0.3, 0)
		astronaut.add(leftArm)

		const rightArm = new THREE.Mesh(armGeometry, armMaterial)
		rightArm.position.set(0.5, 0.3, 0)
		astronaut.add(rightArm)

		// Head
		const headGeometry = new THREE.SphereGeometry(0.45, 32, 32)
		const headMaterial = new THREE.MeshStandardMaterial({ color: 0xc7c7c7, metalness: 0.5, roughness: 0.4 })
		const head = new THREE.Mesh(headGeometry, headMaterial)
		head.position.y = 1.1
		astronaut.add(head)
		headRef.current = head

		// Visor glass
		const visorGeometry = new THREE.SphereGeometry(0.42, 32, 32)
		const visorMaterial = new THREE.MeshStandardMaterial({
			color: 0x4a9eff,
			metalness: 0.8,
			roughness: 0.1,
			transparent: true,
			opacity: 0.4,
		})
		const visor = new THREE.Mesh(visorGeometry, visorMaterial)
		visor.position.y = 1.1
		visor.scale.set(1.05, 1.05, 0.8)
		astronaut.add(visor)

		// Eyes (visible through visor)
		const eyeGeometry = new THREE.SphereGeometry(0.12, 16, 16)
		const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })

		const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
		leftEye.position.set(-0.15, 1.2, 0.35)
		astronaut.add(leftEye)
		leftEyeRef.current = leftEye

		const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
		rightEye.position.set(0.15, 1.2, 0.35)
		astronaut.add(rightEye)
		rightEyeRef.current = rightEye

		// Antenna
		const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8)
		const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500, metalness: 0.6 })
		const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial)
		antenna.position.set(0, 1.7, 0)
		astronaut.add(antenna)

		// Animation loop
		let animationId: number
		let time = 0
		let reactionProgress = 0

		const animate = () => {
			animationId = requestAnimationFrame(animate)
			time += 0.016

			// Idle animation - gentle bob and rotation
			if (astronautRef.current) {
				astronautRef.current.position.y = Math.sin(time * 0.5) * 0.1
				astronautRef.current.rotation.y += 0.001
			}

			// Head tilt and eye look
			if (headRef.current) {
				headRef.current.rotation.z = Math.sin(time * 0.3) * 0.1
			}

			// Reaction animation
			if (isReacting && reactionProgress < 1) {
				reactionProgress += 0.05
				if (astronautRef.current) {
					astronautRef.current.scale.set(
						1 + Math.sin(reactionProgress * Math.PI) * 0.15,
						1 + Math.sin(reactionProgress * Math.PI) * 0.15,
						1
					)
				}
			} else if (!isReacting && reactionProgress > 0) {
				reactionProgress -= 0.05
				if (astronautRef.current) {
					astronautRef.current.scale.set(
						1 + Math.sin(reactionProgress * Math.PI) * 0.15,
						1 + Math.sin(reactionProgress * Math.PI) * 0.15,
						1
					)
				}
			}

			renderer.render(scene, camera)
		}

		animate()

		// Handle window resize
		const handleResize = () => {
			if (!containerRef.current) return
			const width = containerRef.current.clientWidth
			const height = containerRef.current.clientHeight
			camera.aspect = width / height
			camera.updateProjectionMatrix()
			renderer.setSize(width, height)
		}

		window.addEventListener('resize', handleResize)

		// Handle form interactions
		const formElement = document.getElementById('contact-form')
		if (formElement) {
			const inputElements = formElement.querySelectorAll('input, textarea')

			inputElements.forEach((el) => {
				el.addEventListener('focus', () => {
					setIsReacting(true)
					onFormInteraction?.('focus')
					setTimeout(() => setIsReacting(false), 800)
				})

				el.addEventListener('input', () => {
					setIsReacting(true)
					onFormInteraction?.('input')
				})
			})

			formElement.addEventListener('submit', () => {
				setIsReacting(true)
				onFormInteraction?.('submit')
			})
		}

		return () => {
			window.removeEventListener('resize', handleResize)
			if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
				containerRef.current.removeChild(renderer.domElement)
			}
			renderer.dispose()
			cancelAnimationFrame(animationId)
		}
	}, [onFormInteraction])

	return <div ref={containerRef} className="h-full w-full" style={{ minHeight: '400px' }} />
}
