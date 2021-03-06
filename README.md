#Gexf-Parser

##Description
This parser is designed to fetch a remote .gexf file and parse it into a javascript object for later manipulation. It was developed to be used with [sigma 1.0.0 version](https://github.com/jacomyal/sigma.js/tree/draft-v1.0.0) and can be compiled as a [sigma plugin](https://github.com/jacomyal/sigma.js/tree/draft-v1.0.0/plugins/sigma.parsers.gexf).

##Usage
The GexfParser can be used either to fetch and parse the .gexf file or just to parse it if you want to fetch it by your own means. The parser adds a GexfParser variable to your global scope so you can use it.


**Fetching and parsing**
```js
// Synchronously fetch the gexf and parse it
var gexf = GexfParser.fetch('/url/to/file.gexf');

// Asynchronously fetch the gexf and parse it
GexfParser.fetch('/url/to/file.gexf', function(gexf) {
    console.log(gexf);
});
```

**Parsing only**

If you want to fetch the gexf yourself, you can still parse the graph by providing a javascript DOM object to the parser (an ajax XML response or a parsed string, for instance). 
```js
// Converting a string to a DOM object
var gexf_dom = new DOMParser().parseFromString(gexf_string, "application/xml");

// Parsing the gexf
var gexf = GexfParser.parse(gexf_dom);
```

##Output Data Model
The following example shows what the parser is able to output given a gexf file.

```
{
    version "1.0.1",
    meta: {
        creator: "Yomguithereal",
        lastmodifieddate: "2010-05-29+01:27",
        title: "A random graph"
    },
    defaultEdgeType: "directed",
    model: [
        {
            id: "authority",
            type: "float",
            title: "Authority"
        },
        {
            id: "name",
            type: "string",
            title: "Author's name"
        }
    ],
    nodes: [
        {
            id: "0",
            label: "Myriel",
            attributes: {
                authority: 10.43,
                name: "Myriel Dafault"
            },
            viz: {
                color: "rgb(216,72,45)",
                size: 22.4,
                position: {
                    x: 234,
                    y: 23,
                    z: 0
                }
            }
        },
        {
            id: "1",
            label: "Jean",
            attributes: {
                authority: 2.43,
                name: "Jean Daguerre"
            },
            viz: {
                color: "rgb(255,72,45)",
                size: 21.4,
                position: {
                    x: 34,
                    y: 23,
                    z: 0
                }
            }
        }
    ],
    edges: [
        {
            id: "0",
            source: "0",
            target: "1",
            type: "directed",
            weight: 1,
            viz: {
                shape: "dotted"
            }
        }
    ]
}
```

##Contribution
Please feel free to contribute. To set up the dev environment you should have **nodejs**, **npm** and **grunt** installed.

```bash
git clone git@github.com:Yomguithereal/gexf-parser.git
cd gexf-parser
npm install
```

Be sure to add relevant unit tests and pass the linter before submitting any change to the parser. The default grunt command will lint the files, run the tests and minify the code into *build/gexf-parser.min.js*.
