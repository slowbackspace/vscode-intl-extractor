import config from './config';

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
    return tokens
        .map(t => t.trim().toUpperCase())
        .filter(t => !ignoredTokens.includes(t.trim().toLowerCase()));
};

export const generateMessageId = (text: string, minLength = 25) => {
    const rawTokens = removeNonAscii(text)
        .trim()
        .split(' ');
    const tokens = filterTokens(rawTokens, config.ignoreTokens);
    let id = 'TR';
    let i = 0;
    while (id.length < minLength && i < tokens.length) {
        id += '_' + tokens[i];
        i++;
    }
    return id;
};
