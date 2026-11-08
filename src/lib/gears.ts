/**
 * Spur-gear geometry and kinematics — pure math, no `three`, no DOM.
 *
 * The /experience hero is a train of three meshing gears. A mis-cut tooth is
 * the most visible defect a decorative scene can have (teeth crossing or
 * floating), so the profile, the centre distances and the assembly angles live
 * here and are verified numerically (`scratch/verify-gears.ts`) before any
 * geometry is rendered.
 *
 * Conventions, all in the gear's own local frame:
 * - tooth `k` is centred at angle `k * pitch`, so a rotation of `angle` puts it
 *   at `angle + k * pitch`;
 * - `alpha` is the direction from a gear's centre to the next one in the chain;
 * - every gear in a train shares one module, or nothing meshes.
 */

export interface GearSpec {
	id: string
	/** Tooth count. Two meshing gears of equal module meet when a + b is even. */
	teeth: number
	/** Module = pitch diameter / teeth. Identical across a train. */
	module: number
}

export interface PlacedGear {
	id: string
	teeth: number
	module: number
	/** Radius of the pitch circle: where the two gears touch. */
	pitchRadius: number
	/** Tip radius (pitch + addendum). */
	outerRadius: number
	/** Valley radius (pitch − dedendum). */
	rootRadius: number
	x: number
	y: number
	/** Direction from this gear's centre to the next one, in radians. */
	alpha: number
	/** Current rotation, resolved from the previous gear. */
	angle: number
}

/** Angular pitch: one tooth plus one valley. */
export const pitchAngle = (teeth: number): number => (Math.PI * 2) / teeth

/**
 * Lays a train out along a row or a column.
 *
 * Centre distance for a meshing pair is the sum of the pitch radii — that is
 * what makes the pitch circles tangent. Positions are then centred on the
 * origin so the caller can frame the whole train.
 */
export function placeTrain(
	specs: readonly GearSpec[],
	layout: 'row' | 'column' = 'row'
): PlacedGear[] {
	if (!specs.length) return []

	const module = specs[0].module
	const gears: PlacedGear[] = specs.map((spec) => {
		if (spec.module !== module) {
			throw new Error(`[gears] module mismatch: ${spec.id} is ${spec.module}, train is ${module}`)
		}
		const pitchRadius = (module * spec.teeth) / 2
		return {
			id: spec.id,
			teeth: spec.teeth,
			module,
			pitchRadius,
			outerRadius: pitchRadius + module,
			rootRadius: pitchRadius - 1.25 * module,
			x: 0,
			y: 0,
			alpha: 0,
			angle: 0
		}
	})

	// The chain runs along +x (row) or +y (column); each gear sits one centre
	// distance past the previous one.
	const step = layout === 'row' ? { dx: 1, dy: 0 } : { dx: 0, dy: 1 }
	const alpha = layout === 'row' ? 0 : Math.PI / 2

	for (let index = 0; index < gears.length; index += 1) {
		const gear = gears[index]
		gear.alpha = alpha
		if (index === 0) continue
		const previous = gears[index - 1]
		const distance = previous.pitchRadius + gear.pitchRadius
		gear.x = previous.x + step.dx * distance
		gear.y = previous.y + step.dy * distance
	}

	// Centre the train on the origin so `placeTrain` is position-independent.
	const minX = Math.min(...gears.map((gear) => gear.x - gear.outerRadius))
	const maxX = Math.max(...gears.map((gear) => gear.x + gear.outerRadius))
	const minY = Math.min(...gears.map((gear) => gear.y - gear.outerRadius))
	const maxY = Math.max(...gears.map((gear) => gear.y + gear.outerRadius))
	const cx = (minX + maxX) / 2
	const cy = (minY + maxY) / 2

	for (const gear of gears) {
		gear.x -= cx
		gear.y -= cy
	}

	resolveAngles(gears, 0)
	return gears
}

/**
 * Propagates a rotation through the train.
 *
 * For a meshing pair (i drives j) the tooth pattern of `i`, rolled onto `j`'s
 * pitch circle, has to land on `j`'s valleys. Rolling contact maps an angle
 * `s` from the line of centres on `i` to `-s * N_i / N_j` on `j`, which gives
 * the single assembly expression:
 *
 *   θ_j = α + π − (θ_i − α) · N_i / N_j − π / N_j
 *
 * It encodes the gear ratio *and* the phase at once, so the train stays meshed
 * at every angle instead of only at rest. `α` is the direction from `i` to `j`.
 */
export function resolveAngles(gears: PlacedGear[], driverAngle: number): PlacedGear[] {
	if (!gears.length) return gears
	gears[0].angle = driverAngle

	for (let index = 1; index < gears.length; index += 1) {
		const previous = gears[index - 1]
		const gear = gears[index]
		gear.angle =
			gear.alpha +
			Math.PI -
			(previous.angle - gear.alpha) * (previous.teeth / gear.teeth) -
			Math.PI / gear.teeth
	}

	return gears
}

/** Point on a circle, in the gear's local frame. */
const polar = (radius: number, angle: number): [number, number] => [
	radius * Math.cos(angle),
	radius * Math.sin(angle)
]

/**
 * The tooth outline as a closed polygon, in local coordinates.
 *
 * Not an involute: a stylised straight-flank tooth with a rounded tip. At this
 * scale (a hero background, teeth a few pixels wide) the involute would cost
 * dozens of points per tooth and look identical; what matters — and what the
 * verification checks — is that the flanks never cross a neighbour's.
 */
export function toothPolygon(gear: Pick<PlacedGear, 'teeth' | 'module' | 'pitchRadius' | 'outerRadius' | 'rootRadius'>): [number, number][] {
	const { teeth, pitchRadius, outerRadius, rootRadius } = gear
	const pitch = pitchAngle(teeth)
	const points: [number, number][] = []

	/** Fraction of a pitch, measured from the tooth's centre. */
	const shape: [number, number][] = [
		[-0.3, rootRadius],
		[-0.245, pitchRadius],
		[-0.175, (pitchRadius + outerRadius) / 2],
		[-0.125, outerRadius],
		[0.125, outerRadius],
		[0.175, (pitchRadius + outerRadius) / 2],
		[0.245, pitchRadius],
		[0.3, rootRadius]
	]

	for (let tooth = 0; tooth < teeth; tooth += 1) {
		const centre = tooth * pitch
		for (const [offset, radius] of shape) {
			points.push(polar(radius, centre + offset * pitch))
		}
		// Valley floor between this tooth and the next, sampled twice so the
		// extruded shape keeps a flat bottom instead of one long chord.
		const nextCentre = (tooth + 1) * pitch
		points.push(polar(rootRadius, centre + 0.5 * pitch))
		points.push(polar(rootRadius, nextCentre - 0.3 * pitch))
	}

	return points
}

/** Radii of the decorative parts, derived from the same module. */
export function gearRadii(gear: Pick<PlacedGear, 'pitchRadius' | 'rootRadius' | 'module'>) {
	const hubRadius = Math.max(gear.module * 1.8, gear.pitchRadius * 0.3)
	const rimInner = Math.max(hubRadius + gear.module * 1.2, gear.rootRadius * 0.8)
	return {
		hubRadius,
		boreRadius: Math.max(gear.module * 0.55, gear.pitchRadius * 0.12),
		rimInner,
		/** Web thickness between the hub and the rim, for the lightening holes. */
		web: rimInner - hubRadius
	}
}

/**
 * Lightening holes, as circles in local coordinates. Clock gears are full of
 * them; they also let the rim read as brass rather than as a solid disc.
 */
export function lighteningHoles(gear: Pick<PlacedGear, 'teeth' | 'module' | 'pitchRadius' | 'rootRadius'>, count = 5) {
	const { hubRadius, rimInner, web } = gearRadii(gear)
	if (web < gear.module * 1.6) return []

	const radius = web * 0.33
	const centre = (hubRadius + rimInner) / 2
	const holes: { x: number; y: number; r: number }[] = []

	for (let index = 0; index < count; index += 1) {
		const angle = (index / count) * Math.PI * 2
		holes.push({ x: centre * Math.cos(angle), y: centre * Math.sin(angle), r: radius })
	}

	return holes
}

/** Tests every pair by rolling contact; used only by the verification script. */
export function meshingPairs(gears: readonly PlacedGear[]): [PlacedGear, PlacedGear][] {
	const pairs: [PlacedGear, PlacedGear][] = []
	for (let index = 1; index < gears.length; index += 1) {
		pairs.push([gears[index - 1], gears[index]])
	}
	return pairs
}
