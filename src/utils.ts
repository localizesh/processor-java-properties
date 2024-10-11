import {LayoutRoot, LayoutElement} from "@localizesh/sdk";

const isLineContinued = (line: string): boolean => {
    return /(\\\\)*\\$/.test(line);
}
const isTextComment = (line: string): boolean => {
    const firstSymbol = line.trimLeft()[0];
    return  firstSymbol === "!" || firstSymbol === "#";
}

const getKeyValueFromString = (str: string): {key: string, value: string} => {
    const index = str.indexOf("=");
    return {key: str.substring(0, index), value: str.substring(index + 1, str.length)};
}


enum PropertyRecordType {
    text = "text",
    comment = "comment",
    break = "break"
}

type PropertyCommentRecord = {
    type: PropertyRecordType.comment | PropertyRecordType.break,
    text: string,
}

type PropertyTextRecord = {
    type: PropertyRecordType.text,
    object: { key: string, value: string }
}

const stringToHast = (rootString: string) => {
    const lines: string[] = rootString.split(/\r?\n/);

    const objectForHast: Array<PropertyCommentRecord | PropertyTextRecord> = [];
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];

        if (!line.trim()) {
            objectForHast.push({
                type: PropertyRecordType.break,
                text: "\n"
            })
        } else if (isTextComment(line)) {
            objectForHast.push({
                type: PropertyRecordType.comment,
                text: line
            })
        } else {
            let text = line;
            if (isLineContinued(line)) {
                index += 1;
                const partLines = lines.slice(index, lines.length - 1);
                for (const l of partLines) {
                    text += l;

                    if(isLineContinued(l)) {
                        index += 1;
                    } else {
                        break;
                    }
                }
            }

            objectForHast.push({
                type: PropertyRecordType.text,
                object: getKeyValueFromString(text)
            })
        }
    }

    const children = objectForHast.reduce((accum: LayoutElement[], propertyValue) => {

        debugger
        if(propertyValue.type === PropertyRecordType.comment) {

            accum.push({
                type: "element",
                tagName: "tr",
                children: [
                    {
                        type: "element",
                        tagName: "td",
                        children: [
                            {type: "comment", value: propertyValue.text}
                        ],
                        properties: {colspan:"2"},
                    }
                ],
                properties: {style: {display: "none"}  as any},
            })
        } else if(propertyValue.type === PropertyRecordType.text) {
            const {key, value} = propertyValue.object;
            accum.push({
                type: "element",
                tagName: "tr",
                children: [
                    {
                        type: "element",
                        tagName: "td",
                        children: [
                            {type: "text", value: key}
                        ],
                        properties: {},
                    },
                    {
                        type: "element",
                        tagName: "td",
                        children: [
                            {type: "text", value}
                        ],
                        properties: {},
                    },
                ],
                properties: {},
            })
        } else if(propertyValue.type === PropertyRecordType.break) {
            accum.push({
                type: "element",
                tagName: "tr",
                children: [
                    {
                        type: "element",
                        tagName: "td",
                        children: [
                            {type: "comment", value: propertyValue.text}
                        ],
                        properties: {colspan:"2"},
                    }
                ],
                properties: {style: {display: "none"} as any},
            })
        }

        return accum;
    }, [])

    return {type: "root", children: [
            {
                type: "element",
                tagName: "table",
                children: [
                    {
                        type: "element",
                        tagName: "tbody",
                        children: children,
                        properties: {},
                    },
                ],
                properties: {},
            }
        ]} as LayoutRoot;
}

const properties: {
    stringToHast: (rootString: string) => LayoutRoot;
} = {
    stringToHast
}

export default properties;