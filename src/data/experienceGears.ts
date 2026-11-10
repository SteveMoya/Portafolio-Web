/**
 * The /experience hero, as a gear train.
 *
 * One gear per stage of the career, in chronological order. Two decisions are
 * encoded rather than decorated:
 *
 * - **the tooth count is the time worked.** More months, more teeth, bigger
 *   gear. The proportions are read from `experiences`, not invented;
 * - **the train turns.** A meshing gear cannot stand still, so "completed" is
 *   said with things that are true: the period on the plate, a patinated
 *   finish, and the crank mounted on the stage that is still running.
 */
import { experiences } from './experiences'

/**
 * Durations are measured against a fixed date so the scene is identical on
 * every build. Without this, an ongoing role would grow teeth every deploy and
 * the composition would drift.
 */
export const REFERENCE_DATE = '2026-11-01'

/** Module shared by the whole train: equal modules are what make gears mesh. */
export const GEAR_MODULE = 0.1

export type GearState = 'ongoing' | 'completed'

export interface GearStage {
	id: string
	/** Straight from `experiences`, so a click can open the matching card. */
	experienceId: string
	company: string
	/** Short enough to engrave on a plaque: `ICC`, `Freelance`, `AI & Data`. */
	shortLabel: string
	position: string
	/** `2023 — 2024`, or `2025 — hoy`. */
	period: string
	state: GearState
	teeth: number
	module: number
	/** 0 = polished brass, 1 = fully patinated. Completed stages age. */
	patina: number
}

const MONTH_PATTERN = /^(\d{4})-(\d{2})/

const monthsSince = (isoDate: string, reference: string): number => {
	const from = MONTH_PATTERN.exec(isoDate)
	const to = MONTH_PATTERN.exec(reference)
	if (!from || !to) return 0
	const months = (Number(to[1]) - Number(from[1])) * 12 + (Number(to[2]) - Number(from[2]))
	// Count whole months worked, inclusive of the month it started.
	return Math.max(1, months + 1)
}

/**
 * Teeth from months. 12 teeth at a few weeks, +1 tooth every two months, and a
 * ceiling so the train always fits a hero. 22 / 29 / 19 for the 2026-11 build.
 */
const teethFor = (months: number): number => Math.min(34, Math.max(14, Math.round(months / 2) + 12))

/**
 * A plaque is 1.15 units wide on the bench, so the full legal name does not fit.
 * Prefer the parenthetical acronym when the data has one (`International Contact
 * Center (ICC)` → `ICC`), otherwise the first two words.
 */
const shortLabelFor = (company: string): string => {
	const acronym = /\(([^)]+)\)/.exec(company)
	if (acronym) return acronym[1].trim()
	const words = company.trim().split(/\s+/)
	// Keep the ampersand: `AI & Data` reads, `AI &` does not.
	if (words[1] === '&' && words[2]) return `${words[0]} & ${words[2]}`
	return words.slice(0, 2).join(' ')
}

const periodFor = (
	startDate: string,
	endDate: string | null | undefined,
	ongoing: boolean
): string => {
	const startYear = startDate.slice(0, 4)
	if (ongoing) return `${startYear} — hoy`
	if (!endDate) return startYear
	const endYear = endDate.slice(0, 4)
	return startYear === endYear ? startYear : `${startYear} — ${endYear}`
}

// Chronological: the train reads left to right as the career advanced.
const ordered = [...experiences].sort((a, b) => a.startDate.localeCompare(b.startDate))

export const gearStages: GearStage[] = ordered.map((experience) => {
	const months = monthsSince(experience.startDate, experience.isOngoing ? REFERENCE_DATE : experience.endDate ?? REFERENCE_DATE)
	return {
		id: `gear-${experience.id}`,
		experienceId: experience.id,
		company: experience.company,
		shortLabel: shortLabelFor(experience.company),
		position: experience.position,
		period: periodFor(experience.startDate, experience.endDate, experience.isOngoing),
		state: experience.isOngoing ? 'ongoing' : 'completed',
		teeth: teethFor(months),
		module: GEAR_MODULE,
		patina: experience.isOngoing ? 0 : 0.65
	}
})

/** The crank goes on the last stage still running: today drives the train. */
export const driverStage = [...gearStages].reverse().find((stage) => stage.state === 'ongoing') ?? gearStages[gearStages.length - 1]
