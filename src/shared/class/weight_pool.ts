import { GetKeys, Shallowcopy } from "shared/helper/lualib";
import { RandomInt } from "shared/helper/math";

/**
 * 权重池
 * 类功能使用的是Valve提供的class库
 * 用于处理各种权重随机计算
 *
 * 权重池仅提供2个相关参数：
 * string:sName
 * integer:iWeight
 *
 * constructor的参数tList是以sName为key，iWeight为value的表
 *
 * 例子：const pool = new CWeightPool({})
 */
export class CWeightPool {
	tList: { [name: string]: number; };
	tName: string[] = [];
	tSection: number[] = [];
	constructor(tList: { [name: string]: number; }) {
		this.tList = tList;
		this.update();
	}
	update() {
		this.tName = [];
		this.tSection = [];
		let iTotal = 0;
		let keys = GetKeys(this.tList);
		for (const [i, name] of ipairs(keys)) {
			iTotal += this.tList[name];
			this.tSection.push(iTotal);
			this.tName.push(name as string);
		}
	}
	each(func: (name: string) => boolean | void) {
		if (!this.tList)
			return;

		for (const [name, v] of pairs(this.tList)) {
			if (func(name as string) === true) {
				return;
			}
		}
	}
	has(sName: string) {
		for (const [name, v] of pairs(this.tList)) {
			if (name === sName) {
				return true;
			}
		}
		return false;
	}
	get(sName: string) {
		return this.tList[sName] ?? 0;
	}
	set(sName: string, iWeight: number) {
		if (sName === undefined) {
			debug.traceback("in function 'CWeightPool.set': parameter:sName a nil value");
			return;
		}
		if (iWeight > 0) {
			this.tList[sName] = iWeight;
		} else {
			delete this.tList[sName];
		}
		this.update();
	}

	add(sName: string, iWeight: number) {
		let cur = this.tList[sName] || 0;
		this.set(sName, cur + iWeight);
	}

	remove(sName: string) {
		this.set(sName, 0);
	}

	random() {
		const iRandom = RandomInt(1, this.tSection[this.tSection.size() - 1] || 1);
		for (let index = 0; index < this.tSection.size(); index++) {
			const max = this.tSection[index];
			if (iRandom <= max) {
				return this.tName[index];
			}
		}
	}
	copy() {
		return new CWeightPool(Shallowcopy(this.tList));
	}

	count(notIgnoreZero: boolean = false) {
		let iCount = 0;
		for (const [k, v] of pairs(this.tList)) {
			if (v > 0 || notIgnoreZero) {
				iCount++;
			}
		}
		return iCount;
	}
}