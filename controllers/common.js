
const common = {};
const INT_MAX = 2147483647;

IsDefined = (value) => {
    return (value !== undefined && value !== null);
}

common.IsDefined = (value) => {
    return (value !== undefined && value !== null);
}

common.IsUInt = (value) => {
    return (Number.isInteger(value) && value < INT_MAX && value > 0);
}

common.IsDefinedUInt = (value) => {
    return (IsDefined(value) && Number.isInteger(value) && value < INT_MAX && value > 0);
}

common.IsDefinedInt = (value) => {
    return (IsDefined(value) && Number.isInteger(value));
}

common.DB_INT_MAX = INT_MAX;
module.exports = common;