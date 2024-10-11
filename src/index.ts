import {Processor, Context, Document} from "@localizesh/sdk";

class PropertiesProcessor implements Processor {
    parse(res: string, ctx?: Context): Document {

        return {layout: {type: "root", children: []}, segments: []};
    }
    stringify(document: Document, ctx?: Context): string {

        return "";
    }
}

export default PropertiesProcessor;
