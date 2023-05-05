export const getArrFromEnum = (enumType: any, isNan: boolean = false): Array<string | number> => {
    const result: any = Object.values(enumType)
        .filter(dt => isNaN(dt as any) == isNan);
    return result;
}