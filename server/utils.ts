export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function decodeHTMLEntities(text: string) {

    const entities = {
        'nbsp': ' ',
        'amp': '&',
        'quot': '"',
        'lt': '<',
        'gt': '>',
        'iacute': 'í',
        'ntilde': 'ñ',
        'oacute': 'ó',
        // Add more entities as needed
    };

    return text.replace(/&([^;]+);/g, (entity, entityCode: string) => {
        let match: RegExpMatchArray | null;

        if (entityCode in entities) {
            return entities[entityCode as keyof typeof entities];
        }
        
        match = entityCode.match(/^#x([\da-fA-F]+)$/);
        if (match) {
            return String.fromCharCode(Number.parseInt(match[1], 16));
        } 
        
        match = entityCode.match(/^#(\d+)$/);
        if (match) {
            return String.fromCharCode(~~match[1]);
        }

        return entity;
    });
}

export function stringToMilliseconds(input: string): number {
    // Regular expression to match the input string
    const regex = /^(\d+)([smhd])$/;
    
    // Execute the regex on the input string
    const match = input.match(regex);
    
    // If the input doesn't match the expected format, return null
    if (!match) {
        throw new Error(`Invalid string to transform into miliseconds: ${input}`)
    }
    
    // Extract the numerical value and unit from the match
    const value = Number.parseInt(match[1]);
    const unit = match[2];
    
    // Calculate the milliseconds based on the unit
    let milliseconds: number;
    switch (unit) {
        case 's':
            milliseconds = value * 1000;
            break;
        case 'm':
            milliseconds = value * 1000 * 60;
            break;
        case 'h':
            milliseconds = value * 1000 * 60 * 60;
            break;
        case 'd':
            milliseconds = value * 1000 * 60 * 60 * 24;
            break;
        default:
            throw new Error(`Invalid string to transform into miliseconds: ${input}`);
    }
    
    return milliseconds;
}

export class HttpError extends Error {

    constructor(public override message: string, public statusCode: number, public opts?: { originalException: unknown }) {
        super(message);
    }

}