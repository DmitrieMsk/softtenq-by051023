
const common = {};
const INT_MAX = 2147483647;

IsDefined = (value) => {
    return (value !== undefined && value !== null);
}

IsUInt = (value) => {
    return (Number.isInteger(value) && value < INT_MAX && value >= 0);
}

IsVID = (value) => {
    return (Number.isInteger(value) && value < INT_MAX && value > 0);
}

common.IsDefined = IsDefined;

common.IsVID = IsVID;

common.IsUInt = IsUInt;

common.IsDefinedUInt = (value) => {
    return (IsDefined(value) && IsUInt(value));
}

common.IsDefinedVID = (value) => {
    return (IsDefined(value) && IsVID(value));
}

common.IsDefinedInt = (value) => {
    return (IsDefined(value) && Number.isInteger(value));
}

common.DB_INT_MAX = INT_MAX;
module.exports = common;