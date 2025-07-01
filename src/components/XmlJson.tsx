import { useState } from 'react';

function xmlToJson(xml: string) {
  try {
    const dom = new window.DOMParser().parseFromString(xml, 'text/xml');
    function domToObj(node: any): any {
      if (node.nodeType === 3) return node.nodeValue;
      const obj: any = {};
      if (node.attributes) for (let attr of node.attributes) obj[attr.name] = attr.value;
      for (let child of node.childNodes) {
        const name = child.nodeName;
        if (!obj[name]) obj[name] = domToObj(child);
        else if (Array.isArray(obj[name])) obj[name].push(domToObj(child));
        else obj[name] = [obj[name], domToObj(child)];
      }
      return obj;
    }
    return JSON.stringify(domToObj(dom.documentElement), null, 2);
  } catch {
    return 'Invalid XML';
  }
}
function jsonToXml(json: string) {
  try {
    const obj = JSON.parse(json);
    function objToXml(obj: any, nodeName: string): string {
      if (typeof obj !== 'object' || obj === null) return `<${nodeName}>${obj}</${nodeName}>`;
      let xml = `<${nodeName}>`;
      for (let key in obj) {
        if (Array.isArray(obj[key])) xml += obj[key].map((v: any) => objToXml(v, key)).join('');
        else xml += objToXml(obj[key], key);
      }
      xml += `</${nodeName}>`;
      return xml;
    }
    return objToXml(obj, 'root');
  } catch {
    return 'Invalid JSON';
  }
}

export default function XmlJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [direction, setDirection] = useState<'xml2json' | 'json2xml'>('xml2json');

  const convert = () => {
    setOutput(direction === 'xml2json' ? xmlToJson(input) : jsonToXml(input));
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-10">
      <div className="relative group">
        <div className="absolute -inset-1 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-purple-200 mb-4">XML &lt;-&gt; JSON</h2>
          <textarea
            className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[120px] max-h-[320px] p-3 rounded-lg border border-purple-400 mb-2"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={direction === 'xml2json' ? 'Paste XML here...' : 'Paste JSON here...'}
          />
          <div className="flex flex-wrap gap-2 mb-2">
            <label className="flex items-center gap-2 text-purple-200 text-sm select-none cursor-pointer">
              <input type="radio" name="direction" value="xml2json" checked={direction === 'xml2json'} onChange={() => setDirection('xml2json')} className="accent-purple-500 w-4 h-4" />
              XML to JSON
            </label>
            <label className="flex items-center gap-2 text-purple-200 text-sm select-none cursor-pointer">
              <input type="radio" name="direction" value="json2xml" checked={direction === 'json2xml'} onChange={() => setDirection('json2xml')} className="accent-purple-500 w-4 h-4" />
              JSON to XML
            </label>
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/80 to-teal-500/80 hover:from-purple-500 hover:to-teal-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl w-full sm:w-auto"
              onClick={convert}
              disabled={!input}
            >
              Convert
            </button>
            <button
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-sm font-medium transition-all duration-300 border border-white/20 shadow-lg hover:shadow-xl w-full sm:w-auto"
              onClick={() => { setInput(''); setOutput(''); }}
              disabled={!input && !output}
            >
              Clear
            </button>
          </div>
          <textarea
            className="w-full bg-transparent text-white placeholder-purple-300/60 resize-none outline-none text-lg leading-relaxed min-h-[80px] max-h-[240px] p-3 rounded-lg border border-purple-400 mt-2"
            value={output}
            readOnly
            placeholder="Result will appear here.."
          />
        </div>
      </div>
    </div>
  );
} 