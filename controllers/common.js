
const common = {};
const INT_MAX = 2147483647;
DEFAULT_PHOTOLINK = "1VgCxxUp0H8x3o5_tuvG-9q9w8Psg36UY";
const PHOTOFLAGS = {
    GLOBAL: -1,
    GALLERY: 0,
    POST : 1
};
const SEARCHFLAGS = {
    POST: 0,
    COMMENT: 1
}

IsDefined = (value) => {
    return (value !== undefined && value !== null);
}

IsUInt = (value) => {
    return (Number.isInteger(value) && value < INT_MAX && value >= 0);
}

IsVID = (value) => {
    return (value < INT_MAX && value > 0);
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

common.GetProfilePicture = (value) => {
    return (IsDefined(value) ? value : DEFAULT_PHOTOLINK);
}

common.DB_INT_MAX = INT_MAX;
common.PHOTOFLAGS = PHOTOFLAGS;
common.DEFAULT_PHOTOLINK = DEFAULT_PHOTOLINK;
common.SEARCHFLAGS = SEARCHFLAGS;
module.exports = common;