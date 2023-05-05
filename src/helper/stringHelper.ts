const capitalizeAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const capitalizeFirstLetter = (orig: string) => {
    if (orig.length == 0) return orig;
    return [orig[0].toUpperCase(), ...orig.slice(1, orig.length)].join('');
}

export const lowercaseFirstLetter = (orig: string) => {
    if (orig.length == 0) return orig;
    return [orig[0].toLowerCase(), ...orig.slice(1, orig.length)].join('');
}

export const addSpacesForEnum = (orig: string) => {
    if (orig.length == 0) return orig;
    let result = '';

    for (const char of orig) {
        if (capitalizeAlphabet.includes(char)) {
            result += ' ';
        }
        result += char;
    }
    return result;
}