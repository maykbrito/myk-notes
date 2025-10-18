const _timers = new Map();

/**
 * Schedule a function to be called after a delay
 *
 * If a timer with the same key already exists, it will be canceled.
 * @param {*} key Timer key
 * @param {*} ms Delay in milliseconds
 * @param {*} fn Function to be called
 * @returns void
 */
export function scheduleAfter(key: string, ms: number, fn: () => void) {
	const prev = _timers.get(key);
	if (prev) clearTimeout(prev);
	const t = setTimeout(fn, ms);
	_timers.set(key, t);
}

/**
 * Cancel a scheduled timer
 * @param {*} key Timer key
 * @returns void
 */
export function cancelSchedule(key: string) {
	const prev = _timers.get(key);
	if (prev) {
		clearTimeout(prev);
		_timers.delete(key);
	}
}

/**
 * Cancel multiple scheduled timers
 * @param {*} keysToCancel Array of timer keys to cancel.
 *  eg.: ['save-note', 'delete-note']
 * @returns void
 */
export function cancelTimers(keysToCancel: string[]) {
	const keys = Array.from(_timers.keys());
	for (const key of keys) {
		if (keysToCancel.includes(key)) {
			cancelSchedule(key);
		}
	}
}
