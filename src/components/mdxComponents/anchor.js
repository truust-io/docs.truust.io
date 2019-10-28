import * as React from 'react';

const AnchorTag = ({ children: link, ...props }) => {
  if (link) {
    return <a href={props.href}>{link}</a>;
  } else {
    return null;
  }
};

export default AnchorTag;
