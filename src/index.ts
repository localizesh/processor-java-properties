import {Processor, Context, Document} from "@localizesh/sdk";
import properties from "./utils.js";

class PropertiesProcessor implements Processor {
    parse(res: string, ctx?: Context): Document {
        const hast = properties.stringToHast(res);

        return {layout: hast, segments: []} as Document;
    }
    stringify(document: Document, ctx?: Context): string {

        return "";
    }
}

export default PropertiesProcessor;
