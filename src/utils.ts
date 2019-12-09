export const removeNewLines = (text: string) => {
    // remove new lines chars
    let t = text.replace(/(\r\n|\n|\r)/gm, ' ');
    // remove multiple spaces
    t = t.replace(/\s\s+/g, ' ');
    return t;
};

export const removeNonAscii = (text: string) => {
    return text.replace(/[^\x00-\x7F]/g, '');
};

export const filterTokens = (tokens: string[], ignoredTokens: string[]) => {
    return tokens.filter(t => !ignoredTokens.includes(t.toLowerCase()));
};
