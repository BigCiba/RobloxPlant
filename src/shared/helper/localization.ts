function PadStart(str: string, targetLength: number, padString: string): string {
	while (str.size() < targetLength) {
		str = padString + str;
	}
	return str;
}
export function FormatTime(sec: number): string {
	// 将秒数转换为小时、分钟和秒
	const hours = math.floor(sec / 3600);
	const minutes = math.floor((sec % 3600) / 60);
	const seconds = sec % 60;

	// 将分钟和秒格式化为两位数
	const minutesStr = PadStart(tostring(minutes), 2, '0');
	const secondsStr = PadStart(tostring(seconds), 2, '0');

	// 如果小时为0，则隐藏小时部分
	if (hours > 0) {
		const hoursStr = PadStart(tostring(hours), 2, '0');
		return `${hoursStr}:${minutesStr}:${secondsStr}`;
	} else {
		return `${minutesStr}:${secondsStr}`;
	}
}