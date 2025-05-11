/** 深拷贝 */
export function Deepcopy<T>(orig: T): T;
/** 浅拷贝 */
export function Shallowcopy<T>(orig: T): T;
/** 是否是数组 */
export function IsArray(element: object): boolean;
/** 取键，解决Object.keys定义问题 */
export function GetKeys<T, K extends keyof T>(obj: T): K[];