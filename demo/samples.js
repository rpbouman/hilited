const hilitedSamples = {
  "duckdbsql": {
    label: "SQL (DuckDB)",
    highlighterPrefix: 'hilited-duckdb',
    styles: 'duckdbsql.css',
    regexp: /(?:(?<keyword>(?i-s:\b(?:a(?:t|ll|n(?:[dy]|aly(?:se|ze)|ti)|rray|s(?:c|of|ymmetric)?|uthorization)|b(?:y|etween|i(?:t|gint|nary)|o(?:olean|th))|c(?:as[et]|h(?:ar(?:acter)?|eck)|o(?:alesce|l(?:lat(?:e|ion)|umn(?:s)?)|n(?:currently|straint))|r(?:eate|oss))|d(?:o|e(?:c(?:imal)?|f(?:ault|errable)|sc(?:ribe)?)|istinct)|e(?:lse|nd|x(?:cept|ists|tract))|f(?:alse|etch|loat|or(?:eign)?|r(?:eeze|om)|ull)|g(?:enerated|lob|roup(?:ing(?:_id)?)?)|having|i(?:like|n(?:itially|ner|out|t(?:o|e(?:ger|r(?:sect|val)))?)?|s(?:null)?)|join|l(?:a(?:mbda|teral)|e(?:ading|ft)|i(?:ke|mit))|map|n(?:at(?:ional|ural)|char|o(?:ne|t(?:null)?)|u(?:ll(?:if)?|meric))|o(?:ffset|n(?:ly)?|r(?:der)?|ut(?:er)?|verla(?:y|ps))|p(?:ivot(?:_(?:longer|wider))?|lacing|osition(?:al)?|r(?:ecision|imary))|qualify|r(?:e(?:al|ferences|turning)|ight|ow)|s(?:e(?:lect|mi|tof)|how|imilar|mallint|ome|truct|u(?:bstring|mmarize)|ymmetric)|t(?:o|able(?:sample)?|hen|ime(?:stamp)?|r(?:ailing|eat|im|ue|y_cast))|u(?:n(?:i(?:on|que)|p(?:ack|ivot))|sing)|v(?:a(?:lues|r(?:char|iadic))|erbose)|w(?:he(?:n|re)|i(?:ndow|th))|xml(?:attributes|concat|e(?:lement|xists)|forest|namespaces|p(?:i|arse)|root|serialize|table))\b))|(?<number>(?:\d+(\.\d*)?|\.\d+))|(?<string>(?<!')'(?:''|''|[^'])*'(?!'))|(?<multiLineComment>\/\*(?:(?!\*\/)[\s\S])*\*\/)|(?<singleLineComment>--(?:(?!\n)[\s\S])*(?=\n))|(?<punctuation>[\(\)\{\}\.\:;,\-\+<>=\*])|(?<quotedIdentifier>(?<!")"(?:""|""|[^"])+"(?!"))|(?<identifier>\w+)|(?<whitespace>\s+))/gs,
    code: [
      'select someAlias.*',
      'from someTable as someAlias',
      'where someColumn = \'someValue\''
    ].join('\n')
  },
  "json": {
    label: "JSON",
    highlighterPrefix: 'hilited-json',
    styles: 'json.css',
    regexp: /(?:(?<punctuation>[{}\[\]:,])|(?<key>(?:"(?:\\"|\\\\|[^"\\])*")*(?=\s*:))|(?<string>"(?:\\"|\\\\|[^"\\])*")|(?<number>-?(?:0|[1-9]\d*)(?:\.\d+(?:[Ee][+-]?\d+)?|[Ee][+-]?\d+)?)|(?<keyword>\b(?:false|null|true)\b)|(?<whitespace>\s+))/gs ,
    code: JSON.stringify({
      "numberkey": 1.234,
      "stringkey": "string value",
      "nullkey": null,
      "truekey": true,
      "falsekey": false
    }, null, 2)
  }
  
};