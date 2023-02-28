// See https://github.com/lowdefy/lowdefy/tree/main/packages/plugins/blocks/blocks-basic
// for more examples

import React from 'react';
import { blockDefaultProps } from '@lowdefy/block-utils';

const Block = ({
  basePath,
  blockId,
  components,
  content,
  events,
  list,
  loading,
  methods,
  menus,
  pageId,
  properties,
  required,
  validation,
  value,
}) => (
  <div
    id={blockId}
    onClick={() => methods.triggerEvent({ name: 'onClick' })}
    className={methods.makeCssClass([
      { outline: 'none', cursor: events.onClick && 'pointer' },
      properties.style,
    ])}
  >
    {properties.content || (content.content && content.content())}
  </div>
);

Block.defaultProps = blockDefaultProps;
Block.meta = {
  category: 'display', // one of 'container', 'display', 'input' or 'list'
  icons: [],
  styles: [],
};

export default Block;
