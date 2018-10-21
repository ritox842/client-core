function is(token, type) {
  return token.type.lastIndexOf(type + '.xml') > -1;
}

function TokenIterator(session, initialRow, initialColumn) {
  this.$session = session;
  this.$row = initialRow;
  this.$rowTokens = session.getTokens(initialRow);

  let token = session.getTokenAt(initialRow, initialColumn);
  this.$tokenIndex = token ? token.index : -1;

  this.stepBackward = function() {
    this.$tokenIndex -= 1;

    while (this.$tokenIndex < 0) {
      this.$row -= 1;
      if (this.$row < 0) {
        this.$row = 0;
        return null;
      }

      this.$rowTokens = this.$session.getTokens(this.$row);
      this.$tokenIndex = this.$rowTokens.length - 1;
    }

    return this.$rowTokens[this.$tokenIndex];
  };

  this.getCurrentToken = function() {
    return this.$rowTokens[this.$tokenIndex];
  };
}

function getTagCompletions(attributeMap, state, session, pos, prefix) {
  const elements = Object.keys(attributeMap);

  return elements.map(element => {
    return {
      value: element,
      caption: element,
      meta: 'tag',
      score: 1000000
    };
  });
}

function getAttributeCompletions(attributeMap, state, session, pos, prefix) {
  let tagName = findTagName(session, pos);
  console.log(' getAttributeCompletions', tagName);

  if (!tagName) return [];
  let attributes = [];
  if (tagName in attributeMap) {
    attributes = attributes.concat(Object.keys(attributeMap[tagName]));
  }

  return attributes.map(function(attribute) {
    return {
      caption: attribute,
      snippet: attribute + '="$0"',
      meta: 'attribute',
      score: 1000000
    };
  });
}

function getAttributeValueCompletions(attributeMap, state, session, pos, prefix) {
  let tagName = findTagName(session, pos);
  let attributeName = findAttributeName(session, pos);
  console.log(' getAttributeValueCompletions', tagName);
  console.log(' getAttributeValueCompletions', attributeName);

  if (!tagName) return [];
  let values = [];
  if (tagName in attributeMap && attributeName in attributeMap[tagName] && typeof attributeMap[tagName][attributeName] === 'object') {
    values = Object.keys(attributeMap[tagName][attributeName]);
  }
  return values.map(function(value) {
    return {
      caption: value,
      snippet: value,
      meta: 'attribute value',
      score: 1000000
    };
  });
}

function findTagName(session, pos) {
  let iterator = new TokenIterator(session, pos.row, pos.column);
  let token = iterator.getCurrentToken();
  while (token && !is(token, 'tag-name')) {
    token = iterator.stepBackward();
  }
  if (token) return token.value;
}

function findAttributeName(session, pos) {
  let iterator = new TokenIterator(session, pos.row, pos.column);
  let token = iterator.getCurrentToken();
  while (token && !is(token, 'attribute-name')) {
    token = iterator.stepBackward();
  }
  if (token) return token.value;
}

export function addCompletor(attributeMap) {
  return {
    getCompletions: function(state, session, pos, prefix, callback) {
      var token = session.getTokenAt(pos.row, pos.column);
      if (!token) return [];

      // tag name
      if (is(token, 'tag-name') || is(token, 'tag-open') || is(token, 'end-tag-open')) callback(null, getTagCompletions(attributeMap, state, session, pos, prefix));

      // tag attribute
      if (is(token, 'tag-whitespace') || is(token, 'attribute-name')) callback(null, getAttributeCompletions(attributeMap, state, session, pos, prefix));

      // tag attribute values
      if (is(token, 'attribute-value')) callback(null, getAttributeValueCompletions(attributeMap, state, session, pos, prefix));

      return [];
    }
  };
}
