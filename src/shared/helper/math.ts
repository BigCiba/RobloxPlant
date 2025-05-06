const sharedRNG = new Random(tick());

export function RandomInt(min: number, max: number): number {
	return sharedRNG.NextInteger(min, max);
}

export function RandomFloat(min: number, max: number): number {
	return sharedRNG.NextNumber(min, max);
}
