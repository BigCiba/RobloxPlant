local lualib = {}
--- 限定数值区间
-- 
-- @param n 数
-- @param a 最小值
-- @param b 最大值
-- @returns 小于最小值返回最小值，大于最大值返回最大值，否则返回自己
lualib.Clamp = function(val, min, max)
    if val > max then
        val = max
    elseif val < min then
        val = min
    end
    return val
end
lualib.RemapVal = function(v, a, b, c, d)
    if a == b then
        return v >= b and d or c
    end
    return c + (d - c) * (v - a) / (b - a)
end
lualib.RemapValClamped = function(v, a, b, c, d)
    if a == b then
        return v >= b and d or c
    end
    local t = (v - a) / (b - a)
    t = lualib.Clamp(t, 0, 1)
    return c + (d - c) * t
end
--- 四舍五入，s为小数点几位
-- 
-- @param fNumber 数
-- @param prec 进度
-- @returns 数
lualib.Round = function(fNumber, prec)
    if prec == nil then
        prec = 0
    end
    local iSign = fNumber > 0 and 1 or -1
    fNumber = math.abs(fNumber)
    local i = 10 ^ prec
    return iSign * math.floor(fNumber * i + 0.5) / i
end
--- 深拷贝，会把表深度复制
-- 
-- @param orig 任意值
-- @returns 新值
lualib.Deepcopy = function(orig)
    local copy
    if type(orig) == "table" then
        copy = {}
        for key, value in pairs(orig) do
            copy[lualib.Deepcopy(key)] = lualib.Deepcopy(value)
        end
        setmetatable(
            copy,
            lualib.Deepcopy(getmetatable(orig))
        )
    else
        copy = orig
    end
    return copy
end
--- 浅拷贝
-- 
-- @param orig 任意值
-- @returns 新值
lualib.Shallowcopy = function(orig)
    local copy
    if type(orig) == "table" then
        copy = {}
        for key, value in pairs(orig) do
            copy[key] = value
        end
    else
        copy = orig
    end
    return copy
end
lualib.IsArray = function(value)
	return type(value) == "table" and (value[1] ~= nil or next(value) == nil)
end
lualib.GetKeys = function(obj)
    local keys = {}
    for k, _ in pairs(obj) do
        keys[#keys + 1] = k
    end
    return keys
end

return lualib