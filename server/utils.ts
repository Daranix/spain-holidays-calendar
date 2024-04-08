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
